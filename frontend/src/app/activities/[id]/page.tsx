'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, CheckCircle2, ArrowLeft, Clock, AlertCircle,
  ExternalLink, MessageCircle, Sparkles, HeartHandshake,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import DynamicForm from '@/components/DynamicForm';
import { FieldType } from '@/components/admin/FormBuilder';
import api from '@/lib/axios';


const InstagramIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function PublicEventPortal() {
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
      setConfirmationMsg(res.data?.confirmationMessage || event.confirmationMessage || 'Thank you for filling out the form! Our team will contact you shortly.');
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

  const formSchemaToUse = (event.formSchema && event.formSchema.length > 0) 
    ? { activityId: event._id, fields: event.formSchema } 
    : defaultFormSchema;

  const eventBanner = event.bannerUrl || '/images/default-event-banner.png';

  return (
    <div className="min-h-screen pt-24 bg-slate-50/50 pb-24">
      
      {/* Event Header Banner Section */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/activities" className="inline-flex items-center gap-1.5 text-xs text-nss-blue hover:underline font-bold mb-6">
            <ArrowLeft size={14} /> Back to Activities
          </Link>
          
          {/* Banner Display: clean, contained, perfectly fitted with no cropped text! */}
          <div className="w-full bg-white rounded-3xl p-3 sm:p-5 shadow-xs border border-gray-200/80 mb-8 flex items-center justify-center">
            <img 
              src={eventBanner} 
              alt={event.title} 
              className="w-full max-h-[260px] sm:max-h-[340px] object-contain rounded-2xl"
              onError={(e: any) => {
                e.currentTarget.src = '/images/default-event-banner.png';
              }}
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-8 justify-between">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
              <span className={'inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase tracking-wider ' + (
                event.isRegistrationOpen !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              )}>
                Registration {event.isRegistrationOpen !== false ? 'Open' : 'Closed'}
              </span>
              
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                {event.title}
              </h1>
              
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 whitespace-pre-line text-justify">
                {event.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Registration Layout */}
      <section className="container mx-auto px-4 max-w-4xl py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Form Area */}
          <div className="flex-1 w-full order-2 lg:order-1">
            <div className="bg-white rounded-3xl shadow-xs border border-gray-200/80 p-6 md:p-8">
              
              {event.isRegistrationOpen === false ? (
                <div className="text-center py-14">
                  <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                    <Clock size={32} />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2">Registrations are Closed</h2>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    We are no longer accepting new responses for this event. Stay tuned for future drives and initiatives!
                  </p>
                </div>
              ) : (
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

                      <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Registration Confirmed!</h2>
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-lg mx-auto text-emerald-900 text-sm font-semibold leading-relaxed">
                          {confirmationMsg || 'Thank you for filling out the form! Our team will contact you shortly.'}
                        </div>
                      </div>

                      {/* Official Linktree & Social Channels Hub */}
                      <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-purple-50/50 border border-blue-200/80 rounded-3xl p-6 max-w-lg mx-auto text-left space-y-4 shadow-xs">
                        <div className="flex items-center gap-2">
                          <Sparkles size={18} className="text-nss-blue" />
                          <h4 className="font-black text-gray-900 text-sm">Stay Connected with NSS Unit VIT Bhopal!</h4>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Follow our official handles to receive event updates, volunteer opportunities, attendance sheets, and behind-the-scenes moments:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          <a
                            href="https://linktr.ee/nssunit__vitbhopal"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-xl text-xs font-bold text-gray-800 hover:text-emerald-700 flex items-center gap-2.5 transition-all shadow-xs"
                          >
                            <MessageCircle size={16} className="text-emerald-600 shrink-0" />
                            <div className="truncate">
                              <p className="truncate">WhatsApp Community</p>
                              <p className="text-[10px] font-normal text-gray-400">Join Student Community</p>
                            </div>
                          </a>

                          <a
                            href="https://www.instagram.com/nssunit_vitbhopal/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white hover:bg-rose-50 border border-gray-200 hover:border-rose-300 rounded-xl text-xs font-bold text-gray-800 hover:text-rose-700 flex items-center gap-2.5 transition-all shadow-xs"
                          >
                            <InstagramIcon size={16} className="text-rose-600 shrink-0" />
                            <div className="truncate">
                              <p className="truncate">@nssunit_vitbhopal</p>
                              <p className="text-[10px] font-normal text-gray-400">Official Events & Drives</p>
                            </div>
                          </a>

                          <a
                            href="https://linktr.ee/nssunit__vitbhopal"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-xl text-xs font-bold text-gray-800 hover:text-purple-700 flex items-center gap-2.5 transition-all shadow-xs"
                          >
                            <Sparkles size={16} className="text-purple-600 shrink-0" />
                            <div className="truncate">
                              <p className="truncate">NSS Unfiltered</p>
                              <p className="text-[10px] font-normal text-gray-400">BTS, Fun & Volunteer Life</p>
                            </div>
                          </a>

                          <a
                            href="https://www.linkedin.com/company/nss-vit-bhopal/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl text-xs font-bold text-gray-800 hover:text-blue-700 flex items-center gap-2.5 transition-all shadow-xs"
                          >
                            <LinkedinIcon size={16} className="text-blue-600 shrink-0" />
                            <div className="truncate">
                              <p className="truncate">LinkedIn Unit</p>
                              <p className="text-[10px] font-normal text-gray-400">Professional Network</p>
                            </div>
                          </a>
                        </div>

                        <div className="pt-2 text-center">
                          <a
                            href="https://linktr.ee/nssunit__vitbhopal"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 px-4 bg-nss-blue hover:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                          >
                            <ExternalLink size={14} /> Open Official NSS Linktree Hub
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
                          Please complete all required fields. College email verification is enforced.
                        </p>
                      </div>

                      {submitError && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-bold">
                          <AlertCircle size={18} className="shrink-0 text-rose-600" />
                          <span>{submitError}</span>
                        </div>
                      )}

                      <DynamicForm 
                        schema={formSchemaToUse} 
                        onSubmit={handleRegistrationSubmit} 
                        isSubmitting={isSubmitting} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Sticky Event Info Sidebar */}
          <div className="w-full lg:w-1/3 order-1 lg:order-2 lg:sticky top-24">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200/80 space-y-6">
              <h3 className="font-black text-gray-900 text-base border-b border-gray-100 pb-3">Event Details</h3>
              
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

              <div className="flex gap-3.5 items-start">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-nss-red shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Venue</p>
                  <p className="font-bold text-gray-900 text-xs sm:text-sm">{event.venue}</p>
                </div>
              </div>

              {event.hoursAllocated ? (
                <div className="flex gap-3.5 items-start">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Volunteer Hours</p>
                    <p className="font-bold text-gray-900 text-xs sm:text-sm">{event.hoursAllocated} Hours</p>
                  </div>
                </div>
              ) : null}

              <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 text-xs space-y-1.5">
                <p className="font-bold text-gray-800 flex items-center gap-1.5">
                  <HeartHandshake size={15} className="text-nss-blue" /> Official NSS Initiative
                </p>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Conducted by NSS Unit, VIT Bhopal University under the motto "Not Me But You" (स्वयं से पहले आप).
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
