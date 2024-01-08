import {FC, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Item} from "../../../types/Item";
import {RespErr, api, urls} from "../../../api";
import {Button, Container, Form} from "react-bootstrap";
import {useLoader} from "../../../hooks/useLoader";
import {ConfirmModal} from "../../common/ConfirmModal/ConfirmModal";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export const ItemPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {data: item, isLoading, error} = useSWR<Item, RespErr>(id, (url: string) => api.getItem(Number(url)))
  const { trigger: updateItemTrigger, isMutating: isMutatingUpdateItem } = useSWRMutation(urls.item, (url, {arg}: {arg: Item}) => api.updateItem(arg))
  const { trigger: removeItemTrigger, isMutating: isMutatingRemoveItem } = useSWRMutation(urls.item, 
    (url, {arg}: {arg: number}) => api.removeItem(arg).then(() => navigate('/'))
  );

  useLoader(isLoading || isMutatingRemoveItem || isMutatingUpdateItem);

  const [itemDraft, setItemDraft] = useState<Item>();

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
          onClick={() => {
            if (!itemDraft) return;
            updateItemTrigger(itemDraft);
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
        onApply={() => {
          if (!item) return;
          removeItemTrigger(item.id);
        }}
        onCancel={() => setRemoveConfirmationOpened(false)}
      />
    </Container>
  )
};
