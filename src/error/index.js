export const notifyError = (message) => {
  console.error(message);
};

export const errorHandler = (error) => {
  // что-то обрабатывает
  notifyError(error);
  return error;
};

export default {
  notifyError,
  errorHandler,
};
