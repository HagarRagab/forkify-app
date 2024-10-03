import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    numResults: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const formatDataKeys = function (recipe) {
  return Object.entries(recipe).reduce(
    (recipeObj, [key, value]) => {
      const newKey = key.includes('_')
        ? key
            .split('_')
            .map((word, i) => {
              if (i === 0) return word;
              return word.replace(word[0], word[0].toUpperCase());
            })
            .join('')
        : key;
      recipeObj[newKey] = value;
      return recipeObj;
    },
    { ...(recipe.key && { key: recipe.key }) }
  );
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = formatDataKeys(data.data.recipe);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.marked = true;
    else state.recipe.marked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    if (!query) return;
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(recipe =>
      formatDataKeys(recipe)
    );
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.numResults;
  const end = page * state.search.numResults;
  return state.search.results.slice(start, end);
};

export const loadServings = function (newServings) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      newServings * (ingredient.quantity / state.recipe.servings);
  });
  state.recipe.servings = newServings;
};

export const localStorageBookmark = function () {
  window.localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (markedRecipe) {
  state.bookmarks.push(markedRecipe);
  if (state.recipe.id === markedRecipe.id) state.recipe.marked = true;
  localStorageBookmark();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  if (state.recipe.id === id) state.recipe.marked = false;
  localStorageBookmark();
};

const init = function () {
  const storage = window.localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].includes('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(ele => ele.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'The ingredient format is not correct. Please use the correct format. Ex: 1,kg,flour'
          );
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.imageUrl,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = formatDataKeys(data.data.recipe);
  } catch (err) {
    throw err;
  }
};
