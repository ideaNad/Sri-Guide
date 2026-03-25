'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, DollarSign, Users, 
  Image as ImageIcon, Plus, Trash2, Info, 
  ChevronRight, ChevronLeft, Camera, Upload, 
  Star, Globe, Clock, CheckCircle2, Loader2,
  X, Briefcase, AlertCircle
} from 'lucide-react';
import apiClient from '@/services/api-client';
import { useRouter } from 'next/navigation';

interface CategoryField {
  id: string;
  fieldLabel: string;
  fieldName: string;
  fieldType: 'text' | 'number' | 'select' | 'checkbox';
  optionsJson?: string;
  isRequired: boolean;
}

interface Category {
  id: string;
  name: string;
  customFields: CategoryField[];
}

const STEPS = [
  { id: 1, name: 'Foundation', description: 'Core event details' },
  { id: 2, name: 'Narrative', description: 'Story & description' },
  { id: 3, name: 'Logistics', description: 'Location & Map' },
  { id: 4, name: 'Value', description: 'Pricing & capacity' },
  { id: 5, name: 'Visuals', description: 'Cover & gallery' },
  { id: 6, name: 'Insights', description: 'Specific details' }
];

export default function EventForm({ eventId }: { eventId?: string }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [uploading, setUploading] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const [coverImage, setCoverImage] = React.useState<string>('');
  const [galleryImages, setGalleryImages] = React.useState<string[]>([]);

  const { register, handleSubmit, watch, trigger, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      shortDescription: '',
      fullDescription: '',
      categoryId: '',
      eventType: 'One-time',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      locationName: '',
      district: '',
      mapLocation: '',
      price: 1500,
      maxParticipants: 50,
      dynamicFields: {} as Record<string, any>
    }
  });

  const categoryId = watch('categoryId');

    React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load categories first
        const { data: cats } = await apiClient.get('/event-categories');
        setCategories(cats as Category[]);

        // If editing, load event data
        if (eventId) {
          const { data: eventData } = await apiClient.get(`/events/${eventId}`);
          const event = eventData as any;
          reset({
            title: event.title,
            shortDescription: event.shortDescription,
            fullDescription: event.fullDescription,
            categoryId: event.categoryId,
            eventType: event.eventType,
            startDate: event.startDate.split('T')[0],
            endDate: event.endDate.split('T')[0],
            startTime: event.startTime,
            endTime: event.endTime,
            locationName: event.locationName,
            district: event.district,
            mapLocation: event.mapLocation,
            price: event.price,
            maxParticipants: event.maxParticipants,
            dynamicFields: (event.fieldValues || []).reduce((acc: any, f: any) => {
              const fid = f.fieldId || f.FieldId;
              const val = f.value ?? f.Value ?? "";
              if (fid) acc[fid] = val;
              return acc;
            }, {})
          });
          setCoverImage(event.coverImage);
          setGalleryImages(event.galleryImages || []);
        }
      } catch (error) {
        setMessage({ text: 'Failed to load data', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [eventId, reset]);

  const getImageUrl = (url?: string) => {
    if (!url || url.trim() === "") return null;
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url;
    const baseUrl = apiClient.defaults.baseURL?.split('/api')[0] || 'http://localhost:5070';
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${cleanPath.replace(/\\/g, '/')}`;
  };

  React.useEffect(() => {
    if (categoryId) {
      const cat = categories.find(c => c.id === categoryId);
      setSelectedCategory(cat || null);
    }
  }, [categoryId, categories]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'gallery' && galleryImages.length >= 3) {
      setMessage({ text: 'Maximum 3 gallery images allowed', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    const uploadId = type === 'cover' ? 'cover' : `gallery-${galleryImages.length}`;
    setUploading(uploadId);

    try {
      const { data } = await apiClient.post<{ url: string }>('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (type === 'cover') {
        setCoverImage(data.url);
      } else {
        setGalleryImages(prev => [...prev, data.url]);
      }
      setMessage({ text: 'Image uploaded successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Upload failed', type: 'error' });
    } finally {
      setUploading(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1: return ['title', 'categoryId', 'eventType', 'shortDescription'];
      case 2: return ['fullDescription'];
      case 3: return ['startDate', 'endDate', 'locationName', 'district', 'mapLocation'];
      case 4: return ['price', 'maxParticipants'];
      default: return [];
    }
  };

  const onSubmit = async (data: any) => {
    if (currentStep !== STEPS.length) return;
    setSubmitting(true);
    try {
      const payload = {
        ...(eventId ? { id: eventId } : {}),
        ...data,
        coverImage,
        galleryImages,
        fieldValues: Object.entries(data.dynamicFields || {})
          .filter(([fieldId]) => selectedCategory?.customFields.some(f => f.id === fieldId))
          .map(([fieldId, value]) => ({
            fieldId,
            value: value !== undefined && value !== null ? String(value) : ""
          }))
      };
      delete (payload as any).dynamicFields;

      if (eventId) {
        await apiClient.put(`/events/${eventId}`, payload);
        setMessage({ text: 'Event updated successfully!', type: 'success' });
      } else {
        await apiClient.post('/events', payload);
        setMessage({ text: 'Event created successfully!', type: 'success' });
      }
      router.push('/organizer/events');
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Failed to create event', type: 'error' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className={`fixed top-24 left-1/2 z-[100] p-5 rounded-3xl border shadow-2xl flex items-center gap-4 min-w-[320px] ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                : "bg-rose-50 border-rose-100 text-rose-700"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <p className="font-bold text-sm flex-1">{message.text}</p>
            <button onClick={() => setMessage(null)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Stepper */}
      <div className="mb-12 flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 bg-orange-500 transition-all duration-500" style={{ width: `${(currentStep / STEPS.length) * 100}%` }} />
        {STEPS.map((step) => (
          <div key={step.id} className="flex flex-col items-center gap-2 z-10">
            <div 
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${
                currentStep >= step.id 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                  : 'bg-slate-50 text-slate-300'
              }`}
            >
              {currentStep > step.id ? <CheckCircle2 size={18} /> : step.id}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest hidden md:block ${
              currentStep === step.id ? 'text-slate-900' : 'text-slate-400'
            }`}>
              {step.name}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {currentStep === 1 && (
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                    <Star size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Foundation</h2>
                    <p className="text-slate-500 font-medium">Define the core essence of your event.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Event Title</label>
                    <input 
                      {...register('title', { required: 'Title is required' })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-700"
                      placeholder="Give it a catchy name..."
                    />
                    {errors.title && <p className="text-rose-500 text-xs mt-1 ml-4 font-bold">{errors.title.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Category</label>
                      <select 
                        {...register('categoryId', { required: 'Category is required' })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-700 appearance-none"
                      >
                        <option value="">Select a Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Event Type</label>
                      <select 
                        {...register('eventType')}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-700 appearance-none"
                      >
                        <option>One-time</option>
                        <option>Recurring</option>
                        <option>Multi-day</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Short Teaser</label>
                    <input 
                      {...register('shortDescription', { required: 'Short description is required' })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-700"
                      placeholder="Summarize the experience in one line..."
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                    <Info size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">The Narrative</h2>
                    <p className="text-slate-500 font-medium">Provide all the details participants need to know.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Description</label>
                  <textarea 
                    {...register('fullDescription', { required: 'Full description is required' })}
                    rows={12}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-8 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-700 resize-none leading-relaxed"
                    placeholder="Describe everything from itinerary to inclusions..."
                  />
                  {errors.fullDescription && <p className="text-rose-500 text-xs mt-1 ml-4 font-bold">{errors.fullDescription.message}</p>}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Logistics</h2>
                    <p className="text-slate-500 font-medium">Where and when is the magic happening?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Clock size={12} className="text-orange-500" /> Timing
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Start Date</label>
                        <input type="date" {...register('startDate', { required: true })} className="w-full bg-slate-50 p-4 rounded-xl font-bold text-slate-600" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">End Date</label>
                        <input type="date" {...register('endDate', { required: true })} className="w-full bg-slate-50 p-4 rounded-xl font-bold text-slate-600" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Globe size={12} className="text-orange-500" /> Location Details
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Venue & Neighborhood</label>
                        <input {...register('locationName', { required: 'Venue name is required' })} placeholder="e.g. Mirissa Surf Club" className="w-full bg-slate-50 p-4 rounded-xl outline-none font-bold text-slate-600 border border-transparent focus:border-orange-500" />
                        {errors.locationName && <p className="text-rose-500 text-[10px] ml-4 font-bold uppercase">{errors.locationName.message as string}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">District</label>
                          <input {...register('district', { required: 'District is required' })} placeholder="District" className="w-full bg-slate-50 p-4 rounded-xl outline-none font-bold text-slate-600 border border-transparent focus:border-orange-500" />
                          {errors.district && <p className="text-rose-500 text-[10px] ml-4 font-bold uppercase">{errors.district.message as string}</p>}
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Map URL</label>
                          <div className="relative">
                            <MapPin size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input {...register('mapLocation')} placeholder="Google Maps Link" className="w-full bg-slate-50 p-4 rounded-xl outline-none font-bold text-slate-600 border border-transparent focus:border-orange-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Value</h2>
                    <p className="text-slate-500 font-medium">Pricing and attendance limits.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <DollarSign size={10} /> Price (LKR)
                    </label>
                    <input type="number" {...register('price', { required: true, min: 0 })} className="w-full bg-transparent text-5xl font-black outline-none text-slate-900" />
                  </div>

                  <div className="space-y-4 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Users size={10} /> Max Slots
                    </label>
                    <input type="number" {...register('maxParticipants', { required: true, min: 1 })} className="w-full bg-transparent text-5xl font-black outline-none text-slate-900" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                    <ImageIcon size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Gallery</h2>
                    <p className="text-slate-500 font-medium">Add visuals that capture the spirit.</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Main Cover</label>
                    <div className="relative w-full h-80 rounded-[2rem] bg-slate-50 border-4 border-dashed border-slate-100 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-orange-500/30">
                      {coverImage ? (
                        <>
                          <img src={getImageUrl(coverImage) || ''} className="w-full h-full object-cover" alt="Cover" />
                          <button type="button" onClick={() => setCoverImage('')} className="absolute top-4 right-4 p-2 bg-white rounded-xl text-rose-500 shadow-xl z-20"><Trash2 size={20} /></button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-4 cursor-pointer">
                          {uploading === 'cover' ? <Loader2 size={32} className="animate-spin text-orange-500" /> : <Camera size={32} className="text-slate-300" />}
                          <span className="text-xs font-black text-slate-400 uppercase">Click to upload cover</span>
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'cover')} disabled={!!uploading} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Gallery ({galleryImages.length}/3)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {galleryImages.map((img, i) => (
                        <div key={i} className="relative aspect-square rounded-[1.5rem] bg-slate-50 overflow-hidden border border-slate-100">
                          <img src={getImageUrl(img) || ''} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                          <button type="button" onClick={() => setGalleryImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 p-1.5 bg-white rounded-lg text-rose-500 shadow-lg z-20"><X size={14} /></button>
                        </div>
                      ))}
                      {galleryImages.length < 3 && (
                        <div className="aspect-square rounded-[1.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center relative cursor-pointer hover:border-orange-500/30">
                          {uploading?.startsWith('gallery-') ? <Loader2 size={20} className="animate-spin text-orange-500" /> : <Plus size={24} className="text-slate-300" />}
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'gallery')} disabled={!!uploading} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-slate-900 rounded-2xl text-white">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">{selectedCategory?.name} Extras</h2>
                    <p className="text-slate-500 font-medium">Complete these specific details for your category.</p>
                  </div>
                </div>

                {selectedCategory && selectedCategory.customFields.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {selectedCategory.customFields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{field.fieldLabel}</label>
                        {field.fieldType === 'text' && <input {...register(`dynamicFields.${field.id}`, { required: field.isRequired })} className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none font-bold text-slate-700" />}
                        {field.fieldType === 'number' && <input type="number" {...register(`dynamicFields.${field.id}`, { required: field.isRequired })} className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none font-bold text-slate-700" />}
                        {field.fieldType === 'select' && (
                          <select {...register(`dynamicFields.${field.id}`, { required: field.isRequired })} className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none font-bold text-slate-700">
                            <option value="">Select Option</option>
                            {field.optionsJson && JSON.parse(field.optionsJson).map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        )}
                        {field.fieldType === 'checkbox' && (
                          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <input type="checkbox" {...register(`dynamicFields.${field.id}`)} className="w-5 h-5 rounded border-slate-300 text-orange-600" />
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Enabled / Included</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center text-slate-300 flex flex-col items-center gap-4 font-black uppercase tracking-[0.2em]">
                    <CheckCircle2 size={48} />
                    <span>All details captured</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <button type="button" onClick={prevStep} disabled={currentStep === 1 || submitting} className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${currentStep === 1 ? 'opacity-0' : 'bg-slate-50 text-slate-400 hove:bg-slate-100'}`}>Back</button>
          
          {currentStep < STEPS.length ? (
            <button 
              key="continue-button"
              type="button" 
              onClick={nextStep} 
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center gap-2 uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95"
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button 
              key="submit-button"
              type="submit" 
              disabled={submitting} 
              className="px-12 py-4 bg-orange-600 text-white rounded-2xl font-black flex items-center gap-2 uppercase text-[10px] tracking-widest hover:bg-orange-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {submitting ? (eventId ? 'Updating...' : 'Launching...') : (eventId ? 'Update Event Details' : 'Publish Professional Event')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
