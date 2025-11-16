export const validateProduct = (req, res, next) => {
  const { name, price, category, stock } = req.body || {};
  if (typeof name !== "string" || !name.trim())
    return res.status(400).json({ error: "name is required (string)" });
  if (typeof price !== "number" || price < 0)
    return res.status(400).json({ error: "price must be a non-negative number" });
  if (typeof category !== "string" || !category.trim())
    return res.status(400).json({ error: "category is required (string)" });
  if (!Number.isInteger(stock) || stock < 0)
    return res.status(400).json({ error: "stock must be a non-negative integer" });
  next();
};
