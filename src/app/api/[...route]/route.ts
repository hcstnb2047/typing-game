import { Hono } from "hono";
import { handle } from "hono/vercel";
import { getCookie, setCookie } from "hono/cookie";
import { Redis } from "@upstash/redis";

type EnvConfig = {
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
}

const app = new Hono<{ Bindings: EnvConfig }>().basePath("/api");

app.get("/ping", (c) => c.json({ message: "Hello, World!" }));

app.post("/result", async (c) => {
    try{
        const{score ,userName} = await c.req.json();

        if(!score || !userName){
            return c.json({error: "Invalid request"}, 400);
        }

        const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL!,
            token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        });

        await redis.zadd("typing-score-rank", {
            score: score,
            member: userName
        });

        return c.json({message: "Score added successfully"}, 200);
        
    } catch (error) {
        console.error("Error adding score:", error);
        return c.json({error: "Internal server error"}, 500);
    }
});

app.get("result",async (c) => {
    try{
        const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL!,
            token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        });

        const results = await redis.zrange("typing-score-rank", 0, 9, {
            rev: true,
            withScores: true,
        })
        const scores = [];
        for(let i =0; i<results.length; i+=2){
            scores.push({
                userName: results[i],
                score: results[i+1]
            });
        }
        return c.json(scores, 200);
    } catch (error) {
        console.error("Error fetching scores:", error);
        return c.json({error: "Internal server error"}, 500);
    }
})

export const GET = handle(app);
export const POST = handle(app); 