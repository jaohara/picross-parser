import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import { UserContextProvider } from './contexts/UserContext';

import App from './App';
import LoginDemo from './pages/LoginDemo/LoginDemo';

const BASE_URL = "/picross-parser";

const router = createBrowserRouter([
  // login route
  {
    path: `${BASE_URL}/login`,
    element: <LoginDemo />,
  },
  // main route
  {
    path: BASE_URL,
    element: (
      <React.StrictMode>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </React.StrictMode>
    ),
    // loader: someFutureRootLoader,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
