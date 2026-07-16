'use client';

import { useState } from 'react';
import { FieldType, IFormField } from './admin/FormBuilder';
import { Check } from 'lucide-react';

interface DynamicFormProps {
 schema: { fields: IFormField[], activityId: string };
 onSubmit: (responses: { fieldId: string; value: any }[]) => void;
 isSubmitting?: boolean;
}

export default function DynamicForm({ schema, onSubmit, isSubmitting }: DynamicFormProps) {
 const [formData, setFormData] = useState<Record<string, any>>({});

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
 const responses = Object.keys(formData).map(key => ({
 fieldId: key,
 value: formData[key]
 }));
 onSubmit(responses);
 };

 return (
 <form onSubmit={handleSubmit} className="space-y-6">
 {schema.fields.map(field => (
 <div key={field.id} className="space-y-2">
 <label className="block text-sm font-semibold text-gray-900">
 {field.label} {field.required && <span className="text-red-500">*</span>}
 </label>

 {(field.type === FieldType.SHORT_TEXT || field.type === FieldType.REG_NUMBER || field.type === FieldType.EMAIL || field.type === FieldType.MOBILE || field.type === FieldType.DEPARTMENT || field.type === FieldType.YEAR) && (
 <input
 type={field.type === FieldType.EMAIL ? 'email' : 'text'}
 required={field.required}
 placeholder={field.placeholder}
 onChange={(e) => handleChange(field.id, e.target.value)}
 className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-nss-blue outline-none transition-shadow"
 />
 )}

 {field.type === FieldType.LONG_TEXT && (
 <textarea
 required={field.required}
 placeholder={field.placeholder}
 rows={4}
 onChange={(e) => handleChange(field.id, e.target.value)}
 className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-nss-blue outline-none transition-shadow resize-y"
 />
 )}

 {field.type === FieldType.DROPDOWN && (
 <select
 required={field.required}
 onChange={(e) => handleChange(field.id, e.target.value)}
 className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-nss-blue outline-none transition-shadow"
 >
 <option value="">Select an option...</option>
 {field.options?.map(opt => (
 <option key={opt} value={opt}>{opt}</option>
 ))}
 </select>
 )}

 {field.type === FieldType.RADIO && (
 <div className="space-y-2">
 {field.options?.map(opt => (
 <label key={opt} className="flex items-center gap-3 cursor-pointer">
 <input
 type="radio"
 name={field.id}
 value={opt}
 required={field.required}
 onChange={(e) => handleChange(field.id, e.target.value)}
 className="w-4 h-4 text-nss-blue focus:ring-nss-blue"
 />
 <span className="text-gray-700">{opt}</span>
 </label>
 ))}
 </div>
 )}

 {field.type === FieldType.CHECKBOX && (
 <div className="space-y-2">
 {field.options?.map(opt => (
 <label key={opt} className="flex items-center gap-3 cursor-pointer">
 <input
 type="checkbox"
 value={opt}
 onChange={(e) => handleCheckboxChange(field.id, opt, e.target.checked)}
 className="w-4 h-4 text-nss-blue focus:ring-nss-blue rounded"
 />
 <span className="text-gray-700">{opt}</span>
 </label>
 ))}
 </div>
 )}

 {field.type === FieldType.DATE && (
 <input
 type="date"
 required={field.required}
 onChange={(e) => handleChange(field.id, e.target.value)}
 className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-nss-blue outline-none transition-shadow"
 />
 )}

 {field.type === FieldType.DECLARATION && (
 <div className="p-4 bg-blue-50 border border-nss-blue/20 rounded-xl">
 <label className="flex items-start gap-3 cursor-pointer">
 <input
 type="checkbox"
 required={field.required}
 onChange={(e) => handleChange(field.id, e.target.checked)}
 className="w-5 h-5 text-nss-blue mt-0.5 rounded"
 />
 <span className="text-sm text-gray-700 leading-relaxed">
 {field.placeholder ||"I hereby declare that the information provided is true and correct."}
 </span>
 </label>
 </div>
 )}

 {field.type === FieldType.FILE_UPLOAD && (
  <div className="space-y-2">
    <input
      type="file"
      required={field.required}
      accept={field.allowedTypes}
      onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        // Enforce max size if set
        const maxMB = field.maxSizeInMB || 10;
        if (file.size > maxMB * 1024 * 1024) {
          alert(`File exceeds the maximum allowed size of ${maxMB}MB.`);
          e.target.value = ''; // Reset input
          return;
        }

        try {
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
        }
      }}
      className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-nss-blue outline-none transition-shadow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-nss-blue hover:file:bg-blue-100"
    />
    {formData[field.id] && (
      <p className="text-xs text-green-600 font-bold mt-1">✓ File uploaded successfully</p>
    )}
  </div>
 )}

 </div>
 ))}

 <div className="pt-6 border-t border-gray-200">
 <button
 type="submit"
 disabled={isSubmitting}
 className="w-full md:w-auto px-8 py-3 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
 >
 {isSubmitting ? (
 'Submitting...'
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
