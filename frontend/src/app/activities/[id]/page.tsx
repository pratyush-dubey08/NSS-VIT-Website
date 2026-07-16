'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DynamicForm from '@/components/DynamicForm';
import { FieldType } from '@/components/admin/FormBuilder';
import api from '@/lib/axios';

export default function PublicEventPortal() {
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!params?.id) return;
      try {
        const { data } = await api.get(`/activities/${params.id}`);
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
    activityId: params.id,
    fields: [
      { id: 'f1', type: FieldType.SHORT_TEXT, label: 'Full Name', required: true },
      { id: 'f2', type: FieldType.EMAIL, label: 'Email Address', required: true },
      { id: 'f3', type: FieldType.MOBILE, label: 'Mobile Number', required: true },
      { id: 'f5', type: FieldType.RADIO, label: 'Are you a VIT Student?', required: true, options: ['Yes', 'No'] },
      { id: 'f6', type: FieldType.REG_NUMBER, label: 'Registration Number (If Yes)', required: false }
    ]
  };

  const handleRegistrationSubmit = (responses: any) => {
    setIsSubmitting(true);
    // Simulate API call to save registration
    setTimeout(() => {
      console.log('Submitted Form:', responses);
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1500);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Loading Event Details...</div>;
  if (!event) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">Event Not Found</div>;

  const formSchemaToUse = (event.formSchema && event.formSchema.length > 0) 
    ? { activityId: event._id, fields: event.formSchema } 
    : defaultFormSchema;

  return (
    <div className="min-h-screen pt-24 bg-gray-50 pb-20">
      
      {/* Event Header Banner */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/activities" className="inline-flex items-center gap-2 text-nss-blue hover:underline font-medium mb-6">
            <ArrowLeft size={16} /> Back to Activities
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start gap-8 justify-between">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wider ${event.isRegistrationOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                Registration {event.isRegistrationOpen ? 'Open' : 'Closed'}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
                {event.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                {event.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Registration Layout */}
      <section className="container mx-auto px-4 max-w-4xl py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Form Area */}
          <div className="flex-1 w-full order-2 lg:order-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
              
              {!event.isRegistrationOpen ? (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Registrations are Closed</h2>
                  <p className="text-gray-500">We are no longer accepting new registrations for this event.</p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {submitSuccess ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        Thank you for registering. Your response has been recorded. We will notify you with further details soon.
                      </p>
                      <button 
                        onClick={() => setSubmitSuccess(false)}
                        className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-bold transition-colors"
                      >
                        Submit Another Response
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">
                        Registration Form
                      </h2>
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
            <div className="glass-card rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
              <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">Event Details</h3>
              
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-nss-blue shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-nss-red shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Venue</p>
                  <p className="font-semibold text-gray-900">{event.venue}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
