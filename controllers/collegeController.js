const supabase = require('../config/supabase');

exports.createCollege = async (req, res) => {
    const { name, domain } = req.body;
    try {
        const { data, error } = await supabase
            .from('colleges')
            .insert([{ name, domain }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create college', details: err.message });
    }
};

exports.listColleges = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('colleges')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to list colleges', details: err.message });
    }
};
