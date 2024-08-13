import {makeAutoObservable} from "mobx";
import {Item} from "../types/Item";
import {ItemModel} from "./ItemModel";

type Opts = {
  items: Item[];
}

export class ItemListModel {
  protected _items: ItemModel[];
  protected _onlyChecked: boolean = false;
  protected _removingId: number | null = null;

  constructor(opts: Opts) {
    this._items = opts.items.map((item) => new ItemModel({ item }));

    makeAutoObservable(this);
  }

  get onlyChecked() {
    return this._onlyChecked
  }

  get items() {
    return this._items;
  }

  get filteredList() {
    if (!this.onlyChecked) return this.items;
    return this._items.filter((item) => item.checked);
  }

  toggleOnlyChecked() {
    this._onlyChecked = !this.onlyChecked;
  }

  add(item: Item) {
    this._items = [...this._items, new ItemModel({ item })];
  }

  startRemoving(id: number) {
    this._removingId = id;
  }

  confirmRemoving() {
    this._items = this._items.filter((item) => item.id !== this._removingId);
    this._removingId = null;
  }

  cancelRemoving() {
    this._removingId = null;
  }

  get removingId() {
    return this._removingId;
  }

  toJs() {
    return this.items.map((item) => item.toJs());
  }
}
