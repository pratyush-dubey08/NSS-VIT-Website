'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, CheckCircle2, ArrowLeft, Clock, AlertCircle,
  ExternalLink, MessageCircle, Sparkles, HeartHandshake,
  Share2
, FileText } from 'lucide-react';
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

const YoutubeIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
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

  const isGoogleFormMode = event?.registrationMode === 'GOOGLE_FORM' || (Boolean(event?.googleFormUrl) && (!event?.formSchema || event?.formSchema.length === 0 || event?.registrationMode !== 'CUSTOM'));
  const formSchemaToUse = (event.formSchema && event.formSchema.length > 0) 
    ? { activityId: event._id, fields: event.formSchema } 
    : defaultFormSchema;

  const eventBanner = event.formBannerUrl || '/images/default-event-banner.png';

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

                      {/* Official Social Channels Hub */}
                      <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-purple-50/50 border border-blue-200/80 rounded-3xl p-6 max-w-lg mx-auto text-left space-y-4 shadow-xs">
                        <div className="flex items-center gap-2">
                          <Sparkles size={18} className="text-nss-blue shrink-0" />
                          <h4 className="font-black text-gray-900 text-sm">Stay Connected with NSS Unit, VIT Bhopal University!</h4>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Stay connected with us for further updates, activities, volunteer drives, and upcoming opportunities:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {/* 1. WhatsApp Channel */}
                          <a
                            href="https://www.whatsapp.com/channel/0029VbBFSgS8qIzvpLL2Ye1W"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-xl text-xs font-bold text-gray-800 hover:text-emerald-700 flex items-center gap-2.5 transition-all shadow-xs"
                          >
                            <MessageCircle size={17} className="text-emerald-600 shrink-0" />
                            <div className="truncate">
                              <p className="truncate">WhatsApp Channel</p>
                              <p className="text-[10px] font-normal text-gray-400">Official Announcements</p>
                            </div>
                          </a>

                          {/* 2. Official Instagram */}
                          <a
                            href="https://www.instagram.com/nssvitbhopal/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white hover:bg-rose-50 border border-gray-200 hover:border-rose-300 rounded-xl text-xs font-bold text-gray-800 hover:text-rose-700 flex items-center gap-2.5 transition-all shadow-xs"
                          >
                            <InstagramIcon size={17} className="text-rose-600 shrink-0" />
                            <div className="truncate">
                              <p className="truncate">@nssvitbhopal</p>
                              <p className="text-[10px] font-normal text-gray-400">Official Events & Drives</p>
                            </div>
                          </a>

                          {/* 3. NSS Unfiltered Instagram */}
                          <a
                            href="https://www.instagram.com/nssvitb_unfiltered/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-xl text-xs font-bold text-gray-800 hover:text-purple-700 flex items-center gap-2.5 transition-all shadow-xs"
                          >
                            <InstagramIcon size={17} className="text-purple-600 shrink-0" />
                            <div className="truncate">
                              <p className="truncate">@nssvitb_unfiltered</p>
                              <p className="text-[10px] font-normal text-gray-400">BTS & Volunteer Life</p>
                            </div>
                          </a>

                          {/* 4. LinkedIn */}
                          <a
                            href="https://www.linkedin.com/company/nss-vitb/posts/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl text-xs font-bold text-gray-800 hover:text-blue-700 flex items-center gap-2.5 transition-all shadow-xs"
                          >
                            <LinkedinIcon size={17} className="text-blue-600 shrink-0" />
                            <div className="truncate">
                              <p className="truncate">LinkedIn Unit</p>
                              <p className="text-[10px] font-normal text-gray-400">Professional Network</p>
                            </div>
                          </a>

                          {/* 5. YouTube Channel */}
                          <a
                            href="https://www.youtube.com/@nationalservicescheme-vitb5083"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-xl text-xs font-bold text-gray-800 hover:text-red-700 flex items-center gap-2.5 transition-all shadow-xs sm:col-span-2"
                          >
                            <YoutubeIcon size={17} className="text-red-600 shrink-0" />
                            <div className="truncate">
                              <p className="truncate">NSS Unit YouTube Channel</p>
                              <p className="text-[10px] font-normal text-gray-400">Event Documentaries, Drives & Highlights</p>
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
                          Please complete all required fields. College email verification is enforced.
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
                            <span className="inline-block px-3 py-1 bg-blue-50 text-nss-blue rounded-full text-xs font-bold uppercase tracking-wider">
                              Official Event Registration
                            </span>
                            <h2 className="text-2xl font-black text-gray-900">
                              Register for {event.title}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                              Participant registration for this activity is being collected via Google Forms. Please click the button below to complete the official registration form.
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

                          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold text-gray-500 pt-3 border-t border-gray-100 max-w-sm mx-auto">
                            <span className="flex items-center gap-1 text-emerald-600">
                              ✓ Verified Official NSS Form
                            </span>
                            <span className="flex items-center gap-1">
                              ↗ Opens in a new tab
                            </span>
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
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Allocated NSS Hours</p>
                    <p className="font-bold text-gray-900 text-xs sm:text-sm">{event.hoursAllocated} Hours</p>
                  </div>
                </div>
              ) : null}


            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
