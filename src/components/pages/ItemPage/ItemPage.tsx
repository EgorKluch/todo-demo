import {FC, useCallback, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Item} from "../../../types/Item";
import {api} from "../../../api";
import {Button, Container, Form} from "react-bootstrap";
import {useLoader} from "../../../hooks/useLoader";
import {ConfirmModal} from "../../common/ConfirmModal/ConfirmModal";

export const ItemPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const loader = useLoader();

  // Не использовать локальный стейт для демонстрации
  const [item, setItem] = useState<Item | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [removeConfirmationOpened, setRemoveConfirmationOpened] = useState(false);

  const fetch = useCallback(() => {
    const hideLoader = loader.show();
    // Специально не передал пропсом
    // В демо тоже должен лежать отдельно в стейте (не в стейте списка для главной страницы)
    //    что бы проверить инвалидацию при переходе между страницами
    api.getItem(Number(id))
      .then((response) => {
        if ('error' in response) {
          setError(response.error);
          return;
        }

        setItem(response);
      })
      .finally(hideLoader);
  }, []);

  useEffect(() => {
    fetch();
  }, []);

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
            api.updateItem(item)
              .then(fetch)
              .finally(hideLoader);
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
          const hideLoader = loader.show();
          api.removeItem(item.id)
            .then(() => navigate('/'))
            .finally(hideLoader);
        }}
        onCancel={() => setRemoveConfirmationOpened(false)}
      />
    </Container>
  )
};
