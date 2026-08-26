import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUserData } from '../../services/selectors/userSelectors';
import { useLocation } from 'react-router-dom';

export const AppHeader: FC = () => {
  const user = useSelector(selectUserData);
  const location = useLocation();

  return <AppHeaderUI userName={user.name} pathname={location.pathname} />;
};
