export const canParseJson = (input: string) => {
  try {
    JSON.parse(input);
    return true; // If parsing is successful, return true
  } catch (e) {
    return false; // If an error occurs, return false
  }
};

// Helper functions to get and set cookies
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

export const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};
