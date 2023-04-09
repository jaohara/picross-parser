import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import { AuthContextProvider } from './contexts/AuthContext';

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
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </React.StrictMode>
    ),
    // loader: someFutureRootLoader,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
