import { Effect, Store, createStore, sample } from 'effector';
import { hideLoader, showLoader } from './state/loader';
import { useUnit } from 'effector-react';
import { LoadingStatus } from './types/loading';

export const addLoaderToEffect = <T1, T2, T3>(effect: Effect<T1, T2, T3>) => {
    sample({
        clock: effect,
        target: showLoader,
    });

    sample({
        clock: effect.finally,
        target: hideLoader,
    });
};

export const hasNoError = <T extends object>(obj: T | {error: string}): obj is T => {
    return !('error' in obj);
};

export const createLoaderHook = <Params, Done, Fail, State>(
    loadingEffect: Effect<Params, Done, Fail>,
    $store: Store<State>,
) => {
    const $itemsLoadingStatus = createStore<LoadingStatus>('unsent')
        .on(loadingEffect, () => 'loading')
        .on(loadingEffect.fail, () => 'error')
        .on(loadingEffect.done, () => 'success');

    const useHook = (params: Params) => {
        const items = useUnit($store);
        const loadingStatus = useUnit($itemsLoadingStatus);

        if (loadingStatus === 'unsent') {
            loadingEffect(params);
            return {data: items, loadingStatus: 'loading'};
        }

        return {data: items, loadingStatus}
    };

    return useHook;
};

type Id = number;

export const createElementLoaderHook = <T2, T3, T4 extends {id: Id}>(
    loadingEffect: Effect<Id, T2, T3>,
    $store: Store<T4[]>,
) => {
    const $itemLoadingStatuses = createStore<Record<string, LoadingStatus | undefined>>({})
        .on(loadingEffect, (store, id) => ({...store, [id]: 'loading'}))
        .on(loadingEffect.done, (store, {params: id}) => ({...store, [id]: 'success'}))
        .on(loadingEffect.fail, (store, {params: id}) => ({...store, [id]: 'error'}));

    const useHook = (id: number) => {
        const items = useUnit($store);
        const loadingStatus = useUnit($itemLoadingStatuses)[id];

        if (!loadingStatus) {
            loadingEffect(id);
            return { data: undefined, loadingStatus: 'loading' };
        };

        const foundItem = items.find(item => item.id === id);

        return {data: foundItem, loadingStatus};
    };

    return useHook;
};

