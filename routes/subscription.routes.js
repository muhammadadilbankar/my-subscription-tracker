import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js"
import { createSubscription, deleteSubscription, getUserSubscriptions, updateSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => res.send({ title: 'GET all  subscriptions' }));

subscriptionRouter.get('/:id', authorize, getUserSubscriptions);

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', authorize, updateSubscription);

subscriptionRouter.delete('/:id', authorize, deleteSubscription);

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

// subscriptionRouter.get('/:id/cancel', (req, res) => res.send({ title: 'CANCEL subscription' }));

// subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({ title: 'GET upcoming renewal' }));

export default subscriptionRouter;