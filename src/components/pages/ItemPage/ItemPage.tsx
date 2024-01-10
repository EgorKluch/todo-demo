import {FC, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {ItemType} from "../../../types/Item";
import {RespErr, api, urls} from "../../../api";
import {Button, Container, Form} from "react-bootstrap";
import {useLoader} from "../../../hooks/useLoader";
import {ConfirmModal} from "../../common/ConfirmModal/ConfirmModal";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useItem, useItemData } from "../../../hooks/useItemData";

export const ItemPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {item, error, update, remove, isLoading, isValidating} = useItem(String(id));

  // const {data: item, isLoading: isLoadingItem, error} = useSWR<ItemType, RespErr>(id, (url: string) => api.getItem(Number(url)))
  // const {update, remove, isLoading} = useItemData();
  // const { trigger: update, isMutating: isMutatingUpdateItem } = useSWRMutation(urls.item, (url, {arg}: {arg: ItemType}) => api.updateItem(arg))
  // const { trigger: remove, isMutating: isMutatingRemoveItem } = useSWRMutation(urls.item, 
  //   (url, {arg}: {arg: number}) => api.removeItem(arg)
  // );
  // const isLoading = isLoadingItem || isMutatingRemoveItem || isMutatingUpdateItem;

  console.log(item, isLoading, isValidating)
  useLoader(isLoading || isValidating);

  const [itemDraft, setItemDraft] = useState<ItemType>();

  const [removeConfirmationOpened, setRemoveConfirmationOpened] = useState(false);

  function renderContent() {
    if (error) {
      return (
        <div style={{ color: 'red' }}>{error.error}</div>
      )
    }

    if (!item) {
      return null;
    }

    return (
      <Form>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Checked"
            checked={itemDraft? itemDraft.checked : item?.checked}
            onChange={() => setItemDraft({...item, checked: !item?.checked})}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Text</Form.Label>
          <Form.Control
            value={itemDraft ? itemDraft.text : item.text}
            onChange={(e) => setItemDraft({ ...item, text: e.target.value })}
          />
        </Form.Group>
      </Form>
    );
  }

  return (
    <Container className='mt-3'>
      <h1 className='mb-4'>Item</h1>
      {renderContent()}
      <div>
        <Button
          className='m-1'
          disabled={!itemDraft}
          onClick={async () => {
            if (!itemDraft) return;
            await update(itemDraft);
            setItemDraft(undefined);
          }}
        >Save</Button>
        <Button
          className='m-1'
          variant='danger'
          disabled={!item}
          onClick={() => setRemoveConfirmationOpened(true)}
        >Remove</Button>
        <Button className='m-1' href='/' variant='secondary'>Back</Button>
      </div>
      <h3 className='mt-5'>Cache invalidation</h3>
      <p>Please check scenario:</p>
      <ul>
        <li>Go to the <a href='/'>List page</a></li>
        <li>Change this item in the list</li>
        <li>Come back here and check that data will update</li>
      </ul>
      <ConfirmModal
        show={removeConfirmationOpened}
        title='Remove item'
        onApply={async () => {
          if (!item) return;
          await remove(item.id);
          navigate('/')
        }}
        onCancel={() => setRemoveConfirmationOpened(false)}
      />
    </Container>
  )
};
