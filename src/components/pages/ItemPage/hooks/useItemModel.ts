import {useParams} from "react-router-dom";
import {useLoaderModel} from "../../../../hooks/useLoaderModel";
import {useQuery} from "@tanstack/react-query";
import {api} from "../../../../api";
import {useEffect, useState} from "react";
import {ItemModel} from "../../../../models/ItemModel";
import {Item} from "../../../../types/Item";

type Result = {
  model: ItemModel | null,
  error: string | null,
  refetch(): void,
}

type ItemResponseError = {error: string};

function isErrorItem(data: Item | ItemResponseError | undefined): data is ItemResponseError  {
  return Boolean(data && 'error' in data);
}

export const useItemModel = (): Result => {
  const { id } = useParams<{ id: string }>();
  const loader = useLoaderModel();

  const {data, refetch, isFetching, isError: isItemError} = useQuery({
    queryKey: ['item', id],
    queryFn: () => api.getItem(Number(id)),
  });

  useEffect(() => {
    if (isFetching) {
      return loader.show();
    }
  }, [isFetching, loader]);

  const [model, setModel] = useState<ItemModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if(isItemError || isErrorItem(data)) {
      setError((data as ItemResponseError)?.error || 'Item data loading error');
      return
    }

    if (data) {
      if (model) {
        model.update(data);
        return;
      }

      setModel(new ItemModel({ item: data }))
    }
  },[data, isItemError, model, isFetching]);

  return { model, error, refetch };
}
