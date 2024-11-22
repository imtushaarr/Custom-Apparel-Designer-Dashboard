const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json()); // Add to parse JSON data

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }
});

app.use('/uploads', express.static('uploads'));

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded');
    res.json({ filePath: `http://localhost:${port}/uploads/${req.file.filename}` });
});

// Add the /api/saveDesign route
app.post('/api/saveDesign', (req, res) => {
    const { uploadedImageUrl, shirtColor, imagePosition, imageSize, imageRotation, selectedCategory } = req.body;

    // Log the received design data
    console.log('Design Data:', {
        uploadedImageUrl,
        shirtColor,
        imagePosition,
        imageSize,
        imageRotation,
        selectedCategory,
    });

    // You can save this data to a database here if needed

    res.status(200).json({ message: 'Design saved successfully!' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});