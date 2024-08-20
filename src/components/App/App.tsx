import React from 'react';
import {
  createBrowserRouter, RouterProvider,
} from "react-router-dom";
import {ListPage} from "../pages/ListPage/ListPage";
import {ItemPage} from "../pages/ItemPage/ItemPage";
import {LoaderProvider} from "../../hooks/useLoaderModel/useLoaderModel";
import {Loader} from "../common/Loader/Loader";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

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

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <LoaderProvider>
        <RouterProvider router={router}/>
        <Loader/> {/* Логичней в LoaderProvider вынести - но для тестирования глобального стейта тут ;) */}
      </LoaderProvider>
    </QueryClientProvider>
  );
}

export default App;
