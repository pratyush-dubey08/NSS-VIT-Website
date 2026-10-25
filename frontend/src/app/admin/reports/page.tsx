'use client';

import Link from 'next/link';

import { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckSquare, 
  Square, 
  Printer, 
  RefreshCw,
  CheckCircle2,
  FileDown,
  ExternalLink,
  Plus
} from 'lucide-react';
import api from '@/lib/axios';

export default function AdminReportsPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/activities', {
        params: { _t: Date.now() },
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0'
        }
      });
      const list = Array.isArray(data) ? data : (data?.activities || []);
      // Sort newest first
      list.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setActivities(list);
    } catch (err: any) {
      console.error('Error fetching activities for reports:', err);
      setError('Could not load activities. Please refresh or try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const q = searchQuery.toLowerCase();
      return (
        act.title?.toLowerCase().includes(q) ||
        act.venue?.toLowerCase().includes(q) ||
        act.description?.toLowerCase().includes(q)
      );
    });
  }, [activities, searchQuery]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    if (selectedIds.length === filteredActivities.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredActivities.map((a) => a._id));
    }
  };

  // Generate and Print / Save PDF
  const handleGeneratePdf = (targetActivities: any[], reportTitle = 'NSS Unit Activity Report') => {
    if (targetActivities.length === 0) {
      alert('Please select at least one activity to generate the report.');
      return;
    }

    setIsGenerating(true);

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Please allow pop-ups for this site to download the PDF report.');
      setIsGenerating(false);
      return;
    }

    const todayStr = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const reportContentHtml = targetActivities.map((act, index) => {
      const actDate = act.date 
        ? new Date(act.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'Date Not Specified';
      const hours = act.hoursAllocated || act.workingHours || 0;

      return `
        <div class="event-block">
          <div class="event-header">
            <span class="event-index">${index + 1}</span>
            <div class="event-title-wrap">
              <h2 class="event-title">${act.title || 'Untitled Activity'}</h2>
              <div class="event-meta">
                <span><strong>Date:</strong> ${actDate}</span>
                ${act.time ? `<span><strong>Timing:</strong> ${act.time}</span>` : ''}
                ${act.venue ? `<span><strong>Venue:</strong> ${act.venue}</span>` : ''}
                <span><strong>Allocated NSS Hours:</strong> ${hours} Hours</span>
                <span><strong>Status:</strong> ${act.isRegistrationOpen ? 'Registration Active' : 'Completed Activity'}</span>
              </div>
            </div>
          </div>
          <div class="event-description">
            <h4 class="section-label">ACTIVITY BRIEF & OFFICIAL REPORT:</h4>
            <p class="description-text">${act.description || 'No description recorded for this activity.'}</p>
          </div>
          <div style="margin-top: 10px; font-size: 11px; color: #64748b; border-top: 1px dashed #e2e8f0; padding-top: 6px;">
            <span><strong>Live Event Record:</strong> ${typeof window !== 'undefined' ? window.location.origin : ''}/activities/${act._id}</span>
          </div>
        </div>
      `;
    }).join('');

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            @page {
              size: A4;
              margin: 18mm 15mm 18mm 15mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #1a202c;
              margin: 0;
              padding: 0;
              line-height: 1.5;
            }
            .report-container {
              max-width: 800px;
              margin: 0 auto;
            }
            .org-header {
              text-align: center;
              border-bottom: 2.5px solid #1e3a8a;
              padding-bottom: 12px;
              margin-bottom: 20px;
            }
            .org-emblem {
              font-size: 13px;
              font-weight: 800;
              color: #dc2626;
              letter-spacing: 1.5px;
              text-transform: uppercase;
              margin-bottom: 2px;
            }
            .org-title {
              font-size: 22px;
              font-weight: 900;
              color: #1e3a8a;
              margin: 0;
              letter-spacing: -0.5px;
            }
            .org-sub {
              font-size: 12px;
              color: #4b5563;
              margin: 2px 0 0 0;
              font-weight: 600;
            }
            .doc-title-bar {
              background: #f1f5f9;
              padding: 8px 12px;
              border-radius: 6px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 24px;
              font-size: 11px;
              font-weight: bold;
              color: #334155;
              border: 1px solid #e2e8f0;
            }
            .event-block {
              margin-bottom: 24px;
              padding: 16px;
              border: 1px solid #cbd5e1;
              border-radius: 8px;
              background: #ffffff;
              page-break-inside: avoid;
            }
            .event-header {
              display: flex;
              gap: 12px;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 10px;
              margin-bottom: 12px;
            }
            .event-index {
              background: #1e3a8a;
              color: #ffffff;
              width: 26px;
              height: 26px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 900;
              font-size: 12px;
              flex-shrink: 0;
            }
            .event-title-wrap {
              flex: 1;
            }
            .event-title {
              font-size: 16px;
              font-weight: 900;
              color: #0f172a;
              margin: 0 0 6px 0;
            }
            .event-meta {
              display: flex;
              flex-wrap: wrap;
              gap: 12px;
              font-size: 11px;
              color: #475569;
            }
            .section-label {
              font-size: 10px;
              font-weight: 900;
              color: #1e3a8a;
              letter-spacing: 0.8px;
              margin: 0 0 4px 0;
            }
            .description-text {
              font-size: 12px;
              color: #334155;
              text-align: justify;
              margin: 0;
              line-height: 1.6;
              white-space: pre-line;
            }
            .report-footer {
              margin-top: 36px;
              padding-top: 14px;
              border-top: 1px solid #e2e8f0;
              display: flex;
              justify-content: space-between;
              font-size: 10px;
              color: #64748b;
              page-break-inside: avoid;
            }
            @media print {
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="report-container">
            <div class="org-header">
              <div class="org-emblem">Ministry of Youth Affairs & Sports • Government of India</div>
              <h1 class="org-title">NATIONAL SERVICE SCHEME (NSS) UNIT</h1>
              <p class="org-sub">VIT Bhopal University, Bhopal-Indore Highway, Kothri Kalan, Sehore, Madhya Pradesh - 466114</p>
            </div>

            <div class="doc-title-bar">
              <span>OFFICIAL ACTIVITY REPORT</span>
              <span>Generated: ${todayStr}</span>
              <span>Total Events: ${targetActivities.length}</span>
            </div>

            ${reportContentHtml}

            <div class="report-footer">
              <span>National Service Scheme • VIT Bhopal University</span>
              <span>Authorized Signatory / Program Officer</span>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(fullHtml);
    printWindow.document.close();
    setIsGenerating(false);
  };

  const handleDownloadCombined = () => {
    const selectedList = activities.filter((a) => selectedIds.includes(a._id));
    handleGeneratePdf(selectedList, `NSS-Unit-Combined-Activity-Report-${selectedList.length}-Events`);
  };

  const handleDownloadSingle = (act: any) => {
    handleGeneratePdf([act], `NSS-Unit-Activity-Report-${act.title.replace(/[^a-zA-Z0-9]/g, '_')}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <FileText className="text-nss-blue" size={26} /> Activity Reports Generator
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Select one or more events to generate and download official, beautifully formatted PDF activity reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live DB Synced ({activities.length})
          </span>

          <Link
            href="/admin/activities/new"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-nss-blue text-white font-bold text-xs rounded-xl hover:bg-blue-800 transition-colors shadow-2xs"
          >
            <Plus size={14} /> Add Event
          </Link>

          <Link
            href="/admin/activities"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 transition-colors"
          >
            Manage All
          </Link>

          <button
            onClick={fetchActivities}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors cursor-pointer shrink-0"
            title="Refresh activities directly from database"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Action Bar & Multi-Select Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search activities by title, venue, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-nss-blue/20 focus:border-nss-blue"
          />
        </div>

        {/* Buttons & Selection Status */}
        <div className="flex flex-wrap items-center gap-2.5 justify-end">
          <button
            onClick={handleSelectAllFiltered}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {selectedIds.length === filteredActivities.length && filteredActivities.length > 0 ? (
              <>
                <CheckSquare size={14} className="text-nss-blue" /> Deselect All
              </>
            ) : (
              <>
                <Square size={14} /> Select All ({filteredActivities.length})
              </>
            )}
          </button>

          <button
            onClick={handleDownloadCombined}
            disabled={selectedIds.length === 0 || isGenerating}
            className="px-5 py-2 bg-gradient-to-r from-nss-blue to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Printer size={15} />
            <span>Download Selected PDF ({selectedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Activities Table / List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="w-8 h-8 border-2 border-nss-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs font-bold text-gray-600">Loading activities...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-rose-600 text-xs font-bold">{error}</div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-xs font-medium">
            No activities matched your search query.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredActivities.map((act) => {
              const isSelected = selectedIds.includes(act._id);
              const actDate = act.date
                ? new Date(act.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'TBA';
              const hours = act.hoursAllocated || act.workingHours || 0;

              return (
                <div
                  key={act._id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                    isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(act._id)}
                      className="mt-1 w-4 h-4 text-nss-blue rounded border-gray-300 focus:ring-nss-blue cursor-pointer shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                          {act.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-nss-blue shrink-0">
                          {hours} Hrs
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-medium mb-1.5">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-nss-blue" /> {actDate}
                        </span>
                        {act.time && (
                          <span className="flex items-center gap-1">
                            <Clock size={13} className="text-amber-600" /> {act.time}
                          </span>
                        )}
                        {act.venue && (
                          <span className="flex items-center gap-1 truncate max-w-xs">
                            <MapPin size={13} className="text-rose-500" /> {act.venue}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {act.description || 'No description available.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Link
                      href={`/activities/${act._id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 font-semibold text-xs rounded-xl transition-all"
                      title="View public event page"
                    >
                      <ExternalLink size={12} />
                      <span>View Page</span>
                    </Link>

                    <button
                      onClick={() => handleDownloadSingle(act)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-nss-blue hover:text-nss-blue text-gray-700 font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
                      title="Download PDF report for this activity"
                    >
                      <Download size={13} />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
