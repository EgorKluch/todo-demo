import {FC, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Item} from "../../../types/Item";
import {api} from "../../../api";
import {Button, Container, Form} from "react-bootstrap";
import {useLoaderModel} from "../../../hooks/useLoaderModel";
import {ConfirmModal} from "../../common/ConfirmModal/ConfirmModal";
import {observer} from "mobx-react-lite";
import {ItemModel} from "../../../models/ItemModel";
import {useQuery} from "@tanstack/react-query";

type ItemResponseError = {error: string};

function isErrorItem(data: Item | ItemResponseError | undefined): data is ItemResponseError  {
  return Boolean(data && 'error' in data);
}

type ViewProps = {
  itemModel: ItemModel;
  refetchItem(): void;
}

const ItemPageView: FC<ViewProps> = observer((props) => {
  const { itemModel } = props;
  const navigate = useNavigate();

  const loader = useLoaderModel();

  return (
    <Container className='mt-3'>
      <h1 className='mb-4'>Item</h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Checked"
            checked={itemModel.checked}
            onChange={() => itemModel.toggle()}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Text</Form.Label>
          <Form.Control
            value={itemModel.text}
            onChange={(e) => itemModel.text = e.target.value}
          />
        </Form.Group>
      </Form>
      <div>
        <Button
          className='m-1'
          onClick={() => {
            const hideLoader = loader.show();
            api.updateItem(itemModel.toJs())
              .then(props.refetchItem)
              .finally(hideLoader);
          }}
        >Save</Button>
        <Button
          className='m-1'
          variant='danger'
          onClick={() => itemModel.isRemoving = true}
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
        show={itemModel.isRemoving}
        title='Remove item'
        onApply={() => {
          const hideLoader = loader.show();
          api.removeItem(itemModel.id)
            .then(() => navigate('/'))
            .finally(hideLoader);
        }}
        onCancel={() => itemModel.isRemoving = false}
      />
    </Container>
  )
});

export const ItemPage: FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const loader = useLoaderModel();

  const {data, refetch, isFetching, isError: isItemError} = useQuery({
    queryKey: ['item', id],
    queryFn: () => api.getItem(Number(id)),
  });

  useEffect(() => {
    if (isFetching) {
      return loader.show();
    }
  }, [isFetching, loader]);

  const [itemModel, setItemModel] = useState<ItemModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if(isItemError || isErrorItem(data)) {
      setError((data as ItemResponseError)?.error || 'Item data loading error');
    } else if(data) {
      setItemModel(new ItemModel({ item: data }))
    }
  },[data, isItemError])

  if (error) {
    return (
      <div style={{ color: 'red' }}>{error}</div>
    )
  }

  if (!itemModel) {
    return null;
  }

  return (
    <ItemPageView itemModel={itemModel} refetchItem={refetch}/>
  )
})
