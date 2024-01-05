import {FC} from "react";
import {Spinner} from "react-bootstrap";
import './Loader.css';
import {useLoader} from "../../../hooks/useLoader";

export const Loader: FC = () => {
  const loader = useLoader();

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
}