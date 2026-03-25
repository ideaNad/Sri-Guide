'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Plus, Search, Filter, MoreVertical, Edit2, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/services/api-client';
import { useToast } from '@/hooks/useToast';
import { useConfirmStore } from '@/store/useConfirmStore';

export default function MyEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const confirm = useConfirmStore(state => state.confirm);

  const getImageUrl = (url?: string) => {
    if (!url || url.trim() === "") return "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800";
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url;
    const baseUrl = apiClient.defaults.baseURL?.split('/api')[0] || 'http://localhost:5070';
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${cleanPath.replace(/\\/g, '/')}`;
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await apiClient.get('/events/my-events');
      setEvents(response.data as any[]);
    } catch (error) {
      toast.error('Failed to load your events');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEvent = async (id: string, isCancelled: boolean) => {
    const ok = await confirm({
      title: isCancelled ? 'Resume Experience?' : 'Cancel Experience?',
      message: isCancelled 
        ? 'Are you ready to make this experience active again for travelers?' 
        : 'This will notify registered participants (if any) and mark the event as cancelled. You can resume it anytime.',
      confirmText: isCancelled ? 'Resume Now' : 'Cancel Experience',
      variant: isCancelled ? 'primary' : 'danger'
    });

    if (!ok) return;

    try {
      await apiClient.patch(`/events/${id}/cancel`);
      toast.success(isCancelled ? 'Event resumed successfully' : 'Event cancelled successfully');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to update event status');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    const ok = await confirm({
      title: 'Delete Permanently?',
      message: 'Are you sure you want to delete this event? This action is irreversible and all associated data, including gallery images and insights, will be lost forever.',
      confirmText: 'Delete Forever',
      variant: 'danger'
    });

    if (!ok) return;

    try {
      await apiClient.delete(`/events/${id}`);
      toast.success('Event deleted successfully');
      setEvents(events.filter(e => e.id !== id));
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 italic uppercase tracking-tight">My Managed Events</h1>
          <p className="text-slate-500 font-medium">View and manage all your scheduled community experiences.</p>
        </div>
        <Link 
          href="/organizer/events/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-xl active:scale-95"
        >
          <Plus size={20} />
          <span>Create Event</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]" />
          ))
        ) : events.length > 0 ? (
          events.map((event) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={getImageUrl(event.coverImage)} 
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <div className="flex flex-col gap-2">
                    <span className={`px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest ${event.isPublished ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {event.isPublished ? 'Published' : 'Draft'}
                    </span>
                    {event.isCancelled && (
                      <span className="px-3 py-1 bg-rose-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-orange-600 mb-2 uppercase tracking-widest">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.startDate).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-1">{event.title}</h3>
                <div className="flex items-center gap-3 py-4 border-t border-slate-50 mt-4">
                  <Link href={`/organizer/events/${event.id}/edit`} className="p-2 bg-slate-50 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all active:scale-95" title="Edit Event">
                    <Edit2 size={16} />
                  </Link>
                  <Link href={`/events/${event.id}`} target="_blank" className="p-2 bg-slate-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95" title="View Public Page">
                    <ExternalLink size={16} />
                  </Link>
                  <button 
                    onClick={() => handleCancelEvent(event.id, !!event.isCancelled)}
                    className={`p-2 rounded-xl transition-all active:scale-95 flex items-center gap-1 ${event.isCancelled ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                    title={event.isCancelled ? "Resume Event" : "Cancel Event"}
                  >
                    <Clock size={16} />
                    <span className="text-[10px] font-bold uppercase">{event.isCancelled ? 'Resume' : 'Cancel'}</span>
                  </button>
                  <button 
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-2 bg-slate-50 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95 ml-auto"
                    title="Delete Event"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
              <Calendar className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No events found</h3>
            <p className="text-slate-500 font-medium mb-8 max-w-sm">You haven't created any events yet. Start by sharing a unique experience with the community.</p>
            <Link 
              href="/organizer/events/new"
              className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all active:scale-95 shadow-xl"
            >
              Create Your First Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
