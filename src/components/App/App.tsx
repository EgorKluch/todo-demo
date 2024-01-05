import React from 'react';
import {
  createBrowserRouter, RouterProvider,
} from "react-router-dom";
import {ListPage} from "../pages/ListPage/ListPage";
import {ItemPage} from "../pages/ItemPage/ItemPage";
import {LoaderProvider} from "../../hooks/useLoader";
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
    <LoaderProvider>
      <RouterProvider router={router}/>
      <Loader/> {/* Логичней в LoaderProvider вынести - но для тестирования глобального стейта тут ;) */}
    </LoaderProvider>
  );
}

export default App;
