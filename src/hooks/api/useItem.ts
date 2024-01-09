import {api} from "../../api";
import useSWR from "swr";

export function useItem(id: number) {
  return useSWR([id, `item`], ([id]) => {
    return api.getItem(Number(id)).then((response) => {
      if ('error' in response) {
        throw response.error;
      }

      return response;
    });
  });
}