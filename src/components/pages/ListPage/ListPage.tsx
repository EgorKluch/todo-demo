import React, {FC, useMemo, useState} from "react";
import {Button, Container, Form} from "react-bootstrap";
import {Item, Item as ItemType} from '../../../types/Item';
import './ListPage.css';
import {ConfirmModal} from "../../common/ConfirmModal/ConfirmModal";
import { saveItems, useItems } from '../../../state/items/items';
import { addItem, checkItem, localRemoveItem } from '../../../state/items/item';

export const ListPage: FC = () => {
  const [onlyChecked, setOnlyChecked] = useState(false);
  const [removingItem, setRemovingItem] = useState<ItemType | null>(null);

  const {data: items} = useItems()

  // Для демонстрации аля селекторов добавил фильтрацию
  const filteredItems = useMemo(() => {
    if (!onlyChecked) return items;
    return items.filter((item) => item.checked);
  }, [items, onlyChecked]);

  function renderItem(item: Item) {
    return (
      <div className='ListPage__item mb-2' key={item.id}>
        <Form.Check
          className='m-2'
          checked={item.checked}
          onChange={() => {
            if (!item.id) return;
            checkItem(item.id);
          }}
        />
        <div className='ListPage__link'><a href={`item/${item.id}`}>{item.text}</a></div>
        {item.id === 0 ? null : (
          <Button
            variant="outline-secondary"
            size='sm'
            onClick={() => setRemovingItem(item)}
          >X</Button>
        )}
      </div>
    );
  }

  return (
    <Container className='mt-3' style={{ width: 800 }}>
      <h1 className='mb-4'>Items list</h1>
      <Form.Check
        type="switch"
        label="Only checked (for selectors)"
        checked={onlyChecked}
        onChange={() => setOnlyChecked(!onlyChecked)}
      />
      <div className='mt-4 mb-4'>
        {renderItem({
          id: 0,
          text: 'Not exists item (for error testing)',
          checked: true,
        })}
        {filteredItems.map(renderItem)}
      </div>
      <Button
        style={{ marginRight: 8 }}
        onClick={() => {
          const newItem = {
            id: +new Date(),
            text: 'New item',
            checked: false
          };
          addItem(newItem);
        }}
      >Add item</Button>
      <Button
        onClick={() => {
          saveItems();
        }}
      >Save</Button>
      <h3 className='mt-5'>Cache invalidation</h3>
      <p>Please check scenario:</p>
      <ul>
        <li>Go to any item page</li>
        <li>Change the item</li>
        <li>Come back here and check that data will update</li>
      </ul>
      <ConfirmModal
        show={!!removingItem}
        title='Remove item'
        onApply={() => {
          if (!removingItem) return;
          localRemoveItem(removingItem.id);
          setRemovingItem(null);
        }}
        onCancel={() => setRemovingItem(null)}
      />
    </Container>
  );
};
