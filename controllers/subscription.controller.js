import { workflowClient } from '../config/upstash.js';
import Subscription from '../models/subscription.model.js';
import { SERVER_URL } from '../config/env.js';
import dayjs from 'dayjs';

export const createSubscription = async (req, res, next) => {
    try {
        console.log('Creating subscription with data:', req.body);
        const { startDate, frequency } = req.body;
        let renewalDate;
        if (frequency === 'monthly') {
            renewalDate = dayjs(startDate).add(1, 'month').toISOString();
        }
        else if (frequency === 'yearly') {
            renewalDate = dayjs(startDate).add(1, 'year').toISOString();
        }
        const subscription = await Subscription.create({
            ...req.body,
            renewalDate,
            user: req.user._id,
        });

        console.log('Subscription created:', subscription);


        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        });

        console.log('Workflow triggered with ID:', workflowRunId);


        res.status(201).json({ success: true, data: { subscription, workflowRunId } });
    } catch (error) {
        console.error('Error creating subscription:', error);
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

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({ success: true, data: subscriptions})
    } catch (error) {
        next(error);
    }
}

export const updateSubscription = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, price, currency, frequency, category, startDate, paymentMethod } = req.body;

        //Find the subscription by ID
        const subscription = await Subscription.findById(id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        //Ensuring that the authenticated user is the owner of the subscription
        if (subscription.user.toString() !== req.user.id) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            throw error;
        }

        //Update the subscription details
        if (name) subscription.name = name;
        if (price) subscription.price = price;       
        if (currency) subscription.currency = currency;
        if (frequency) subscription.frequency = frequency;
        if (category) subscription.category = category;
        if (startDate) subscription.startDate = startDate;
        if (paymentMethod) subscription.paymentMethod = paymentMethod;

        await subscription.save();

        res.status(200).json({
            success: true,
            message: 'Subscription updated successfully',
            data: subscription,
        })

    } catch (error) {
        next(error);
    }
}

export const deleteSubscription = async (req, res, next) => {
    try {
        const { id } = req.params;

        const subscription = await Subscription.findById(id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        //Delete the subscription if found
        await Subscription.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Subscription deleted successfully',
        })
    } catch (error) {
        next(error);
    }
}