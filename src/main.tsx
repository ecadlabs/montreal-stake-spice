import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Connect from './routes/connect';
import Dashboard from './routes/dashboard';
import Delegate from './routes/delegate';
import EndDelegation from './routes/end-delegation';
import Stake from './routes/stake';
import Unstake from './routes/unstake';
import FinalizeUnstake from './routes/finalize-unstake';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Connect />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/delegate",
    element: <Delegate />,
  },
  {
    path: "/end-delegation",
    element: <EndDelegation />,
  },
  {
    path: "/stake",
    element: <Stake />
  },
  {
    path: "/unstake",
    element: <Unstake />
  },
  {
    path: "/finalize-unstake",
    element: <FinalizeUnstake />
  } 
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <>
      <RouterProvider router={router} />
    </>
  </React.StrictMode>,
)
