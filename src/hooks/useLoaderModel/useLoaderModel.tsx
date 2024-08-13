import {createContext, FC, ReactNode, useContext, useMemo} from "react";
import {LoaderModel} from "./LoaderModel";

const loaderContext = createContext<LoaderModel | null>(null);
const { Provider } = loaderContext;

export function useLoaderModel() {
  const api = useContext(loaderContext);

  if (!api) throw new Error('Please, use LoaderProvider');

  return api;
}

type Props = {
  children: ReactNode
};

export const LoaderProvider: FC<Props> = (props) => {
  const loaderModel = useMemo(() => {
    return new LoaderModel();
  }, []);

  return (
    <Provider value={loaderModel}>{props.children}</Provider>
  )
};
