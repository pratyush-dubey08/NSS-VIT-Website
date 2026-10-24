'use client';

import { useState } from 'react';
import { FieldType, IFormField, renderRichText } from './admin/FormBuilder';
import { Check, AlertCircle, UploadCloud, CheckCircle2, QrCode } from 'lucide-react';

interface DynamicFormProps {
  schema: { fields: IFormField[]; activityId: string };
  onSubmit: (data: {
    responses: { fieldId: string; value: any }[];
    email: string;
    fullName: string;
    registrationNumber: string;
    phoneNumber: string;
  }) => void;
  isSubmitting?: boolean;
}

export default function DynamicForm({ schema, onSubmit, isSubmitting }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [emailError, setEmailError] = useState<string>('');
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxChange = (fieldId: string, option: string, checked: boolean) => {
    setFormData(prev => {
      const current = prev[fieldId] || [];
      if (checked) {
        return { ...prev, [fieldId]: [...current, option] };
      } else {
        return { ...prev, [fieldId]: current.filter((o: string) => o !== option) };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    // 1. Locate email, full name, reg no, phone across all fields
    let userEmail = '';
    let userFullName = '';
    let userRegNo = '';
    let userPhone = '';

    for (const f of schema.fields) {
      const val = formData[f.id];
      if (typeof val === 'string' && val.trim()) {
        const trimmed = val.trim();
        const lbl = f.label.toLowerCase();

        if (f.type === FieldType.EMAIL || lbl.includes('email') || (!userEmail && trimmed.includes('@'))) {
          if (!userEmail) userEmail = trimmed.toLowerCase();
        }
        if (f.type === FieldType.REG_NUMBER || lbl.includes('reg') || (!userRegNo && /^[0-9]{2}[A-Za-z]{3}[0-9]{4,5}$/i.test(trimmed))) {
          if (!userRegNo) userRegNo = trimmed.toUpperCase();
        }
        if (f.type === FieldType.SHORT_TEXT && (lbl.includes('name') || lbl.includes('full name')) && !userFullName) {
          userFullName = trimmed;
        }
        if (f.type === FieldType.MOBILE || lbl.includes('phone') || lbl.includes('whatsapp') || lbl.includes('mobile')) {
          if (!userPhone) userPhone = trimmed;
        }
      }
    }

    // 2. Strict VIT Bhopal Email Validation
    if (!userEmail) {
      setEmailError('Please enter your official VIT Bhopal email address (@vitbhopal.ac.in).');
      return;
    }

    if (!userEmail.endsWith('@vitbhopal.ac.in') || userEmail === '@vitbhopal.ac.in') {
      setEmailError('Registration is strictly restricted to @vitbhopal.ac.in email addresses. Personal emails (e.g. gmail.com) are not accepted.');
      return;
    }

    // 3. Prepare response items (exclude pure IMAGE display blocks)
    const responses = Object.keys(formData)
      .filter(key => {
        const f = schema.fields.find(field => field.id === key);
        return f?.type !== FieldType.IMAGE;
      })
      .map(key => ({
        fieldId: key,
        value: formData[key]
      }));

    onSubmit({
      responses,
      email: userEmail,
      fullName: userFullName,
      registrationNumber: userRegNo,
      phoneNumber: userPhone
    });
  };

  const handleFileUpload = async (fieldId: string, file: File) => {
    try {
      setUploadingField(fieldId);
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (data.url) {
        handleChange(fieldId, data.url);
      } else {
        alert('File upload failed. Please try again.');
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploadingField(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Error Banner (Shows only on error) */}
      {emailError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-bold shadow-xs">
          <AlertCircle size={18} className="shrink-0 text-rose-600" />
          <span>{emailError}</span>
        </div>
      )}

      {schema.fields.map((field) => {
        const cardBg = field.bgColor || '#ffffff';

        // 1. Pure Image / QR Code Display Block
        if (field.type === FieldType.IMAGE) {
          return (
            <div 
              key={field.id}
              style={{ backgroundColor: cardBg }}
              className="p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3"
            >
              <h3 className="text-base text-gray-900 font-bold">
                {renderRichText(field.label, { bold: field.bold ?? true, italic: field.italic, underline: field.underline })}
              </h3>

              {field.description && (
                <p className="text-xs text-gray-600 leading-relaxed">
                  {renderRichText(field.description)}
                </p>
              )}

              {field.imageUrl && (
                <div className="p-3 bg-white rounded-2xl border border-gray-200/90 max-w-sm mx-auto shadow-xs text-center my-3">
                  {field.imageTitle && (
                    <p className="text-xs font-bold text-gray-800 mb-2">{field.imageTitle}</p>
                  )}
                  <img 
                    src={field.imageUrl} 
                    alt={field.imageTitle || field.label} 
                    className="max-h-64 object-contain mx-auto rounded-xl shadow-2xs"
                  />
                </div>
              )}
            </div>
          );
        }

        // 2. Standard Input Questions
        const isEmailField = field.type === FieldType.EMAIL || field.label.toLowerCase().includes('email');
        const currentVal = typeof formData[field.id] === 'string' ? formData[field.id].trim() : '';
        const isInvalidVitEmail = isEmailField && currentVal && (!currentVal.toLowerCase().endsWith('@vitbhopal.ac.in') || currentVal === '@vitbhopal.ac.in');

        return (
          <div 
            key={field.id}
            style={{ backgroundColor: cardBg }}
            className="p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2.5 transition-colors"
          >
            <label className="block text-sm text-gray-900 leading-snug">
              {renderRichText(field.label, { bold: field.bold ?? true, italic: field.italic, underline: field.underline })}
              {field.required && <span className="text-rose-500 ml-1 font-bold">*</span>}
            </label>

            {field.description && (
              <p className="text-xs text-gray-500 leading-relaxed pb-1">
                {renderRichText(field.description)}
              </p>
            )}

            {/* Short Text, Email, Reg Number, Mobile */}
            {[FieldType.SHORT_TEXT, FieldType.EMAIL, FieldType.REG_NUMBER, FieldType.MOBILE].includes(field.type) && (
              <div>
                <input
                  type={isEmailField ? 'email' : 'text'}
                  required={field.required}
                  placeholder={field.placeholder || (isEmailField ? 'e.g. student2024@vitbhopal.ac.in' : '')}
                  value={formData[field.id] || ''}
                  onChange={(e) => {
                    handleChange(field.id, e.target.value);
                    if (isEmailField && emailError) setEmailError('');
                  }}
                  className={'w-full px-4 py-3 rounded-xl border text-gray-900 text-sm outline-none transition-all font-medium shadow-2xs ' + (
                    isInvalidVitEmail 
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 bg-rose-50/20' 
                      : 'border-gray-200 focus:border-nss-blue focus:ring-2 focus:ring-nss-blue/20 bg-white'
                  )}
                />
                {isEmailField && (
                  isInvalidVitEmail ? (
                    <p className="text-[11px] text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                      <AlertCircle size={13} className="shrink-0 text-rose-600" />
                      Only official VIT Bhopal University emails (@vitbhopal.ac.in) are accepted.
                    </p>
                  ) : (
                    <p className="text-[11px] text-gray-400 mt-1">Official @vitbhopal.ac.in email required</p>
                  )
                )}
              </div>
            )}

            {/* Long Text */}
            {field.type === FieldType.LONG_TEXT && (
              <textarea
                required={field.required}
                placeholder={field.placeholder}
                rows={4}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-nss-blue/20 focus:border-nss-blue outline-none transition-all font-medium shadow-2xs"
              />
            )}

            {/* Radio / Multiple Choice */}
            {field.type === FieldType.RADIO && field.options && (
              <div className="space-y-2 pt-1">
                {field.options.map((opt, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-black/5 cursor-pointer transition-all">
                    <input
                      type="radio"
                      name={field.id}
                      required={field.required}
                      value={opt}
                      checked={formData[field.id] === opt}
                      onChange={() => handleChange(field.id, opt)}
                      className="w-4 h-4 text-nss-blue focus:ring-nss-blue"
                    />
                    <span className="text-sm font-medium text-gray-800">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Checkboxes */}
            {field.type === FieldType.CHECKBOX && field.options && (
              <div className="space-y-2 pt-1">
                {field.options.map((opt, i) => {
                  const currentVals = formData[field.id] || [];
                  const isChecked = currentVals.includes(opt);
                  return (
                    <label key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-black/5 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        value={opt}
                        checked={isChecked}
                        onChange={(e) => handleCheckboxChange(field.id, opt, e.target.checked)}
                        className="w-4 h-4 text-nss-blue rounded-md focus:ring-nss-blue"
                      />
                      <span className="text-sm font-medium text-gray-800">{opt}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Dropdown */}
            {field.type === FieldType.DROPDOWN && field.options && (
              <select
                required={field.required}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-nss-blue/20 focus:border-nss-blue outline-none transition-all font-medium shadow-2xs"
              >
                <option value="">-- Select an option --</option>
                {field.options.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            {/* File Upload */}
            {field.type === FieldType.FILE_UPLOAD && (
              <div className="space-y-2 pt-1">
                {formData[field.id] ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-800 flex items-center gap-1.5 truncate">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      File uploaded successfully
                    </span>
                    <button
                      type="button"
                      onClick={() => handleChange(field.id, undefined)}
                      className="text-rose-600 font-bold hover:underline shrink-0 ml-2"
                    >
                      Change File
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-200 hover:border-nss-blue rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/60 hover:bg-blue-50/20">
                    <UploadCloud size={24} className="text-nss-blue mb-1" />
                    <span className="text-xs font-bold text-gray-700">
                      {uploadingField === field.id ? 'Uploading file...' : 'Click to select and upload document / image'}
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5">Images, PDF, or Docs up to 10MB</span>
                    <input
                      type="file"
                      required={field.required}
                      disabled={uploadingField === field.id}
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileUpload(field.id, e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            )}

            {/* Declaration Checkbox */}
            {field.type === FieldType.DECLARATION && (
              <div className="pt-2">
                <label className="flex items-start gap-3 p-3.5 bg-gray-50/80 border border-gray-200 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    required={field.required}
                    checked={formData[field.id] === true}
                    onChange={(e) => handleChange(field.id, e.target.checked)}
                    className="w-4 h-4 text-nss-blue rounded-md focus:ring-nss-blue mt-0.5"
                  />
                  <span className="text-xs text-gray-700 font-medium leading-relaxed">
                    I confirm that the details provided above are authentic and complete. I agree to abide by the event guidelines and attendance requirements set by NSS Unit VIT Bhopal.
                  </span>
                </label>
              </div>
            )}
          </div>
        );
      })}

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !!uploadingField}
          className="w-full sm:w-auto px-8 py-3.5 bg-nss-blue hover:bg-blue-800 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 text-sm cursor-pointer"
        >
          {isSubmitting ? (
            'Submitting Response...'
          ) : (
            <>
              Submit Registration <Check size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
