// Utility Functions for Services
import Cookies from 'js-cookie';

const CSRF_TOKEN = 'csrftoken';

export function getCSRFToken() {
  return Cookies.get(CSRF_TOKEN);
}

export function clearCSRFToken() {
  Cookies.remove(CSRF_TOKEN);
}
