import React from 'react';
import _ from "lodash";
import { loaderSlice } from '../components/store/slices/loading';
import { useDispatch } from 'react-redux';

export const useLoader = (isLoading: boolean) => {
  const dispatch = useDispatch();
  const id = React.useMemo(() => _.uniqueId(), []);

  React.useEffect(() => {
    dispatch(loaderSlice.actions.setLoading({id, isLoading}))
    return () => {
      dispatch(loaderSlice.actions.setLoading({id, isLoading: false}))
    }
  }, [id, dispatch, isLoading])
}
