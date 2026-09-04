import ingredientsReducer, {
  addIngredient,
  fetchIngredients
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Булка мак',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 30,
    calories: 300,
    price: 100,
    image: 'image-bun.png',
    image_large: 'image-bun-large.png',
    image_mobile: 'image-bun-mobile.png'
  },
  {
    _id: 'main-1',
    name: 'Котлета космическая',
    type: 'main',
    proteins: 20,
    fat: 10,
    carbohydrates: 5,
    calories: 250,
    price: 200,
    image: 'image-meat.png',
    image_large: 'image-meat-large.png',
    image_mobile: 'image-meat-mobile.png'
  }
];

const initialState = {
  ingredients: [],
  isLoading: false,
  error: null
};

describe('Редьюсер слайса ingredients', () => {
  it('возвращает начальное состояние при вызове с неизвестным экшеном', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('обрабатывает экшен fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.pending('req-1')
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  it('обрабатывает экшен fetchIngredients.fulfilled', () => {
    const action = fetchIngredients.fulfilled(mockIngredients, 'req-1');
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('обрабатывает экшен fetchIngredients.rejected', () => {
    const action = fetchIngredients.rejected(new Error('Ошибка сети'), 'req-1');
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка сети');
  });

  it('добавляет ингредиент по экшену addIngredient', () => {
    const state = ingredientsReducer(
      initialState,
      addIngredient(mockIngredients[0])
    );
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(mockIngredients[0]);
  });
});
