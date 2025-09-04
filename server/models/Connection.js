import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
    to_user_id : {type: String, ref: 'User', required: true},
    from_user_id : {type: String, ref: 'User', required: true},
    status : {type: String, enum: ['pending', 'accepted'], default: 'pending'}
}, { timestamps: true});

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;