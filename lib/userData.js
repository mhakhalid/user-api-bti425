import { getToken } from './authenticate';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function makeRequest(method, url) {
  const token = getToken();
  const res = await fetch(`${API_URL}${url}`, {
    method: method,
    headers: {
      'content-type': 'application/json',
      'Authorization': `JWT ${token}`
    }
  });
  if (res.ok) {
    return res.json();
  } else {
    return [];
  }
}

export async function getFavourites() {
  return makeRequest('GET', '/favourites');
}

export async function addToFavourites(id) {
  return makeRequest('PUT', `/favourites/${id}`);
}

export async function removeFromFavourites(id) {
  return makeRequest('DELETE', `/favourites/${id}`);
}

export async function getHistory() {
  return makeRequest('GET', '/history');
}

export async function addToHistory(id) {
  return makeRequest('PUT', `/history/${id}`);
}

export async function removeFromHistory(id) {
  return makeRequest('DELETE', `/history/${id}`);
}
