import View from './view.js';
import icons from 'url:../../img/icons.svg';

class ShoppingView extends View {
  _parentElement = document.querySelector('.cart');
  _shoppingCartBtn = document.querySelector('.nav__btn--shopping');
  _errorMsg = 'There is no items in this list. Please select a recipe ;)';

  constructor() {
    super();
    this._addHandlerList();
    window.addEventListener('hashchange', this._closeCart.bind(this));
  }

  _toggleCart() {
    this._parentElement.classList.toggle('open');
  }

  _closeCart() {
    this._parentElement.classList.remove('open');
  }

  addHandlerCart(handler) {
    this._shoppingCartBtn.addEventListener('click', () => {
      this._toggleCart();
      if (this._parentElement.classList.contains('open')) handler();
    });
  }

  _addHandlerList() {
    this._parentElement.addEventListener('click', e => {
      const clickedBtn = e.target;
      if (clickedBtn.closest('.cart__item--delete'))
        return this._addHandlerRemoveItem(clickedBtn);

      if (clickedBtn.closest('.quantity--change'))
        return this._addHandlerChangeQuantity(clickedBtn);

      if (clickedBtn.closest('.cart__close')) return this._closeCart();
      return;
    });
  }

  _addHandlerRemoveItem(clickedBtn) {
    const removedIng = clickedBtn.closest('.cart__item');
    const removedIngIndex = this._data.findIndex(
      ing => ing.id === +removedIng.dataset.id
    );

    this._data.splice(removedIngIndex, 1);
    removedIng.remove();
  }

  _addHandlerChangeQuantity(clickedBtn) {
    const changedIngIndex = this._data.findIndex(ing => {
      return ing.id === +clickedBtn.closest('.cart__item').dataset.id;
    });
    const clickedBtnDataSet =
      +clickedBtn.closest('.quantity--change').dataset.quantity;

    if (clickedBtnDataSet <= 0) return;
    this._data[changedIngIndex].component.quantity = clickedBtnDataSet;
    this.update(this._data);
  }

  _cartItemMarkup(item) {
    return `
    <li class="cart__item" data-id="${item.id}">
      <button class="cart__item--delete btn--tiny">
        <svg>
          <use href="${icons}#icon-trash"></use>
        </svg>
      </button>
      <p class="cart__item--title">${item.component.description}</p>
      <div class="quantity-container ${
        item.component.quantity ? '' : 'hidden'
      }">
        <button class="btn--tiny quantity--change" data-quantity="${
          item.component.quantity - item.changeValue
        }">
          <svg>
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <p class="quantity">${item.component.quantity} ${
      item.component.unit
    }</p>
        <button class="btn--tiny quantity--change" data-quantity="${
          item.component.quantity + item.changeValue
        }">
          <svg>
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
    </li>
    `;
  }

  _generateMarkup() {
    return `
      <div class="cart__header">
        <div>
          <h2 class="cart__title">Shopping list</h2>
          <span class="cart__subtitle">Recipe ingredients</span>
        </div>
          <button class="cart__close">x</button>
      </div>
      <ul class="cart__list">
        ${this._data.map(item => this._cartItemMarkup(item)).join('')}
      </ul>
    `;
  }
}

export default new ShoppingView();
