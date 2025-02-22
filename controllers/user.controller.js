// import Subscription from '../models/subscription.model.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

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
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        //Delete the user if found
        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        })
    } catch (error) {
        next(error);

    }
}

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        
        //Find the user by ID
        const user = await User.findById(id);

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        //Update the user details
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'User updated',
            data: user,
        });
        
    } catch (error) {
        next(error);
    }
}

