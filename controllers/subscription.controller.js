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
    } catch (error) {
        next(error);
    }
}