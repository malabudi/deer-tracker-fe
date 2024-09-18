export const API_PATH = 'http://localhost:5000/api';
export const logIn = 'Log in';
export const signUp = 'Sign up';
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

// cooldown time to save deer in ms (1000ms = 1s)
export const cooldownTime = 60000;
