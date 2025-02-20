// import Subscription from '../models/subscription.model.js';
import User from '../models/user.model.js';

export const getUsers = async (req, res, next) => { 
    try {
        const users = await User.find();

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // const subscriptions = await Subscription.find({ user: req.params.id });
        
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        //Delete the user if found
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        })
    } catch (error) {
        next(error);

    }
}

