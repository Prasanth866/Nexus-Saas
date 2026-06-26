import 'dotenv/config';
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rootUserRouter from "./routes/users.routes.js";
import orgsRoutes from "./routes/orgs.routes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/", rootUserRouter);
app.use("/", orgsRoutes);

export default app;