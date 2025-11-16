import { Router } from "express";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { validateProduct } from "../middleware/validateProduct.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, "..", "data", "products.json");

const read = () => JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
const write = (data) => fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

// GET /api/products?search=&category=&minPrice=&maxPrice=&sort=price:desc&page=1&limit=10
router.get("/", (req, res) => {
  let { page = 1, limit = 10, search = "", category, minPrice, maxPrice, sort } = req.query;
  page = Number(page); limit = Number(limit);

  let items = read();

  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }
  if (category) items = items.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  if (minPrice) items = items.filter(p => p.price >= Number(minPrice));
  if (maxPrice) items = items.filter(p => p.price <= Number(maxPrice));

  if (sort) {
    const [field, dirRaw] = String(sort).split(":");
    const dir = dirRaw === "desc" ? -1 : 1;
    items.sort((a,b) => (a[field] > b[field] ? dir : a[field] < b[field] ? -dir : 0));
  }

  const total = items.length;
  const start = (page - 1) * limit;
  res.json({ page, limit, total, data: items.slice(start, start + limit) });
});

router.get("/:id", (req, res) => {
  const item = read().find(p => p.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Product not found" });
  res.json(item);
});

router.post("/", validateProduct, (req, res) => {
  const products = read();
  const product = { id: uuid(), ...req.body };
  products.push(product);
  write(products);
  res.status(201).json(product);
});

router.put("/:id", validateProduct, (req, res) => {
  const products = read();
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });
  products[idx] = { id: products[idx].id, ...req.body };
  write(products);
  res.json(products[idx]);
});

router.patch("/:id", (req, res) => {
  const products = read();
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });
  products[idx] = { ...products[idx], ...req.body };
  write(products);
  res.json(products[idx]);
});

router.delete("/:id", (req, res) => {
  const products = read();
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });
  const deleted = products.splice(idx, 1)[0];
  write(products);
  res.json({ deleted });
});

export default router;
