import {FC} from "react";
import {Button, Modal} from "react-bootstrap";

type Props = {
  show: boolean;
  title: string;
  onApply(): void;
  onCancel(): void;
}

export const ConfirmModal: FC<Props> = (props) => {
  return (
    <Modal show={props.show} onHide={props.onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onCancel}>Cancel</Button>
        <Button variant="primary" onClick={props.onApply}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  )
};