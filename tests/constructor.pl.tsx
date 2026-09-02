import { test, expect, type Page } from '@playwright/test';
import path from 'path';

const HARS_DIR = path.join(__dirname, 'hars');

const BUN_NAME = 'Краторная булка N-200i';
const MEAT_NAME = 'Мясо бессмертных моллюсков Protostomia';
const BUN_ID = '643d69a5c3f7b9001cfa093c';

/** Перехватывает все запросы к бэкенду и подменяет их моками из HAR-файлов. */
const mockBackend = async (page: Page) => {
  await page.routeFromHAR(path.join(HARS_DIR, 'ingredients.har'), {
    url: '**/api/ingredients'
  });
  await page.routeFromHAR(path.join(HARS_DIR, 'user.har'), {
    url: '**/api/auth/user'
  });
  await page.routeFromHAR(path.join(HARS_DIR, 'order.har'), {
    url: '**/api/orders'
  });
};

/** Открывает страницу конструктора и ждёт загрузки ингредиентов. */
const openConstructorPage = async (page: Page) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Соберите бургер' })
  ).toBeVisible();
};

/** Возвращает карточку ингредиента из списка ингредиентов по его имени. */
const getIngredientCard = (page: Page, name: string) =>
  page
    .locator('li')
    .filter({
      has: page.getByRole('button', { name: 'Добавить', exact: true })
    })
    .filter({ hasText: name });

/** Возвращает секцию конструктора бургера. */
const getConstructor = (page: Page) =>
  page.locator('section').filter({
    has: page.getByRole('button', { name: 'Оформить заказ', exact: true })
  });

/** Возвращает контейнер, в который портируются модальные окна. */
const getModal = (page: Page) => page.locator('#modals');

test.beforeEach(async ({ page }) => {
  await mockBackend(page);
});

test.describe('Страница конструктора бургера', () => {
  test('добавление булки и начинки из списка ингредиентов в конструктор', async ({
    page
  }) => {
    await openConstructorPage(page);

    // добавляем булку — она появляется в верхней и нижней части бургера
    await getIngredientCard(page, BUN_NAME)
      .getByRole('button', { name: 'Добавить', exact: true })
      .click();

    const constructor = getConstructor(page);
    await expect(constructor.getByText(`${BUN_NAME} (верх)`)).toBeVisible();
    await expect(constructor.getByText(`${BUN_NAME} (низ)`)).toBeVisible();

    // добавляем начинку — она появляется в центральной части бургера
    await getIngredientCard(page, MEAT_NAME)
      .getByRole('button', { name: 'Добавить', exact: true })
      .click();

    await expect(constructor.getByText(MEAT_NAME)).toBeVisible();

    // на карточке добавленной начинки отображается счётчик
    await expect(
      getIngredientCard(page, MEAT_NAME).getByText('1', { exact: true })
    ).toBeVisible();

    // вторая булка заменяет первую, а не добавляется второй раз
    await getIngredientCard(page, 'Соус фирменный')
      .getByRole('button', { name: 'Добавить', exact: true })
      .click();
    await expect(constructor.getByText('Соус фирменный')).toBeVisible();
  });

  test('открытие модального окна ингредиента и закрытие по крестику', async ({
    page
  }) => {
    await openConstructorPage(page);

    // клик по ингредиенту открывает модальное окно с его данными
    await getIngredientCard(page, BUN_NAME).getByText(BUN_NAME).click();

    const modal = getModal(page);
    await expect(modal.getByText('Детали ингредиента')).toBeVisible();
    await expect(modal.getByText(BUN_NAME)).toBeVisible();
    await expect(modal.getByText('Калории')).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/ingredients/${BUN_ID}$`));

    // закрытие по клику на крестик
    await modal.getByRole('button').click();
    await expect(modal.getByText('Детали ингредиента')).toHaveCount(0);
    await expect(page).toHaveURL(/\/$/);
  });

  test('закрытие модального окна ингредиента по клику на оверлей', async ({
    page
  }) => {
    await openConstructorPage(page);

    await getIngredientCard(page, MEAT_NAME).getByText(MEAT_NAME).click();

    const modal = getModal(page);
    await expect(modal.getByText('Детали ингредиента')).toBeVisible();

    // оверлей — последний элемент в портале, кликаем в его углу,
    // чтобы попасть вне модального окна
    await page
      .locator('#modals > div')
      .last()
      .click({ position: { x: 5, y: 5 } });

    await expect(modal.getByText('Детали ингредиента')).toHaveCount(0);
    await expect(page).toHaveURL(/\/$/);
  });

  test('создание заказа: модальное окно с верным номером и очистка конструктора', async ({
    page,
    context
  }) => {
    // подставляем фейковые токены авторизации
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'test-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await openConstructorPage(page);

    // в шапку подставляются данные пользователя из мока
    await expect(page.getByText('Тестировщик')).toBeVisible();

    // собираем бургер
    await getIngredientCard(page, BUN_NAME)
      .getByRole('button', { name: 'Добавить', exact: true })
      .click();
    await getIngredientCard(page, MEAT_NAME)
      .getByRole('button', { name: 'Добавить', exact: true })
      .click();

    // клик по кнопке «Оформить заказ» отправляет запрос создания заказа
    await page
      .getByRole('button', { name: 'Оформить заказ', exact: true })
      .click();

    // открывается модальное окно с верным номером заказа
    const modal = getModal(page);
    await expect(modal.getByText('777')).toBeVisible();
    await expect(modal.getByText('идентификатор заказа')).toBeVisible();

    // конструктор очищается от добавленных ингредиентов
    const constructor = getConstructor(page);
    await expect(constructor.getByText('Выберите булки')).toHaveCount(2);
    await expect(constructor.getByText(`${BUN_NAME} (верх)`)).toHaveCount(0);
    await expect(constructor.getByText(MEAT_NAME)).toHaveCount(0);

    // модальное окно закрывается по клику на крестик
    await modal.getByRole('button').click();
    await expect(modal.getByText('идентификатор заказа')).toHaveCount(0);
  });
});
