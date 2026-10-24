'use client';

import { useState } from 'react';
import { 
  Plus, Trash2, Copy, Eye, CheckCircle2, 
  ChevronUp, ChevronDown, Settings2, FileText, CheckSquare, ListFilter,
  Type, AlignLeft, Mail, Hash, Phone, UploadCloud, CheckCheck,
  QrCode, Image as ImageIcon, Bold, Italic, Underline, Palette, X
} from 'lucide-react';
import api from '@/lib/axios';

export enum FieldType {
  SHORT_TEXT = 'SHORT_TEXT',
  LONG_TEXT = 'LONG_TEXT',
  EMAIL = 'EMAIL',
  MOBILE = 'MOBILE',
  REG_NUMBER = 'REG_NUMBER',
  DROPDOWN = 'DROPDOWN',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  FILE_UPLOAD = 'FILE_UPLOAD',
  DECLARATION = 'DECLARATION',
  IMAGE = 'IMAGE'
}

export interface IFormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  description?: string;
  options?: string[];
  placeholder?: string;
  allowedTypes?: string;
  maxSizeInMB?: number;
  imageUrl?: string;
  imageTitle?: string;
  bgColor?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

interface FormBuilderProps {
  initialFields?: IFormField[];
  onSave: (fields: IFormField[]) => void;
  isSaving?: boolean;
}

// Preset color options
export const PRESET_BG_COLORS = [
  { name: 'White', value: '#ffffff', border: '#e2e8f0' },
  { name: 'Soft Blue', value: '#eff6ff', border: '#bfdbfe' },
  { name: 'Soft Green', value: '#ecfdf5', border: '#a7f3d0' },
  { name: 'Soft Purple', value: '#f5f3ff', border: '#ddd6fe' },
  { name: 'Soft Amber', value: '#fffbeb', border: '#fde68a' },
  { name: 'Soft Rose', value: '#fff1f2', border: '#fecdd3' },
  { name: 'Soft Slate', value: '#f8fafc', border: '#cbd5e1' }
];

export function renderRichText(text: string, formatting?: { bold?: boolean; italic?: boolean; underline?: boolean }) {
  if (!text) return null;

  // Replace markdown-style formatting: **bold**, *italic*, <u>underline</u>
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.*?)\*/g, '<i>$1</i>')
    .replace(/__(.*?)__/g, '<u>$1</u>');

  const classes = [
    formatting?.bold ? 'font-black' : '',
    formatting?.italic ? 'italic' : '',
    formatting?.underline ? 'underline underline-offset-2' : ''
  ].filter(Boolean).join(' ');

  return (
    <span 
      className={classes}
      dangerouslySetInnerHTML={{ __html: formatted }}
    />
  );
}

export default function FormBuilder({ initialFields = [], onSave, isSaving = false }: FormBuilderProps) {
  const [fields, setFields] = useState<IFormField[]>(() => {
    if (initialFields && initialFields.length > 0) return initialFields;
    return [
      { id: 'f_name', type: FieldType.SHORT_TEXT, label: 'Full Name', required: true, placeholder: 'Enter your full name' },
      { id: 'f_email', type: FieldType.EMAIL, label: 'Official VIT Bhopal Email', required: true, placeholder: 'name@vitbhopal.ac.in', description: 'Restricted strictly to @vitbhopal.ac.in domains' },
      { id: 'f_reg', type: FieldType.REG_NUMBER, label: 'Registration Number', required: true, placeholder: 'e.g. 24BCY10001' },
      { id: 'f_phone', type: FieldType.MOBILE, label: 'WhatsApp / Mobile Number', required: true, placeholder: '10-digit mobile number' }
    ];
  });

  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [uploadingImageFor, setUploadingImageFor] = useState<string | null>(null);

  const fieldTypeOptions = [
    { type: FieldType.SHORT_TEXT, label: 'Short Answer', icon: Type, desc: 'Single-line text' },
    { type: FieldType.LONG_TEXT, label: 'Paragraph', icon: AlignLeft, desc: 'Multi-line detailed answer' },
    { type: FieldType.EMAIL, label: 'VIT Email', icon: Mail, desc: 'Restricted to @vitbhopal.ac.in' },
    { type: FieldType.REG_NUMBER, label: 'Registration No.', icon: Hash, desc: 'College reg number' },
    { type: FieldType.MOBILE, label: 'Phone Number', icon: Phone, desc: '10-digit contact number' },
    { type: FieldType.RADIO, label: 'Multiple Choice', icon: CheckCircle2, desc: 'Single select radio buttons' },
    { type: FieldType.CHECKBOX, label: 'Checkboxes', icon: CheckSquare, desc: 'Multi-select options' },
    { type: FieldType.DROPDOWN, label: 'Dropdown', icon: ListFilter, desc: 'Select from list' },
    { type: FieldType.FILE_UPLOAD, label: 'File Upload', icon: UploadCloud, desc: 'Documents or images' },
    { type: FieldType.DECLARATION, label: 'Declaration', icon: CheckCheck, desc: 'Consent or agreement checkbox' },
    { type: FieldType.IMAGE, label: 'Image / QR Code', icon: QrCode, desc: 'Display QR, poster, or instructions' }
  ];

  const addField = (type: FieldType) => {
    const defaultLabels: Record<FieldType, string> = {
      [FieldType.SHORT_TEXT]: 'Short Answer Question',
      [FieldType.LONG_TEXT]: 'Detailed Response / Notes',
      [FieldType.EMAIL]: 'Official VIT Email Address',
      [FieldType.REG_NUMBER]: 'Registration Number',
      [FieldType.MOBILE]: 'WhatsApp Contact Number',
      [FieldType.RADIO]: 'Multiple Choice Question',
      [FieldType.CHECKBOX]: 'Select Applicable Options',
      [FieldType.DROPDOWN]: 'Select from Options',
      [FieldType.FILE_UPLOAD]: 'Upload Document / ID Card',
      [FieldType.DECLARATION]: 'Declaration / Consent',
      [FieldType.IMAGE]: 'Scan QR Code / Important Guidelines'
    };

    const newField: IFormField = {
      id: 'f_' + Math.random().toString(36).substring(2, 9),
      type,
      label: defaultLabels[type] || 'New Question',
      required: type !== FieldType.IMAGE,
      placeholder: '',
      description: type === FieldType.IMAGE ? 'Scan the QR code below or follow these instructions:' : '',
      options: [FieldType.RADIO, FieldType.CHECKBOX, FieldType.DROPDOWN].includes(type)
        ? ['Option 1', 'Option 2']
        : undefined,
      allowedTypes: type === FieldType.FILE_UPLOAD ? '.pdf, image/*' : undefined,
      maxSizeInMB: type === FieldType.FILE_UPLOAD ? 10 : undefined,
      bgColor: '#ffffff',
      bold: false,
      italic: false,
      underline: false
    };

    setFields(prev => [...prev, newField]);
    setActiveFieldId(newField.id);
  };

  const updateField = (id: string, updates: Partial<IFormField>) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const duplicateField = (id: string) => {
    const index = fields.findIndex(f => f.id === id);
    if (index === -1) return;
    const original = fields[index];
    const clone: IFormField = {
      ...original,
      id: 'f_' + Math.random().toString(36).substring(2, 9),
      label: original.label + ' (Copy)',
      options: original.options ? [...original.options] : undefined
    };
    const updated = [...fields];
    updated.splice(index + 1, 0, clone);
    setFields(updated);
    setActiveFieldId(clone.id);
  };

  const removeField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
    if (activeFieldId === id) setActiveFieldId(null);
  };

  const moveField = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;
    const updated = [...fields];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFields(updated);
  };

  const addOption = (fieldId: string) => {
    setFields(prev => prev.map(f => {
      if (f.id !== fieldId) return f;
      const opts = f.options || [];
      return { ...f, options: [...opts, 'Option ' + (opts.length + 1)] };
    }));
  };

  const updateOption = (fieldId: string, optIndex: number, val: string) => {
    setFields(prev => prev.map(f => {
      if (f.id !== fieldId) return f;
      const opts = [...(f.options || [])];
      opts[optIndex] = val;
      return { ...f, options: opts };
    }));
  };

  const removeOption = (fieldId: string, optIndex: number) => {
    setFields(prev => prev.map(f => {
      if (f.id !== fieldId) return f;
      const opts = (f.options || []).filter((_, i) => i !== optIndex);
      return { ...f, options: opts.length > 0 ? opts : ['Option 1'] };
    }));
  };

  // Upload image/QR for a card
  const handleUploadImageForField = async (fieldId: string, file: File) => {
    try {
      setUploadingImageFor(fieldId);
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateField(fieldId, { imageUrl: res.data.url });
    } catch (err) {
      console.error('Failed to upload image:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImageFor(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Builder Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
            <Settings2 size={18} className="text-nss-blue" />
            Google Forms Style Form Builder
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Add questions, QR codes/images, descriptions, card background colors, and rich text formatting (bold, italic, underline).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Eye size={15} /> Preview Form ({fields.length} questions)
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => onSave(fields)}
            className="px-5 py-2 rounded-xl bg-nss-blue hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 size={15} /> {isSaving ? 'Saving...' : 'Save Form Schema'}
          </button>
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Questions Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {fields.length === 0 ? (
            <div className="p-12 text-center bg-gray-50/70 border-2 border-dashed border-gray-200 rounded-2xl">
              <FileText size={36} className="mx-auto text-gray-300 mb-2" />
              <h4 className="font-bold text-gray-700">No questions added yet</h4>
              <p className="text-xs text-gray-500 mt-1">Select a question or image/QR type from the sidebar to add it to your form.</p>
            </div>
          ) : (
            fields.map((field, index) => {
              const isSelected = activeFieldId === field.id;
              const hasOptions = [FieldType.RADIO, FieldType.CHECKBOX, FieldType.DROPDOWN].includes(field.type);
              const cardBg = field.bgColor || '#ffffff';

              return (
                <div
                  key={field.id}
                  onClick={() => setActiveFieldId(field.id)}
                  style={{ backgroundColor: cardBg }}
                  className={'rounded-2xl border-2 transition-all p-5 shadow-xs relative ' + (
                    isSelected ? 'border-nss-blue ring-2 ring-nss-blue/10 shadow-md' : 'border-gray-200/90 hover:border-gray-300'
                  )}
                >
                  {/* Card Header & Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-black/5 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-black/5 text-gray-700 font-bold text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-nss-blue border border-blue-200/60">
                        {field.type.replace('_', ' ')}
                      </span>
                      {field.required && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60">
                          Required
                        </span>
                      )}
                    </div>

                    {/* Rich Formatting Toolbar (Bold, Italic, Underline) & Card BG Picker */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Bold button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateField(field.id, { bold: !field.bold });
                        }}
                        title="Toggle Bold"
                        className={'p-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ' + (
                          field.bold ? 'bg-slate-900 text-white border-slate-900' : 'bg-white/80 text-gray-700 border-gray-200 hover:bg-gray-100'
                        )}
                      >
                        <Bold size={13} />
                      </button>

                      {/* Italic button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateField(field.id, { italic: !field.italic });
                        }}
                        title="Toggle Italic"
                        className={'p-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ' + (
                          field.italic ? 'bg-slate-900 text-white border-slate-900' : 'bg-white/80 text-gray-700 border-gray-200 hover:bg-gray-100'
                        )}
                      >
                        <Italic size={13} />
                      </button>

                      {/* Underline button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateField(field.id, { underline: !field.underline });
                        }}
                        title="Toggle Underline"
                        className={'p-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ' + (
                          field.underline ? 'bg-slate-900 text-white border-slate-900' : 'bg-white/80 text-gray-700 border-gray-200 hover:bg-gray-100'
                        )}
                      >
                        <Underline size={13} />
                      </button>

                      {/* Color Palette Dropdown / Swatches */}
                      <div className="flex items-center gap-1 bg-white/80 border border-gray-200 rounded-lg p-1" onClick={(e) => e.stopPropagation()}>
                        <Palette size={13} className="text-gray-400 ml-0.5" />
                        {PRESET_BG_COLORS.map(c => (
                          <button
                            key={c.value}
                            type="button"
                            title={c.name}
                            onClick={() => updateField(field.id, { bgColor: c.value })}
                            style={{ backgroundColor: c.value, borderColor: c.border }}
                            className={'w-4 h-4 rounded-full border cursor-pointer transition-transform ' + (
                              field.bgColor === c.value ? 'scale-125 ring-1 ring-slate-900' : 'hover:scale-110'
                            )}
                          />
                        ))}
                      </div>

                      {/* Reorder and Delete controls */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={(e) => { e.stopPropagation(); moveField(index, 'UP'); }}
                        title="Move Up"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white/80 disabled:opacity-30 transition-colors cursor-pointer"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        type="button"
                        disabled={index === fields.length - 1}
                        onClick={(e) => { e.stopPropagation(); moveField(index, 'DOWN'); }}
                        title="Move Down"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white/80 disabled:opacity-30 transition-colors cursor-pointer"
                      >
                        <ChevronDown size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); duplicateField(field.id); }}
                        title="Duplicate Question"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-nss-blue hover:bg-white/80 transition-colors cursor-pointer"
                      >
                        <Copy size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
                        title="Delete Question"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-white/80 transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Question Title & Type Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div className="md:col-span-2">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                        Question / Element Title
                      </label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        placeholder="e.g. Which domain do you want to volunteer in?"
                        style={{
                          fontWeight: field.bold ? '900' : 'bold',
                          fontStyle: field.italic ? 'italic' : 'normal',
                          textDecoration: field.underline ? 'underline' : 'none'
                        }}
                        className="w-full px-3.5 py-2 text-sm text-gray-900 bg-white/90 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-nss-blue/20 focus:border-nss-blue transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                        Field Type
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) => {
                          const newType = e.target.value as FieldType;
                          const needsOpts = [FieldType.RADIO, FieldType.CHECKBOX, FieldType.DROPDOWN].includes(newType);
                          updateField(field.id, {
                            type: newType,
                            options: needsOpts ? (field.options || ['Option 1', 'Option 2']) : undefined
                          });
                        }}
                        className="w-full px-3 py-2 text-xs font-bold text-gray-800 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:border-nss-blue transition-all"
                      >
                        {fieldTypeOptions.map(opt => (
                          <option key={opt.type} value={opt.type}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Question Description / Helper Text Input */}
                  <div className="mb-3">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Question Description / Instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={field.description || ''}
                      onChange={(e) => updateField(field.id, { description: e.target.value })}
                      placeholder="Add helpful instructions, guidelines, or details (e.g. 'Use **bold** or *italic* if needed')..."
                      className="w-full px-3 py-1.5 text-xs text-gray-700 bg-white/90 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-nss-blue transition-all resize-y"
                    />
                  </div>

                  {/* Attached Image / QR Code Section */}
                  <div className="mb-4 bg-white/80 p-3.5 rounded-xl border border-gray-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                        <QrCode size={14} className="text-nss-blue" />
                        Attached Image / QR Code (Optional)
                      </span>

                      <div className="flex items-center gap-2">
                        <label className="px-2.5 py-1 bg-blue-50 text-nss-blue hover:bg-blue-100 rounded-lg text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1">
                          <UploadCloud size={12} /> {uploadingImageFor === field.id ? 'Uploading...' : 'Upload Image / QR'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleUploadImageForField(field.id, e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                        {field.imageUrl && (
                          <button
                            type="button"
                            onClick={() => updateField(field.id, { imageUrl: undefined, imageTitle: undefined })}
                            className="text-rose-600 hover:text-rose-700 text-[11px] font-bold flex items-center gap-0.5"
                          >
                            <X size={12} /> Remove Image
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        value={field.imageUrl || ''}
                        onChange={(e) => updateField(field.id, { imageUrl: e.target.value })}
                        placeholder="Or paste Image URL (e.g. https://... or /images/qr.png)"
                        className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-nss-blue font-mono"
                      />
                      <input
                        type="text"
                        value={field.imageTitle || ''}
                        onChange={(e) => updateField(field.id, { imageTitle: e.target.value })}
                        placeholder="Image Caption / QR Title (e.g. 'UPI Payment QR')"
                        className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-nss-blue"
                      />
                    </div>

                    {/* Image Preview Box */}
                    {field.imageUrl && (
                      <div className="p-3 bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center max-w-xs mx-auto">
                        {field.imageTitle && (
                          <p className="text-xs font-bold text-gray-800 mb-1.5">{field.imageTitle}</p>
                        )}
                        <img 
                          src={field.imageUrl} 
                          alt={field.imageTitle || 'Attached'} 
                          className="max-h-48 object-contain rounded-lg border border-gray-100 shadow-2xs"
                        />
                      </div>
                    )}
                  </div>

                  {/* Placeholder (For text inputs) */}
                  {[FieldType.SHORT_TEXT, FieldType.LONG_TEXT, FieldType.EMAIL, FieldType.REG_NUMBER, FieldType.MOBILE].includes(field.type) && (
                    <div className="mb-4">
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        placeholder="Input placeholder text..."
                        className="w-full px-3 py-1.5 text-xs text-gray-600 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:border-nss-blue transition-all"
                      />
                    </div>
                  )}

                  {/* Options Editor (Radio, Checkbox, Dropdown) */}
                  {hasOptions && (
                    <div className="bg-white/80 p-4 rounded-xl border border-gray-200/80 mb-4 space-y-2">
                      <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">
                        Answer Choices:
                      </p>
                      {(field.options || ['Option 1']).map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center text-[10px] text-gray-500 font-bold shrink-0">
                            {optIndex + 1}
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateOption(field.id, optIndex, e.target.value)}
                            className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-nss-blue transition-all"
                          />
                          {(field.options || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOption(field.id, optIndex)}
                              className="p-1 text-gray-400 hover:text-rose-600 rounded cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(field.id)}
                        className="text-xs font-bold text-nss-blue hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                      >
                        <Plus size={13} /> Add another option
                      </button>
                    </div>
                  )}

                  {/* File Upload Specific Settings */}
                  {field.type === FieldType.FILE_UPLOAD && (
                    <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-200/60 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Allowed File Types:</label>
                        <input
                          type="text"
                          value={field.allowedTypes || '.pdf, image/*'}
                          onChange={(e) => updateField(field.id, { allowedTypes: e.target.value })}
                          placeholder=".pdf, image/*, .docx"
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Max File Size (MB):</label>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={field.maxSizeInMB || 10}
                          onChange={(e) => updateField(field.id, { maxSizeInMB: parseInt(e.target.value) || 10 })}
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* Bottom Toggle Bar */}
                  <div className="flex items-center justify-between border-t border-black/5 pt-3">
                    {field.type !== FieldType.IMAGE ? (
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                          className="w-4 h-4 text-nss-blue rounded focus:ring-nss-blue cursor-pointer"
                        />
                        <span className="text-xs font-bold text-gray-700">Required question</span>
                      </label>
                    ) : (
                      <span className="text-xs font-bold text-gray-500">
                        Information / QR display block
                      </span>
                    )}

                    <span className="text-[11px] text-gray-400 font-mono">
                      ID: {field.id}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Quick Add Palette (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
            <h4 className="text-sm font-black text-gray-900 mb-1 flex items-center gap-2">
              <Plus size={16} className="text-nss-blue" /> Add Elements
            </h4>
            <p className="text-xs text-gray-500 mb-4">Click any question type or element to add to your form:</p>

            <div className="space-y-1.5">
              {fieldTypeOptions.map(opt => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => addField(opt.type)}
                    className="w-full text-left p-2.5 rounded-xl border border-gray-200 hover:border-nss-blue/60 hover:bg-blue-50/30 transition-all flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-blue-100 text-gray-600 group-hover:text-nss-blue flex items-center justify-center shrink-0 transition-colors">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 group-hover:text-nss-blue">{opt.label}</p>
                      <p className="text-[11px] text-gray-400 truncate">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Info Card */}
          <div className="bg-emerald-50/70 border border-emerald-200/70 p-4 rounded-2xl text-xs space-y-1.5 text-emerald-900">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" /> Rich Design Controls
            </p>
            <p className="text-emerald-800/80 leading-relaxed text-[11px]">
              Use the top toolbar on each card to toggle <strong>Bold</strong>, <em>Italic</em>, <u>Underline</u>, pick a custom card background color, add descriptions, or attach QR codes and payment posters.
            </p>
          </div>
        </div>
      </div>

      {/* Live Form Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/70">
              <div>
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Eye size={18} className="text-nss-blue" /> Public Form Preview
                </h3>
                <p className="text-xs text-gray-500">Live preview of your questions, attached QR codes, descriptions, and card colors.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold px-2 py-1 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              <div className="border border-blue-100 bg-blue-50/40 p-3.5 rounded-xl text-xs text-blue-900 flex items-center justify-between">
                <span>Domain requirement: <strong>@vitbhopal.ac.in</strong> email only</span>
                <span className="text-[11px] bg-blue-100 font-bold px-2 py-0.5 rounded-full">1 Response / Email</span>
              </div>

              {fields.map((f, i) => (
                <div 
                  key={f.id} 
                  style={{ backgroundColor: f.bgColor || '#ffffff' }}
                  className="space-y-2 p-5 rounded-2xl border border-gray-200/90 shadow-2xs"
                >
                  <label className="block text-sm text-gray-900">
                    <span className="text-gray-400 font-mono text-xs mr-1">{i + 1}.</span>
                    {renderRichText(f.label, { bold: f.bold, italic: f.italic, underline: f.underline })}
                    {f.required && <span className="text-rose-500 ml-1">*</span>}
                  </label>
                  
                  {f.description && (
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {renderRichText(f.description)}
                    </p>
                  )}

                  {/* Attached Image / QR */}
                  {f.imageUrl && (
                    <div className="p-3 bg-white rounded-xl border border-gray-200 max-w-xs mx-auto text-center my-2">
                      {f.imageTitle && <p className="text-xs font-bold text-gray-800 mb-1">{f.imageTitle}</p>}
                      <img src={f.imageUrl} alt={f.imageTitle || f.label} className="max-h-48 object-contain mx-auto rounded-lg" />
                    </div>
                  )}

                  {[FieldType.SHORT_TEXT, FieldType.EMAIL, FieldType.REG_NUMBER, FieldType.MOBILE].includes(f.type) && (
                    <input
                      disabled
                      placeholder={f.placeholder || ('Enter ' + f.label + '...')}
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg text-gray-400"
                    />
                  )}

                  {f.type === FieldType.LONG_TEXT && (
                    <textarea
                      disabled
                      rows={3}
                      placeholder={f.placeholder || 'Type your detailed answer...'}
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg text-gray-400 resize-none"
                    />
                  )}

                  {f.type === FieldType.RADIO && (
                    <div className="space-y-1.5 pt-1">
                      {(f.options || ['Option 1']).map((opt, oi) => (
                        <label key={oi} className="flex items-center gap-2 text-xs text-gray-700">
                          <input type="radio" disabled name={'preview_' + f.id} className="text-nss-blue" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {f.type === FieldType.CHECKBOX && (
                    <div className="space-y-1.5 pt-1">
                      {(f.options || ['Option 1']).map((opt, oi) => (
                        <label key={oi} className="flex items-center gap-2 text-xs text-gray-700">
                          <input type="checkbox" disabled className="text-nss-blue rounded" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {f.type === FieldType.DROPDOWN && (
                    <select disabled className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg text-gray-400">
                      <option>Select an option...</option>
                      {(f.options || []).map((opt, oi) => (
                        <option key={oi}>{opt}</option>
                      ))}
                    </select>
                  )}

                  {f.type === FieldType.FILE_UPLOAD && (
                    <div className="border border-dashed border-gray-300 rounded-lg p-3 text-center bg-white text-xs text-gray-500">
                      <UploadCloud size={18} className="mx-auto mb-1 text-gray-400" />
                      Attach file ({f.allowedTypes || 'all files'}, max {f.maxSizeInMB || 10}MB)
                    </div>
                  )}

                  {f.type === FieldType.DECLARATION && (
                    <label className="flex items-start gap-2 pt-1 text-xs text-gray-700">
                      <input type="checkbox" disabled className="mt-0.5 text-nss-blue rounded" />
                      <span>{f.placeholder || 'I hereby confirm that all information provided is accurate and adheres to the NSS Code of Conduct.'}</span>
                    </label>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/70 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2 bg-nss-blue text-white font-bold rounded-xl text-xs hover:bg-blue-800 transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
