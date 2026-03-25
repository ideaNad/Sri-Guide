'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Star, Plus, MapPin, Clock, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/services/api-client';

export default function OrganizerDashboard() {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/events/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Events', value: stats?.totalEvents || '0', icon: <Calendar className="w-6 h-6 text-orange-600" />, color: 'bg-orange-50' },
    { label: 'Total Participants', value: stats?.totalParticipants || '0', icon: <Users className="w-6 h-6 text-blue-600" />, color: 'bg-blue-50' },
    { label: 'Avg. Rating', value: stats?.averageRating?.toFixed(1) || '0.0', icon: <Star className="w-6 h-6 text-amber-600" />, color: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 italic uppercase tracking-tight">Organizer Dashboard</h1>
          <p className="text-slate-500 font-medium">Welcome back! Here's what's happening with your events.</p>
        </div>
        <Link 
          href="/organizer/events/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-gray-900/10 active:scale-95"
        >
          <Plus size={20} />
          <span>Create New Event</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-44 bg-slate-100 animate-pulse rounded-3xl" />
          ))
        ) : statCards.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300"
          >
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
              {stat.icon}
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity / Empty State */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Upcoming Events</h3>
            <Link href="/organizer/events" className="text-sm font-bold text-orange-600 hover:underline">View All</Link>
          </div>
          
          {loading ? (
             <div className="space-y-4">
               {Array(3).fill(0).map((_, i) => <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-2xl" />)}
             </div>
          ) : stats?.recentEvents?.length > 0 ? (
            <div className="space-y-4">
              {stats.recentEvents.map((event: any) => (
                <div key={event.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors rounded-2xl border border-slate-50">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                    <img src={event.coverImage || '/placeholder.png'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{event.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(event.startDate).toLocaleDateString()}</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-300" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
              <div className="p-4 bg-slate-50 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-400 font-medium italic">No upcoming events found.</p>
              <Link href="/organizer/events/new" className="mt-4 text-sm font-bold text-gray-900 hover:underline">Create your first event</Link>
            </div>
          )}
        </div>

        <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem]">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/organizer/events/new" className="p-6 bg-orange-50 rounded-3xl group hover:bg-orange-600 transition-all duration-300">
              <Plus className="w-8 h-8 text-orange-600 mb-4 group-hover:text-white transition-colors" />
              <p className="text-sm font-black text-orange-950 group-hover:text-white uppercase tracking-widest">Post Event</p>
            </Link>
            <Link href="/organizer/profile" className="p-6 bg-blue-50 rounded-3xl group hover:bg-blue-600 transition-all duration-300">
              <User className="w-8 h-8 text-blue-600 mb-4 group-hover:text-white transition-colors" />
              <p className="text-sm font-black text-blue-950 group-hover:text-white uppercase tracking-widest">Settings</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
