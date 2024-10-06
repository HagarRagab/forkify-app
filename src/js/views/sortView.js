import View from './view.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.sort');

  addHandlerSort(handler) {
    this._parentElement.addEventListener('change', e => {
      e.preventDefault();
      handler(e.target.value);
    });
  }

  _generateMarkup() {
    return `
        <label for="sorting">sort by: </label>
        <select id="sorting">
            <option value="all">All</option>
            <option value="byMe">By Me</option>
        </select>
    `;
  }
}

export default new ResultsView();
