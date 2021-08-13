import mongoose from 'mongoose';
import RefreshToken from './refreshToken.interface';

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    id: {
        type: Number,
        unique: false,
        required: true,
    },
    date: {
        type: Number,
        required: true,
    }
});

const tokenModel = mongoose.model<RefreshToken & mongoose.Document>('TOKEN', tokenSchema);

export default tokenModel;
