import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Draw, Home, NotFound } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/draw",
    element: <Draw />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />
};
export default App;
