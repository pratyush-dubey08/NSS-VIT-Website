'use client';

import { useState } from 'react';
import { Reorder, motion } from 'framer-motion';
import { GripVertical, Plus, Trash2, Settings } from 'lucide-react';

export enum FieldType {
 SHORT_TEXT = 'SHORT_TEXT',
 LONG_TEXT = 'LONG_TEXT',
 EMAIL = 'EMAIL',
 MOBILE = 'MOBILE',
 REG_NUMBER = 'REG_NUMBER',
 DEPARTMENT = 'DEPARTMENT',
 YEAR = 'YEAR',
 DROPDOWN = 'DROPDOWN',
 RADIO = 'RADIO',
 CHECKBOX = 'CHECKBOX',
 DATE = 'DATE',
 FILE_UPLOAD = 'FILE_UPLOAD',
 DECLARATION = 'DECLARATION'
}

export interface IFormField {
 id: string;
 type: FieldType;
 label: string;
 required: boolean;
 options?: string[];
 placeholder?: string;
 allowedTypes?: string;
 maxSizeInMB?: number;
}

export default function FormBuilder({ initialFields = [], onSave }: { initialFields?: IFormField[], onSave: (fields: IFormField[]) => void }) {
 const [fields, setFields] = useState<IFormField[]>(initialFields);
 const [activeField, setActiveField] = useState<string | null>(null);

 const addField = (type: FieldType) => {
 const newField: IFormField = {
 id: Math.random().toString(36).substr(2, 9),
 type,
 label: `New ${type.replace('_', ' ')}`,
 required: false,
 options: type === FieldType.DROPDOWN || type === FieldType.RADIO || type === FieldType.CHECKBOX ? ['Option 1'] : undefined
 };
 setFields([...fields, newField]);
 setActiveField(newField.id);
 };

 const updateField = (id: string, updates: Partial<IFormField>) => {
 setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
 };

 const removeField = (id: string) => {
 setFields(fields.filter(f => f.id !== id));
 if (activeField === id) setActiveField(null);
 };

 return (
 <div className="flex flex-col lg:flex-row gap-8 bg-gray-50 min-h-screen p-8 rounded-3xl">
 
 {/* Sidebar: Available Fields */}
 <div className="w-full lg:w-1/4 space-y-4">
 <h3 className="font-bold text-gray-900 text-lg">Add Elements</h3>
 <div className="grid grid-cols-2 gap-2">
 {Object.values(FieldType).map(type => (
 <button
 key={type}
 onClick={() => addField(type)}
 className="p-3 bg-white border border-gray-200 rounded-xl hover:border-nss-blue transition-colors text-xs font-semibold text-gray-700 flex items-center justify-center gap-2"
 >
 <Plus size={14} />
 {type.replace('_', ' ')}
 </button>
 ))}
 </div>
 
 <button 
 onClick={() => onSave(fields)}
 className="w-full mt-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
 >
 Save Form Schema
 </button>
 </div>

 {/* Main Canvas: Form Preview */}
 <div className="w-full lg:w-2/4">
 <h3 className="font-bold text-gray-900 text-lg mb-4">Form Canvas (Drag to Reorder)</h3>
 
 {fields.length === 0 ? (
 <div className="h-64 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400">
 Click elements on the left to add them here
 </div>
 ) : (
 <Reorder.Group axis="y"values={fields} onReorder={setFields} className="space-y-4">
 {fields.map((field) => (
 <Reorder.Item key={field.id} value={field} className="relative">
 <div 
 onClick={() => setActiveField(field.id)}
 className={`p-4 bg-white rounded-2xl border-2 transition-all cursor-pointer flex gap-4 ${activeField === field.id ? 'border-nss-blue shadow-lg' : 'border-gray-100 hover:border-gray-300'}`}
 >
 <div className="text-gray-400 cursor-grab flex items-center pt-2">
 <GripVertical size={20} />
 </div>
 <div className="flex-1">
 <div className="flex justify-between items-start mb-2">
 <span className="font-semibold text-gray-900">
 {field.label} {field.required && <span className="text-red-500">*</span>}
 </span>
 <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">
 {field.type}
 </span>
 </div>
 {/* Visual Preview */}
 <input disabled placeholder={field.placeholder || '...'} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400"/>
 </div>
 </div>
 </Reorder.Item>
 ))}
 </Reorder.Group>
 )}
 </div>

 {/* Properties Panel */}
 <div className="w-full lg:w-1/4">
 <h3 className="font-bold text-gray-900 text-lg mb-4">Properties</h3>
 {activeField ? (
 <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
 {fields.map(f => f.id === activeField && (
 <div key={f.id} className="space-y-4">
 <div>
 <label className="block text-sm text-gray-500 mb-1">Field Label</label>
 <input 
 type="text"
 value={f.label} 
 onChange={e => updateField(f.id, { label: e.target.value })}
 className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-nss-blue text-gray-900"
 />
 </div>
 
 <div>
 <label className="flex items-center gap-2 cursor-pointer">
 <input 
 type="checkbox"
 checked={f.required} 
 onChange={e => updateField(f.id, { required: e.target.checked })}
 className="w-4 h-4 text-nss-blue"
 />
 <span className="text-sm text-gray-700">Required Field</span>
 </label>
 </div>

 {(f.type === FieldType.SHORT_TEXT || f.type === FieldType.LONG_TEXT) && (
 <div>
 <label className="block text-sm text-gray-500 mb-1">Placeholder text</label>
 <input 
 type="text"
 value={f.placeholder || ''} 
 onChange={e => updateField(f.id, { placeholder: e.target.value })}
 className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-nss-blue text-gray-900"
 />
 </div>
 )}

 {(f.type === FieldType.DROPDOWN || f.type === FieldType.RADIO || f.type === FieldType.CHECKBOX) && (
 <div>
 <label className="block text-sm text-gray-500 mb-1">Options (Comma separated)</label>
 <textarea 
 value={f.options?.join(', ') || ''} 
 onChange={e => updateField(f.id, { options: e.target.value.split(',').map(o => o.trim()) })}
 className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-nss-blue text-gray-900 text-sm"
 rows={3}
 />
 </div>
 )}

 {f.type === FieldType.FILE_UPLOAD && (
  <div className="space-y-4">
    <div>
      <label className="block text-sm text-gray-500 mb-1">Allowed File Types (e.g., .pdf, .jpg, .png)</label>
      <input 
        type="text"
        value={f.allowedTypes || ''} 
        onChange={e => updateField(f.id, { allowedTypes: e.target.value })}
        placeholder=".pdf, image/*, video/*"
        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-nss-blue text-gray-900"
      />
    </div>
    <div>
      <label className="block text-sm text-gray-500 mb-1">Max Size (in MB)</label>
      <input 
        type="number"
        min={1}
        max={100}
        value={f.maxSizeInMB || 10} 
        onChange={e => updateField(f.id, { maxSizeInMB: parseInt(e.target.value) || 10 })}
        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-nss-blue text-gray-900"
      />
    </div>
  </div>
 )}

 <button 
 onClick={() => removeField(f.id)}
 className="w-full py-2 mt-4 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 :bg-red-900/20 rounded-lg transition-colors"
 >
 <Trash2 size={16} /> Delete Field
 </button>
 </div>
 ))}
 </div>
 ) : (
 <div className="text-gray-400 text-sm text-center py-8 bg-white rounded-2xl border border-gray-100 border-dashed">
 Select a field to edit its properties
 </div>
 )}
 </div>
 </div>
 );
}
