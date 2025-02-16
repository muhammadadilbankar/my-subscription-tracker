import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from "./env.js";

console.log('Arcjet configuration file loaded')
const aj = arcjet({
    key: ARCJET_KEY,
    characteristics: ["ip.src"], 
    rules: [
        shield({ mode: "LIVE" }),
        detectBot({
            mode: "LIVE",
            allow: ["CATEGORY:SEARCH_ENGINE",],
        }),
        
        tokenBucket({
            mode: "LIVE",
            refillRate: 5, // Refill 5 tokens per interval
            interval: 10, // Refill every 10 seconds
            capacity: 5, // Bucket capacity of 10 tokens
        }),
    ],
});

console.log('Arcjet configuration loaded:', aj);

export default aj;