'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Plus, Settings, Trash2, Edit3, Save, X, GripVertical, CheckCircle, Info } from 'lucide-react';
import apiClient from '@/services/api-client';
import { useToast } from '@/hooks/useToast';

interface CustomField {
  id?: string;
  fieldLabel: string;
  fieldName: string;
  fieldType: string;
  optionsJson?: string;
  isRequired: boolean;
  sortOrder: number;
}

interface EventCategory {
  id: string;
  name: string;
  icon?: string;
  customFields: CustomField[];
}

export default function CategoryManager() {
  const { toast } = useToast();
  const [categories, setCategories] = React.useState<EventCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingCategory, setEditingCategory] = React.useState<EventCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const fetchCategories = async () => {
    try {
      const { data } = await apiClient.get('/event-categories');
      setCategories(data as EventCategory[]);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (category: EventCategory) => {
    try {
      if (category.id) {
        // Update logic (to be implemented on backend)
        await apiClient.put(`/admin/event-categories/${category.id}`, category);
      } else {
        await apiClient.post('/admin/event-categories', category);
      }
      toast.success('Category saved successfully');
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error('Failed to save category');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#5D596C] mb-1">Event Categories</h1>
          <p className="text-sm text-[#A5A3AE] font-medium">Define categories and custom dynamic fields for organizers.</p>
        </div>
        <button 
          onClick={() => {
            setEditingCategory({ id: '', name: '', customFields: [] });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-[#7367F0] text-white font-bold rounded-xl shadow-md shadow-[#7367F0]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={18} />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <motion.div 
            key={cat.id}
            layoutId={cat.id}
            className="bg-white p-6 rounded-2xl border border-[#DBDADE]/50 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#7367F0]/10 rounded-xl flex items-center justify-center text-[#7367F0]">
                  <LayoutGrid size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-[#5D596C]">{cat.name}</h3>
                  <p className="text-[10px] font-black text-[#A5A3AE] uppercase tracking-widest leading-none mt-1">
                    {cat.customFields.length} Custom Fields
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setEditingCategory(cat);
                  setIsModalOpen(true);
                }}
                className="p-2 text-[#A5A3AE] hover:text-[#7367F0] hover:bg-[#F8F7FA] rounded-lg transition-all"
              >
                <Settings size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {cat.customFields.slice(0, 3).map((field, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium text-[#6F6B7D] bg-[#F8F7FA] px-3 py-1.5 rounded-lg border border-[#DBDADE]/30">
                  <CheckCircle size={12} className="text-[#28C76F]" />
                  <span>{field.fieldLabel}</span>
                  <span className="ml-auto text-[9px] font-black text-[#A5A3AE] px-1.5 py-0.5 bg-white rounded border border-[#DBDADE]/50 uppercase">
                    {field.fieldType}
                  </span>
                </div>
              ))}
              {cat.customFields.length > 3 && (
                <p className="text-[10px] text-center font-bold text-[#A5A3AE] uppercase pt-1">
                  + {cat.customFields.length - 3} more fields
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* category Editor Modal Placeholder */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-[#DBDADE]/50 flex items-center justify-between bg-[#F8F7FA]">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#7367F0] text-white rounded-2xl shadow-lg shadow-[#7367F0]/20">
                    <Edit3 size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#5D596C]">
                      {editingCategory?.id ? 'Edit Category' : 'New Category'}
                    </h2>
                    <p className="text-xs text-[#A5A3AE] font-bold uppercase tracking-widest mt-1">Field Configuration</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-all">
                  <X size={24} className="text-[#A5A3AE]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div>
                  <label className="block text-sm font-bold text-[#5D596C] mb-2 uppercase tracking-wide">Category Name</label>
                  <input 
                    type="text"
                    value={editingCategory?.name || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory!, name: e.target.value })}
                    className="w-full p-4 rounded-xl border border-[#DBDADE] outline-none focus:ring-2 focus:ring-[#7367F0]/20 focus:border-[#7367F0] transition-all font-bold text-[#5D596C]"
                    placeholder="e.g. Surfing Class"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-[#6F6B7D] uppercase tracking-widest">Custom Fields</h3>
                    <button 
                      onClick={() => {
                        const newFields = [...(editingCategory?.customFields || [])];
                        newFields.push({ fieldLabel: '', fieldName: '', fieldType: 'text', isRequired: false, sortOrder: newFields.length });
                        setEditingCategory({ ...editingCategory!, customFields: newFields });
                      }}
                      className="text-xs font-black text-[#7367F0] uppercase flex items-center gap-1 hover:underline"
                    >
                      <Plus size={14} /> Add Field
                    </button>
                  </div>

                  <div className="space-y-3">
                    {editingCategory?.customFields.map((field, idx) => (
                      <div key={idx} className="p-4 bg-[#F8F7FA] rounded-2xl border border-[#DBDADE]/50 flex flex-col sm:flex-row gap-4 relative group">
                        <div className="flex-1 space-y-3">
                          <input 
                            type="text"
                            placeholder="Label (e.g. Skill Level)"
                            value={field.fieldLabel}
                            onChange={(e) => {
                              const newFields = [...editingCategory!.customFields];
                              newFields[idx].fieldLabel = e.target.value;
                              newFields[idx].fieldName = e.target.value.toLowerCase().replace(/ /g, '_');
                              setEditingCategory({ ...editingCategory!, customFields: newFields });
                            }}
                            className="w-full bg-white px-4 py-2.5 rounded-lg border border-[#DBDADE]/50 outline-none text-sm font-bold"
                          />
                          <div className="flex flex-wrap gap-4">
                            <select 
                              value={field.fieldType}
                              onChange={(e) => {
                                const newFields = [...editingCategory!.customFields];
                                newFields[idx].fieldType = e.target.value;
                                setEditingCategory({ ...editingCategory!, customFields: newFields });
                              }}
                              className="text-xs font-black p-2 rounded-lg border border-[#DBDADE]/50 bg-white"
                            >
                              <option value="text">TEXT</option>
                              <option value="number">NUMBER</option>
                              <option value="select">SELECT (DROPDOWN)</option>
                              <option value="checkbox">CHECKBOX</option>
                            </select>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={field.isRequired}
                                onChange={(e) => {
                                  const newFields = [...editingCategory!.customFields];
                                  newFields[idx].isRequired = e.target.checked;
                                  setEditingCategory({ ...editingCategory!, customFields: newFields });
                                }}
                                className="w-4 h-4 rounded border-[#DBDADE] text-[#7367F0] focus:ring-[#7367F0]"
                              />
                              <span className="text-[10px] font-black text-[#A5A3AE] uppercase">Required</span>
                            </label>
                          </div>
                          {field.fieldType === 'select' && (
                            <input 
                               type="text"
                               placeholder='Options (JSON: ["Option1", "Option2"])'
                               value={field.optionsJson || ''}
                               onChange={(e) => {
                                    const newFields = [...editingCategory!.customFields];
                                    newFields[idx].optionsJson = e.target.value;
                                    setEditingCategory({ ...editingCategory!, customFields: newFields });
                               }}
                               className="w-full bg-white px-4 py-2.5 rounded-lg border border-[#DBDADE]/50 outline-none text-xs font-mono"
                            />
                          )}
                        </div>
                        <button 
                          onClick={() => {
                            const newFields = editingCategory!.customFields.filter((_, i) => i !== idx);
                            setEditingCategory({ ...editingCategory!, customFields: newFields });
                          }}
                          className="sm:self-start p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-[#DBDADE]/50 flex justify-end gap-3 bg-[#F8F7FA]">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 font-bold text-[#6F6B7D] hover:bg-white rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleSave(editingCategory!)}
                  className="px-8 py-3 bg-[#7367F0] text-white font-black rounded-xl shadow-lg shadow-[#7367F0]/20 flex items-center gap-2"
                >
                  <Save size={18} />
                  <span>Save Configuration</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
