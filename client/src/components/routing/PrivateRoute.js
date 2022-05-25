import { Navigate } from 'react-router-dom';
import Test from "../dashboard/test"

const routes = (isAuthenticated) => [
  {
    path: '/',
    element: isAuthenticated ? <Test /> : <Navigate to="/" />,
    children: [
      { path: '/dashboard', element: <Test /> },
      { path: '/', element: <Navigate to="/dashboard" /> }
    ],
  }
];

export default routes;