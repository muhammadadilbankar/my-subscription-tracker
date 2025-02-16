import Subscription from '../models/subscription.model.js';

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });
        res.status(201).json({ success: true, data: { subscription } });
    } catch (error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) => { 
    try {
        //Check if the user is the same as the one in the token
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.statusCode = 403;
            throw error;
        }
    } catch (error) {
        next(error);
    }
}