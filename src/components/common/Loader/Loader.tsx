import {FC} from "react";
import {Spinner} from "react-bootstrap";
import './Loader.css';
import {useLoaderModel} from "../../../hooks/useLoaderModel";
import {observer} from "mobx-react-lite";

export const Loader: FC = observer(() => {
  const loader = useLoaderModel();

  if (!loader.isLoading) {
    return null;
  }

  return (
    <div className='Loader'>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  )
})
