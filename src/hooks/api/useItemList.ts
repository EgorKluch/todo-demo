import useSWR from "swr";
import {api} from "../../api";

export function useItemList() {
  return useSWR('items', () => api.getItemList(), {
    fallbackData: []
  });
}