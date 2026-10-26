'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  FileText,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import { getActivityFallbackBanner } from '@/lib/utils';
import DynamicForm from '@/components/DynamicForm';
import { FieldType } from '@/components/admin/FormBuilder';
import { MessageCircle, Video } from 'lucide-react';

export default function ActivityDetailsPage() {
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmationMsg, setConfirmationMsg] = useState<string>('');
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!params?.id) return;
      try {
        const { data } = await api.get('/activities/' + params.id);
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [params?.id]);

  const defaultFormSchema = {
    activityId: params?.id as string,
    fields: [
      { id: 'f1', type: FieldType.SHORT_TEXT, label: 'Full Name', required: true, placeholder: 'Enter your full name' },
      { id: 'f2', type: FieldType.EMAIL, label: 'Official VIT Email (@vitbhopal.ac.in)', required: true, placeholder: 'name@vitbhopal.ac.in' },
      { id: 'f3', type: FieldType.REG_NUMBER, label: 'Registration Number', required: true, placeholder: 'e.g. 24BCY10001' },
      { id: 'f4', type: FieldType.MOBILE, label: 'WhatsApp / Mobile Number', required: true, placeholder: '10-digit mobile number' },
      { id: 'f5', type: FieldType.RADIO, label: 'Are you an active NSS Volunteer?', required: true, options: ['Yes, Active Volunteer', 'No, General Student'] }
    ]
  };

  const handleRegistrationSubmit = async (formData: {
    responses: { fieldId: string; value: any }[];
    email: string;
    fullName: string;
    registrationNumber: string;
    phoneNumber: string;
  }) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        activityId: event._id,
        email: formData.email,
        fullName: formData.fullName,
        registrationNumber: formData.registrationNumber,
        phoneNumber: formData.phoneNumber,
        responses: formData.responses
      };

      const res = await api.post('/forms/register', payload);
      setConfirmationMsg(res.data?.confirmationMessage || event.confirmationMessage || 'Thank you for registering! Our team will get in touch shortly.');
      setSubmitSuccess(true);
    } catch (err: any) {
      console.error('Registration submission error:', err);
      const msg = err.response?.data?.message || 'Failed to submit registration. Please verify your details and try again.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-28 flex flex-col items-center justify-center font-bold text-gray-500">
      <div className="w-10 h-10 border-3 border-nss-blue border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-sm">Loading Event Details...</p>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen pt-28 flex flex-col items-center justify-center font-bold text-rose-500 text-center px-4">
      <AlertCircle size={40} className="mb-2" />
      <h2 className="text-xl font-bold">Event Not Found</h2>
      <Link href="/activities" className="mt-4 px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors">
        Back to Activities
      </Link>
    </div>
  );

  const isRegistrationOpen = Boolean(event.isRegistrationOpen);
  const isGoogleFormMode = event?.registrationMode === 'GOOGLE_FORM' || (Boolean(event?.googleFormUrl) && (!event?.formSchema || event?.formSchema.length === 0 || event?.registrationMode !== 'CUSTOM'));
  const formSchemaToUse = (event.formSchema && event.formSchema.length > 0) 
    ? { activityId: event._id, fields: event.formSchema } 
    : defaultFormSchema;

  const eventBanner = (event.bannerUrl && !event.bannerUrl.includes('onrender.com/uploads/')) ? event.bannerUrl : (event.formBannerUrl || getActivityFallbackBanner(event.title));

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-slate-50 via-blue-50/20 to-red-50/20 pb-24 font-sans relative overflow-hidden">
      
      {/* Soft Blended Photography Watermark in Background */}
      <div className="fixed inset-0 pointer-events-none -z-30 opacity-[0.035] select-none overflow-hidden">
        <img src="/images/hero-nss-group.jpg" alt="" className="w-full h-full object-cover scale-105 filter blur-xs" />
      </div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      
      {/* Event Header Banner Section */}
      <section className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/activities" className="inline-flex items-center gap-1.5 text-xs text-nss-blue hover:underline font-bold mb-6">
            <ArrowLeft size={14} /> Back to Activities
          </Link>
          
          {/* Banner Display: clean, contained, perfectly fitted with no cropped text */}
          <div className="w-full bg-slate-50 rounded-3xl p-3 sm:p-5 shadow-xs border border-gray-200/80 mb-8 flex items-center justify-center overflow-hidden">
            <img 
              src={eventBanner} 
              alt={event.title} 
              className="w-full max-h-[300px] sm:max-h-[380px] object-contain rounded-2xl"
              onError={(e: any) => {
                e.currentTarget.src = getActivityFallbackBanner(event.title);
              }}
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                isRegistrationOpen ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-700'
              }`}>
                {isRegistrationOpen ? 'Registration Open' : 'Completed Initiative'}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              {event.title}
            </h1>
            
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line text-justify">
              {event.description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="container mx-auto px-4 max-w-4xl py-10">
        {isRegistrationOpen ? (
          /* When Registration is Open: Form on Left + Event Details on Right */
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Form Area */}
            <div className="flex-1 w-full order-2 lg:order-1">
              <div className="bg-white rounded-3xl shadow-xs border border-gray-200/80 p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {submitSuccess ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8 space-y-6"
                    >
                      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <CheckCircle2 size={44} />
                      </div>
                      
                      <div className="space-y-2 max-w-md mx-auto">
                        <h2 className="text-2xl font-black text-gray-900">Registration Successful!</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {confirmationMsg}
                        </p>
                      </div>

                      {/* Official Community Connect Box */}
                      <div className="p-6 bg-slate-50/80 rounded-2xl border border-gray-200/80 text-left space-y-3 max-w-lg mx-auto">
                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest text-center">
                          Stay Connected for Further Announcements
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          <a
                            href="https://www.instagram.com/nss_vitbhopal"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white hover:bg-pink-50 border border-gray-200 hover:border-pink-300 rounded-xl text-xs font-bold text-gray-800 hover:text-pink-700 flex items-center gap-2.5 transition-all shadow-xs"
                          >
                            <svg className="w-4 h-4 text-pink-600 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                            <div className="truncate">
                              <p className="truncate">Official Instagram</p>
                              <p className="text-[10px] font-normal text-gray-400">Updates & Coverage</p>
                            </div>
                          </a>

                          <a
                            href="https://chat.whatsapp.com/G4P4G6XbL1r9d6Q6v7Z8X9"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-xl text-xs font-bold text-gray-800 hover:text-emerald-700 flex items-center gap-2.5 transition-all shadow-xs"
                          >
                            <MessageCircle size={17} className="text-emerald-600 shrink-0" />
                            <div className="truncate">
                              <p className="truncate">WhatsApp Community</p>
                              <p className="text-[10px] font-normal text-gray-400">Direct Announcements</p>
                            </div>
                          </a>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Link 
                          href="/activities"
                          className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs transition-colors inline-block"
                        >
                          Explore Other NSS Activities
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="border-b border-gray-100 pb-4 mb-6">
                        <h2 className="text-xl font-black text-gray-900">
                          Event Registration Form
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Please complete all required fields. Official student email verification is enforced.
                        </p>
                      </div>

                      {submitError && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-bold">
                          <AlertCircle size={18} className="shrink-0 text-rose-600" />
                          <span>{submitError}</span>
                        </div>
                      )}

                      {isGoogleFormMode ? (
                        <div className="py-8 px-4 text-center space-y-6">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
                            <FileText size={32} />
                          </div>
                          <div className="max-w-md mx-auto space-y-2">
                            <h2 className="text-2xl font-black text-gray-900">
                              Register for {event.title}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                              Please click the button below to complete the official registration form.
                            </p>
                          </div>

                          <div className="pt-2">
                            <a
                              href={event.googleFormUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-nss-blue to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                            >
                              <span>Click Here to Register Now</span>
                              <ExternalLink size={18} />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <DynamicForm 
                          schema={formSchemaToUse} 
                          onSubmit={handleRegistrationSubmit} 
                          isSubmitting={isSubmitting} 
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Sticky Event Info Sidebar (NO Allocated NSS Hours) */}
            <div className="w-full lg:w-1/3 order-1 lg:order-2 lg:sticky top-24">
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200/80 space-y-5">
                <h3 className="font-black text-gray-900 text-base border-b border-gray-100 pb-3">Event Schedule</h3>
                
                <div className="flex gap-3.5 items-start">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-nss-blue shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Date</p>
                    <p className="font-bold text-gray-900 text-xs sm:text-sm">
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                {event.time && (
                  <div className="flex gap-3.5 items-start">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Timing</p>
                      <p className="font-bold text-gray-900 text-xs sm:text-sm">{event.time}</p>
                    </div>
                  </div>
                )}

                {event.venue && (
                  <div className="flex gap-3.5 items-start">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-nss-red shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Venue</p>
                      <p className="font-bold text-gray-900 text-xs sm:text-sm">{event.venue}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          /* When Registration is Closed: Clean Event Details Overview without Closed Box or Allocated Hours */
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-200/80 space-y-6">
            <h3 className="font-black text-gray-900 text-lg border-b border-gray-100 pb-3 flex items-center gap-2">
              <Calendar size={20} className="text-nss-blue" /> Event Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex gap-3.5 items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-nss-blue shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Date</p>
                  <p className="font-bold text-gray-900 text-xs sm:text-sm">
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              {event.time && (
                <div className="flex gap-3.5 items-start">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Timing</p>
                    <p className="font-bold text-gray-900 text-xs sm:text-sm">{event.time}</p>
                  </div>
                </div>
              )}

              {event.venue && (
                <div className="flex gap-3.5 items-start">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-nss-red shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Venue</p>
                    <p className="font-bold text-gray-900 text-xs sm:text-sm">{event.venue}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-gray-500 font-medium">
                This NSS community initiative has concluded. Explore our gallery or check upcoming activities.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="/gallery"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                >
                  View Event Gallery
                </Link>
                <Link
                  href="/activities"
                  className="px-4 py-2 bg-nss-blue hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Explore Other Activities
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
