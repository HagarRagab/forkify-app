import View from './view.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'A new recipe was added successfully.';

  _addRecipeBtn = document.querySelector('.nav__btn--add-recipe');
  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerDisplayWin();
    this._addHandlerCloseWin();
  }

  hideRecipeWindow() {
    this._window.classList.add('hidden');
    this._overlay.classList.add('hidden');
  }

  _displayRecipeWindow() {
    this._window.classList.remove('hidden');
    this._overlay.classList.remove('hidden');
  }

  _addHandlerDisplayWin() {
    this._addRecipeBtn.addEventListener(
      'click',
      this._displayRecipeWindow.bind(this)
    );
  }

  _addHandlerCloseWin() {
    [this._overlay, this._btnClose].forEach(ele =>
      ele.addEventListener('click', this.hideRecipeWindow.bind(this))
    );
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.hideRecipeWindow();
    });
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();

      const dataArr = [...new FormData(this._parentElement)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
}

export default new AddRecipeView();
