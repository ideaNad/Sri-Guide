'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Building2, Globe, Mail, Save, 
  Loader2, Camera, Instagram, Twitter, 
  Linkedin, Youtube, Facebook, Star, 
  MapPin, Globe2, X, AlertCircle, CheckCircle2 
} from 'lucide-react';
import apiClient from '@/services/api-client';
import { useAuth } from '@/providers/AuthContext';

const XIcon = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const COMMON_LANGUAGES = ["English", "Sinhala", "Tamil", "German", "French", "Italian", "Japanese", "Chinese", "Russian", "Arabic"];
const COMMON_AREAS = ["Colombo", "Kandy", "Galle", "Ella", "Nuwara Eliya", "Mirissa", "Sigiriya", "Anuradhapura", "Polonnaruwa", "Yala", "Trincomalee", "Jaffna", "Kataragama", "Arugam Bay", "Horton Plains", "Sinharaja", "Dambulla", "Matara", "Hikkaduwa", "Bentota", "Negombo", "Kalpitiya", "Kitulgala", "Adam's Peak", "Pinnawala", "Haputale", "Udawalawe", "Wilpattu", "Pasikudah", "Nilaveli", "Batticaloa", "Mannar", "Minneriya", "Koggala", "Unawatuna", "Weligama", "Tangalle", "Dickwella", "Mihintale", "Kurunegala", "Ratnapura", "Kegalle", "Badulla", "Bandarawela"];

interface SectionCardProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}

const SectionCard = ({ icon: Icon, title, children }: SectionCardProps) => (
  <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm shadow-slate-200/50">
    <div className="flex items-center gap-4 p-8 border-b border-slate-50 bg-slate-50/30">
      <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight italic">{title}</h3>
    </div>
    <div className="p-8">
      {children}
    </div>
  </div>
);

export default function OrganizerProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [profile, setProfile] = useState({
    organizationName: '',
    website: '',
    bio: '',
    facebookLink: '',
    instagramLink: '',
    twitterLink: '',
    tikTokLink: '',
    youTubeLink: '',
    linkedinLink: '',
    languages: [] as string[],
    specialties: [] as string[],
    operatingAreas: [] as string[],
    profileImageUrl: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get('/profile/me');
      const data = response.data as any;
      if (data.eventOrganizerProfile) {
        setProfile({
          organizationName: data.eventOrganizerProfile.organizationName || '',
          website: data.eventOrganizerProfile.website || '',
          bio: data.eventOrganizerProfile.bio || '',
          facebookLink: data.eventOrganizerProfile.facebookLink || '',
          instagramLink: data.eventOrganizerProfile.instagramLink || '',
          twitterLink: data.eventOrganizerProfile.twitterLink || '',
          tikTokLink: data.eventOrganizerProfile.tikTokLink || '',
          youTubeLink: data.eventOrganizerProfile.youTubeLink || '',
          linkedinLink: data.eventOrganizerProfile.linkedinLink || '',
          languages: data.eventOrganizerProfile.languages || [],
          specialties: data.eventOrganizerProfile.specialties || [],
          operatingAreas: data.eventOrganizerProfile.operatingAreas || [],
          profileImageUrl: data.profileImageUrl || ''
        });
      }
    } catch (error) {
      setMessage({ text: 'Failed to load profile', type: 'error' });
    } finally {
      setInitialLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataFile = new FormData();
    formDataFile.append("file", file);

    setLoading(true);
    try {
      const response = await apiClient.post<string>("/profile/upload-photo", formDataFile, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setProfile(prev => ({ ...prev, profileImageUrl: response.data }));
      updateUser({ profileImageUrl: response.data });
      setMessage({ text: "Profile picture updated!", type: "success" });
    } catch (error) {
      setMessage({ text: "Failed to upload photo.", type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/profile/organizer/update', {
        ...profile,
        userId: user?.id
      });
      setMessage({ text: 'Profile updated successfully', type: 'success' });
      
      updateUser({
        fullName: user?.fullName,
        eventOrganizerProfile: {
          ...profile,
          isVerified: user?.eventOrganizerProfile?.isVerified || false
        }
      });
    } catch (error) {
      setMessage({ text: 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (initialLoading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black text-slate-900 mb-2 italic uppercase tracking-tighter">Organization Profile</h1>
        <p className="text-slate-500 font-medium">Elevate your organization&apos;s presence in the SriGuide community.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 items-center bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-xl">
            <img
              src={profile.profileImageUrl ? `${apiClient.defaults.baseURL?.replace('/api', '')}${profile.profileImageUrl}` : `https://ui-avatars.com/api/?name=${profile.organizationName || user?.fullName}&background=random`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <input type="file" id="photo-upload" className="hidden" onChange={handlePhotoUpload} />
          <label
            htmlFor="photo-upload"
            className="absolute bottom-0 right-0 p-2.5 bg-slate-900 text-white rounded-full shadow-lg border-2 border-white cursor-pointer hover:bg-orange-500 transition-all active:scale-95"
          >
            <Camera size={16} />
          </label>
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">{profile.organizationName || "Your Organization"}</h2>
          <p className="text-slate-400 font-bold text-sm tracking-wide">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <SectionCard icon={Building2} title="Core Identity">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 flex items-center gap-2">
                <Building2 size={10} /> Organization Name
              </label>
              <input
                type="text"
                name="organizationName"
                value={profile.organizationName}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-700"
                placeholder="Your Organization"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 flex items-center gap-2">
                <Globe size={10} /> Website
              </label>
              <input
                type="url"
                name="website"
                value={profile.website}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-700"
                placeholder="https://example.com"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 flex items-center gap-2">
                <User size={10} /> Professional Bio
              </label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-8 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-700 resize-none leading-relaxed"
                placeholder="Tell the community about your organization's mission and history..."
              />
            </div>
          </div>
        </SectionCard>

        {/* Professional Details Section */}
        <SectionCard icon={Star} title="Professional Details">
          <div className="space-y-10">
            {/* Languages */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 ml-1 mb-4 block flex items-center gap-2">
                <Globe2 size={12} className="text-orange-500" /> Languages
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.languages.map(lang => (
                  <span key={lang} className="bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2">
                    {lang}
                    <button
                      type="button"
                      onClick={() => setProfile(prev => ({ ...prev, languages: prev.languages.filter(l => l !== lang) }))}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <select
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && !profile.languages.includes(val)) {
                      setProfile(prev => ({ ...prev, languages: [...prev.languages, val] }));
                    }
                    e.target.value = '';
                  }}
                  className="bg-slate-50 border border-dashed border-slate-300 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-500 outline-none cursor-pointer hover:border-orange-500 transition-colors"
                >
                  <option value="">+ Add Language</option>
                  {COMMON_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Operating Areas */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 ml-1 mb-4 block flex items-center gap-2">
                <MapPin size={12} className="text-orange-500" /> Operating Areas
              </label>
              <div className="flex flex-wrap gap-2">
                {profile.operatingAreas.map(area => (
                  <span key={area} className="bg-orange-50 text-orange-700 border border-orange-100 px-4 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2">
                    {area}
                    <button
                      type="button"
                      onClick={() => setProfile(prev => ({ ...prev, operatingAreas: prev.operatingAreas.filter(a => a !== area) }))}
                      className="text-orange-400 hover:text-orange-600"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <select
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && !profile.operatingAreas.includes(val)) {
                      setProfile(prev => ({ ...prev, operatingAreas: [...prev.operatingAreas, val] }));
                    }
                    e.target.value = '';
                  }}
                  className="bg-slate-50 border border-dashed border-slate-300 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-500 outline-none cursor-pointer hover:border-orange-500 transition-colors"
                >
                  <option value="">+ Add Area</option>
                  {COMMON_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>

            {/* Specialties */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 ml-1 mb-4 block flex items-center gap-2">
                <Star size={12} className="text-orange-500" /> Organization Specialties
              </label>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((s, i) => (
                  <span key={i} className="bg-blue-50 text-blue-600 border border-blue-100 px-4 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2">
                    {s}
                    <button
                      type="button"
                      onClick={() => setProfile(prev => ({ ...prev, specialties: prev.specialties.filter((_, idx) => idx !== i) }))}
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <input
                  placeholder="Type Specialty & Press Enter"
                  className="bg-slate-50 border border-dashed border-slate-300 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-500 outline-none hover:border-orange-500 transition-colors flex-1 min-w-[250px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (val && !profile.specialties.includes(val)) {
                        setProfile(prev => ({ ...prev, specialties: [...prev.specialties, val] }));
                      }
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Social Presence Section */}
        <SectionCard icon={Instagram} title="Social Presence">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'instagramLink', label: 'Instagram Profile URL', icon: Instagram, hex: '#E1306C' },
              { name: 'twitterLink', label: 'X Profile URL', icon: XIcon, hex: '#000000' },
              { name: 'linkedinLink', label: 'LinkedIn Profile URL', icon: Linkedin, hex: '#0A66C2' },
              { name: 'youTubeLink', label: 'YouTube Channel URL', icon: Youtube, hex: '#FF0000' },
              { name: 'facebookLink', label: 'Facebook Page URL', icon: Facebook, hex: '#1877F2' },
              { name: 'tikTokLink', label: 'TikTok Profile URL', icon: MapPin, hex: '#000000' }
            ].map((social) => {
              return (
                <div key={social.name}>
                  <div className="relative group">
                    <div
                      className="absolute left-6 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all"
                      style={{ backgroundColor: `${social.hex}15`, color: social.hex }}
                    >
                      <social.icon size={16} />
                    </div>
                    <input
                      type="text"
                      name={social.name}
                      value={(profile as any)[social.name] || ''}
                      onChange={handleChange}
                      placeholder={social.label}
                      className="w-full bg-slate-50 border border-transparent rounded-2xl py-4 pl-16 pr-6 font-bold text-slate-900 outline-none focus:bg-white transition-all text-sm focus:border-slate-200"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <div className="flex justify-end pt-10">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-3 px-12 py-5 bg-slate-900 text-white font-black rounded-[2rem] hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50 uppercase text-xs tracking-[0.2em]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={18} />}
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
