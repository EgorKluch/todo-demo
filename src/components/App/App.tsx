import React from 'react';
import {
  createBrowserRouter, RouterProvider,
} from "react-router-dom";

import {QueryClient, QueryClientProvider} from 'react-query';
import {ListPage} from "../pages/ListPage/ListPage";
import {ItemPage} from "../pages/ItemPage/ItemPage";
import { Loader } from '../common/Loader/Loader';
import {LoaderProvider} from "../../hooks/useLoader";

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

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
       <LoaderProvider>
        <RouterProvider router={router}/>
        <Loader/>
      </LoaderProvider>
    </QueryClientProvider>
  );
}

export default App;
