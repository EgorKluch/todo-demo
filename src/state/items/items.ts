import { createStore, createEvent, createEffect, sample } from 'effector';
import { Item } from '../../types/Item';
import {api} from "../../api";
import { addLoaderToEffect, createLoaderHook } from '../../utils';

export const saveItems = createEvent();

const loadItemsFx = createEffect(async () => {
    return await api.getItemList();
});

const updateItemsFx = createEffect(async (items: Item[]) => {
    return await api.updateItemList(items);
});

export const $items = createStore<Item[]>([])
    .on(loadItemsFx.done, (_, {result}) => result);

sample({
    clock: saveItems,
    source: $items,
    target: updateItemsFx,
});

addLoaderToEffect(loadItemsFx);
addLoaderToEffect(updateItemsFx);

export const useItems = createLoaderHook(loadItemsFx, $items);
