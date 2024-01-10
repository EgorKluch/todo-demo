import React, {FC, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Container, Form} from "react-bootstrap";
import {ConfirmModal} from "../../common/ConfirmModal/ConfirmModal";
import { itemDeleted, removeItem, resetItemDraft, saveItemDraft, setItemDraft, useItem } from '../../../state/items/item';

export const ItemPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);
  const navigate = useNavigate();

  // Не использовать локальный стейт для демонстрации
  const {data: item, loadingStatus} = useItem(numId);
  const [removeConfirmationOpened, setRemoveConfirmationOpened] = useState(false);

  useEffect(() => {
    return resetItemDraft;
  }, [id]);

  useEffect(() => {
    itemDeleted.watch(() => {
      navigate('/')
    });
  }, [navigate]);

  function renderContent() {
    if (loadingStatus === 'error') {
      return (
        <div style={{ color: 'red' }}>{loadingStatus}</div>
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
            onChange={() => setItemDraft({ ...item, checked: !item.checked })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Text</Form.Label>
          <Form.Control
            value={item.text}
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
          onClick={() => {
            if (!item) return;
            saveItemDraft();
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
          if (!item) return;
          removeItem(numId);
        }}
        onCancel={() => setRemoveConfirmationOpened(false)}
      />
    </Container>
  )
};
