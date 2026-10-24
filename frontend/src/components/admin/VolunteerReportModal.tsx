'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  User, 
  Mail, 
  Phone, 
  Home, 
  Calendar, 
  Award,
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText,
  Building,
  RefreshCw
} from 'lucide-react';
import api from '@/lib/axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface VolunteerReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: any;
}

export default function VolunteerReportModal({ isOpen, onClose, volunteer }: VolunteerReportModalProps) {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    if (isOpen && volunteer?._id) {
      fetchReport();
    } else {
      setReportData(null);
    }
  }, [isOpen, volunteer]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/users/${volunteer._id}/report`);
      setReportData(data);
    } catch (err) {
      console.error('Error fetching volunteer report:', err);
      // Fallback to basic volunteer info if endpoint fails
      setReportData({
        volunteer: volunteer,
        stats: {
          totalEvents: volunteer.participatedActivities?.length || 0,
          attendedEvents: volunteer.participatedActivities?.length || 0,
          bunkedEvents: volunteer.bunks || 0,
          pendingEvents: 0,
          attendanceRate: 100,
          totalHours: volunteer.accumulatedHours || 0
        },
        activities: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !volunteer) return null;

  const vol = reportData?.volunteer || volunteer;
  const stats = reportData?.stats || {
    totalEvents: 0,
    attendedEvents: 0,
    bunkedEvents: 0,
    pendingEvents: 0,
    attendanceRate: 100,
    totalHours: 0
  };
  const activities = reportData?.activities || [];

  // ==========================================================================
  // GENERATE & DOWNLOAD OFFICIAL PDF REPORT CARD
  // ==========================================================================
  const handleDownloadPdf = () => {
    try {
      setIsGeneratingPdf(true);
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();

      // 1. Header Navy Banner
      doc.setFillColor(15, 23, 42); // #0F172A
      doc.rect(0, 0, pageWidth, 38, 'F');

      // Accent gold/blue line
      doc.setFillColor(37, 99, 235); // NSS Blue
      doc.rect(0, 38, pageWidth, 2.5, 'F');

      // Title & Branding
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('NATIONAL SERVICE SCHEME (NSS)', pageWidth / 2, 14, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('VIT Bhopal University • Official Volunteer Performance & Attendance Report Card', pageWidth / 2, 22, { align: 'center' });

      doc.setFontSize(9);
      doc.setTextColor(191, 219, 254);
      doc.text('"NOT ME, BUT YOU"', pageWidth / 2, 30, { align: 'center' });

      // 2. Report Details & Generation Timestamp
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      doc.text(`Report Issued: ${today}`, 14, 47);
      doc.text(`Document Ref: NSS-REP-${vol.registrationNumber}-${new Date().getFullYear()}`, pageWidth - 14, 47, { align: 'right' });

      // 3. Volunteer Profile Box
      doc.setFillColor(248, 250, 252); // #F8FAFC
      doc.setDrawColor(226, 232, 240); // #E2E8F0
      doc.roundedRect(14, 52, pageWidth - 28, 42, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('VOLUNTEER CREDENTIALS & PROFILE', 20, 60);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);

      // Column 1
      doc.text('Full Name:', 20, 68);
      doc.setFont('helvetica', 'normal');
      doc.text(vol.name || 'N/A', 52, 68);

      doc.setFont('helvetica', 'bold');
      doc.text('Registration No:', 20, 75);
      doc.setFont('helvetica', 'normal');
      doc.text(vol.registrationNumber || 'N/A', 52, 75);

      doc.setFont('helvetica', 'bold');
      doc.text('Contact Number:', 20, 82);
      doc.setFont('helvetica', 'normal');
      doc.text(vol.phoneNumber || 'Not provided', 52, 82);

      doc.setFont('helvetica', 'bold');
      doc.text('Email Address:', 20, 89);
      doc.setFont('helvetica', 'normal');
      doc.text(vol.email || 'Not provided', 52, 89);

      // Column 2
      const col2X = 115;
      doc.setFont('helvetica', 'bold');
      doc.text('Gender:', col2X, 68);
      doc.setFont('helvetica', 'normal');
      doc.text(vol.gender || 'Not specified', col2X + 32, 68);

      doc.setFont('helvetica', 'bold');
      doc.text('Residential Status:', col2X, 75);
      doc.setFont('helvetica', 'normal');
      doc.text(vol.residenceType || 'Not specified', col2X + 32, 75);

      doc.setFont('helvetica', 'bold');
      doc.text('Batch / Year:', col2X, 82);
      doc.setFont('helvetica', 'normal');
      doc.text(vol.batch ? `Batch of ${vol.batch}` : 'Active Volunteer', col2X + 32, 82);

      doc.setFont('helvetica', 'bold');
      doc.text('Role & Status:', col2X, 89);
      doc.setFont('helvetica', 'normal');
      doc.text(`${vol.role || 'VOLUNTEER'} (Active)`, col2X + 32, 89);

      // 4. Performance Summary Metric Cards
      const boxY = 100;
      const boxW = (pageWidth - 28 - 9) / 4;
      const boxH = 20;

      // Card 1: Total Events
      doc.setFillColor(239, 246, 255);
      doc.setDrawColor(191, 219, 254);
      doc.roundedRect(14, boxY, boxW, boxH, 2, 2, 'FD');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 64, 175);
      doc.text('TOTAL EVENTS', 14 + boxW / 2, boxY + 7, { align: 'center' });
      doc.setFontSize(13);
      doc.text(String(stats.totalEvents), 14 + boxW / 2, boxY + 16, { align: 'center' });

      // Card 2: Present (Attended)
      doc.setFillColor(236, 253, 245);
      doc.setDrawColor(167, 243, 208);
      doc.roundedRect(14 + boxW + 3, boxY, boxW, boxH, 2, 2, 'FD');
      doc.setFontSize(8);
      doc.setTextColor(6, 95, 70);
      doc.text('PRESENT (ATTENDED)', 14 + boxW + 3 + boxW / 2, boxY + 7, { align: 'center' });
      doc.setFontSize(13);
      doc.text(String(stats.attendedEvents), 14 + boxW + 3 + boxW / 2, boxY + 16, { align: 'center' });

      // Card 3: Absent (Bunked)
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(254, 202, 202);
      doc.roundedRect(14 + (boxW + 3) * 2, boxY, boxW, boxH, 2, 2, 'FD');
      doc.setFontSize(8);
      doc.setTextColor(153, 27, 27);
      doc.text('ABSENT (MISSED)', 14 + (boxW + 3) * 2 + boxW / 2, boxY + 7, { align: 'center' });
      doc.setFontSize(13);
      doc.text(String(stats.bunkedEvents), 14 + (boxW + 3) * 2 + boxW / 2, boxY + 16, { align: 'center' });

      // Card 4: Attendance Rate
      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(253, 230, 138);
      doc.roundedRect(14 + (boxW + 3) * 3, boxY, boxW, boxH, 2, 2, 'FD');
      doc.setFontSize(8);
      doc.setTextColor(146, 64, 14);
      doc.text('ATTENDANCE RATE', 14 + (boxW + 3) * 3 + boxW / 2, boxY + 7, { align: 'center' });
      doc.setFontSize(13);
      doc.text(`${stats.attendanceRate}%`, 14 + (boxW + 3) * 3 + boxW / 2, boxY + 16, { align: 'center' });

      // 5. Activities Attendance Table
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.text('EVENT-WISE PARTICIPATION & ATTENDANCE RECORD', 14, 130);

      const tableRows = activities.length > 0 
        ? activities.map((act: any, idx: number) => [
            String(idx + 1),
            act.title,
            act.date || 'N/A',
            act.category || 'General',
            act.venue || 'Campus',
            act.attendanceStatus === 'ATTENDED' ? 'PRESENT' : act.attendanceStatus === 'BUNKED' ? 'ABSENT' : 'PENDING'
          ])
        : [['-', 'No activity records registered yet for this volunteer', '-', '-', '-', '-']];

      autoTable(doc, {
        startY: 135,
        head: [['#', 'Activity / Event Name', 'Date', 'Category', 'Venue', 'Attendance Status']],
        body: tableRows,
        theme: 'striped',
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8.5
        },
        styles: {
          fontSize: 8,
          cellPadding: 2.5
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 65 },
          2: { cellWidth: 28 },
          3: { cellWidth: 27 },
          4: { cellWidth: 28 },
          5: { cellWidth: 24, fontStyle: 'bold', halign: 'center' }
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 5) {
            const val = String(data.cell.raw);
            if (val === 'PRESENT') {
              data.cell.styles.textColor = [16, 185, 129]; // Emerald
            } else if (val === 'ABSENT') {
              data.cell.styles.textColor = [239, 68, 68]; // Red
            } else if (val === 'PENDING') {
              data.cell.styles.textColor = [245, 158, 11]; // Amber
            }
          }
        }
      });

      // 6. Verification & Signatures Footer
      const finalY = (doc as any).lastAutoTable?.finalY || 220;
      const footerY = Math.min(finalY + 25, 270);

      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.5);
      doc.line(14, footerY, 65, footerY);
      doc.line(pageWidth - 65, footerY, pageWidth - 14, footerY);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Prepared by Administrative Cell', 14, footerY + 5);
      doc.text('Program Officer, NSS Unit', pageWidth - 14, footerY + 5, { align: 'right' });
      doc.text('VIT Bhopal University', pageWidth - 14, footerY + 9, { align: 'right' });

      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('This is an official system-generated record from the NSS Unit Administrative Portal.', pageWidth / 2, 287, { align: 'center' });

      // Save file
      const cleanReg = (vol.registrationNumber || 'VOL').replace(/[^a-zA-Z0-9]/g, '_');
      doc.save(`NSS_ReportCard_${cleanReg}.pdf`);
    } catch (err) {
      console.error('Error generating PDF report card:', err);
      alert('Error generating PDF report card. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 font-sans">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-black text-lg shadow-inner">
              {vol.name?.substring(0, 2).toUpperCase() || 'VO'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black tracking-tight">{vol.name}</h3>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 font-mono">
                  {vol.registrationNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                NSS Volunteer Profile & Attendance Report Card
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 bg-nss-blue hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              title="Download Official PDF Report Card"
            >
              {isGeneratingPdf ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download size={15} />
                  <span>Download Report Card (PDF)</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
              <RefreshCw size={32} className="animate-spin text-nss-blue" />
              <p className="text-sm font-semibold">Loading volunteer profile and attendance record...</p>
            </div>
          ) : (
            <>
              {/* 1. Full Volunteer Details Grid */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <User size={16} className="text-nss-blue" />
                    Volunteer Information
                  </h4>
                  <span className="text-xs font-semibold text-slate-500">
                    Role: <strong className="text-slate-800">{vol.role || 'VOLUNTEER'}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs sm:text-sm">
                  {/* Name */}
                  <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Full Name</span>
                    <span className="font-bold text-slate-900">{vol.name}</span>
                  </div>

                  {/* Reg No */}
                  <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Reg Number</span>
                    <span className="font-mono font-bold text-slate-900">{vol.registrationNumber}</span>
                  </div>

                  {/* Contact Number */}
                  <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
                      <Phone size={12} /> Contact No
                    </span>
                    <span className="font-semibold text-slate-800">{vol.phoneNumber || 'Not provided'}</span>
                  </div>

                  {/* Gender */}
                  <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Gender</span>
                    <span className="font-semibold text-slate-900">{vol.gender || 'Not specified'}</span>
                  </div>

                  {/* Residential Status */}
                  <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
                      <Home size={12} /> Residential Status
                    </span>
                    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${
                      vol.residenceType === 'Hosteller'
                        ? 'bg-purple-100 text-purple-700'
                        : vol.residenceType === 'Day Scholar'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {vol.residenceType || 'Not specified'}
                    </span>
                  </div>

                  {/* Batch */}
                  <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Batch / Department</span>
                    <span className="font-semibold text-slate-800">{vol.batch ? `Batch of ${vol.batch}` : 'Active'}</span>
                  </div>

                  {/* Email (Spans 2 columns for full visibility) */}
                  <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs sm:col-span-2 md:col-span-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
                      <Mail size={12} /> Email
                    </span>
                    <span className="font-medium text-slate-800 break-all block" title={vol.email}>
                      {vol.email || 'Not provided'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Attendance Summary Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                  <div className="text-xs sm:text-sm font-bold text-blue-800">Total Enrolled</div>
                  <div className="text-2xl sm:text-3xl font-black text-nss-blue mt-1">{stats.totalEvents}</div>
                  <div className="text-[11px] text-blue-600 mt-0.5">Activities Enlisted</div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                  <div className="text-xs sm:text-sm font-bold text-emerald-800 flex items-center justify-center gap-1">
                    <CheckCircle2 size={14} /> Present
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">{stats.attendedEvents}</div>
                  <div className="text-[11px] text-emerald-600 mt-0.5">Events Attended</div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-center">
                  <div className="text-xs sm:text-sm font-bold text-rose-800 flex items-center justify-center gap-1">
                    <XCircle size={14} /> Absent
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-rose-700 mt-1">{stats.bunkedEvents}</div>
                  <div className="text-[11px] text-rose-600 mt-0.5">Events Missed</div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                  <div className="text-xs sm:text-sm font-bold text-amber-800 flex items-center justify-center gap-1">
                    <Award size={14} /> Attendance Rate
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-1">{stats.attendanceRate}%</div>
                  <div className="text-[11px] text-amber-600 mt-0.5">Participation Ratio</div>
                </div>
              </div>

              {/* 3. Event-wise Attendance & Participation Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Calendar size={16} className="text-nss-blue" />
                    Activity-Wise Attendance History
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">
                    Showing {activities.length} activity record{activities.length === 1 ? '' : 's'}
                  </span>
                </div>

                {activities.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
                    <AlertCircle size={32} className="mx-auto text-slate-400 mb-2" />
                    <p className="text-sm font-bold text-slate-700">No activity participation recorded yet.</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      When attendance is marked for this volunteer in any NSS activity or event, it will automatically link and reflect here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold">
                        <tr>
                          <th className="py-3 px-4">#</th>
                          <th className="py-3 px-4">Activity Title</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Venue</th>
                          <th className="py-3 px-4 text-center">Attendance Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activities.map((act: any, idx: number) => {
                          const isAttended = act.attendanceStatus === 'ATTENDED';
                          const isBunked = act.attendanceStatus === 'BUNKED';

                          return (
                            <tr key={act.id || idx} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-4 text-slate-400 font-bold">{idx + 1}</td>
                              <td className="py-3 px-4 font-bold text-slate-900">{act.title}</td>
                              <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">{act.date}</td>
                              <td className="py-3 px-4">
                                <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
                                  {act.category}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-600">{act.venue}</td>
                              <td className="py-3 px-4 text-center">
                                {isAttended ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    <CheckCircle2 size={13} /> Present
                                  </span>
                                ) : isBunked ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                    <XCircle size={13} /> Absent
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                    <AlertCircle size={13} /> Pending
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Official NSS Volunteer Performance & Attendance Record • VIT Bhopal University
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-5 py-2.5 rounded-xl bg-nss-blue hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
            >
              <Download size={15} />
              <span>Download Report Card (PDF)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
