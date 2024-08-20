import {makeAutoObservable} from "mobx";
import {Item} from "../types/Item";
import {ItemModel} from "./ItemModel";

type Opts = {
  items: Item[];
}

export class ItemListModel {
  public onlyChecked: boolean = false;
  public items: ItemModel[];

  protected _removingId: number | null = null;

  constructor(opts: Opts) {
    this.items = opts.items.map((item) => new ItemModel({ item }));

    makeAutoObservable(this);
  }

  get filteredList() {
    if (!this.onlyChecked) return this.items;
    return this.items.filter((item) => item.checked);
  }

  toggleOnlyChecked() {
    this.onlyChecked = !this.onlyChecked;
  }

  add(item: Item) {
    this.items = [...this.items, new ItemModel({ item })];
  }

  startRemoving(id: number) {
    this._removingId = id;
  }

  confirmRemoving() {
    this.items = this.items.filter((item) => item.id !== this._removingId);
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

  update(items: Item[]) {
    this.items = items.map((item) => {
      const oldItem = this.items.find(({ id }) => id === item.id);
      if (oldItem) {
        oldItem.update(item);
        return oldItem;
      }
        return new ItemModel({ item });
    });
  }
}
