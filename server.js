const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

// CORS Middleware
app.use(cors());

// Body parser middleware to handle POST request data
app.use(express.json());

// Flag to prevent multiple downloads
let isDownloading = false;

// Static files (HTML, CSS, JS) serve करने के लिए
app.use(express.static('public'));

// API endpoint जो डाउनलोड अनुरोध को हैंडल करेगा (POST)
app.post('/download', async (req, res) => {
    const url = req.body.url;

    if (!url) {
        return res.json({ success: false, message: 'URL नहीं दिया गया है' });
    }

    if (isDownloading) {
        return res.json({ success: false, message: 'कृपया कुछ समय बाद पुनः प्रयास करें' });
    }

    isDownloading = true;

    try {
        // Reels डाउनलोड URL प्राप्त करें
        const downloadUrl = await getReelsDownloadUrl(url);
        res.json({ success: true, downloadUrl });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'वीडियो प्राप्त करने में त्रुटि' });
    } finally {
        isDownloading = false;  // Reset the download flag after the download request is complete
    }
});

// Function जो URL से वीडियो डाउनलोड लिंक प्राप्त करेगी
async function getReelsDownloadUrl(url) {
    try {
        const encodedUrl = encodeURIComponent(url); // URL को एन्कोड करें

        const apiUrl = 'https://instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com/get-info-rapidapi';

        // API से डाउनलोड लिंक प्राप्त करने के लिए axios अनुरोध भेजें
        const response = await axios.get(apiUrl, {
            headers: {
                'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com',
                'X-RapidAPI-Key': '65bfef87b6msh050e9489f7e81b4p1f5a76jsnd3bca985df4b'  // RapidAPI Key यहाँ डालें
            },
            params: { url: encodedUrl } // Instagram URL को एन्कोड करके भेजें
        });

        // API Response को लॉग करें
        console.log('API Response:', response.data);

        if (response.data && response.data.download_url) {  // सही वीडियो URL लौटाएं
            return response.data.download_url;  // Return the correct video URL
        } else {
            throw new Error('कोई वीडियो URL नहीं मिला');
        }
    } catch (error) {
        console.error('API से त्रुटि:', error);
        throw error;
    }
}

// Server Start करें
app.listen(port, () => {
    console.log(`Server चल रहा है: http://localhost:${port}`);
});
