import {useNavigate, useParams} from "react-router-dom";
import {useLoader} from "../../../../hooks/useLoader";
import {createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {useItem} from "../../../../hooks/api/useItem";
import {Item} from "../../../../types/Item";
import {api} from "../../../../api";

type Api = {
  item?: Item,
  error?: string,
  change(item: Item): Promise<void>,
  save(): Promise<void>,
  remove: {
    isRemoving: boolean,
    start(): void,
    cancel(): void,
    end(): Promise<void>,
  },
}

const itemPageContext = createContext<Api | null>(null);
const { Provider } = itemPageContext;

export function useItemPage() {
  const api = useContext(itemPageContext);
  if (!api) throw new Error('Use ItemPageProvider');
  return api;
}

type Props = {
  children: ReactNode,
}

export const ItemPageProvider: FC<Props> = (props) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const loader = useLoader();
  const [isRemoving, setIsRemoving] = useState(false);
  const { data: item, error, isValidating, mutate: mutateItem } = useItem(Number(id));

  useEffect(() => {
    if (!isValidating) return;
    return loader.show();
  }, [loader, isValidating]);

  const change = useCallback(async (item: Item) => {
    await mutateItem(item, { revalidate: false });
  }, [mutateItem]);

  const save = useCallback(async () => {
    if (!item) return;
    await api.updateItem(item);
    await mutateItem();
  }, [mutateItem, item]);

  const removeApi = useMemo(() => {
    return {
      isRemoving,
      start() {
        setIsRemoving(true);
      },
      async end() {
        if (!item) return;
        await api.removeItem(item.id)
        navigate('/');
      },
      cancel() {
        setIsRemoving(false);
      }
    }
  }, [item, navigate, isRemoving]);

  const pageAPi = useMemo((): Api => {
    return {
      item,
      error,
      change,
      save,
      remove: removeApi,
    }
  }, [change, save, item, error, removeApi]);

  return (
    <Provider value={pageAPi}>{props.children}</Provider>
  )
}
