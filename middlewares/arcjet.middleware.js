// filepath: /home/adil/my-subscription-tracker/middlewares/arcjet.middleware.js
import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    console.log('Arcjet middleware invoked'); // Initial log statement
    try {
        console.log('Arcjet middleware invoked for request:', req.method, req.url);
        const decision = await aj.protect(req, { requested: 1 });
        console.log('Arcjet decision:', decision);

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                console.log('Rate limit exceeded for request:', req.method, req.url);
                return res.status(429).json({ error: 'Rate limit exceeded' });
            }
            if (decision.reason.isBot()) {
                console.log('Bot detected for request:', req.method, req.url);
                return res.status(403).json({ error: 'Bot detected' });
            }

            console.log('Access denied for request:', req.method, req.url);
            return res.status(403).json({ error: 'Access denied' });
        }

        next();
    } catch (error) {
        console.log(`Arcjet middleware Error: ${error}`);
        next(error);
    }
};

export default arcjetMiddleware;