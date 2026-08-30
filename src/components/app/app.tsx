import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Preloader } from '@ui';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  Register,
  ResetPassword,
  Feed,
  ProfileOrders,
  IngredientDetailsPage
} from '@pages';
import { useEffect } from 'react';
import { fetchUser } from '../../services/slices/userSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { selectIngredientsLoading } from '../../services/selectors/ingredientsSelectors';
import { useDispatch, useSelector } from '../../services/store';
import { selectUserIsAuthChecked } from '../../services/selectors/userSelectors';
import { ProtectedRoute } from '../../services/protected-route';
import { Modal } from '@components';
import { IngredientDetails } from '@components';
import { OrderInfo } from '@components';

const App = () => {
  const dispatch = useDispatch();
  const isAuthChecked = useSelector(selectUserIsAuthChecked);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const location = useLocation();
  const navigate = useNavigate();

  const background = location.state && (location.state as any).background;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUser());
  }, [dispatch]);

  const closeModal = () => {
    navigate(-1);
  };

  if (!isAuthChecked) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <Preloader />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <Routes location={background || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route
            path='/login'
            element={
              <ProtectedRoute onlyUnAuth>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path='/register'
            element={
              <ProtectedRoute onlyUnAuth>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path='/forgot-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path='/reset-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <OrderInfo />
              </ProtectedRoute>
            }
          />
          <Route path='/ingredients/:id' element={<IngredientDetailsPage />} />
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      )}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Детали заказа' onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
