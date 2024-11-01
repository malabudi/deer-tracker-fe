export const API_PATH = 'http://localhost:5000/api';
export const logIn = 'Log in';
export const signUp = 'Sign up';
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//new user password validation
export const minLengthRegex = /.{8,}/;
export const containsUpperLetterRegex = /[A-Z]/;
export const containsLowerLetterRegex = /[a-z]/;
export const containsNumberRegex = /\d/;
export const containsSpecialCharRegex = /[@$!%*#?&]/;

// cooldown time to save deer in ms (1000ms = 1s)
export const cooldownTime = 60000;

// cooldown for ever box highlight
export const detectCooldown = 5000;

//cool down for every fetched user location
export const FetchLocation_CoolDown = 5000;
