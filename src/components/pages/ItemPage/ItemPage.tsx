import { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Item } from "../../../types/Item";
import { Button, Container, Form } from "react-bootstrap";
import { ConfirmModal } from "../../common/ConfirmModal/ConfirmModal";
import {
  useRemoveItem,
  useSetTodoList,
  useTodoList,
  useUpdateItem,
} from "../../../zustandState";

export const ItemPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const items = useTodoList();

  const removeItem = useRemoveItem();
  const updateItem = useUpdateItem();

  const item = items.find((item) => item.id === Number(id));
  const error = !item ? "Item not found" : null;

  const [removeConfirmationOpened, setRemoveConfirmationOpened] =
    useState(false);

  function renderContent() {
    if (error) {
      return <div style={{ color: "red" }}>{error}</div>;
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
            onChange={() => updateItem(item.id, { checked: !item.checked })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Text</Form.Label>
          <Form.Control
            value={item.text}
            onChange={(e) => updateItem(item.id, { text: e.target.value })}
          />
        </Form.Group>
      </Form>
    );
  }

  return (
    <Container className="mt-3">
      <h1 className="mb-4">Item</h1>
      {renderContent()}
      <div>
        <Button
          className="m-1"
          variant="danger"
          onClick={() => setRemoveConfirmationOpened(true)}
        >
          Remove
        </Button>
        <Button className="m-1" href="/" variant="secondary">
          Back
        </Button>
      </div>
      <h3 className="mt-5">Cache invalidation</h3>
      <p>Please check scenario:</p>
      <ul>
        <li>
          Go to the <a href="/">List page</a>
        </li>
        <li>Change this item in the list</li>
        <li>Come back here and check that data will update</li>
      </ul>
      <ConfirmModal
        show={removeConfirmationOpened}
        title="Remove item"
        onApply={() => {
          if (!item) return;

          removeItem(item.id);
          navigate("/");
        }}
        onCancel={() => setRemoveConfirmationOpened(false)}
      />
    </Container>
  );
};
