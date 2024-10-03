class searchView {
  _parentElement = document.querySelector('.search');
  _inputField = this._parentElement.querySelector('.search__field');

  getQuery() {
    const query = this._inputField.value;
    this._inputField.value = '';
    return query;
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new searchView();
