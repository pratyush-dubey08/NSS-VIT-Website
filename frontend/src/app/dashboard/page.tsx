'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Clock, Calendar, CheckCircle2, XCircle, Award, Briefcase, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';

export default function VolunteerDashboard() {
  const { user } = useAuthStore();
  const [managedActivities, setManagedActivities] = useState<any[]>([]);
  const [registeredActivities, setRegisteredActivities] = useState<any[]>([]);
  const [activeVolunteerForms, setActiveVolunteerForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const currentUserId = (user._id || user.id || '').toString();

          // Fetch all dashboard data concurrently in parallel
          const [actsRes, myRegsRes, vfRes] = await Promise.all([
            api.get('/activities').catch(err => { console.error('Acts fetch error', err); return { data: [] }; }),
            api.get('/forms/my-registrations').catch(err => { console.error('Regs fetch error', err); return { data: [] }; }),
            api.get('/volunteer-forms').catch(() => ({ data: [] }))
          ]);

          const allActs = Array.isArray(actsRes.data) ? actsRes.data : (actsRes.data?.activities || []);
          const managing = allActs.filter((a: any) => 
            a.eventManagers && a.eventManagers.some((m: any) => {
              const mId = (m._id || m.id || m)?.toString();
              return mId === currentUserId;
            })
          );
          setManagedActivities(managing);

          const validRegs = (myRegsRes.data || []).filter((r: any) => r.activityId != null);
          validRegs.sort((a: any, b: any) => {
            const dateA = a.activityId?.date ? new Date(a.activityId.date).getTime() : 0;
            const dateB = b.activityId?.date ? new Date(b.activityId.date).getTime() : 0;
            return dateB - dateA;
          });
          setRegisteredActivities(validRegs);

          const now = new Date();
          const pendingForms = (vfRes.data || []).filter((f: any) => 
            f.isActive && (!f.deadline || new Date(f.deadline) >= now)
          );
          setActiveVolunteerForms(pendingForms);

        } catch (error) {
          console.error("Error fetching dashboard data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [user]);

  if (!user) return null;

  // Calculate stats based on actual attendance from admin portal
  const attendedRegistrations = registeredActivities.filter((reg) => 
    reg.attendanceStatus === 'ATTENDED' || reg.attendanceStatus === 'Present'
  );
  const absentRegistrations = registeredActivities.filter((reg) => 
    reg.attendanceStatus === 'BUNKED' || reg.attendanceStatus === 'Absent'
  );

  const totalAttended = attendedRegistrations.length;
  const totalAbsent = absentRegistrations.length;

  // Sum of hours for events where volunteer was marked Present
  const calculatedHours = attendedRegistrations.reduce((sum, reg) => {
    const hours = reg.activityId?.hoursAllocated || reg.activityId?.workingHours || 0;
    return sum + hours;
  }, 0);

  // If calculatedHours > 0 use it, otherwise fall back to user.accumulatedHours
  const totalHours = calculatedHours > 0 ? calculatedHours : (user.accumulatedHours || 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-nss-blue to-blue-600 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-lg mt-2">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase mb-3 text-blue-100">
            Volunteer Portal
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2">Welcome back, {user.name}!</h1>
          <p className="text-blue-100 max-w-xl text-base md:text-lg">
            Track your social service hours, attended events, and manage activities assigned to you.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Action Required: Volunteer Forms Alert */}
      {activeVolunteerForms.length > 0 && (
        <div className="space-y-4">
          {activeVolunteerForms.map((vf) => (
            <div
              key={vf._id}
              className="p-5 sm:p-6 bg-gradient-to-r from-amber-50 via-white to-blue-50 border-2 border-amber-300 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1 shadow-2xs">
                    ⚡ Action Required
                  </span>
                  {vf.deadline && (
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                      <Clock size={13} /> Closes: {new Date(vf.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <h3
                  style={{
                    color: vf.titleColor || '#111827',
                    fontWeight: vf.titleBold ? 'bold' : 'normal',
                    fontStyle: vf.titleItalic ? 'italic' : 'normal',
                    textDecoration: vf.titleUnderline ? 'underline' : 'none'
                  }}
                  className="text-lg sm:text-xl leading-snug"
                >
                  {vf.title}
                </h3>

                {vf.description && (
                  <p
                    style={{
                      color: vf.descriptionColor || '#4b5563',
                      fontWeight: vf.descriptionBold ? 'bold' : 'normal',
                      fontStyle: vf.descriptionItalic ? 'italic' : 'normal',
                      textDecoration: vf.descriptionUnderline ? 'underline' : 'none'
                    }}
                    className="text-xs sm:text-sm max-w-2xl leading-relaxed"
                  >
                    {vf.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={vf.googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-gradient-to-r from-nss-blue to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Click Here to Fill Form Now</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid - 3 Clickable Filter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Total Hours (Clickable -> Redirects to Attended Events) */}
        <Link 
          href="/dashboard/activities?filter=ATTENDED"
          title="Click to view all verified attended events and earned hours"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-50 text-nss-blue rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Clock size={32} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Hours</p>
              {loading && !totalHours ? (
                <div className="h-8 w-20 bg-blue-100 animate-pulse rounded-lg my-1" />
              ) : (
                <h3 className="text-3xl font-black text-gray-900 leading-none">
                  {totalHours} <span className="text-lg font-bold text-gray-400">hrs</span>
                </h3>
              )}
              <p className="text-xs text-blue-600 font-medium mt-1 flex items-center gap-1">
                <span>From verified present events</span>
              </p>
            </div>
          </div>
          <ArrowRight size={18} className="text-gray-300 group-hover:text-nss-blue group-hover:translate-x-1 transition-all shrink-0" />
        </Link>

        {/* Card 2: Events Attended (Clickable -> Redirects to Present / Attended Tab) */}
        <Link 
          href="/dashboard/activities?filter=ATTENDED"
          title="Click to view all events where you were marked Present"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Events Attended</p>
              {loading ? (
                <div className="h-8 w-24 bg-emerald-100 animate-pulse rounded-lg my-1" />
              ) : (
                <h3 className="text-3xl font-black text-gray-900 leading-none">
                  {totalAttended} <span className="text-lg font-bold text-gray-400">Events</span>
                </h3>
              )}
              <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <span>Marked Present</span>
                <span className="text-[11px] font-normal text-emerald-700 underline underline-offset-2">View details →</span>
              </p>
            </div>
          </div>
          <ArrowRight size={18} className="text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
        </Link>

        {/* Card 3: Events Absent (Clickable -> Redirects to Absent Tab) */}
        <Link 
          href="/dashboard/activities?filter=BUNKED"
          title="Click to view all events where you were marked Absent"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-rose-300 transition-all flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <XCircle size={32} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Events Absent</p>
              {loading ? (
                <div className="h-8 w-24 bg-rose-100 animate-pulse rounded-lg my-1" />
              ) : (
                <h3 className="text-3xl font-black text-gray-900 leading-none">
                  {totalAbsent} <span className="text-lg font-bold text-gray-400">Events</span>
                </h3>
              )}
              <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                <span>Marked Absent</span>
                <span className="text-[11px] font-normal text-rose-700 underline underline-offset-2">View details →</span>
              </p>
            </div>
          </div>
          <ArrowRight size={18} className="text-gray-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all shrink-0" />
        </Link>
      </div>

      {/* Events You Are Managing Section */}
      {managedActivities.length > 0 && (
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h3 className="font-bold text-gray-900 text-xl flex items-center gap-2">
                <Briefcase className="text-nss-blue" size={22} /> Events You Are Managing
              </h3>
              <p className="text-sm text-gray-500">Edit event details and mark volunteer attendance for your events.</p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-nss-blue text-xs font-bold rounded-full">
              {managedActivities.length} Assigned
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {managedActivities.map((activity) => (
              <div key={activity._id} className="border border-gray-100 bg-slate-50/50 rounded-2xl p-4 sm:p-5 hover:border-nss-blue/40 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="px-2.5 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg shadow-2xs">
                      {activity.hoursAllocated || activity.workingHours || 0} Hours
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      activity.isRegistrationOpen 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {activity.isRegistrationOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">{activity.title}</h4>
                  <p className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400" />
                    {activity.date ? new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
                  </p>
                </div>

                <Link 
                  href={`/dashboard/activities/${activity._id}`} 
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-nss-blue text-white font-bold text-sm rounded-xl hover:bg-blue-800 transition-colors shadow-sm"
                >
                  Manage & Mark Attendance <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Grid: Attended Events & Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Events Attended & Attendance History */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-900 text-xl flex items-center gap-2">
                <Calendar className="text-nss-blue" size={22} /> My Events & Attendance
              </h3>
              <p className="text-sm text-gray-500">Your verified attendance and participation log.</p>
            </div>
            <Link href="/dashboard/activities" className="text-xs text-nss-blue font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 max-h-[380px]">
            {loading ? (
              <div className="py-12 text-center text-gray-400">
                <div className="w-8 h-8 border-2 border-nss-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm font-medium">Loading events...</p>
              </div>
            ) : registeredActivities.length > 0 ? (
              registeredActivities.map((reg) => {
                const isAttended = reg.attendanceStatus === 'ATTENDED' || reg.attendanceStatus === 'Present';
                const isAbsent = reg.attendanceStatus === 'BUNKED' || reg.attendanceStatus === 'Absent';
                const hours = reg.activityId?.hoursAllocated || reg.activityId?.workingHours || 0;

                return (
                  <div key={reg._id} className="flex items-center justify-between p-4 bg-gray-50/70 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors">
                    <div className="pr-4">
                      <h4 className="font-bold text-gray-900 text-sm md:text-base line-clamp-1">{reg.activityId?.title || 'NSS Activity'}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{reg.activityId?.date ? new Date(reg.activityId.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}</span>
                        {isAttended && hours > 0 && (
                          <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+{hours} hrs earned</span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      {isAttended ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                          <CheckCircle2 size={14} /> Present
                        </span>
                      ) : isAbsent ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full">
                          <XCircle size={14} /> Absent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <Calendar className="text-gray-300 mb-2" size={40} />
                <p className="text-sm font-medium text-gray-600">No event registrations found yet.</p>
                <p className="text-xs text-gray-400 mt-1">Once you are registered or attend an event, it will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Certificates Section */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-900 text-xl flex items-center gap-2">
                <Award className="text-amber-500" size={22} /> My Certificates
              </h3>
              <p className="text-sm text-gray-500">Official certificates issued by NSS Unit.</p>
            </div>
            <Link href="/dashboard/certificates" className="text-xs text-nss-blue font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 max-h-[380px]">
            {user.certificates && user.certificates.length > 0 ? (
              user.certificates.map((cert: any, i: number) => {
                const certUrl = typeof cert === 'string' ? cert : cert.url;
                const certTitle = typeof cert === 'string' ? `Certificate ${i + 1}` : (cert.title || 'NSS Event Participation');

                return (
                  <div key={i} className="flex items-center justify-between p-4 bg-amber-50/40 rounded-xl border border-amber-100/70 hover:bg-amber-50/70 transition-colors">
                    <div>
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-100/70 px-2 py-0.5 rounded">
                        Verified
                      </span>
                      <h4 className="font-bold text-gray-900 text-sm md:text-base mt-1">{certTitle}</h4>
                    </div>
                    <a 
                      href={certUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      Download <ExternalLink size={12} />
                    </a>
                  </div>
                );
              })
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <Award className="text-gray-300 mb-2" size={40} />
                <p className="text-sm font-medium text-gray-600">No certificates issued yet.</p>
                <p className="text-xs text-gray-400 mt-1">Certificates uploaded for events will appear here.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
