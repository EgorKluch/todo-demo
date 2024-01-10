import {FC, useMemo, useState} from "react";
import {Button, Container, Form} from "react-bootstrap";
import {api, urls} from "../../../api";
import {ItemType as ItemType} from '../../../types/Item';
import './ListPage.css';
import {useLoader} from "../../../hooks/useLoader";
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { Item } from "./Item";
import { useItems } from "../../../hooks/useItemData";

const AddItemButton = () => {
  // const {add, isLoading} = useItems();
  // useLoader(isLoading)

  const { trigger: add, isMutating } = useSWRMutation(urls.item, (url, {arg}: {arg: ItemType}) => api.addItem(arg))
  useLoader(isMutating);

  
  return (
    <Button
      style={{ marginRight: 8 }}
      onClick={() => {
        const newItem = {
          id: +new Date(),
          text: 'New item',
          checked: false
        };
        add(newItem);
      }}
    >Add item</Button>
  )
}

export const ListPage: FC = () => {
  // const {items, isLoading } = useItems();
  const {data: items = [], isLoading} = useSWR(urls.item, (url) => api.getItemList());
  
  useLoader(isLoading);

  const [onlyChecked, setOnlyChecked] = useState(false);

  const filteredItems = useMemo(() => !onlyChecked ? items : items?.filter((item) => item.checked), [items, onlyChecked]);

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
        {<Item item={{
          id: 0,
          text: 'Not exists item (for error testing)',
          checked: true,
        }} />}
        {filteredItems.map((item) => <Item item={item} />)}
      </div>
      <AddItemButton />
      <h3 className='mt-5'>Cache invalidation</h3>
      <p>Please check scenario:</p>
      <ul>
        <li>Go to any item page</li>
        <li>Change the item</li>
        <li>Come back here and check that data will update</li>
      </ul>
    </Container>
  );
};
