export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // récupérer le status dans l'erreur (si on en a un)
  const statusCode = err.statusCode || 500;

  //   const message = err.message;
  //   if (statusCode === 500) {
  //     message = "Internal server error";
  //   }
  const message = statusCode === 500 ? "Internal server error" : err.message;

  res.status(statusCode).json({ message });
};