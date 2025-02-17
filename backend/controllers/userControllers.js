const { User } = require('../models/userSchemas');


// Get unread notification count (without authentication middleware)
const getUnreadNotifCount = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: 'User ID required' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const unreadCount = user.notifications.filter(n => !n.read).length;
        res.json({ unreadCount });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all notifications (without authentication middleware)
const getNotifs = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: 'User ID required' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user.notifications);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Mark notifications as read (without authentication middleware)
const putReadNotifs = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: 'User ID required' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.notifications.forEach(n => (n.read = true));
        await user.save();

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = {
    putReadNotifs,
    getNotifs,
    getUnreadNotifCount
};