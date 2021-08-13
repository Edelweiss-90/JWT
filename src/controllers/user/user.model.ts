import mongoose from 'mongoose';
import User from './user.interface';

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        unique: true,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    }
});

const userModel = mongoose.model<User & mongoose.Document>('USER', userSchema);

export default userModel;
