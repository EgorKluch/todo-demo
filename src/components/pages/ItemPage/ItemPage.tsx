import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {api} from "../../../api";
import {Button, Container, Form} from "react-bootstrap";
import {ConfirmModal} from "../../common/ConfirmModal/ConfirmModal";
import { useMutation, useQuery } from "react-query";
import { Item } from "../../../types/Item";
import { useLoader } from "../../../hooks/useLoader";

type ItemResponseError = {error: string};

function isErrorItem(data: Item | ItemResponseError | undefined): data is ItemResponseError  {
  return Boolean(data && 'error' in data);
}

export const ItemPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const loader = useLoader();

  const [item, setItem] = useState<Item | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [removeConfirmationOpened, setRemoveConfirmationOpened] = useState(false);

  //react-query
  const {data, refetch, isError: isItemError} = useQuery('item', () => api.getItem(Number(id)));
  const {mutate: updateItem} = useMutation(api.updateItem)
  const {mutate: removeItem} = useMutation(api.removeItem)

  useEffect(() => {
    if(isItemError || isErrorItem(data)) {
      setError((data as ItemResponseError)?.error || 'Item data loading error');
    } else if(data) {
      setItem(data)
    }
  },[data, isItemError])

  function renderContent() {
    if (error) {
      return (
        <div style={{ color: 'red' }}>{error}</div>
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
            checked={item.checked}
            onChange={() => setItem({ ...item, checked: !item.checked })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Text</Form.Label>
          <Form.Control
            value={item.text}
            onChange={(e) => setItem({ ...item, text: e.target.value })}
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
          onClick={() => {
            if (!item) return;

            const hideLoader = loader.show();

            updateItem(item, {
              onSuccess: () => refetch(),
              onSettled: hideLoader
            })
          }}
        >Save</Button>
        <Button
          className='m-1'
          variant='danger'
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
          if (!item || 'error' in item) return;
          const hideLoader = loader.show();

          removeItem(item.id, {
            onSuccess: () => navigate('/'),
            onSettled: hideLoader
          })
        }}
        onCancel={() => setRemoveConfirmationOpened(false)}
      />
    </Container>
  )
};
