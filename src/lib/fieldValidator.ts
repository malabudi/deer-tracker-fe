import {
  emailRegex,
  minLengthRegex,
  containsLowerLetterRegex,
  containsUpperLetterRegex,
  containsNumberRegex,
  containsSpecialCharRegex,
} from '@/utils/constants';

// All validator functions return strings for the error message

export const validateEmail = (value: string) => {
  if (!value) return 'Email cannot be empty.';
  if (!emailRegex.test(value)) return 'Invalid email address.';
  return '';
};

export const validatePassword = (value: string) => {
  const errors = [];
  if (!minLengthRegex.test(value))
    errors.push('* must contain min. 8 characters');
  if (!containsUpperLetterRegex.test(value))
    errors.push('* must contain min. 1 upper case');
  if (!containsLowerLetterRegex.test(value))
    errors.push('* must contain min. 1 lower case');
  if (!containsNumberRegex.test(value))
    errors.push('* must contain min. 1 number');
  if (!containsSpecialCharRegex.test(value))
    errors.push('* must contain min. 1 special character');
  return errors.length ? errors.join('\n') : '';
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
) => {
  if (!password) return 'Please re-enter your password.';
  if (confirmPassword !== password) return 'Passwords do not match.';
  return '';
};
