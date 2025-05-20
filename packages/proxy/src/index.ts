import { Hono } from "hono";
import { cors } from "hono/cors";
import { config } from "dotenv";

if (import.meta.env.DEV) {
  config();
}

const app = new Hono().use(cors());

app.onError((err, c) => {
  console.error(`Error on ${c.req.path} router`, err);
  return c.json(err, 500);
});

export default app;
