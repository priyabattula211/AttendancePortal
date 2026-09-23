const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.getAllEvents = async (req, res) => {
    try {
        const { data: events, error } = await supabase.from('events').select('*').eq('status', 'Published').order('date', { ascending: true });
        if (error) throw error;
        res.json({ success: true, data: events.map((event) => ({ ...event, _id: event.id })) });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const { data: event, error } = await supabase.from('events').select('*').eq('id', req.params.id).single();
        if (error || !event) return res.status(404).json({ success: false, message: 'Event not found' });
        res.json({ success: true, data: { ...event, _id: event.id } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, venue, posterUrl, maxCapacity, status } = req.body;
        const { data: event, error } = await supabase.from('events').insert([{ title, description, date, venue, poster_url: posterUrl, max_capacity: maxCapacity || 0, status: status || 'Draft', created_by_id: req.user.id }]).select().single();
        if (error) throw error;
        res.status(201).json({ success: true, data: { ...event, _id: event.id } });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { data: event, error } = await supabase.from('events').update(req.body).eq('id', req.params.id).select().single();
        if (error) throw error;
        res.json({ success: true, data: { ...event, _id: event.id } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.registerForEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.id;
        const { data: event, error: eventError } = await supabase.from('events').select('*').eq('id', eventId).single();
        if (eventError || !event) return res.status(404).json({ success: false, message: 'Event not found' });
        if (event.max_capacity > 0 && event.current_registrations >= event.max_capacity) return res.status(400).json({ success: false, message: 'Event is full' });
        const { error: insertError } = await supabase.from('registrations').insert([{ event_id: eventId, user_id: userId }]);
        if (insertError) {
            if (insertError.code === '23505') return res.status(400).json({ success: false, message: 'You are already registered for this event' });
            throw insertError;
        }
        await supabase.from('events').update({ current_registrations: event.current_registrations + 1 }).eq('id', eventId);
        res.status(201).json({ success: true, message: 'Successfully registered for event' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getEventAttendees = async (req, res) => {
    try {
        const { data: attendees, error } = await supabase.from('registrations').select('*, user:user_id (first_name, last_name, email, roll_number, branch)').eq('event_id', req.params.id);
        if (error) throw error;
        res.json({ success: true, data: attendees });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
