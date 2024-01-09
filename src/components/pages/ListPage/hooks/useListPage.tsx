import {createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {Item} from "../../../../types/Item";
import {useLoader} from "../../../../hooks/useLoader";
import {useItemList} from "../../../../hooks/api/useItemList";
import {api} from "../../../../api";

type Api = {
  onlyChecked: boolean,
  toggleOnlyChecked(): void,
  filteredItems: Item[],
  save(): Promise<void>,
  change(item: Item): Promise<void>,
  create(): Promise<void>,
  remove: {
    removingItem: Item | null,
    start(item: Item): void,
    cancel(): void,
    end(): Promise<void>,
  }
};

const listPageContext = createContext<Api | null>(null);
const { Provider } = listPageContext;

export function useListPage() {
  const listApi = useContext(listPageContext);
  if (!listApi) throw new Error('Use ListPageProvider');
  return listApi;
}

type Props = {
  children: ReactNode,
}

export const ListPageProvider: FC<Props> = (props) => {
  const loader = useLoader();
  const { data: items, isValidating, mutate: mutateItems } = useItemList();

  useEffect(() => {
    if (!isValidating) return;
    return loader.show();
  }, [loader, isValidating]);

  const [onlyChecked, setOnlyChecked] = useState(false);
  const [removingItem, setRemovingItem] = useState<Item | null>(null);

  const filteredItems = useMemo(() => {
    if (!onlyChecked) return items;
    return items.filter((item) => item.checked);
  }, [items, onlyChecked]);

  const toggleOnlyChecked = useCallback(() => {
    setOnlyChecked((onlyChecked) => !onlyChecked)
  }, []);

  const removeItemApi = useMemo(() => {
    return {
      removingItem,
      start(item: Item) {
        setRemovingItem(item)
      },
      async end() {
        if (!removingItem) return;
        setRemovingItem(null);
        await mutateItems((items) => items?.filter((item) => item.id !== removingItem.id) || [], {
          revalidate: false,
        })
      },
      cancel() {
        setRemovingItem(null)
      }
    }
  }, [mutateItems, removingItem]);

  const save = useCallback(async () => {
    await api.updateItemList(items);
    await mutateItems();
  }, [items, mutateItems]);

  const change = useCallback(async (changedItem: Item) => {
    if (!changedItem.id) return;
    await mutateItems((items) => (items || []).map((item) => item.id === changedItem.id ? changedItem : item), {
      revalidate: false,
    });
  }, [mutateItems]);

  const create = useCallback(async () => {
    const newItem = {
      id: +new Date(),
      text: 'New item',
      checked: false
    };
    await api.addItem(newItem);
    await mutateItems((items) => [...items || [], newItem], {
      revalidate: false
    });
  }, [mutateItems])

  const listApi = useMemo((): Api => {
    return {
      onlyChecked,
      toggleOnlyChecked,
      remove: removeItemApi,
      filteredItems,
      save,
      change,
      create,
    };
  }, [toggleOnlyChecked, onlyChecked, removeItemApi, filteredItems, save, change, create]);

  return (
    <Provider value={listApi}>{props.children}</Provider>
  )
}