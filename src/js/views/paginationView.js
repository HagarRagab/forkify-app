import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', e => {
      const clickedBtn = e.target.closest('.btn--inline');
      if (!clickedBtn) return;
      handler(+clickedBtn.dataset.goto);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.numResults
    );
    const currentPage = this._data.page;

    // page 1, other pages
    if (currentPage === 1 && currentPage < numPages)
      return (
        this._generatePageNumMarkup(currentPage, numPages) +
        this._generateMarkupBtn('next', currentPage)
      );

    // last page
    if (currentPage === numPages && currentPage > 1)
      return (
        this._generateMarkupBtn('prev', currentPage) +
        this._generatePageNumMarkup(currentPage, numPages)
      );

    // other page
    if (currentPage < numPages && currentPage > 1)
      return (
        this._generateMarkupBtn('prev', currentPage) +
        this._generatePageNumMarkup(currentPage, numPages) +
        this._generateMarkupBtn('next', currentPage)
      );

    // page 1, no other pages
    return '';
  }

  _generatePageNumMarkup(currentPage, numPages) {
    return `
      <span class="pagination__page-num">${currentPage}/${numPages}</span>
    `;
  }

  _generateMarkupBtn(btnType, currentPage) {
    const getPageBtnNum =
      btnType === 'prev' ? currentPage - 1 : currentPage + 1;

    return `
        <button data-goto="${getPageBtnNum}" class="btn--inline pagination__btn--${btnType}">
            <span>Page ${getPageBtnNum}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-${
      btnType === 'perv' ? 'left' : 'right'
    }"></use>
            </svg>
        </button>
    `;
  }
}

export default new PaginationView();
