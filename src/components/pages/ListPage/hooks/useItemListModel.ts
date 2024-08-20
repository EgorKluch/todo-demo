import {useLoaderModel} from "../../../../hooks/useLoaderModel";
import {useQuery} from "@tanstack/react-query";
import {api} from "../../../../api";
import {useEffect, useMemo} from "react";
import {ItemListModel} from "../../../../models/ItemListModel";

type Result = {
  model: ItemListModel,
  error: Error | null,
  refetch(): void,
}

export const useItemListModel = (): Result => {
  const loader = useLoaderModel();
  const {data: items, refetch, isFetching, error} = useQuery({
    queryKey: ['items'],
    queryFn: api.getItemList,
  });

  useEffect(() => {
    if(isFetching) {
      return loader.show()
    }
  },[isFetching, loader]);

  const itemListModel = useMemo(() => {
    return new ItemListModel({ items: [] });
  }, []);

  useEffect(() => {
    if (!items) return;
    itemListModel.update(items);
  }, [items, itemListModel, isFetching]);

  return { model: itemListModel, error, refetch };
};
