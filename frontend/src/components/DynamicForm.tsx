'use client';

import { useState } from 'react';
import { FieldType, IFormField } from './admin/FormBuilder';
import { Check, AlertCircle, UploadCloud, CheckCircle2 } from 'lucide-react';

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

    // 1. Locate email in fields or form data
    let userEmail = '';
    let userFullName = '';
    let userRegNo = '';
    let userPhone = '';

    for (const f of schema.fields) {
      const val = formData[f.id];
      if (typeof val === 'string' && val.trim()) {
        const trimmed = val.trim();
        if (f.type === FieldType.EMAIL || (!userEmail && trimmed.includes('@'))) {
          userEmail = trimmed.toLowerCase();
        }
        if (f.type === FieldType.REG_NUMBER || (!userRegNo && /^[0-9]{2}[A-Za-z]{3}[0-9]{4,5}$/i.test(trimmed))) {
          userRegNo = trimmed.toUpperCase();
        }
        if (f.type === FieldType.SHORT_TEXT && f.label.toLowerCase().includes('name') && !userFullName) {
          userFullName = trimmed;
        }
        if (f.type === FieldType.MOBILE || (f.label.toLowerCase().includes('phone') || f.label.toLowerCase().includes('whatsapp'))) {
          userPhone = trimmed;
        }
      }
    }

    // 2. Strict VIT Bhopal Email Validation
    if (!userEmail) {
      setEmailError('Please enter your official VIT Bhopal email address.');
      return;
    }

    if (!userEmail.endsWith('@vitbhopal.ac.in')) {
      setEmailError('Registration is strictly restricted to @vitbhopal.ac.in email addresses. Please enter your college email.');
      return;
    }

    // 3. Prepare response items
    const responses = Object.keys(formData).map(key => ({
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Notice Banner */}
      <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3">
        <CheckCircle2 size={18} className="text-nss-blue shrink-0 mt-0.5" />
        <div className="text-xs text-blue-950">
          <p className="font-bold">VIT Bhopal University Event Registration</p>
          <p className="text-blue-800/90 mt-0.5 leading-relaxed">
            Please enter your official <strong>@vitbhopal.ac.in</strong> email ID. Only one submission is permitted per student.
          </p>
        </div>
      </div>

      {emailError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-xs font-bold">
          <AlertCircle size={16} className="shrink-0" />
          <span>{emailError}</span>
        </div>
      )}

      {schema.fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <label className="block text-sm font-bold text-gray-800">
            {field.label} {field.required && <span className="text-rose-500">*</span>}
          </label>

          {/* Short Text, Email, Reg Number, Mobile */}
          {[FieldType.SHORT_TEXT, FieldType.EMAIL, FieldType.REG_NUMBER, FieldType.MOBILE].includes(field.type) && (
            <div>
              <input
                type={field.type === FieldType.EMAIL ? 'email' : 'text'}
                required={field.required}
                placeholder={field.placeholder || (field.type === FieldType.EMAIL ? 'e.g. name2024@vitbhopal.ac.in' : '')}
                value={formData[field.id] || ''}
                onChange={(e) => {
                  handleChange(field.id, e.target.value);
                  if (field.type === FieldType.EMAIL && emailError) setEmailError('');
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:ring-2 focus:ring-nss-blue/20 focus:border-nss-blue outline-none transition-all font-medium"
              />
              {field.type === FieldType.EMAIL && (
                <p className="text-[11px] text-gray-400 mt-1">Must end with @vitbhopal.ac.in</p>
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:ring-2 focus:ring-nss-blue/20 focus:border-nss-blue outline-none transition-all resize-y font-medium"
            />
          )}

          {/* Dropdown */}
          {field.type === FieldType.DROPDOWN && (
            <select
              required={field.required}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:ring-2 focus:ring-nss-blue/20 focus:border-nss-blue outline-none transition-all font-medium cursor-pointer"
            >
              <option value="">Select an option...</option>
              {field.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}

          {/* Radio */}
          {field.type === FieldType.RADIO && (
            <div className="space-y-2 pt-1">
              {field.options?.map(opt => (
                <label key={opt} className="flex items-center gap-3 p-3 bg-gray-50/60 hover:bg-gray-100/70 rounded-xl cursor-pointer transition-colors border border-gray-100">
                  <input
                    type="radio"
                    name={'radio_' + field.id}
                    value={opt}
                    required={field.required}
                    checked={formData[field.id] === opt}
                    onChange={() => handleChange(field.id, opt)}
                    className="w-4 h-4 text-nss-blue focus:ring-nss-blue cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-800">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {/* Checkbox */}
          {field.type === FieldType.CHECKBOX && (
            <div className="space-y-2 pt-1">
              {field.options?.map(opt => {
                const isChecked = (formData[field.id] || []).includes(opt);
                return (
                  <label key={opt} className="flex items-center gap-3 p-3 bg-gray-50/60 hover:bg-gray-100/70 rounded-xl cursor-pointer transition-colors border border-gray-100">
                    <input
                      type="checkbox"
                      value={opt}
                      checked={isChecked}
                      onChange={(e) => handleCheckboxChange(field.id, opt, e.target.checked)}
                      className="w-4 h-4 text-nss-blue rounded focus:ring-nss-blue cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-800">{opt}</span>
                  </label>
                );
              })}
            </div>
          )}

          {/* Declaration */}
          {field.type === FieldType.DECLARATION && (
            <div className="p-4 bg-blue-50/60 border border-blue-200/60 rounded-xl">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required={field.required}
                  checked={!!formData[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.checked)}
                  className="w-4 h-4 text-nss-blue mt-0.5 rounded focus:ring-nss-blue cursor-pointer"
                />
                <span className="text-xs text-gray-700 leading-relaxed font-medium">
                  {field.placeholder || "I hereby declare that all details filled above are accurate and I agree to the NSS Unit VIT Bhopal event guidelines."}
                </span>
              </label>
            </div>
          )}

          {/* File Upload */}
          {field.type === FieldType.FILE_UPLOAD && (
            <div className="space-y-2">
              <input
                type="file"
                required={field.required && !formData[field.id]}
                accept={field.allowedTypes}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const maxMB = field.maxSizeInMB || 10;
                  if (file.size > maxMB * 1024 * 1024) {
                    alert('File exceeds the maximum allowed size of ' + maxMB + 'MB.');
                    e.target.value = '';
                    return;
                  }

                  try {
                    setUploadingField(field.id);
                    const fd = new FormData();
                    fd.append('file', file);

                    const { default: api } = await import('@/lib/axios');
                    const res = await api.post('/upload', fd, {
                      headers: { 'Content-Type': 'multipart/form-data' }
                    });

                    handleChange(field.id, res.data.url);
                  } catch (error) {
                    console.error('File upload failed:', error);
                    alert('Failed to upload file. Please try again.');
                  } finally {
                    setUploadingField(null);
                  }
                }}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-xs focus:ring-2 focus:ring-nss-blue outline-none transition-shadow file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-nss-blue hover:file:bg-blue-100 cursor-pointer"
              />
              {uploadingField === field.id && (
                <p className="text-xs text-blue-600 font-bold animate-pulse">Uploading file to secure cloud...</p>
              )}
              {formData[field.id] && (
                <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  ✓ File uploaded successfully
                </p>
              )}
            </div>
          )}
        </div>
      ))}

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
