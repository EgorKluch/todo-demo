import {FC, useCallback, useEffect, useMemo, useState} from "react";
import {Button, Container, Form} from "react-bootstrap";
import {api} from "../../../api";
import './ListPage.css';
import {useLoaderModel} from "../../../hooks/useLoaderModel";
import {ConfirmModal} from "../../common/ConfirmModal/ConfirmModal";
import {observer} from "mobx-react-lite";
import {ItemModel} from "../../../models/ItemModel";
import {useItemListModel} from "./hooks/useItemListModel";

const notExistsItem = new ItemModel({
  item: {
    id: 0,
    text: 'Not exists item (for error testing)',
    checked: true,
  },
});

export const ListPage: FC = observer(() => {
  const { model: itemListModel, error, refetch } = useItemListModel();
  const loader = useLoaderModel();

  function renderItem(item: ItemModel) {
    return (
      <div className='ListPage__item mb-2' key={item.id}>
        <Form.Check
          className='m-2'
          checked={item.checked}
          onChange={() => {
            if (!item.id) return;
            item.toggle();
          }}
        />
        <div className='ListPage__link'><a href={`item/${item.id}`}>{item.text}</a></div>
        {item.id === 0 ? null : (
          <Button
            variant="outline-secondary"
            size='sm'
            onClick={() => itemListModel.startRemoving(item.id)}
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
        checked={itemListModel.onlyChecked}
        onChange={() => itemListModel.toggleOnlyChecked()}
      />
      <div className='mt-4 mb-4'>
        {renderItem(notExistsItem)}
        {itemListModel.filteredList.map(renderItem)}
        {error && <p className="ListPage__error">Fetching items error</p>}
      </div>
      <Button
        style={{ marginRight: 8 }}
        onClick={() => {
          const newItem = {
            id: +new Date(),
            text: 'New item',
            checked: false
          };
          itemListModel.add(newItem);
          api.addItem(newItem);
        }}
      >Add item</Button>
      <Button
        onClick={() => {
          const hideLoader = loader.show();
          api.updateItemList(itemListModel.toJs())
            .then(refetch)
            .finally(hideLoader);
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
        show={!!itemListModel.removingId}
        title='Remove item'
        onApply={() => {
          if (!itemListModel.removingId) return;
          itemListModel.confirmRemoving();
        }}
        onCancel={() => itemListModel.cancelRemoving()}
      />
    </Container>
  );
});

