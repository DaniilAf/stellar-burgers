describe('Булки и ингредиенты добавляются в конструктор', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4222');
  });
  it('Булка добавляется', function () {
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-bun-1]').contains('Булка').should('exist');
    cy.get('[data-cy=constructor-bun-2]').contains('Булка').should('exist');
  });

  it('Ингредиенты добавляются', function () {
    cy.get('[data-cy=mains-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=sauces-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-ingredients]')
      .contains('Котлета')
      .should('exist');
    cy.get('[data-cy=constructor-ingredients]')
      .contains('Соус')
      .should('exist');
  });
});

describe('Модальное окно ингредиента работает правильно', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4222');
  });

  it('Модальное окно открывается', function () {
    cy.contains('Детали ингредиента').should('not.exist');
    cy.contains('Булка').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modal').contains('Булка').should('exist');
  });

  it('Модальное окно закрывается по нажатию на крестик', function () {
    cy.contains('Булка').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modal button[aria-label="Закрыть"]').click();
    cy.get('#modal').should('not.exist');
  });

  it('Модальное окно закрывается по нажатию на оверлей', function () {
    cy.contains('Булка').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('[data-cy=modal-overlay]').click('left', { force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });
});

describe('Процесс оформления заказа работает правильно', function () {
  beforeEach(function () {
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');
    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user.json'
    });
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.intercept('POST', 'api/orders', {
      fixture: 'newOrder.json'
    });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4222');
  });

  it('Заказ оформляется', function () {
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-bun-1]').contains('Булка').should('exist');
    cy.get('[data-cy=constructor-bun-2]').contains('Булка').should('exist');
    cy.get('[data-cy=mains-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=sauces-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-ingredients]')
      .contains('Котлета')
      .should('exist');
    cy.get('[data-cy=constructor-ingredients]')
      .contains('Соус')
      .should('exist');
    cy.get('[data-cy=create-order]').contains('Оформить заказ').click();
    cy.get('#modal').contains('1234').should('exist');
    cy.get('#modal button[aria-label="Закрыть"]').click();
    cy.get('#modal').should('not.exist');

    cy.get('[data-cy=constructor-bun-1]').should('not.exist');
    cy.get('[data-cy=constructor-bun-2]').should('not.exist');
    cy.get('[data-cy=constructor-ingredients]')
      .contains('Котлета')
      .should('not.exist');
    cy.get('[data-cy=constructor-ingredients]')
      .contains('Соус')
      .should('not.exist');
  });

  afterEach(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
});
