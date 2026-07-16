'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 ArrowLeft, Search, CheckCircle, XCircle, Clock, FileDown, 
 CheckSquare, Square, Eye, Image as ImageIcon, UploadCloud, Link as LinkIcon 
} from 'lucide-react';

export default function ActivityManagementPage({ params }: { params: { id: string } }) {
 const [activeTab, setActiveTab] = useState<'REGISTRATIONS' | 'POST_EVENT'>('REGISTRATIONS');
 
 // Registration State
 const [filter, setFilter] = useState('All');
 const [viewResponse, setViewResponse] = useState<any>(null);

 // Post-Event State
 const [certificateLink, setCertificateLink] = useState('');
 const [driveLinkSaved, setDriveLinkSaved] = useState(false);

 // Mock Registrations
 const [registrations, setRegistrations] = useState([
 {
 id: 'reg1',
 volunteer: { name: 'Rishabh Doe', regNo: '21BCE10101', dept: 'SCOPE' },
 status: 'APPROVED',
 attended: true,
 responses: [
 { field: 'Blood Group', value: 'B+' },
 { field: 'Medical Declaration', value: true }
 ]
 },
 {
 id: 'reg2',
 volunteer: { name: 'Alice Smith', regNo: '22BCE10234', dept: 'SENSE' },
 status: 'PENDING',
 attended: false,
 responses: [
 { field: 'Blood Group', value: 'O+' },
 { field: 'Medical Declaration', value: true }
 ]
 },
 {
 id: 'reg3',
 volunteer: { name: 'Bob Johnson', regNo: '20BCE10999', dept: 'SMEC' },
 status: 'REJECTED',
 attended: false,
 responses: [
 { field: 'Blood Group', value: 'A-' },
 { field: 'Medical Declaration', value: false }
 ]
 }
 ]);

 const handleUpdateStatus = (id: string, newStatus: string) => {
 setRegistrations(registrations.map(r => r.id === id ? { ...r, status: newStatus } : r));
 };

 const handleToggleAttendance = (id: string, current: boolean) => {
 setRegistrations(registrations.map(r => r.id === id ? { ...r, attended: !current } : r));
 };

 const handleExportCSV = () => {
 // Basic CSV Export logic mock
 const headers = ['Name', 'Registration Number', 'Status', 'Attended', 'Blood Group', 'Medical Declaration'];
 const csvContent = [
 headers.join(','),
 ...registrations.map(r => [
 r.volunteer.name,
 r.volunteer.regNo,
 r.status,
 r.attended ? 'Yes' : 'No',
 r.responses[0].value,
 r.responses[1].value
 ].join(','))
 ].join('\n');
 
 console.log("Exporting CSV:\n", csvContent);
 alert("CSV Download started! (Check console for mock output)");
 };

 const filteredRegs = filter === 'All' ? registrations : registrations.filter(r => r.status === filter);

 return (
 <div className="space-y-6 max-w-7xl mx-auto">
 
 {/* Header */}
 <div className="flex items-center gap-4 mb-8">
 <Link href="/admin/activities"className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 :bg-gray-700 transition-colors">
 <ArrowLeft size={20} />
 </Link>
 <div>
 <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
 Manage Event
 <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">5 Hours</span>
 </h1>
 <p className="text-sm text-gray-500">Mega Blood Donation Camp 2026</p>
 </div>
 </div>

 {/* Tabs */}
 <div className="flex border-b border-gray-200">
 <button
 onClick={() => setActiveTab('REGISTRATIONS')}
 className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${
 activeTab === 'REGISTRATIONS' 
 ? 'border-nss-blue text-nss-blue' 
 : 'border-transparent text-gray-500 hover:text-gray-900 :text-white'
 }`}
 >
 Registrations & Attendance
 </button>
 <button
 onClick={() => setActiveTab('POST_EVENT')}
 className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${
 activeTab === 'POST_EVENT' 
 ? 'border-nss-blue text-nss-blue' 
 : 'border-transparent text-gray-500 hover:text-gray-900 :text-white'
 }`}
 >
 Post-Event Updates
 </button>
 </div>

 {/* Tab Content: REGISTRATIONS */}
 {activeTab === 'REGISTRATIONS' && (
 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
 <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
 <div className="relative w-full md:w-80">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"size={18} />
 <input 
 type="text"
 placeholder="Search name or reg no..."
 className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-blue outline-none transition-shadow text-sm"
 />
 </div>

 <div className="flex items-center justify-between md:justify-end flex-1 gap-4">
 <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
 {['All', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
 <button
 key={status}
 onClick={() => setFilter(status)}
 className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
 filter === status 
 ? 'bg-white shadow-sm text-gray-900 ' 
 : 'text-gray-500 hover:text-gray-900'
 }`}
 >
 {status}
 </button>
 ))}
 </div>
 
 <button 
 onClick={handleExportCSV}
 className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 font-bold rounded-lg hover:bg-green-100 transition-colors text-sm"
 >
 <FileDown size={16} /> Export CSV
 </button>
 </div>
 </div>

 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
 <th className="p-4 pl-6">Volunteer</th>
 <th className="p-4">Reg No & Dept</th>
 <th className="p-4 text-center">Status</th>
 <th className="p-4 text-center">Mark Attendance</th>
 <th className="p-4 text-right pr-6">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100">
 {filteredRegs.map((reg) => (
 <tr key={reg.id} className="hover:bg-gray-50 :bg-gray-800/50 transition-colors group">
 <td className="p-4 pl-6">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full bg-nss-red text-white flex items-center justify-center font-bold text-xs shrink-0">
 {reg.volunteer.name.charAt(0)}
 </div>
 <span className="font-bold text-gray-900">{reg.volunteer.name}</span>
 </div>
 </td>
 <td className="p-4">
 <div className="text-sm font-medium text-gray-900">{reg.volunteer.regNo}</div>
 <div className="text-xs text-gray-500">{reg.volunteer.dept}</div>
 </td>
 <td className="p-4 text-center">
 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
 reg.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
 reg.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
 'bg-yellow-100 text-yellow-700'
 }`}>
 {reg.status === 'APPROVED' && <CheckCircle size={12} />}
 {reg.status === 'REJECTED' && <XCircle size={12} />}
 {reg.status === 'PENDING' && <Clock size={12} />}
 {reg.status}
 </span>
 </td>
 <td className="p-4 text-center">
 <button 
 onClick={() => handleToggleAttendance(reg.id, reg.attended)}
 disabled={reg.status !== 'APPROVED'}
 className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors ${
 reg.status !== 'APPROVED' ? 'opacity-30 cursor-not-allowed text-gray-400' :
 reg.attended ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-400 bg-gray-100 hover:bg-gray-200 :bg-gray-600'
 }`}
 title={reg.status !== 'APPROVED' ? 'Approve registration to mark attendance' : 'Toggle Attendance'}
 >
 {reg.attended ? <CheckSquare size={20} /> : <Square size={20} />}
 </button>
 </td>
 <td className="p-4 pr-6 text-right">
 <div className="flex items-center justify-end gap-2">
 <button 
 onClick={() => setViewResponse(reg)}
 className="p-1.5 text-gray-500 hover:text-nss-blue bg-gray-50 rounded transition-colors"
 title="View Form Responses"
 >
 <Eye size={16} />
 </button>
 {reg.status === 'PENDING' && (
 <>
 <button 
 onClick={() => handleUpdateStatus(reg.id, 'APPROVED')}
 className="px-3 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded text-xs font-bold transition-colors"
 >
 Approve
 </button>
 <button 
 onClick={() => handleUpdateStatus(reg.id, 'REJECTED')}
 className="px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded text-xs font-bold transition-colors"
 >
 Reject
 </button>
 </>
 )}
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </motion.div>
 )}

 {/* Tab Content: POST EVENT */}
 {activeTab === 'POST_EVENT' && (
 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
 
 {/* Certificate Drive Link */}
 <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
 <div className="w-12 h-12 bg-blue-50 text-nss-blue rounded-xl flex items-center justify-center mb-6">
 <LinkIcon size={24} />
 </div>
 <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Certificates</h2>
 <p className="text-gray-500 text-sm mb-6">
 Paste the Google Drive link containing all the certificates for this event. 
 Once saved, it will be visible on the dashboards of all volunteers whose attendance is marked.
 </p>

 <div className="space-y-4">
 <div>
 <label className="block text-sm font-semibold text-gray-700 mb-2">Drive Folder URL</label>
 <input 
 type="url"
 placeholder="https://drive.google.com/drive/folders/..."
 value={certificateLink}
 onChange={(e) => {
 setCertificateLink(e.target.value);
 setDriveLinkSaved(false);
 }}
 className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-blue outline-none transition-shadow"
 />
 </div>
 <button 
 onClick={() => setDriveLinkSaved(true)}
 disabled={!certificateLink || driveLinkSaved}
 className="w-full py-3 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
 >
 {driveLinkSaved ? <><CheckCircle size={18} /> Link Saved</> : 'Save Drive Link'}
 </button>
 </div>
 </div>

 {/* Event Photos Upload */}
 <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
 <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
 <ImageIcon size={24} />
 </div>
 <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Event Photos</h2>
 <p className="text-gray-500 text-sm mb-6">
 Upload photos to automatically showcase them in the public gallery under this event's category.
 </p>

 <div className="flex-1 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-8 bg-gray-50 hover:bg-gray-100 :bg-gray-800 transition-colors cursor-pointer group">
 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-400 group-hover:text-nss-blue shadow-sm mb-4 transition-colors">
 <UploadCloud size={28} />
 </div>
 <p className="font-bold text-gray-700">Click to upload photos</p>
 <p className="text-xs text-gray-500 mt-2">JPG, PNG (Max 5MB per image)</p>
 </div>
 </div>

 </motion.div>
 )}

 {/* View Responses Modal */}
 <AnimatePresence>
 {viewResponse && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
 >
 <motion.div
 initial={{ scale: 0.95, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.95, opacity: 0 }}
 className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
 >
 <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
 <h2 className="font-bold text-gray-900 flex items-center gap-2">
 Form Responses
 </h2>
 <button 
 onClick={() => setViewResponse(null)}
 className="p-1 hover:bg-gray-200 :bg-gray-700 rounded-full transition-colors"
 >
 <XCircle size={20} className="text-gray-500"/>
 </button>
 </div>
 <div className="p-6">
 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
 <div className="w-12 h-12 rounded-full bg-nss-red text-white flex items-center justify-center font-bold text-lg shrink-0">
 {viewResponse.volunteer.name.charAt(0)}
 </div>
 <div>
 <h3 className="font-bold text-gray-900">{viewResponse.volunteer.name}</h3>
 <p className="text-sm text-gray-500">{viewResponse.volunteer.regNo}</p>
 </div>
 </div>

 <div className="space-y-4">
 {viewResponse.responses.map((resp: any, idx: number) => (
 <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
 <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{resp.field}</p>
 <p className="font-medium text-gray-900">
 {typeof resp.value === 'boolean' 
 ? (resp.value ? '✅ Yes / Agreed' : '❌ No / Disagreed') 
 : String(resp.value)}
 </p>
 </div>
 ))}
 </div>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>

 </div>
 );
}
