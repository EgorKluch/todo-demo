import {Item} from "../types/Item";
import {makeAutoObservable, toJS} from "mobx";

type Opts = {
  item: Item
}

export class ItemModel{
  private _item: Item;
  private _isRemoving = false;

  constructor(opts: Opts) {
    this._item = opts.item;

    makeAutoObservable(this);
  }

  get id() {
    return this._item.id;
  }

  set text(text) {
    this._item.text = text;
  }

  get text() {
    return this._item.text;
  }

  toggle() {
    this._item.checked = !this.checked;
  }

  get checked() {
    return this._item.checked;
  }

  toJs() {
    return toJS(this._item);
  }

  get isRemoving() {
    return this._isRemoving
  }

  set isRemoving(isRemoving) {
    this._isRemoving = isRemoving;
  }
}
