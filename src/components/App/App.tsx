import React from 'react';
import {
  createBrowserRouter, RouterProvider,
} from "react-router-dom";
import {ListPage} from "../pages/ListPage/ListPage";
import {ItemPage} from "../pages/ItemPage/ItemPage";
import {Loader} from "../common/Loader/Loader";

const router = createBrowserRouter([
  {
    path: "/",
    Component: ListPage,
  },
  {
    path: "/item/:id",
    Component: ItemPage
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router}/>
      <Loader/>
    </>
  );
}

export default App;
