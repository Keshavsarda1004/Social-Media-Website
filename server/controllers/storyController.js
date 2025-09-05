import fs from 'fs'
import User from '../models/User.js';
import Story from '../models/Story.js';
import imagekit from '../configs/imageKit.js';
import { inngest } from '../inngest/index.js';

// Add User Story
export const addUserStory = async(req, res) => {
    try {
        const { userId } = req.auth();
        const { content, media_type, bakground_color } = req.body;
        const media = req.file;
        let media_url = '';

        if(media_type !== 'text') {
            const fileBuffer = fs.readFileSync(media.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                filename: media.originalname,
            });

            media_url = response.url;
        }

        // Create story
        const story = await Story.create({
            user: userId,
            content,
            media_url, 
            media_type,
            bakground_color
        })

        // Schedule story deletion after 24 hours
        await inngest.send({
            name: 'app/story.delete',
            data: { storyId: story._id }
        })

        res.json({success: true});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

// Get User Story
export const getStories = async(req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId);
        
        // Get User's connections and followings
        const userIds = [userId, ...user.following, ...user.connections];

        const stories = await Story.find({
            user: {$in: userIds}
        }).populate('user').sort({createdAt: -1});

        res.json({success: true, stories});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}