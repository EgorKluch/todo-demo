import React from 'react'
import {FC} from "react";
import {Button, Modal} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import _ from 'lodash';
import { modalSlice } from '../components/store/slices/modal';
import { RootState } from '../components/store/store';


export const useModal = () => {
  const id = React.useMemo(() => _.uniqueId(), []);
  const isOpen = useSelector<RootState, boolean>(state => Boolean(state.modal[id]));
  const dispatch = useDispatch();

  const open = React.useCallback(() => {
    dispatch(modalSlice.actions.setOpen({id}))
  }, [dispatch, id])

  const close = React.useCallback(() => {
    dispatch(modalSlice.actions.setClose({id}))
  }, [dispatch, id])

  return {
    isOpen,
    open,
    close,
  }
}