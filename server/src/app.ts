import 'dotenv/config';
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rootUserRouter from "./routes/users.routes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/", rootUserRouter);

export default app;