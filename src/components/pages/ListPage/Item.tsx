import React, {FC} from "react";
import { ItemType } from '../../../types/Item';
import {Button, Form} from "react-bootstrap";
import {api, urls} from "../../../api";
import useSWRMutation from 'swr/mutation';
import { useLoader } from "../../../hooks/useLoader";
import { ConfirmModal } from "../../common/ConfirmModal/ConfirmModal";
import { useItem, useItemData } from "../../../hooks/useItemData";
import { useModal } from "../../../hooks/useModal";

type Props = {
  item: ItemType,
  onUpdate?: (newItem: ItemType) => void;
  onRemove?: () => void
}

export const Item: FC<Props> = (props) => {
  const { item } = props;
  const {update, remove, isLoading} = useItem(String(item.id));
  const {isOpen, open, close} = useModal();
  
  // const {update, remove, isLoading} = useItemData();
  // const { trigger: update, isMutating: isMutatingUpdateItem } = useSWRMutation(urls.item, (url, {arg}: {arg: ItemType}) => api.updateItem(arg))
  // const { trigger: remove, isMutating: isMutatingRemoveItem } = useSWRMutation(urls.item, (url, {arg}: {arg: number}) => api.removeItem(arg))
  // const isLoading = isMutatingRemoveItem || isMutatingUpdateItem;

  useLoader(isLoading);

  return (
    <>
      <div className='ListPage__item mb-2' key={item.id}>
        <Form.Check
          className='m-2'
          checked={item.checked}
          onChange={() => {
            update?.({...item, checked: !item.checked})
          }}
        />
        <div className='ListPage__link'><a href={`item/${item.id}`}>{item.text}</a></div>
        {item.id === 0 ? null : (
          <Button
            variant="outline-secondary"
            size='sm'
            onClick={open}
          >X</Button>
        )}
      </div>
      <ConfirmModal
        show={isOpen}
        title='Remove item'
        onApply={() => {
          remove(item.id)
          close()
        }}
        onCancel={close}
      />
    </>
  )
}