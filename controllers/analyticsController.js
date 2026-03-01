const supabase = require('../config/supabase');

// Get generic dashboard analytics
exports.getDashboardAnalytics = async (req, res) => {
    const community_id = req.communityId;
    try {
        if (!community_id) {
            return res.status(400).json({ error: 'Community ID is required for analytics' });
        }

        // 1. Total people joined THIS community
        const { count: totalMembers, error: membersError } = await supabase
            .from('community_members')
            .select('*', { count: 'exact', head: true })
            .eq('community_id', community_id);

        if (membersError) throw membersError;

        // 2. Total participants across all events in THIS community
        // We first get event IDs for this community
        const { data: eventIds, error: eventsError } = await supabase
            .from('events')
            .select('id')
            .eq('community_id', community_id);

        if (eventsError) throw eventsError;

        const ids = eventIds.map(e => e.id);

        const { count: totalEventParticipants, error: participantsError } = await supabase
            .from('event_registrations')
            .select('*', { count: 'exact', head: true })
            .in('event_id', ids.length > 0 ? ids : ['00000000-0000-0000-0000-000000000000']);

        if (participantsError) throw participantsError;

        // 3. Count of Admins in THIS community (using community_roles)
        const { count: totalAdmins, error: adminsError } = await supabase
            .from('community_roles')
            .select('*', { count: 'exact', head: true })
            .eq('community_id', community_id)
            .in('role', ['admin', 'superadmin']);

        if (adminsError) throw adminsError;

        // 4. Get 5 most recently joined members
        const { data: recentMembers, error: recentError } = await supabase
            .from('community_members')
            .select('joined_at, profiles(full_name, email)')
            .eq('community_id', community_id)
            .order('joined_at', { ascending: false })
            .limit(5);

        if (recentError) throw recentError;

        res.status(200).json({
            totalMembers: totalMembers || 0,
            totalEventParticipants: totalEventParticipants || 0,
            totalAdmins: totalAdmins || 0,
            recentActivity: recentMembers.map(m => ({
                type: 'registration',
                user: m.profiles.full_name || m.profiles.email,
                time: m.joined_at
            }))
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch analytics', details: err.message });
    }
};

// Get analytics for a specific event (e.g., individual vs team registrations)
exports.getEventAnalytics = async (req, res) => {
    const { id } = req.params;

    try {
        // Analytics specific to an event
        // Count how many registrations have a team_id (teams) vs those that don't (individuals)
        const { data: registrations, error } = await supabase
            .from('event_registrations')
            .select('id, team_id')
            .eq('event_id', id);

        if (error) throw error;

        let individualCount = 0;
        let teamsArr = [];

        registrations.forEach(reg => {
            if (reg.team_id) {
                if (!teamsArr.includes(reg.team_id)) {
                    teamsArr.push(reg.team_id);
                }
            } else {
                individualCount++;
            }
        });

        res.status(200).json({
            eventId: id,
            totalRegistrations: registrations.length,
            individualCount,
            teamCount: teamsArr.length
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch event analytics', details: err.message });
    }
};
