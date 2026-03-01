const supabase = require('../config/supabase');

// Add a new admin to THIS community
exports.addAdmin = async (req, res) => {
    const { email, role } = req.body;
    const community_id = req.communityId;

    if (!email || !community_id) {
        return res.status(400).json({ error: 'Email and Community ID are required' });
    }

    try {
        const { data: profile, error: searchError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single();

        if (searchError || !profile) {
            return res.status(404).json({ error: 'User profile not found. They must sign up first.' });
        }

        // Add to community_roles
        const { data, error } = await supabase
            .from('community_roles')
            .upsert([{ community_id, user_id: profile.id, role: role || 'admin' }])
            .select();

        if (error) throw error;
        res.status(200).json({ message: 'Admin added to community successfully', admin: data[0] });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add admin', details: err.message });
    }
};

// Delete an admin role in THIS community
exports.deleteAdmin = async (req, res) => {
    const { id } = req.params;
    const community_id = req.communityId;

    try {
        const { error } = await supabase
            .from('community_roles')
            .delete()
            .eq('user_id', id)
            .eq('community_id', community_id);

        if (error) throw error;
        res.status(200).json({ message: 'Admin role removed from community successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove admin', details: err.message });
    }
};

// List all admins in THIS community
exports.listAdmins = async (req, res) => {
    const community_id = req.communityId;
    try {
        if (!community_id) {
            return res.status(400).json({ error: 'Community ID is required' });
        }

        const { data, error } = await supabase
            .from('community_roles')
            .select('user_id, role, profiles(*)')
            .eq('community_id', community_id)
            .in('role', ['admin', 'superadmin']);

        if (error) throw error;

        const admins = data.map(item => ({
            ...item.profiles,
            role: item.role
        }));

        res.status(200).json(admins);
    } catch (err) {
        res.status(500).json({ error: 'Failed to list admins', details: err.message });
    }
};
