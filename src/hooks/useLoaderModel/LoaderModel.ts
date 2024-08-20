import _ from "lodash";
import {makeAutoObservable} from "mobx";

export class LoaderModel {
  private _ids: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  show() {
    const id = _.uniqueId();
    this._ids = [...this._ids, id];
    return () => this.hide(id);
  }

  hide(id: string) {
    this._ids = this._ids.filter((checkingId) => checkingId !== id);
  }

  get isLoading() {
    return this._ids.length > 0;
  }
}
