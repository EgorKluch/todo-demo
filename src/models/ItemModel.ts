import {Item} from "../types/Item";
import {makeAutoObservable, toJS} from "mobx";

type Opts = {
  item: Item
}

export class ItemModel {
  public isRemoving = false;

  protected _source: Item;
  // Обычно работа с изменениями под капотом библиотек форм. В реальном приложении нет смысла хранить в Mobx
  // Тут для примера оставил в модели
  protected _changes: Partial<Item>;

  constructor(opts: Opts) {
    this._source = opts.item;
    this._changes = {};

    makeAutoObservable(this);
  }

  get id() {
    return this._source.id;
  }

  set text(text) {
    this._changes.text = text;
  }

  get text() {
    return this._changes.text == null ? this._source.text : this._changes.text;
  }

  toggle() {
    this._changes.checked = !this.checked;
  }

  get checked() {
    return this._changes.checked == null ? this._source.checked : this._changes.checked;
  }

  toJs() {
    return toJS({
      ...this._source,
      ...this._changes
    });
  }

  update(item: Item) {
    if (item.id !== this.id) {
      console.warn('ItemModel.update: you should update the same item');
    }
    this._source = item;
  }
}
