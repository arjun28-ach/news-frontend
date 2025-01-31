import axios from 'axios';
import { getCookie } from '../utils/cookies';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor for CSRF token
api.interceptors.request.use(config => {
  const csrfToken = getCookie('csrftoken');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('Starting Request:', request.method, request.url);
  return request;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      console.error('API Connection Error: Unable to reach the API server. Please ensure the backend server is running.');
      console.error('Error details:', error.message);
    } else if (error.response.status === 404) {
      console.error('API not found:', {
        url: error.config.url,
        method: error.config.method,
        baseURL: error.config.baseURL,
        fullURL: error.config.baseURL + error.config.url
      });
    } else {
      console.error('API Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config.url,
        method: error.config.method
      });
    }
    return Promise.reject(error);
  }
);

// API functions
export const fetchNews = async ({ page = 1, language = 'en', per_page = 30 }) => {
  try {
    const { data } = await api.get(`/news/?page=${page}&language=${language}&per_page=${per_page}`);
    return data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const bookmarkArticle = async (article) => {
  try {
    const { data } = await api.post('/bookmarks/add/', article, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return data;
  } catch (error) {
    console.error('Error bookmarking article:', error);
    throw error;
  }
};

export const removeBookmark = async (articleUrl) => {
  try {
    const { data } = await api.post(`/bookmarks/remove/`, {
      article_url: articleUrl
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return data;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
};

export const getBookmarks = async () => {
  try {
    const { data } = await api.get('/bookmarks/');
    return data;
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    throw error;
  }
};

export const getBookmarkCount = async () => {
  try {
    const { data } = await api.get('/bookmarks/count/');
    return data.count;
  } catch (error) {
    console.error('Error fetching bookmark count:', error);
    throw error;
  }
};

// Export the api instance as default
export default api;