import _ from "lodash";
import {makeAutoObservable} from "mobx";

type Hide = () => void;

export class LoaderModel {
  private _ids: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  show(): Hide {
    const id = _.uniqueId();
    this._ids = [...this._ids, id];

    return () => {
      this._ids = this._ids.filter((checkingId) => checkingId !== id);
    }
  }

  get isLoading() {
    return this._ids.length > 0;
  }
}
