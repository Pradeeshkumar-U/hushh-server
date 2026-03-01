const supabase = require('../config/supabase');

exports.createCommunity = async (req, res) => {
    const { title, description, created_by, college_id, image_url } = req.body;
    try {
        const { data, error } = await supabase
            .from('communities')
            .insert([{ title, description, created_by, college_id, image_url }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        console.error('Error creating community:', err);
        res.status(500).json({ error: 'Failed to create community', details: err.message });
    }
};

exports.updateCommunity = async (req, res) => {
    const { id } = req.params;
    const { title, description, image_url } = req.body;
    try {
        const { data, error } = await supabase
            .from('communities')
            .update({ title, description, image_url })
            .eq('id', id)
            .select();

        if (error) throw error;
        res.status(200).json(data[0]);
    } catch (err) {
        console.error('Error updating community:', err);
        res.status(500).json({ error: 'Failed to update community', details: err.message });
    }
};

exports.getCommunity = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('communities')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get community', details: err.message });
    }
};

exports.listCommunities = async (req, res) => {
    const { college_id } = req.query;
    try {
        let query = supabase.from('communities').select('*');

        if (college_id) {
            query = query.eq('college_id', college_id);
        }

        const { data, error } = await query;

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to list communities', details: err.message });
    }
};
