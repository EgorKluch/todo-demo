import React from 'react'
import useSWRMutation from "swr/mutation"
import { RespErr, api, urls } from "../api"
import { ItemType } from "../types/Item"
import useSWR, { useSWRConfig } from 'swr'

export const useItem = (id: string) => {
    const url = `${urls.item}/${id}`;
    const { mutate } = useSWRConfig()
    const {data: item, isLoading: isLoadingItems, error, isValidating} = useSWR<ItemType, RespErr>(
        url,
        (url: string) => api.getItem(Number(id)),
        {shouldRetryOnError: false}
    )
    const { trigger: updateItemTrigger, isMutating: isMutatingUpdateItem } = useSWRMutation(
        url,
        (url, {arg}: {arg: ItemType}) => api.updateItem(arg),
        {onSuccess: () => mutate(urls.item)},
    );
    const { trigger: removeItemTrigger, isMutating: isMutatingRemoveItem } = useSWRMutation(
        url,
        (url, {arg}: {arg: number}) => api.removeItem(arg),
        {onSuccess: () => mutate(urls.item)}
    );

    const isLoading = React.useMemo(
        () => isMutatingUpdateItem || isMutatingRemoveItem || isLoadingItems,
        [isMutatingUpdateItem, isMutatingRemoveItem, isLoadingItems]
    )

    return {
        item,
        isLoading,
        error,
        isValidating,
        update: updateItemTrigger,
        remove: removeItemTrigger,
    }
}

export const useItemOptimistic = (id: string) => {
    const url = `${urls.item}/${id}`;
    const { mutate } = useSWRConfig()

    const {data: item, isLoading: isLoadingItems, error, isValidating} = useSWR<ItemType, RespErr>(
        url,
        (url: string) => api.getItem(Number(id)),
        {shouldRetryOnError: false}
    )
    const { trigger: updateItemTrigger, isMutating: isMutatingUpdateItem } = useSWRMutation(
        url,
        (url, {arg}: {arg: ItemType}) => api.updateItem(arg),
        {onSuccess: () => mutate(urls.item)},
    );
    const { trigger: removeItemTrigger, isMutating: isMutatingRemoveItem } = useSWRMutation(
        url,
        (url, {arg}: {arg: number}) => api.removeItem(arg),
        {onSuccess: () => mutate(urls.item)}
    );

    const isLoading = React.useMemo(
        () => isMutatingUpdateItem || isMutatingRemoveItem || isLoadingItems,
        [isMutatingUpdateItem, isMutatingRemoveItem, isLoadingItems]
    )

    const update = (newItem: ItemType) => {
        updateItemTrigger<ItemType>(newItem, {
            optimisticData: item => ({ ...item, ...newItem }),
            rollbackOnError: true,
          });
    }

    return {
        item,
        isLoading,
        error,
        isValidating,
        update,
        remove: removeItemTrigger,
    }
}

// example for same url
export const useItems = () => {
    const {data: items = [], isLoading: isLoadingItems} = useSWR(urls.item, (url) => api.getItemList());
    const { trigger: addItemTrigger, isMutating: isMutatingAddItem } = useSWRMutation(urls.item, (url, {arg}: {arg: ItemType}) => api.addItem(arg))

    const isLoading = React.useMemo(
        () => isLoadingItems || isMutatingAddItem,
        [isLoadingItems, isMutatingAddItem]
    )

    return {
        items,
        isLoading,
        add: addItemTrigger,
    }
}

// example url same for POST, DELETE actions
export const useItemData = () => {
    const { trigger: addItemTrigger, isMutating: isMutatingAddItem } = useSWRMutation(urls.item, (url, {arg}: {arg: ItemType}) => api.addItem(arg))
    const { trigger: updateItemTrigger, isMutating: isMutatingUpdateItem } = useSWRMutation(urls.item, (url, {arg}: {arg: ItemType}) => api.updateItem(arg))
    const { trigger: removeItemTrigger, isMutating: isMutatingRemoveItem } = useSWRMutation(urls.item, (url, {arg}: {arg: number}) => api.removeItem(arg))

    const isLoading = React.useMemo(
        () => isMutatingUpdateItem || isMutatingRemoveItem || isMutatingAddItem,
        [isMutatingUpdateItem, isMutatingRemoveItem, isMutatingAddItem]
    )

    return {
        isLoading,
        add: addItemTrigger,
        update: updateItemTrigger,
        remove: removeItemTrigger,
    }
}