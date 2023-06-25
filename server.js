const express = require('express');
const axios = require('axios');
const cron = require('node-cron');

const app = express();
const port = 3000;

let followersCount = 0;
let followingCount = 0;
let commentsCount = 0;
let likesCount = 0;

const fetchInstagramData = async () => {
    try {
        // Fetch followers count
        const followersResponse = await axios.get('https://api.instagram.com/v1/users/{user-id}/media/recent/?client_id={12345}', {
            params: {
                access_token: 'YOUR_ACCESS_TOKEN',
                // Additional parameters if required
            }
        });
        followersCount = followersResponse.data.count;

        // Fetch following count
        const followingResponse = await axios.get('https://api.instagram.com/v1/follows/{user-id}/?client_id={12345}', {
            params: {
                access_token: 'YOUR_ACCESS_TOKEN',
                // Additional parameters if required
            }
        });
        followingCount = followingResponse.data.count;

        // Fetch comments count
        const commentsResponse = await axios.get('https://api.instagram.com/v1/media/{media-id}/comments?client_id={12345}', {
            params: {
                access_token: 'YOUR_ACCESS_TOKEN',
                // Additional parameters if required
            }
        });
        commentsCount = commentsResponse.data.count;

        // Fetch likes count
        const likesResponse = await axios.get('https://api.instagram.com/v1/media/{media-id}/likes?client_id={12345}', {
            params: {
                access_token: 'YOUR_ACCESS_TOKEN',
                // Additional parameters if required
            }
        });
        likesCount = likesResponse.data.count;

        console.log('Instagram data refreshed successfully!');
    } catch (error) {
        console.error('Error fetching Instagram data:', error);
    }
};


// Fetch data initially
fetchInstagramData().then(r => console.log(r));

// Schedule cron job to refresh data every day at midnight
cron.schedule('0 0 * * *', fetchInstagramData);



app.get('/followers', (req, res) => {
    res.json({ followers: followersCount });
});

app.get('/following', (req, res) => {
    res.json({ following: followingCount });
});

app.get('/comments', (req, res) => {
    res.json({ comments: commentsCount });
});

app.get('/likes', (req, res) => {
    res.json({ likes: likesCount });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
