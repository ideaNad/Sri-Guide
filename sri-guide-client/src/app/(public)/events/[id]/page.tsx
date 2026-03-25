'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Calendar, MapPin, Clock, Users, 
  ChevronLeft, Share2, Info, CheckCircle2,
  CalendarDays, Globe, DollarSign, ArrowRight,
  Loader2, AlertCircle, Phone, Instagram, Facebook, Star, Heart
} from 'lucide-react';
import apiClient from '@/services/api-client';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthContext';
import { useShare } from '@/hooks/useShare';
import { useToast } from '@/hooks/useToast';
import AuthModal from '@/features/auth/components/AuthModal';
import ReviewModal from '@/features/reviews/components/ReviewModal';

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user, login } = useAuth();
  const { share } = useShare();
  const { toast } = useToast();
  const [event, setEvent] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = React.useState(false);

  const fetchEvent = React.useCallback(async () => {
    try {
      const { data } = await apiClient.get(`/events/${id}`);
      setEvent(data);
    } catch (err) {
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchReviews = React.useCallback(async () => {
    setLoadingReviews(true);
    try {
      const { data } = await apiClient.get(`/events/${id}/reviews`);
      setReviews(data as any[]);
    } catch (err) {
      console.error('Failed to load reviews');
    } finally {
      setLoadingReviews(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchEvent();
    fetchReviews();
  }, [fetchEvent, fetchReviews]);

  const handleToggleLike = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const { data: liked } = await apiClient.post(`/events/${id}/like`);
      setEvent((prev: any) => ({
        ...prev,
        isLiked: liked,
        likeCount: liked ? (prev.likeCount || 0) + 1 : (prev.likeCount || 1) - 1
      }));
      toast.success(liked ? 'Added to favorites!' : 'Removed from favorites');
    } catch (err) {
      toast.error('Failed to update favorite status');
    }
  };

  const getImageUrl = (url?: string) => {
    if (!url || url.trim() === "") return "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1200";
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url;
    const baseUrl = apiClient.defaults.baseURL?.split('/api')[0] || 'http://localhost:5070';
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${cleanPath.replace(/\\/g, '/')}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
    </div>
  );

  if (error || !event) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
        <AlertCircle size={40} />
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-2 italic uppercase tracking-tight">Event Not Found</h1>
      <p className="text-slate-500 font-medium mb-8 max-w-md">The event you're looking for might have been removed or the link is incorrect.</p>
      <Link href="/events" className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-xl active:scale-95">
        Browse Other Events
      </Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <img 
          src={getImageUrl(event.coverImage)} 
          alt={event.title}
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-16">
          <div className="container mx-auto px-4 md:px-8">
            <Link 
              href="/events" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 group transition-all"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-black uppercase tracking-widest">Back to Explore</span>
            </Link>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                {event.categoryName}
              </span>
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/30">
                {event.eventType}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black text-white mb-6 italic uppercase tracking-tighter leading-none">
              {event.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8 text-white/90">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Calendar size={20} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Date</p>
                  <p className="font-bold">{new Date(event.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <MapPin size={20} className="text-rose-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Location</p>
                  <p className="font-bold">{event.locationName}</p>
                </div>
              </div>
              {event.averageRating > 0 && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Star size={20} className="text-amber-400 fill-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Rating</p>
                    <p className="font-bold">{event.averageRating.toFixed(1)} <span className="text-white/40 font-medium">({event.reviewCount})</span></p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="absolute top-8 right-8 flex gap-3">
               <button 
                onClick={handleToggleLike}
                className={`p-4 rounded-2xl backdrop-blur-md transition-all active:scale-95 shadow-xl ${event.isLiked ? 'bg-rose-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
               >
                 <Heart size={24} className={event.isLiked ? 'fill-white' : ''} />
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-6 italic uppercase tracking-tight flex items-center gap-3">
                <Info size={24} className="text-orange-600" />
                About this Experience
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-xl text-slate-900 font-bold leading-relaxed mb-6 italic border-l-4 border-orange-500 pl-6">
                  {event.shortDescription}
                </p>
                <div className="text-slate-600 leading-loose whitespace-pre-line font-medium text-lg">
                  {event.fullDescription}
                </div>
              </div>
            </section>

            {/* Dynamic Custom Fields */}
            {event.fieldValues && event.fieldValues.length > 0 && (
              <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-8 italic uppercase tracking-tight">Experience Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {event.fieldValues.map((fv: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="mt-1 p-2 bg-orange-50 text-orange-600 rounded-xl">
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{fv.fieldLabel}</p>
                        <p className="text-lg font-black text-slate-900">{fv.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery */}
            {event.galleryImages && event.galleryImages.length > 0 && (
              <section>
                <h3 className="text-xl font-black text-slate-900 mb-8 italic uppercase tracking-tight">Visual Moments</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {event.galleryImages.map((img: string, i: number) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 0.98 }}
                      className="aspect-square rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm"
                    >
                      <img src={getImageUrl(img)} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Reviews Section */}
            <section className="pt-8">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2 italic uppercase tracking-tight flex items-center gap-3">
                    <Star size={24} className="text-amber-500" />
                    Traveler Stories
                  </h2>
                  <p className="text-slate-500 font-medium tracking-wide">Shared experiences from our community</p>
                </div>
                {(!user || user.role === 'Tourist') && (
                  <button 
                    onClick={() => {
                      if (!user) { setIsAuthModalOpen(true); return; }
                      setIsReviewModalOpen(true);
                    }}
                    className="px-6 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-all shadow-lg active:scale-95"
                  >
                    Share My Story
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {loadingReviews ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                  </div>
                ) : reviews.length > 0 ? (
                  reviews.map((review) => (
                    <motion.div 
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
                    >
                      <div className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-50 shadow-sm flex-shrink-0">
                          <img 
                            src={review.userProfileImageUrl || `https://ui-avatars.com/api/?name=${review.userFullName}&background=random&color=fff&bold=true`} 
                            alt={review.userFullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-black text-slate-900 leading-none">{review.userFullName}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                              </p>
                            </div>
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map((s) => (
                                <Star 
                                  key={s} 
                                  size={10} 
                                  className={s <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-100"} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-600 font-medium leading-relaxed italic">&ldquo;{review.comment}&rdquo;</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                    <p className="text-slate-400 font-bold italic tracking-widest uppercase text-xs">Be the first to share your story...</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar / Booking Card */}
          <div className="space-y-8">
            <div className="sticky top-24 bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8">
              <div className="flex items-center justify-between pb-6 border-b border-slate-50">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Participation Fee</p>
                  <p className="text-4xl font-black text-slate-900">
                    {event.price === 0 ? 'FREE' : `Rs. ${event.price.toLocaleString()}`}
                  </p>
                </div>
                <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                  <DollarSign size={32} />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacity</p>
                    <p className="font-bold text-slate-900">{event.maxParticipants} slots available</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timing</p>
                    <p className="font-bold text-slate-900">{event.startTime || 'Check description'}</p>
                  </div>
                </div>
              </div>

              <button className="w-full py-5 bg-orange-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95">
                Join this Experience
                <ArrowRight size={20} />
              </button>

              <div className="pt-6 text-center">
                <p className="text-xs font-medium text-slate-400">Hosted by</p>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight mt-1">{event.organizationName}</p>
              </div>
            </div>

            {/* Share Card */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
              <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                <Share2 size={16} className="text-orange-400" />
                Spread the word
              </h4>
              <p className="text-white/60 text-sm font-medium mb-8">Share this unique community experience with your friends and family.</p>
              <div className="flex items-center gap-4">
                 <button 
                  onClick={() => share({ title: event.title, text: event.shortDescription, url: window.location.href })}
                  className="flex-1 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2 group"
                 >
                   <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                 </button>
                 <button 
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="flex-1 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2 group"
                 >
                   <Facebook size={18} className="group-hover:scale-110 transition-transform" />
                 </button>
                 <button 
                  onClick={() => window.open(`https://www.instagram.com/`, '_blank')}
                  className="flex-1 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2 group"
                 >
                   <Instagram size={18} className="group-hover:scale-110 transition-transform" />
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(userData) => {
          login(userData);
          setIsAuthModalOpen(false);
        }}
      />

      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        targetId={id}
        targetType="Event"
        targetName={event.title}
        onSuccess={() => {
          fetchEvent();
          fetchReviews();
          toast.success('Thank you for your review!');
        }}
      />
    </main>
  );
}
