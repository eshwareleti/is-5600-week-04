import express from "express";
import morgan from "morgan";
import productsRouter from "./routes/products.js";
import { logger } from "./middleware/logger.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));
app.use(logger);

app.use("/api/products", productsRouter);
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

app.listen(PORT, () => console.log(`eCommerce API on http://localhost:${PORT}`));
