import {Item} from "./types/Item";

export type RespErr = {error: string}

type Db = {
  items: Item[],
}

function getDb(): Db {
  const lsDb = localStorage.getItem('db');
  return lsDb ? JSON.parse(lsDb) : {
    items: []
  };
}

function setDb(setter: (db: Db) => Db) {
  localStorage.setItem('db', JSON.stringify(setter(getDb())));
}

function doRequest<TResponse>(fn: () => TResponse) {
  return new Promise<TResponse>((resolve) => {
    setTimeout(() => {
      resolve(fn());
    }, 500);
  });
}

function doErrorRequest<TResponse>(errorObj: RespErr) {
  return new Promise<TResponse>((res, rej) => {
    setTimeout(() => {
      rej(errorObj);
    }, 500);
  });
}

export const urls = {
  item: '/item'
}

export const api = {
  getItemList() {
    console.log('getList')
    return doRequest(() => getDb().items);
  },
  updateItemList(items: Item[]) {
    console.log('updateItemList', items);
    return doRequest(() => {
      setDb((db) => {
        return {...db, items};
      });
    });
  },
  // should reject promise
  getItem(id: number): Promise<Item> {
    console.log('getItem', id);
    const item = getDb().items.find((item) => item.id === id);
    return item ? doRequest(() => item) : doErrorRequest({ error: 'Item not found' });
  },
  addItem(newItem: Item) {
    console.log('addItem', newItem);
    return doRequest(() => {
      setDb((db) => {
        return {
          ...db,
          items: [...db.items, newItem]
        };
      })
    });
  },
  updateItem(newItem: Item) {
    console.log('updateItem', newItem);
    return doRequest(() => {
      setDb((db) => {
        return {
          ...db,
          items: db.items.map((item) => item.id === newItem.id ? newItem : item)};
      });
    });
  },
  removeItem(id: number) {
    console.log('removeItem', id);
    return doRequest(() => {
      setDb((db) => {
        return {...db, items: db.items.filter((item) => item.id !== id)};
      })
    });
  },
} as const;