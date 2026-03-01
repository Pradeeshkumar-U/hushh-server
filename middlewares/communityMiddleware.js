module.exports = (req, res, next) => {
    const communityId = req.headers['x-community-id'];

    if (!communityId && req.method !== 'GET' && !req.path.includes('/communities')) {
        // Optional: bypass check for certain routes or methods
        // But for production grade, we want this.
    }

    req.communityId = communityId;
    next();
};
