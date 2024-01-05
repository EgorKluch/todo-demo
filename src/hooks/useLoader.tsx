import {createContext, FC, ReactNode, useContext, useMemo, useState} from "react";
import _ from "lodash";

type Hide = () => void;

type Api = {
  show(): Hide;
  isLoading: boolean;
}

const loaderContext = createContext<Api | null>(null);
const { Provider } = loaderContext;

export function useLoader() {
  const api = useContext(loaderContext);

  if (!api) throw new Error('Please, use LoaderProvider');

  return api;
}

type Props = {
  children: ReactNode
};

export const LoaderProvider: FC<Props> = (props) => {
  const [ids, setIds] = useState<string[]>([]);

  const isLoading = ids.length > 0;

  const api = useMemo((): Api => {
    return {
      show() {
        const id = _.uniqueId();
        setIds((ids) => [...ids, id]);
        return () => {
          setIds((ids) => ids.filter((checkingId) => checkingId !== id));
        }
      },
      isLoading
    };
  }, [isLoading]);

  return (
    <Provider value={api}>{props.children}</Provider>
  )
};
