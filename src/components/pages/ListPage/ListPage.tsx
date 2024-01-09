import {FC} from "react";
import {Button, Container, Form} from "react-bootstrap";
import {Item} from '../../../types/Item';
import './ListPage.css';
import {ConfirmModal} from "../../common/ConfirmModal/ConfirmModal";
import {ListPageProvider, useListPage} from "./hooks/useListPage";
import {SWRConfig} from "swr";

const ListPageView: FC = () => {
  const listPage = useListPage();

  function renderItem(item: Item) {
    return (
      <div className='ListPage__item mb-2' key={item.id}>
        <Form.Check
          className='m-2'
          checked={item.checked}
          onChange={async () => {
            if (!item.id) return;
            await listPage.change({...item, checked: !item.checked});
          }}
        />
        <div className='ListPage__link'><a href={`item/${item.id}`}>{item.text}</a></div>
        {item.id === 0 ? null : (
          <Button
            variant="outline-secondary"
            size='sm'
            onClick={() => listPage.remove.start(item)}
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
        checked={listPage.onlyChecked}
        onChange={listPage.toggleOnlyChecked}
      />
      <div className='mt-4 mb-4'>
        {renderItem({
          id: 0,
          text: 'Not exists item (for error testing)',
          checked: true,
        })}
        {listPage.filteredItems.map(renderItem)}
      </div>
      <Button
        style={{ marginRight: 8 }}
        onClick={listPage.create}
      >Add item</Button>
      <Button onClick={listPage.save}>Save</Button>
      <h3 className='mt-5'>Cache invalidation</h3>
      <p>Please check scenario:</p>
      <ul>
        <li>Go to any item page</li>
        <li>Change the item</li>
        <li>Come back here and check that data will update</li>
      </ul>
      <ConfirmModal
        show={!!listPage.remove.removingItem}
        title='Remove item'
        onApply={listPage.remove.end}
        onCancel={listPage.remove.cancel}
      />
    </Container>
  );
};

export const ListPage: FC = () => {
  return (
    <SWRConfig value={{ provider: () => new Map() }}>
      <ListPageProvider>
        <ListPageView/>
      </ListPageProvider>
    </SWRConfig>
  )
}
