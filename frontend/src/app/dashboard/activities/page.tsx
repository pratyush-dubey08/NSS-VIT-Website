'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, X } from 'lucide-react';
import DynamicForm from '@/components/DynamicForm';
import { FieldType } from '@/components/admin/FormBuilder';

export default function VolunteerActivities() {
 const [selectedActivity, setSelectedActivity] = useState<any>(null);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [submitSuccess, setSubmitSuccess] = useState(false);

 // Mock data for activities that the volunteer can register for
 const openActivities = [
 {
 id: 'act1',
 title: 'Mega Blood Donation Camp 2026',
 date: '2026-08-15',
 venue: 'Auditorium, VIT Bhopal',
 hours: 5,
 description: 'Join us for the annual mega blood donation drive. Your single donation can save up to 3 lives.',
 },
 {
 id: 'act2',
 title: 'Digital Literacy Awareness Drive',
 date: '2026-07-25',
 venue: 'Sehore Community Hall',
 hours: 4,
 description: 'Teach basic computer and internet skills to senior citizens in the neighboring community.',
 }
 ];

 // Mock Form Schema corresponding to the Activity
 const mockSchema = {
 activityId: 'act1',
 fields: [
 { id: 'f1', type: FieldType.SHORT_TEXT, label: 'Full Name', required: true },
 { id: 'f2', type: FieldType.REG_NUMBER, label: 'Registration Number', required: true },
 { id: 'f3', type: FieldType.DROPDOWN, label: 'Blood Group', required: true, options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
 { id: 'f4', type: FieldType.DECLARATION, label: 'Medical Declaration', required: true, placeholder: 'I declare that I have not consumed alcohol in the last 24 hours and have no major medical conditions.' }
 ]
 };

 const handleRegisterClick = (activity: any) => {
 setSelectedActivity(activity);
 setSubmitSuccess(false);
 };

 const handleSubmitRegistration = async (responses: any) => {
 setIsSubmitting(true);
 // Simulate API call
 setTimeout(() => {
 console.log('Submitted Responses:', responses);
 setIsSubmitting(false);
 setSubmitSuccess(true);
 setTimeout(() => {
 setSelectedActivity(null);
 }, 2000);
 }, 1500);
 };

 return (
 <div className="space-y-6">
 <div className="flex justify-between items-center">
 <h1 className="text-2xl font-bold text-gray-900">Available Activities</h1>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {openActivities.map((activity) => (
 <div key={activity.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
 <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h3>
 <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{activity.description}</p>
 
 <div className="space-y-2 mb-6 bg-gray-50 p-4 rounded-xl">
 <div className="flex items-center text-sm text-gray-600 gap-3">
 <Calendar size={16} className="text-nss-blue"/>
 <span>{new Date(activity.date).toLocaleDateString()}</span>
 </div>
 <div className="flex items-center text-sm text-gray-600 gap-3">
 <MapPin size={16} className="text-nss-red"/>
 <span>{activity.venue}</span>
 </div>
 <div className="flex items-center text-sm text-gray-600 gap-3">
 <Clock size={16} className="text-green-500"/>
 <span>{activity.hours} Hours</span>
 </div>
 </div>

 <button 
 onClick={() => handleRegisterClick(activity)}
 className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-nss-blue :bg-nss-blue hover:text-white transition-colors"
 >
 Register Now
 </button>
 </div>
 ))}
 </div>

 {/* Registration Modal */}
 <AnimatePresence>
 {selectedActivity && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
 >
 <motion.div
 initial={{ scale: 0.95, opacity: 0, y: 20 }}
 animate={{ scale: 1, opacity: 1, y: 0 }}
 exit={{ scale: 0.95, opacity: 0, y: 20 }}
 className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative my-auto"
 >
 <div className="sticky top-0 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex justify-between items-center rounded-t-3xl z-10">
 <div>
 <h2 className="text-xl font-bold text-gray-900">Activity Registration</h2>
 <p className="text-sm text-gray-500">{selectedActivity.title}</p>
 </div>
 <button 
 onClick={() => !isSubmitting && setSelectedActivity(null)}
 className="p-2 bg-gray-100 text-gray-500 hover:text-gray-900 :text-white rounded-full transition-colors"
 disabled={isSubmitting}
 >
 <X size={20} />
 </button>
 </div>

 <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
 {submitSuccess ? (
 <div className="text-center py-12">
 <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
 <svg className="w-10 h-10"fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
 </div>
 <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
 <p className="text-gray-500">Your form has been submitted for approval.</p>
 </div>
 ) : (
 <DynamicForm 
 schema={mockSchema} 
 onSubmit={handleSubmitRegistration} 
 isSubmitting={isSubmitting} 
 />
 )}
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
