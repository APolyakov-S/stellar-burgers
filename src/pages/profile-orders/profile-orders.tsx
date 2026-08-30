import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchProfileOrders,
  clearProfileOrders
} from '../../services/slices/profileOrdersSlice';
import { selectProfileOrders } from '../../services/selectors/profileOrdersSelectors';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectProfileOrders);

  useEffect(() => {
    dispatch(fetchProfileOrders());
    return () => {
      dispatch(clearProfileOrders());
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
