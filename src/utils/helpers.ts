export const canParseJson = (input: string) => {
  try {
    JSON.parse(input);
    return true; // If parsing is successful, return true
  } catch (e) {
    return false; // If an error occurs, return false
  }
};
