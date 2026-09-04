import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from '../burgerConstructorSlice';
import { createOrder } from '../orderSlice';
import { TIngredient, TOrder } from '@utils-types';

const bun: TIngredient = {
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
};

const secondBun: TIngredient = {
  ...bun,
  _id: 'bun-2',
  name: 'Булка космическая'
};

const meat: TIngredient = {
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
};

const sauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус фирменный',
  type: 'sauce',
  proteins: 8,
  fat: 15,
  carbohydrates: 22,
  calories: 260,
  price: 347,
  image: 'image-sauce.png',
  image_large: 'image-sauce-large.png',
  image_mobile: 'image-sauce-mobile.png'
};

const mockOrder: TOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Краторный бургер',
  createdAt: '2026-09-01T10:00:00.000Z',
  updatedAt: '2026-09-01T10:00:00.000Z',
  number: 777,
  ingredients: ['bun-1', 'main-1']
};

const initialState = {
  bun: null,
  ingredients: []
};

/** Состояние с булкой и двумя ингредиентами, у которых заданы id. */
const filledState = {
  bun: { ...bun, id: 'bun-instance-1' },
  ingredients: [
    { ...meat, id: 'meat-instance-1' },
    { ...sauce, id: 'sauce-instance-1' }
  ]
};

describe('Редьюсер слайса burgerConstructor', () => {
  it('возвращает начальное состояние при вызове с неизвестным экшеном', () => {
    const state = burgerConstructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('добавляет булку по экшену addIngredient в поле bun', () => {
    const state = burgerConstructorReducer(undefined, addIngredient(bun));
    expect(state.bun).toEqual({ ...bun, id: expect.any(String) });
    expect(state.ingredients).toEqual([]);
  });

  it('заменяет ранее добавленную булку при добавлении другой', () => {
    const first = burgerConstructorReducer(undefined, addIngredient(bun));
    const second = burgerConstructorReducer(first, addIngredient(secondBun));
    expect(second.bun?._id).toBe('bun-2');
    expect(second.ingredients).toEqual([]);
  });

  it('добавляет ингредиент по экшену addIngredient в список ingredients', () => {
    const state = burgerConstructorReducer(undefined, addIngredient(meat));
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({ ...meat, id: expect.any(String) });
  });

  it('удаляет ингредиент из списка по экшену removeIngredient', () => {
    const state = burgerConstructorReducer(
      filledState,
      removeIngredient('meat-instance-1')
    );
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].id).toBe('sauce-instance-1');
    expect(state.bun).toEqual(filledState.bun);
  });

  it('перемещает ингредиент вверх по экшену moveIngredientUp', () => {
    const moved = burgerConstructorReducer(filledState, moveIngredientUp(1));
    expect(moved.ingredients.map((item) => item.id)).toEqual([
      'sauce-instance-1',
      'meat-instance-1'
    ]);
    // первый элемент не может подняться выше
    const notMoved = burgerConstructorReducer(filledState, moveIngredientUp(0));
    expect(notMoved.ingredients).toEqual(filledState.ingredients);
  });

  it('перемещает ингредиент вниз по экшену moveIngredientDown', () => {
    const moved = burgerConstructorReducer(filledState, moveIngredientDown(0));
    expect(moved.ingredients.map((item) => item.id)).toEqual([
      'sauce-instance-1',
      'meat-instance-1'
    ]);
    // последний элемент не может опуститься ниже
    const notMoved = burgerConstructorReducer(
      filledState,
      moveIngredientDown(1)
    );
    expect(notMoved.ingredients).toEqual(filledState.ingredients);
  });

  it('очищает конструктор по экшену clearConstructor', () => {
    const state = burgerConstructorReducer(filledState, clearConstructor());
    expect(state).toEqual(initialState);
  });

  it('очищает конструктор после успешного оформления заказа (createOrder.fulfilled)', () => {
    const action = createOrder.fulfilled(mockOrder, 'req-1', [
      'bun-1',
      'main-1'
    ]);
    const state = burgerConstructorReducer(filledState, action);
    expect(state).toEqual(initialState);
  });
});
