import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useWebSocket } from '../../services/hooks/useWebSocket';
import {
  fetchProfileOrders,
  clearProfileOrders,
  setProfileOrders
} from '../../services/slices/profileOrdersSlice';
import { selectProfileOrders } from '../../services/selectors/profileOrdersSelectors';
import { getCookie } from '../../utils/cookie';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectProfileOrders);

  const wsToken = useMemo(
    () => getCookie('accessToken')?.replace('Bearer ', '') ?? '',
    []
  );

  const { send } = useWebSocket({
    url: `wss://norma.nomoreparties.space/orders?token=${wsToken}`,
    shouldConnect: !!wsToken,
    onMessage: (data) => {
      if (data.type === 'orders') {
        const payload = data.payload as { orders: TOrder[] };
        dispatch(setProfileOrders(payload.orders));
      }
    }
  });

  useEffect(() => {
    dispatch(fetchProfileOrders());
    return () => {
      dispatch(clearProfileOrders());
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
