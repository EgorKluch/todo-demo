import { create } from "zustand";
import { useEffect } from "react";
import { Item } from "./types/Item";
import { persist, createJSONStorage } from "zustand/middleware";

interface TodoListState {
  todoList: Item[];
  onlyChecked: boolean;
  setTodoList: (items: Item[]) => void;
  setOnlyChecked: (checked: boolean) => void;
  addItem: (item: Item) => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, updatedItem: Partial<Item>) => void;
}

// Создание zustand хранилища
const useTodoStore = create(
  persist<TodoListState>(
    (set, get) => ({
      todoList: [],
      onlyChecked: false,
      setTodoList: (items) => set({ todoList: items }),
      setOnlyChecked: (checked) => set({ onlyChecked: checked }),
      addItem: (item) => {
        const updatedList = [...get().todoList, item];
        set({ todoList: updatedList });
      },

      removeItem: (id) => {
        const updatedList = get().todoList.filter((item) => item.id !== id);
        set({ todoList: updatedList });
      },

      updateItem: (id, updatedItem) => {
        const updatedList = get().todoList.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        );
        set({ todoList: updatedList });
      },
    }),
    {
      name: "todo-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Селектор для фильтрации списка дел
export const useFilteredTodoList = () => {
  const { todoList, onlyChecked } = useTodoStore();

  return onlyChecked ? todoList.filter((item) => item.checked) : todoList;
};

// Использование хранилища
export const useTodoList = () => useTodoStore((state) => state.todoList);
export const useSetTodoList = () => useTodoStore((state) => state.setTodoList);
export const useOnlyChecked = () => useTodoStore((state) => state.onlyChecked);
export const useSetOnlyChecked = () =>
  useTodoStore((state) => state.setOnlyChecked);
export const useAddItem = () => useTodoStore((state) => state.addItem);
export const useRemoveItem = () => useTodoStore((state) => state.removeItem);
export const useUpdateItem = () => useTodoStore((state) => state.updateItem);
