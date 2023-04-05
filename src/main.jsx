import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import App from './App';
import Login from './pages/Login/Login';

const BASE_URL = "/picross-parser";

const router = createBrowserRouter([
  // login route
  {
    path: `${BASE_URL}/login`,
    element: <Login />,
  },
  // main route
  {
    path: BASE_URL,
    element: (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    ),
    // loader: someFutureRootLoader,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
