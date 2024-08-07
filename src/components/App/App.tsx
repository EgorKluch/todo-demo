import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ListPage } from "../pages/ListPage/ListPage";
import { ItemPage } from "../pages/ItemPage/ItemPage";
import { LoaderProvider } from "../../hooks/useLoader";
import { Loader } from "../common/Loader/Loader";
import { RecoilRoot } from "recoil";

const router = createBrowserRouter([
  {
    path: "/",
    Component: ListPage,
  },
  {
    path: "/item/:id",
    Component: ItemPage,
  },
]);

function App() {
  return (
    <RecoilRoot>
      <LoaderProvider>
        <RouterProvider router={router} />
        <Loader />
        {/* Логичней в LoaderProvider вынести - но для тестирования глобального стейта тут ;) */}
      </LoaderProvider>
    </RecoilRoot>
  );
}

export default App;
