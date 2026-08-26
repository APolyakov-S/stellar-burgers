import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useWebSocket } from '../../services/hooks/useWebSocket';
import {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday
} from '../../services/selectors/feedSelectors';
import {
  clearFeed,
  setFeed,
  setFeedTotal,
  fetchFeeds
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedOrders);
  const total = useSelector(selectFeedTotal);
  const totalToday = useSelector(selectFeedTotalToday);

  const { send } = useWebSocket({
    url: 'wss://norma.nomoreparties.space/orders/all',
    shouldConnect: true,
    onMessage: (data) => {
      if (data.type === 'orders') {
        const payload = data.payload as {
          orders: TOrder[];
          total: number;
          totalToday: number;
        };
        dispatch(setFeed(payload.orders));
        dispatch(
          setFeedTotal({ total: payload.total, totalToday: payload.totalToday })
        );
      }
    }
  });

  useEffect(() => {
    dispatch(fetchFeeds());
    return () => {
      dispatch(clearFeed());
    };
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeeds());
      }}
    />
  );
};
