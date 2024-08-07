import { proxy, subscribe } from "valtio";
import { subscribeKey } from "valtio/utils";
import { Item } from "./types/Item";

// Создание valtio хранилища
export const todoStore = proxy({
  todoList: [] as Item[],
  onlyChecked: false,

  get filteredTodoList() {
    return this.onlyChecked
      ? this.todoList.filter((item) => item.checked)
      : this.todoList;
  },
});

// Сохранение и загрузка из localStorage
subscribe(todoStore, () => {
  localStorage.setItem("todo-storage", JSON.stringify(todoStore.todoList));
});

const savedList = localStorage.getItem("todo-storage");
if (savedList) {
  todoStore.todoList = JSON.parse(savedList);
}

export function setTodoList(items: Item[]) {
  todoStore.todoList = items;
}
export function setOnlyChecked(checked: boolean) {
  todoStore.onlyChecked = checked;
}
export function addItem(item: Item) {
  todoStore.todoList.push(item);
}
export function removeItem(id: number) {
  todoStore.todoList = todoStore.todoList.filter((item) => item.id !== id);
}
export function updateItem(id: number, updatedItem: Partial<Item>) {
  todoStore.todoList = todoStore.todoList.map((item) =>
    item.id === id ? { ...item, ...updatedItem } : item
  );
}
