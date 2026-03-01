const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Upload image to Cloudinary
exports.uploadImage = (req, res) => {
    console.log('--- Image Upload Request ---');
    if (!req.file) {
        console.error('No file in request');
        return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('File received:', req.file.originalname, 'Size:', req.file.size);

    const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'hushh_connect/events' },
        (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).json({ error: 'Failed to upload image to Cloudinary', details: error.message });
            }
            console.log('Cloudinary upload success:', result.secure_url);
            res.status(200).json({
                message: 'Image uploaded successfully',
                url: result.secure_url,
                public_id: result.public_id,
            });
        }
    );

    // Pipe the buffer from multer directly to Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};

// Delete image from Cloudinary
exports.deleteImage = async (req, res) => {
    const { public_id } = req.params; // Make sure to URL-encode the public ID if it has slashes

    try {
        const result = await cloudinary.uploader.destroy(public_id);
        if (result.result === 'ok') {
            res.status(200).json({ message: 'Image deleted successfully' });
        } else {
            res.status(400).json({ error: 'Failed to delete image', result });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error deleting image', details: err.message });
    }
};
