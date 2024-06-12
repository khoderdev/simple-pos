import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

// Create `axios-cache-adapter` instance
const cache = setupCache({
  maxAge: 15 * 60 * 1000 // Cache for 15 minutes
});

// Create `axios` instance passing the newly created `cache.adapter`
const api = axios.create({
  baseURL: 'http://localhost:5200',
  adapter: cache.adapter
});

export default api;
