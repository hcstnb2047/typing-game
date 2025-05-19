import { Hono } from "hono";
import { handle } from "hono/vercel";

type EnvConfig = {
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
}

const app = new Hono().basePath("/api");

app.get("/ping", (c) => c.json({ message: "Hello, World!" }));


export const GET = handle(app); 