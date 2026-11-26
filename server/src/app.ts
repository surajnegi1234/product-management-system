import express from "express";
import cors from "cors";
import { env } from "./config/env";
import productRoutes from "./routes/productRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(cors({ origin: env.clientOrigins }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/products", productRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
