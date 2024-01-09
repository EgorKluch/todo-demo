import {FC} from "react";
import {Button, Container, Form} from "react-bootstrap";
import {ConfirmModal} from "../../common/ConfirmModal/ConfirmModal";
import {ItemPageProvider, useItemPage} from "./hooks/useItemPage";
import {SWRConfig} from "swr";

const ItemPageView: FC = () => {
  const itemPage = useItemPage();

  function renderContent() {
    if (itemPage.error) {
      return (
        <div style={{ color: 'red' }}>{itemPage.error}</div>
      )
    }

    if (!itemPage.item) {
      return null;
    }

    return (
      <Form>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Checked"
            checked={itemPage.item.checked}
            onChange={() => {
              if (!itemPage.item) return;
              itemPage.change({ ...itemPage.item, checked: !itemPage.item.checked })
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Text</Form.Label>
          <Form.Control
            value={itemPage.item.text}
            onChange={(e) => {
              if (!itemPage.item) return;
              itemPage.change({ ...itemPage.item, text: e.target.value })
            }}
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
          onClick={itemPage.save}
        >Save</Button>
        <Button
          className='m-1'
          variant='danger'
          onClick={itemPage.remove.start}
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
        show={itemPage.remove.isRemoving}
        title='Remove item'
        onApply={itemPage.remove.end}
        onCancel={itemPage.remove.cancel}
      />
    </Container>
  )
};

export const ItemPage: FC = () => {
  return (
    <SWRConfig value={{ provider: () => new Map() }}>
      <ItemPageProvider>
        <ItemPageView/>
      </ItemPageProvider>
    </SWRConfig>
  )
}
