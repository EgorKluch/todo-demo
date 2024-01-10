import {FC} from "react";
import {Spinner} from "react-bootstrap";
import './Loader.css';
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export const Loader: FC = () => {
  const isLoading = useSelector<RootState>((state) => state.loader.isLoading);

  if (!isLoading) {
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