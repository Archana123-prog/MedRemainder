const { clerkClient } = require('@clerk/clerk-sdk-node');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = await clerkClient.verifyToken(token);
    req.userId = payload.sub;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

module.exports = { protect };
