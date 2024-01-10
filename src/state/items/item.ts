import { createEffect, createEvent, createStore, sample } from 'effector';
import { Item } from '../../types/Item';
import { api } from '../../api';
import { $items } from './items';
import { addLoaderToEffect, createElementLoaderHook, hasNoError } from '../../utils';
import { useUnit } from 'effector-react';

const emptyDraft = {id: NaN, checked: false, text: ''};

const _addItem = createEvent<Item>();

export const addItem = createEvent<Item>();
export const checkItem = createEvent<number>();
export const removeItem = createEvent<number>();
export const itemDeleted = createEvent();
export const setItemDraft = createEvent<Item>();
export const resetItemDraft = createEvent();
export const saveItemDraft = createEvent();
export const localRemoveItem = createEvent<number>();

const getItemFx = createEffect(async (id: number) => {
    const itemResponse = await api.getItem(id);

    if (hasNoError(itemResponse)) {
        return itemResponse;
    } else {
        throw new Error('api error');
    }
});

const updateItemFx = createEffect(async (item: Item) => {
    await api.updateItem(item);
});

const removeItemFx = createEffect(async (id: number) => {
    await api.removeItem(id);
});

const addItemFx = createEffect(async (item: Item) => {
    await api.addItem(item);
});

$items
    .on(_addItem, (store, item) => [...store, item])
    .on(getItemFx.done, (store, {result: item}) => [...store, item])
    .on(localRemoveItem, (store, id) => store.filter(item => item.id !== id))
    .on(checkItem, (store, id) => store.map((item) => {
        if (item.id === id)  {
            return {...item, checked: !item.checked};
        }

        return item;
    }));

const $itemDraft = createStore<Item>(emptyDraft)
    .on(setItemDraft, (_, item) => item)
    .on(resetItemDraft, () => emptyDraft);

sample({
    source: $itemDraft,
    clock: saveItemDraft,
    target: [updateItemFx, _addItem],
})

sample({
    clock: removeItemFx.done,
    fn: ({params: id}) => id,
    target: localRemoveItem,
})

sample({
    clock: removeItem,
    target: removeItemFx,
});

sample({
    clock: removeItemFx.done,
    target: itemDeleted,
})

sample({
    clock: addItem,
    target: addItemFx,
});

sample({
    clock: addItemFx,
    target: _addItem,
})

addLoaderToEffect(updateItemFx);
addLoaderToEffect(removeItemFx);

const _useItem = createElementLoaderHook(getItemFx, $items);

export const useItem = (id: number) => {
    const draft = useUnit($itemDraft);
    const {data: foundItem, loadingStatus} = _useItem(id);

    if (!isNaN(draft.id) && foundItem) {
        return { data: {...foundItem, ...draft},  loadingStatus};
    }

    return {data: foundItem, loadingStatus};
}
