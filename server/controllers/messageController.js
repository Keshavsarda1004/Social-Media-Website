import fs from 'fs';
import Messagse from '../models/Message.js';
import imagekit from '../configs/imageKit.js';
import { create } from 'domain';

// Create an empty object to store Server Side Event connections
const connections = {};

// Controller Function for Server Side Event endpoint
export const sseController = (req, res) => {
    const { userID } = req.params;
    console.log('New client connected : ', userID);
    
    // Set SSE Header
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Add the client's response object to the connections object
    connections[userID] = res;

    // Send an initial event to the client
    res.write('log: Connected to Server Side Event stream\n\n');

    // Handle Client Disconnection
    req.on('Close', () => {
        // Remove the client's response object from the connections array
        delete connections[userID];
        console.log('Client disconnected');        
    })
}

// Send Message
export const sendMessage = async(req, res) => {
    try {
        const { userId } = req.auth();
        const { to_user_id, text } = req.body;
        const image = req.file;
        let media_url = '';
        let message_type = image ? 'image' : 'text';

        if(message_type === 'image') {
            const fileBuffer = fs.readFileSync(media_url.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                filename: image.originalname,
            })

            media_url = imagekit.url({
                path: response.filePath,
                transformation: [
                    {width: '1280'},
                    {format: 'webp'},
                    {quality: 'auto'}
                ]
            });
        }

        const message = await Messagse.create({
            from_user_id: userId,
            to_user_id,
            text,
            message_type,
            media_url
        })

        res.json({success: true, message});

        // Send message to_user_id using SSE
        const messageWithUserData = await Messagse.findById(message._id).populate('from_user_id');

        if(connections[to_user_id]) {
            connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`);
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Get Chat Messages
export const getChatMessages = async(req, res) => {
    try {
        const { userId } = req.auth();
        const { to_user_id } = req.body;
        
        const messages = await Messagse.find({
            $or: [
                {from_user_id: userId, to_user_id},
                {from_user_id: to_user_id, to_user_id: userId}
            ]
        }).sort({created_at: -1})
        await Messagse.updateMany({from_user_id: to_user_id, to_user_id: userId}, {seen: true});

        res.json({success: true, messages})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Get User recent Messages
export const getUserRecentMessages = async(req, res) => {
    try {
        const { userId } = req.auth();
        const messages = await Messagse.find({to_user_id: userId}.populate('from_user_id to_user_id')).sort({created_at: -1});

        res.json({success: true, messages})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}