const formatError = (error) => {
  const formattedErrors = {};
  JSON.parse(error).forEach((err) => {
    const field = err.path[0]; // top-level field
    formattedErrors[field] = err.message;
  });
  return formattedErrors;
};

module.exports = { formatError };
