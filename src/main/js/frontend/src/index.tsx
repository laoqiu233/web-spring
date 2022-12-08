import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegsiterPage';
import HomePage from './pages/HomePage';
import RequiresAuth from './components/RequiresAuth';

const container = document.getElementById('root')!;
const root = createRoot(container);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'home',
        element: (
          <RequiresAuth>
            <HomePage/>
          </RequiresAuth>
        )
      },
      {
        path: 'login',
        element: (
          <div className="flex items-center justify-center absolute top-0 left-0 w-full h-screen">
            <LoginPage/>
          </div>
        )
      },
      {
        path: 'register',
        element: (
          <div className='flex items-center justify-center absolute top-0 left-0 w-full h-screen'>
            <RegisterPage/>
          </div>
        )
      }
    ],
    errorElement: <Navigate to='/'/>
  }
])

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
