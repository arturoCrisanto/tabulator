export const jsonParseErrorHandler = (error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    console.error("JSON Parse Error:", error.message);
    console.error("Request body:", req.body);
    console.error("Request headers:", req.headers);
    return res.status(400).json({
      error: "Invalid JSON format",
      message:
        "The request body contains malformed JSON. Please check your JSON syntax.",
      details: error.message,
    });
  }
  next(error);
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
