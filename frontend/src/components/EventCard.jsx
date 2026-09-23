import { Calendar, MapPin, Users } from 'lucide-react';

const EventCard = ({ event, onRegister, isRegistered }) => {
    // Safely handle Firestore Timestamp or ISO string
    const dateObj = event.date?.toDate ? event.date.toDate() : new Date(event.date || Date.now());
    const formattedDate = dateObj instanceof Date && !isNaN(dateObj) 
        ? dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
        : 'TBA';

    const isFull = event.maxCapacity > 0 && event.currentRegistrations >= event.maxCapacity;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-slate-100 flex flex-col h-full group">
            {event.posterUrl && (
                <div className="h-48 w-full overflow-hidden">
                    <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
            )}
            <div className="p-6 flex flex-col flex-grow">
                <div className="uppercase tracking-wide text-xs text-brand-600 font-bold mb-2 flex items-center gap-1">
                    <Calendar size={14} /> {formattedDate}
                </div>
                <h3 className="block mt-1 text-xl leading-tight font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {event.title}
                </h3>
                <p className="mt-2 text-slate-600 line-clamp-3 text-sm flex-grow">
                    {event.description}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center text-slate-500 text-sm gap-4 mb-4">
                        <div className="flex items-center gap-1">
                            <MapPin size={16} className="text-slate-400" />
                            {event.venue}
                        </div>
                        <div className="flex items-center gap-1">
                            <Users size={16} className="text-slate-400" />
                            {event.currentRegistrations} {event.maxCapacity > 0 ? `/ ${event.maxCapacity}` : 'attended'}
                        </div>
                    </div>
                    {onRegister && (
                        <button
                            onClick={() => onRegister(event._id)}
                            disabled={isRegistered || isFull}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${isRegistered
                                ? 'bg-green-100 text-green-800 cursor-not-allowed border border-green-200'
                                : isFull
                                    ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                                    : 'bg-brand-600 hover:bg-brand-500 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                }`}
                        >
                            {isRegistered ? 'Registered' : isFull ? 'Event Full' : 'RSVP Now'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventCard;
