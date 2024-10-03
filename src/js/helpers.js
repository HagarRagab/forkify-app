import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('The request took long time. Please try again later.'));
    }, s * 1000);
  });
};

export const AJAX = async function (url, newRecipe = undefined) {
  try {
    const fetchPro = newRecipe
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newRecipe),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok)
      throw new Error(`${data.message} (${res.status}). Please try again.`);

    return data;
  } catch (err) {
    throw err;
  }
};
