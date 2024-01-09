import {createContext, FC, ReactNode, useContext, useMemo, useRef, useState} from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const idsRef = useRef<string[]>([]);

  const api = useMemo((): Api => {
    return {
      show() {
        const loaderId = _.uniqueId();
        idsRef.current.push(loaderId);
        setIsLoading(true);
        return () => {
          idsRef.current = idsRef.current.filter((id) => id !== loaderId);
          setIsLoading(idsRef.current.length > 0);
        }
      },
      isLoading
    };
  }, [isLoading]);

  return (
    <Provider value={api}>{props.children}</Provider>
  )
};
