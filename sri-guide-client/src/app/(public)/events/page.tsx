import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Filter, Search, Tag, X, SlidersHorizontal, ChevronDown, Clock, Users, Heart, Star } from 'lucide-react';
import apiClient from '@/services/api-client';
import { useToast } from '@/hooks/useToast';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthContext';
import AuthModal from '@/features/auth/components/AuthModal';

interface Event {
  id: string;
  title: string;
  shortDescription: string;
  coverImage?: string;
  categoryName: string;
  locationName: string;
  startDate: string;
  price: number;
  currency: string;
  eventType: string;
  likeCount: number;
  averageRating: number;
  reviewCount: number;
  isLiked?: boolean;
}

export default function EventsPage() {
  const { toast } = useToast();
  const { user, login } = useAuth();
  const [events, setEvents] = React.useState<Event[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({
    categoryId: '',
    district: '',
    eventType: '',
    minPrice: '',
    maxPrice: ''
  });
  const [showFilters, setShowFilters] = React.useState(false);

  const fetchEvents = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.district) params.append('district', filters.district);
      if (filters.eventType) params.append('eventType', filters.eventType);
      
      const { data } = await apiClient.get(`/events?${params.toString()}`);
      setEvents(data as Event[]);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  const fetchCategories = async () => {
    try {
      const { data } = await apiClient.get('/event-categories');
      setCategories(data as any[]);
    } catch (error) {}
  };

  React.useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, [fetchEvents]);

  const handleToggleLike = async (e: React.MouseEvent, eventId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const response = await apiClient.post(`/events/${eventId}/like`);
      const isLikedNow = response.data as boolean;
      setEvents(prev => prev.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            isLiked: isLikedNow,
            likeCount: isLikedNow ? (event.likeCount || 0) + 1 : Math.max(0, (event.likeCount || 0) - 1)
          };
        }
        return event;
      }));
      
      toast.success(isLikedNow ? 'Added to favorites!' : 'Removed from favorites');
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const getImageUrl = (url?: string) => {
    if (!url || url.trim() === "") return "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800";
    if (url.startsWith('http')) return url;
    const baseUrl = apiClient.defaults.baseURL?.split('/api')[0] || 'http://localhost:5070';
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${cleanPath.replace(/\\/g, '/')}`;
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-black uppercase tracking-widest mb-6"
          >
            Explore Experiences
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight"
          >
            Discover Events in <br />
            <span className="text-orange-600">Sri Lanka</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg font-medium max-w-2xl mx-auto"
          >
            From beach parties to cooking workshops, find the best community-led events happening across the island.
          </motion.p>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                 type="text" 
                 placeholder="Search events, workshops, festivals..." 
                 className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500 outline-none font-medium"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-2 font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <SlidersHorizontal size={20} />
              <span>Filters</span>
              {Object.values(filters).some(v => v !== '') && (
                <span className="w-5 h-5 bg-orange-600 text-white text-[10px] rounded-full flex items-center justify-center translate-x-1">
                  {Object.values(filters).filter(v => v !== '').length}
                </span>
              )}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <select 
                    value={filters.categoryId}
                    onChange={(e) => setFilters({...filters, categoryId: e.target.value})}
                    className="p-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  
                  <select 
                    value={filters.eventType}
                    onChange={(e) => setFilters({...filters, eventType: e.target.value})}
                    className="p-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none cursor-pointer"
                  >
                    <option value="">Any Event Type</option>
                    <option>One-time</option>
                    <option>Recurring</option>
                    <option>Multi-day</option>
                  </select>

                  <select 
                    value={filters.district}
                    onChange={(e) => setFilters({...filters, district: e.target.value})}
                    className="p-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none cursor-pointer"
                  >
                    <option value="">All Regions</option>
                    <option>Galle</option>
                    <option>Matara</option>
                    <option>Colombo</option>
                    <option>Kandy</option>
                  </select>

                  <button 
                    onClick={() => setFilters({ categoryId: '', district: '', eventType: '', minPrice: '', maxPrice: '' })}
                    className="flex items-center justify-center gap-2 text-rose-500 font-bold hover:bg-rose-50 rounded-2xl py-4 transition-all"
                  >
                    <X size={18} />
                    Reset Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-3xl h-[400px] animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No Events Found</h3>
            <p className="text-slate-500 font-medium italic">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {events.map((event, i) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={getImageUrl(event.coverImage)} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {event.categoryName}
                    </span>
                    <span className="px-4 py-1.5 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {event.eventType}
                    </span>
                  </div>
                  
                  {/* Interactive Heart Button */}
                  <button 
                    onClick={(e) => handleToggleLike(e, event.id)}
                    className="absolute top-6 right-6 w-11 h-11 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20 hover:scale-110 active:scale-90 transition-all group/heart"
                  >
                    <Heart 
                      size={20} 
                      className={`${event.isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400 group-hover/heart:text-rose-500'} transition-colors`} 
                    />
                  </button>
                  
                  {/* Engagement Overlay */}
                  <div className="absolute bottom-6 right-6 flex items-center gap-2">
                    {event.averageRating > 0 && (
                      <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl flex items-center gap-1.5 shadow-lg border border-white/20">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-black text-slate-900">{event.averageRating.toFixed(1)}</span>
                      </div>
                    )}
                    <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl flex items-center gap-1.5 shadow-lg border border-white/20">
                      <Heart size={12} className={`${event.likeCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                      <span className="text-xs font-black text-slate-900">{event.likeCount}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-4 text-xs font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-orange-500" />
                      <span>{new Date(event.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{event.locationName}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-orange-600 transition-colors leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-slate-500 font-medium text-sm line-clamp-2 mb-6">
                    {event.shortDescription}
                  </p>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Price</p>
                      <p className="text-xl font-black text-slate-900">
                        {event.price === 0 ? 'FREE' : `Rs. ${event.price.toLocaleString()}`}
                      </p>
                    </div>
                    <Link 
                      href={`/events/${event.id}`}
                      className="px-6 py-3 bg-gray-900 text-white text-sm font-black rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-gray-900/10 active:scale-95"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(userData) => {
          login(userData);
          setIsAuthModalOpen(false);
          fetchEvents();
        }}
      />
    </main>
  );
}
