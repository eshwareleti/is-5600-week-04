export const logger = (req, res, next) => {
  const t0 = Date.now();
  res.on("finish", () =>
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${Date.now()-t0}ms`)
  );
  next();
};
