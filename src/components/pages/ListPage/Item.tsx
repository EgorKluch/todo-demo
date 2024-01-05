import {FC, useEffect, useState} from "react";
import { Item as ItemType } from '../../../types/Item';
import {Button, Form, InputGroup, Row} from "react-bootstrap";
import {api} from "../../../api";

type Props = {
  item: ItemType,
  onUpdate(newItem: ItemType): void;
  onRemove(): void
}

export const Item: FC<Props> = (props) => {
  const { item } = props;

  return (
    <Row>
      <InputGroup className="mb-3">
        <InputGroup.Checkbox
          checked={item.checked}
          onChange={() => {
            props.onUpdate({...item, checked: !item.checked})
          }}
        />
        <Form.Control />
        <Button
          variant="outline-secondary"
          onClick={props.onRemove}
        >X</Button>
      </InputGroup>
    </Row>
  )
}