import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Item } from "./types/Item";

export const todoListState = atomWithStorage<Item[]>("items", []);

export const todoListOnlyCheckedState = atom<boolean>(false);

export const filteredTodoListState = atom<Item[]>((get) => {
  const onlyChecked = get(todoListOnlyCheckedState);
  const list = get(todoListState);
  return onlyChecked ? list.filter((item) => item.checked) : list;
});
