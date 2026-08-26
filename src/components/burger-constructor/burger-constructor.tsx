import { FC, useMemo, useEffect } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { selectConstructorItems } from '../../services/selectors/burgerConstructorSelectors';
import { createOrder, closeOrderModal } from '../../services/slices/orderSlice';
import {
  selectOrderRequest,
  selectOrderModalData
} from '../../services/selectors/orderSelectors';
import { selectUserData } from '../../services/selectors/userSelectors';
import { useNavigate } from 'react-router-dom';
import { clearConstructor } from '../../services/slices/burgerConstructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const user = useSelector(selectUserData);
  const navigate = useNavigate();

  useEffect(() => {
    if (orderModalData) {
      dispatch(clearConstructor());
    }
  }, [orderModalData, dispatch]);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user.name) {
      navigate('/login');
      return;
    }
    const ingredientsId = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(createOrder(ingredientsId));
  };

  const closeOrderModalHandler = () => {
    dispatch(closeOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModalHandler}
    />
  );
};
