import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../services/store';
import {
  selectUserIsAuthChecked,
  selectUserData
} from '../services/selectors/userSelectors';
import { Preloader } from '@ui';
import { FC } from 'react';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const isAuthChecked = useSelector(selectUserIsAuthChecked);
  const user = useSelector(selectUserData);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user.name) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user.name) {
    return <Navigate to='/' replace />;
  }

  return children;
};
