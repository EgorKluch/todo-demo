import React, {FC} from "react";
import {Spinner} from "react-bootstrap";
import './Loader.css';
import { useLoader } from '../../../state/loader';

export const Loader: FC = () => {
  const isLoading = useLoader();

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