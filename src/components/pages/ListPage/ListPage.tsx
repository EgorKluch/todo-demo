import {useEffect, useMemo, useState} from "react";
import {Button, Container, Form} from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import {api} from "../../../api";
import {Item, Item as ItemType} from '../../../types/Item';
import {ConfirmModal} from "../../common/ConfirmModal/ConfirmModal";
import {useLoader} from "../../../hooks/useLoader";

import './ListPage.css';

const createItem = ()=> ({
  id: +new Date(),
  text: 'New item',
  checked: false
});

export const ListPage = () => {
  const [onlyChecked, setOnlyChecked] = useState(false);
  const [removingItem, setRemovingItem] = useState<ItemType | null>(null);
  const loader = useLoader();

  // react-query
  const {data: items = [], refetch, isFetching: isItemsFetching, isError: isItemsError} = useQuery('items', api.getItemList);
  const {mutate: updateItem, isLoading: isItemUpdating} = useMutation(api.updateItem, {onSuccess: () => refetch()})
  const {mutate: updateItems, isLoading: isItemsUpdating} = useMutation(api.updateItemList, {onSuccess: () => refetch()})

  useEffect(() => {
    if(isItemsFetching || isItemUpdating || isItemsUpdating) {
      return loader.show()}
  },[isItemsFetching, isItemUpdating, isItemsUpdating, loader]);
  
  const filteredItems = useMemo(() => {
    if (!onlyChecked) return items;
    return items?.filter((item) => item.checked);
  }, [items, onlyChecked]);

  function renderItem(item: Item) {
    return (
      <div className='ListPage__item mb-2' key={item.id}>
        <Form.Check
          className='m-2'
          checked={item.checked}
          onChange={() => {
            if(item.id) {
              updateItem({...item, checked: !item.checked});
            }
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
        {filteredItems?.map(renderItem)}
        {isItemsError && <p className="ListPage__error">Fetching items error</p>}
      </div>
      <Button
        style={{ marginRight: 8 }}
        onClick={() => {
          updateItems([...items, createItem()]);
        }}
      >Add item</Button>
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
          updateItems(items.filter(({ id }) => id !== removingItem.id), {
            onSuccess:() => {
              setRemovingItem(null);
            }
          })
        }}
        onCancel={() => setRemovingItem(null)}
      />
    </Container>
  );
};
