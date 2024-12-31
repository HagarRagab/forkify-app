import { TIMEOUT_SEC } from './config';

// Escape from API request in case the request took long time
const timeout = function (s) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('The request took long time. Please try again later.'));
    }, s * 1000);
  });
};

export const AJAX = async function (url, newRecipe = undefined) {
  try {
    // POST / GET data to forkify-api
    const fetchPro = newRecipe
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newRecipe),
        })
      : fetch(url);

    // res will be fetched data in case fetch is faster than time out
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok)
      throw new Error(`${data.message} (${res.status}). Please try again.`);

    return data;
  } catch (err) {
    throw err;
  }
};
