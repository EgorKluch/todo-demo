import React, {FC} from "react";
import { ItemType as ItemType } from '../../../types/Item';
import {Button, Form} from "react-bootstrap";
import {api, urls} from "../../../api";
import useSWRMutation from 'swr/mutation';
import { useLoader } from "../../../hooks/useLoader";
import { ConfirmModal } from "../../common/ConfirmModal/ConfirmModal";

type Props = {
  item: ItemType,
  onUpdate?: (newItem: ItemType) => void;
  onRemove?: () => void
}

export const Item: FC<Props> = (props) => {
  const { item } = props;
  const { trigger: updateItemTrigger, isMutating: isMutatingUpdateItem } = useSWRMutation(urls.item, (url, {arg}: {arg: ItemType}) => api.updateItem(arg))
  const { trigger: removeItemTrigger, isMutating: isMutatingRemoveItem } = useSWRMutation(urls.item, (url, {arg}: {arg: number}) => api.removeItem(arg))

  const [isOpenModal, setIsOpenModal] = React.useState(false);

  useLoader(isMutatingRemoveItem || isMutatingUpdateItem);

  return (
    <>
      <div className='ListPage__item mb-2' key={item.id}>
        <Form.Check
          className='m-2'
          checked={item.checked}
          onChange={() => {
            updateItemTrigger?.({...item, checked: !item.checked})
          }}
        />
        <div className='ListPage__link'><a href={`item/${item.id}`}>{item.text}</a></div>
        {item.id === 0 ? null : (
          <Button
            variant="outline-secondary"
            size='sm'
            onClick={() => setIsOpenModal(true)}
          >X</Button>
        )}
      </div>
      <ConfirmModal
        show={isOpenModal}
        title='Remove item'
        onApply={() => {
          removeItemTrigger(item.id)
          setIsOpenModal(false);
        }}
        onCancel={() => setIsOpenModal(false)}
      />
    </>
  )
}