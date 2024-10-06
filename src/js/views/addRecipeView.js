import View from './view.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _errorMsg = 'Some of information is not valid. Please try again';
  _message = 'A new recipe was added successfully.';

  _addRecipeBtn = document.querySelector('.nav__btn--add-recipe');
  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerDisplayWin();
    this._addHandlerCloseWin();
    this._addHandlerPlusIng();
    this._inputsValidation();
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
    this._addRecipeBtn.addEventListener('click', () => {
      this._displayRecipeWindow();
      this.render();
    });
  }

  _addHandlerCloseWin() {
    [this._overlay, this._btnClose].forEach(ele =>
      ele.addEventListener('click', this.hideRecipeWindow.bind(this))
    );
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.hideRecipeWindow();
    });
  }

  _combineIngsFieldsData() {
    const allIngredientsArr = [...document.querySelectorAll('.ingredient')];
    return allIngredientsArr
      .map((ing, i) => {
        const ingFields = [...ing.querySelectorAll('input')]
          .map(field => field.value)
          .join(',');
        return [`ingredient-${i + 1}`, ingFields];
      })
      .filter(ing => ing[1] !== ',,');
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();

      // Check all input
      const allInputs = [
        ...this._parentElement.querySelectorAll('.upload__field input'),
      ];
      allInputs.forEach(input => this._checkInput(input));
      const isAllInputsValid = allInputs.every(input =>
        Boolean(+input.closest('.upload__field').dataset.valid)
      );
      if (!isAllInputsValid) return;

      // Select all direct input values in the form
      const dataArr = [...new FormData(this._parentElement)];
      const data = Object.fromEntries(dataArr);

      const ingredients = Object.fromEntries(this._combineIngsFieldsData());

      handler({ ...data, ...ingredients });
    });
  }

  _addHandlerPlusIng() {
    this._parentElement.addEventListener('click', e => {
      if (!e.target.classList.contains('plus-btn')) return;

      const ingNum = +this._parentElement.querySelector(
        '.ingredient:last-child'
      ).dataset.ing;

      this._parentElement
        .querySelector('.upload__ingredients')
        .insertAdjacentHTML('beforeend', this._ingredientMarkup(ingNum + 1));
    });
  }

  _checkInput(input) {
    const inputContainer = input.closest('.upload__field');
    if (!inputContainer) return;
    const requiredInputs =
      (input.name === 'title' ||
        input.name.includes('Url') ||
        input.name === 'publisher' ||
        input.name === 'cookingTime' ||
        input.name === 'servings') &&
      input.value.trim() === '';

    const inputsUrl =
      input.name.includes('Url') && input.value.trim().length < 5;

    const inputNum =
      input.type === 'number' && +input.value <= 0 && input.value !== '';

    if (requiredInputs)
      inputContainer.setAttribute('data-after', 'This field is required');

    if (inputsUrl)
      inputContainer.setAttribute(
        'data-after',
        'Should contains 5 chars at least'
      );

    if (inputNum)
      inputContainer.setAttribute('data-after', 'Add positive number');

    if (requiredInputs || inputsUrl || inputNum) this._failedInput(input);
    else this._succeedInput(input);
    this._optionalFields(input);
  }

  _failedInput(input) {
    const inputContainer = input.closest('.upload__field');
    if (!inputContainer) return;
    inputContainer.classList.add('input-error');
    inputContainer.classList.remove('input-success');
    inputContainer.dataset.valid = 0;
  }

  _succeedInput(input) {
    const inputContainer = input.closest('.upload__field');
    if (!inputContainer) return;
    inputContainer.classList.remove('input-error');
    inputContainer.classList.add('input-success');
    inputContainer.dataset.valid = 1;
  }

  _optionalFields(input) {
    const inputParent = input.closest('.ingredient .upload__field');
    if (!inputParent) return;
    if (input.value === '') inputParent.className = 'upload__field';
  }

  _inputsValidation() {
    this._parentElement.addEventListener('input', e => {
      const input = e.target;
      this._checkInput(input);
      this._optionalFields(input);
    });
  }

  _ingredientMarkup(i) {
    return `
      <label>Ingredient ${i}</label>
      <div class="ingredient" data-ing="${i}" name="ingredient-${i}">
        <div class="upload__field">
          <input type="number" placeholder="Quantity" min="0.1" />
        </div>
        <input type="text" placeholder="Unit" />
        <input type="text" placeholder="Description" />
      </div>
    `;
  }

  _generateMarkup() {
    return `
      <div>
        <h3 class="upload__heading">Recipe data</h3>
        <div class="upload__column">
          <label>Title</label>
          <div class="upload__field">
            <input name="title" type="text" placeholder="title" />
          </div>
          <label>URL</label>
          <div class="upload__field">
            <input name="sourceUrl" type="text" placeholder="URL" />
          </div>
          <label>Image URL</label>
          <div class="upload__field">
            <input name="imageUrl" type="text" placeholder="image URL" />
          </div>
          <label>Publisher</label>
          <div class="upload__field">
            <input name="publisher" type="text" placeholder="publisher" />
          </div>
          <label>Prep time</label>
          <div class="upload__field">
            <input name="cookingTime" type="number" placeholder="cooking time" />
          </div>
          <label>Servings</label>
          <div class="upload__field">
            <input name="servings" type="number" placeholder="servings" />
          </div>
        </div>
      </div>

      <div class="Ingredients-container">
        <h3 class="upload__heading">Ingredients</h3>
        <div class="upload__column upload__ingredients">
          ${new Array(3)
            .fill(0)
            .map((_, i) => this._ingredientMarkup(i + 1))
            .join('')}
        </div>
        <button type="button" class="plus-btn" title="Add more ingredients">
          +
        </button>
      </div>

      <button type="submit" class="btn upload__btn">
        <svg>
          <use href="${icons}#icon-upload-cloud"></use>
        </svg>
        <span>Upload</span>
      </button>
    `;
  }
}

export default new AddRecipeView();
