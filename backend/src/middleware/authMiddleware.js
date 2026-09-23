const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }

        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        req.user = { ...user, ...profile };
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

exports.adminOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'Admin' || req.user.role === 'SuperAdmin')) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied, admin only' });
    }
};
