import 'core-js/actual';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import sortView from './views/sortView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import shoppingView from './views/shoppingView.js';
import { MODAL_CLOSE_SEC } from './config.js';

///////////////////////////////////////
const controlRecipes = async function () {
  try {
    const recipeId = window.location.hash.slice(1);
    if (!recipeId) return;

    recipeView.renderSpinner();

    await model.loadRecipe(recipeId);

    recipeView.render(model.state.recipe);

    bookmarkView.update(model.state.bookmarks);

    resultsView.update(model.getSearchResultsPage(model.state.search.page));
  } catch (err) {
    recipeView.renderError();
  }
};

const controlServings = function (newServings) {
  model.loadServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    resultsView.renderSpinner();
    const data = await model.loadSearchResults(query);
    // Render initial results
    resultsView.render(model.getSearchResultsPage());
    // Render initial pagination
    paginationView.render(model.state.search);
    // Render sort list
    if (model.state.search.results.length !== 0)
      sortView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

//TODO ############
const controlSorting = function (sortBy) {
  const search = model.sortResults(sortBy);
  resultsView.render(model.getSearchResultsPage(1, search));
  paginationView.render(search);
};

const controlPagination = function (goToPage) {
  // Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // Render new pagination  `
  paginationView.render(model.state.search);
};

const controlAddBookmark = function (markedRecipe) {
  // Add/remove bookmark
  if (!markedRecipe.marked) model.addBookmark(markedRecipe);
  else model.deleteBookmark(markedRecipe.id);

  // Render message in bookmark view
  if (model.state.bookmarks.length === 0) bookmarkView.renderMsg();

  // updat recipe view
  recipeView.update(model.state.recipe);

  // render bookmark list
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render a spinner
    addRecipeView.renderSpinner();
    // Upload new recipe
    await model.uploadRecipe(newRecipe);
    // render success message
    addRecipeView.renderMsg();
    // Change URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // Add new recipe to bookmark
    model.addBookmark(model.state.recipe);
    // Render new recipe
    recipeView.render(model.state.recipe);
    // Update bookmark
    bookmarkView.render(model.state.bookmarks);
    // Hide modal window
    setTimeout(() => {
      addRecipeView.hideRecipeWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError();
  }
};

// Subscriber
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  sortView.addHandlerSort(controlSorting);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);

  if (model.state.bookmarks) bookmarkView.render(model.state.bookmarks);
};
init();
