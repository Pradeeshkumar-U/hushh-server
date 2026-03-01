const supabase = require('../config/supabase');

// Create event
exports.createEvent = async (req, res) => {
    const { title, description, event_date, location, is_paid, price, capacity, image_url } = req.body;
    const community_id = req.communityId;

    console.log('--- Create Event Request ---');
    console.log('Payload:', req.body);
    console.log('Community ID:', community_id);

    if (!community_id) {
        console.error('Missing community ID in request');
        return res.status(400).json({ error: 'Community ID is required to create an event' });
    }

    try {
        const { data, error } = await supabase
            .from('events')
            .insert([{ title, description, event_date, location, is_paid, price, community_id, image_url }])
            .select();

        if (error) {
            console.error('Supabase error creating event:', error);
            throw error;
        }

        console.log('Event created successfully:', data[0].id);
        res.status(201).json({ message: 'Event created', event: data[0] });
    } catch (err) {
        console.error('Catch error in createEvent:', err.message);
        res.status(500).json({ error: 'Failed to create event', details: err.message });
    }
};

// List events
exports.listEvents = async (req, res) => {
    const community_id = req.communityId;
    try {
        let query = supabase.from('events').select('*, event_registrations(count)');
        if (community_id) {
            query = query.eq('community_id', community_id);
        }
        const { data, error } = await query.order('event_date', { ascending: true });

        if (error) throw error;

        // Flatten the count from event_registrations aggregation
        const eventsWithCount = data.map(event => ({
            ...event,
            joined: event.event_registrations?.[0]?.count || 0
        }));

        res.status(200).json(eventsWithCount);
    } catch (err) {
        res.status(500).json({ error: 'Failed to list events', details: err.message });
    }
};

// Get single event
exports.getEvent = async (req, res) => {
    const { id } = req.params;
    const community_id = req.communityId;
    try {
        let query = supabase.from('events').select('*').eq('id', id);
        if (community_id) {
            query = query.eq('community_id', community_id);
        }
        const { data, error } = await query.single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get event', details: err.message });
    }
};

// Update event
exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const community_id = req.communityId;
    const updates = req.body;

    try {
        let query = supabase.from('events').update(updates).eq('id', id);
        if (community_id) {
            query = query.eq('community_id', community_id);
        }
        const { data, error } = await query.select();

        if (error) throw error;
        res.status(200).json({ message: 'Event updated', event: data[0] });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update event', details: err.message });
    }
};

// Delete event
exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    const community_id = req.communityId;

    try {
        let query = supabase.from('events').delete().eq('id', id);
        if (community_id) {
            query = query.eq('community_id', community_id);
        }
        const { error } = await query;

        if (error) throw error;
        res.status(200).json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete event', details: err.message });
    }
};
