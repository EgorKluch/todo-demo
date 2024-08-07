import { atom, AtomEffect, selector } from "recoil";
import { Item } from "./types/Item";

const localStorageEffect =
  (key: string): AtomEffect<Item[]> =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const todoListState = atom<Item[]>({
  key: "todoListState",
  default: [],
  effects: [localStorageEffect("items")],
});

export const todoListOnlyCheckedState = atom({
  key: "todoListFilterState",
  default: false,
});

export const filteredTodoListState = selector({
  key: "filteredTodoListState",
  get: ({ get }) => {
    const onlyChecked = get(todoListOnlyCheckedState);
    const list = get(todoListState);
    if (onlyChecked) {
      return list.filter((item) => item.checked);
    }

    return list;
  },
});
