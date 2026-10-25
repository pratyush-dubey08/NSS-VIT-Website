'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Upload,
  Edit,
  Users,
  User,
  Trash2,
  FileSpreadsheet,
  Download,
  CheckSquare,
  Square,
  MinusSquare,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  MoreVertical,
  FileText,
  Sparkles,
  FileEdit
} from 'lucide-react';
import api from '@/lib/axios';

import AddVolunteerModal from '@/components/admin/AddVolunteerModal';
import BulkAddModal from '@/components/admin/BulkAddModal';
import EditVolunteerModal from '@/components/admin/EditVolunteerModal';
import VolunteerReportModal from '@/components/admin/VolunteerReportModal';
import NewBatchModal from '@/components/admin/NewBatchModal';
import ChangeRequestsModal from '@/components/admin/ChangeRequestsModal';

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isNewBatchModalOpen, setIsNewBatchModalOpen] = useState(false);
  const [activeBatchPreset, setActiveBatchPreset] = useState('');
  const [editingVolunteer, setEditingVolunteer] = useState<any>(null);
  const [selectedReportVolunteer, setSelectedReportVolunteer] = useState<any>(null);
  const [isChangeRequestsModalOpen, setIsChangeRequestsModalOpen] = useState(false);
  const [pendingChangeRequestsCount, setPendingChangeRequestsCount] = useState(0);

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users');
      setVolunteers(data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChangeRequestsCount = async () => {
    try {
      const { data } = await api.get('/users/change-requests');
      if (Array.isArray(data)) {
        setPendingChangeRequestsCount(data.filter((r: any) => r.status === 'Pending').length);
      }
    } catch (e) {
      console.error('Error fetching change requests count:', e);
    }
  };

  useEffect(() => {
    fetchVolunteers();
    fetchChangeRequestsCount();
  }, []);

  const handleDeleteVolunteer = async (id: string, name?: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${name ? `"${name}"` : 'this volunteer'}? This cannot be undone.`)) {
      return;
    }
    
    try {
      await api.delete(`/users/${id}`);
      alert('Volunteer deleted successfully');
      setSelectedIds(prev => prev.filter(item => item !== id));
      fetchVolunteers();
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      alert('Failed to delete volunteer.');
    }
  };

  // Bulk Delete Handler
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const count = selectedIds.length;
    const confirmMsg = `WARNING: You are about to permanently delete ${count} selected volunteer${count > 1 ? 's' : ''}.

This will also remove their attendance and participation records across all events. Are you sure you want to proceed?`;

    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      setIsDeletingBulk(true);
      const { data } = await api.post('/users/bulk-delete', { ids: selectedIds, userIds: selectedIds });
      alert(data.message || `Successfully deleted ${count} volunteers.`);
      setSelectedIds([]);
      fetchVolunteers();
    } catch (error: any) {
      console.error('Error bulk deleting volunteers:', error);
      alert(error.response?.data?.message || 'Failed to delete selected volunteers.');
    } finally {
      setIsDeletingBulk(false);
    }
  };

  // One-Click Full Details CSV Sheet Export
  const handleDownloadSheet = (targetVolunteers?: any[]) => {
    const listToExport = targetVolunteers && targetVolunteers.length > 0 ? targetVolunteers : filteredVolunteers;
    
    if (listToExport.length === 0) {
      alert('No volunteer data available to export.');
      return;
    }

    // CSV Headers
    const headers = [
      'Full Name',
      'Registration Number',
      'Email Address',
      'Contact Number',
      'Batch',
      'Gender',
      'Residence Type',
      'Events Attended Count'
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = listToExport.map(v => [
      escapeCsv(v.name || ''),
      escapeCsv(v.registrationNumber || ''),
      escapeCsv(v.email || ''),
      escapeCsv(v.phoneNumber || ''),
      escapeCsv(v.batch || ''),
      escapeCsv(v.gender || ''),
      escapeCsv(v.residenceType || ''),
      escapeCsv(v.participatedActivities ? v.participatedActivities.length : 0)
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.setAttribute('download', `NSS_VIT_Bhopal_Volunteers_Sheet_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Toggle single volunteer selection
  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Toggle all visible volunteers in a table
  const toggleSelectBatch = (batchData: any[]) => {
    const batchIds = batchData.map(v => v._id);
    const allSelected = batchIds.length > 0 && batchIds.every(id => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !batchIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...batchIds])));
    }
  };

  // Select all filtered volunteers
  const handleSelectAllFiltered = () => {
    const allFilteredIds = filteredVolunteers.map(v => v._id);
    setSelectedIds(allFilteredIds);
  };

  // Clear all selections
  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const filteredVolunteers = volunteers.filter(v => 
    v.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStats = (batchData: any[]) => {
    const total = batchData.length;
    const male = batchData.filter(v => v.gender === 'Male').length;
    const female = batchData.filter(v => v.gender === 'Female').length;
    const hosteller = batchData.filter(v => v.residenceType === 'Hosteller').length;
    const dayScholar = batchData.filter(v => v.residenceType === 'Day Scholar').length;
    return { total, male, female, hosteller, dayScholar };
  };

  // Dynamically group filtered volunteers by batch
  const batchMap = new Map<string, any[]>();
  filteredVolunteers.forEach(v => {
    const b = (v.batch ? String(v.batch) : '').trim();
    if (!b) return;
    if (!batchMap.has(b)) batchMap.set(b, []);
    batchMap.get(b)!.push(v);
  });

  // Sort batches in descending order (e.g. 2026, 2025, 2024...)
  const distinctBatches = Array.from(batchMap.keys()).sort((a, b) => {
    const numA = parseInt(a) || 0;
    const numB = parseInt(b) || 0;
    return numB - numA;
  });

  const unassignedVolunteers = filteredVolunteers.filter(v => !(v.batch ? String(v.batch) : '').trim());

  const renderTable = (data: any[], batchLabel: string) => {
    const batchIds = data.map(v => v._id);
    const isAllBatchSelected = batchIds.length > 0 && batchIds.every(id => selectedIds.includes(id));
    const isSomeBatchSelected = batchIds.some(id => selectedIds.includes(id)) && !isAllBatchSelected;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        
        {/* Table Subheader with Batch Select Toggle */}
        <div className="p-4 bg-gray-50/70 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleSelectBatch(data)}
              disabled={data.length === 0}
              className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-nss-blue transition-colors px-2.5 py-1 rounded-lg hover:bg-white border border-transparent hover:border-gray-200"
            >
              {isAllBatchSelected ? (
                <CheckSquare size={16} className="text-nss-blue" />
              ) : isSomeBatchSelected ? (
                <MinusSquare size={16} className="text-nss-blue" />
              ) : (
                <Square size={16} className="text-gray-400" />
              )}
              <span>{isAllBatchSelected ? 'Deselect All in' : 'Select All in'} {batchLabel} ({data.length})</span>
            </button>
          </div>

          <div className="text-xs text-gray-500 font-semibold">
            {data.filter(v => selectedIds.includes(v._id)).length} selected in this batch
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-bold text-gray-500">
                <th className="p-4 w-12 text-center">
                  <span className="sr-only">Select</span>
                </th>
                <th className="p-4">Name</th>
                <th className="p-4">Reg. No.</th>
                <th className="p-4">Contact Number</th>
                <th className="p-4">Gender & Res.</th>
                <th className="p-4">Events Attended</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center font-bold text-gray-500">
                    No volunteers found in {batchLabel}.
                  </td>
                </tr>
              ) : (
                data.map(volunteer => {
                  const isSelected = selectedIds.includes(volunteer._id);

                  return (
                    <tr
                      key={volunteer._id}
                      className={`border-b border-gray-50 transition-colors ${
                        isSelected ? 'bg-blue-50/50 hover:bg-blue-50/70' : 'hover:bg-gray-50/50'
                      }`}
                    >
                      {/* Checkbox Column */}
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(volunteer._id)}
                          className="w-4 h-4 rounded text-nss-blue focus:ring-nss-blue cursor-pointer border-gray-300"
                        />
                      </td>

                      {/* Name & Email */}
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{volunteer.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{volunteer.email || '-'}</div>
                      </td>

                      {/* Reg No */}
                      <td className="p-4 text-gray-700 font-semibold font-mono text-sm">
                        {volunteer.registrationNumber}
                      </td>

                      {/* Phone */}
                      <td className="p-4 text-gray-600 text-sm">
                        {volunteer.phoneNumber || '-'}
                      </td>

                      {/* Gender & Residence */}
                      <td className="p-4">
                        <div className="text-sm text-gray-900 font-semibold">{volunteer.gender || '-'}</div>
                        <div className="text-xs text-gray-500 font-medium">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            volunteer.residenceType === 'Hosteller'
                              ? 'bg-purple-50 text-purple-700'
                              : volunteer.residenceType === 'Day Scholar'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {volunteer.residenceType || 'Not specified'}
                          </span>
                        </div>
                      </td>

                      {/* Events Count */}
                      <td className="p-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-nss-blue font-bold text-sm">
                          {volunteer.participatedActivities?.length || 0}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setSelectedReportVolunteer(volunteer)}
                            className="p-2 text-slate-700 hover:text-nss-blue hover:bg-blue-50 rounded-lg transition-all inline-flex items-center gap-1 border border-slate-200/80 shadow-2xs hover:shadow-xs cursor-pointer"
                            title="View Volunteer Info & Attendance Report Card"
                          >
                            <MoreVertical size={16} className="text-slate-700" />
                            <span className="text-xs font-bold hidden xl:inline">Info & Report</span>
                          </button>
                          <button 
                            onClick={() => setEditingVolunteer(volunteer)}
                            className="p-2 text-gray-500 hover:text-nss-blue hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1"
                            title="Edit Volunteer"
                          >
                            <Edit size={16} /> <span className="text-xs font-bold">Edit</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteVolunteer(volunteer._id, volunteer.name)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-1"
                            title="Delete Volunteer"
                          >
                            <Trash2 size={16} /> <span className="text-xs font-bold">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* New Batch Modal */}
      <NewBatchModal 
        isOpen={isNewBatchModalOpen}
        onClose={() => setIsNewBatchModalOpen(false)}
        onStartBulk={(batch) => {
          setActiveBatchPreset(batch);
          setIsNewBatchModalOpen(false);
          setIsBulkModalOpen(true);
        }}
        onStartSingle={(batch) => {
          setActiveBatchPreset(batch);
          setIsNewBatchModalOpen(false);
          setIsAddModalOpen(true);
        }}
      />

      <AddVolunteerModal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setActiveBatchPreset('');
        }} 
        onSuccess={fetchVolunteers}
        defaultBatch={activeBatchPreset}
        availableBatches={distinctBatches}
      />
      <BulkAddModal 
        isOpen={isBulkModalOpen} 
        onClose={() => {
          setIsBulkModalOpen(false);
          setActiveBatchPreset('');
        }} 
        onSuccess={fetchVolunteers}
        defaultBatch={activeBatchPreset}
        availableBatches={distinctBatches}
      />
      <EditVolunteerModal 
        isOpen={!!editingVolunteer}
        onClose={() => setEditingVolunteer(null)}
        onSuccess={fetchVolunteers}
        volunteer={editingVolunteer}
        availableBatches={distinctBatches}
      />

      {/* Volunteer Info & Attendance Report Card Modal */}
      <VolunteerReportModal
        isOpen={!!selectedReportVolunteer}
        onClose={() => setSelectedReportVolunteer(null)}
        volunteer={selectedReportVolunteer}
      />

      {/* Volunteer Detail Change Requests Modal */}
      <ChangeRequestsModal
        isOpen={isChangeRequestsModalOpen}
        onClose={() => {
          setIsChangeRequestsModalOpen(false);
          fetchChangeRequestsCount();
        }}
        onEditVolunteer={(volunteer) => {
          setEditingVolunteer(volunteer);
        }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Manage Volunteers</h1>
          <p className="text-sm text-gray-500">
            View, select, bulk manage and export registered NSS volunteers.
          </p>
        </div>
        
        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Changes Requested Button */}
          <button 
            onClick={() => setIsChangeRequestsModalOpen(true)}
            title="View volunteer detail change requests submitted by volunteers"
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all transform hover:scale-[1.02] text-sm cursor-pointer"
          >
            <FileEdit size={18} />
            <span>Changes Requested</span>
            {pendingChangeRequestsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-black bg-white text-amber-700 shadow-sm animate-pulse">
                {pendingChangeRequestsCount}
              </span>
            )}
          </button>
          {/* New Batch Button */}
          <button 
            onClick={() => setIsNewBatchModalOpen(true)}
            title="Start or onboard a new batch of volunteers (e.g. 2026 Batch)"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all transform hover:scale-[1.02] text-sm"
          >
            <Sparkles size={18} />
            <span>+ New Batch</span>
          </button>

          {/* One-Click Download Sheet Button */}
          <button 
            onClick={() => handleDownloadSheet()}
            title="Download complete details sheet of all volunteers (Name, Reg No, Email, Contact, Gender, Residential Status)"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all transform hover:scale-[1.02] text-sm"
          >
            <FileSpreadsheet size={18} />
            <span>Download Details Sheet</span>
          </button>

          <button 
            onClick={() => {
              setActiveBatchPreset('');
              setIsBulkModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
          >
            <Upload size={18} /> Bulk Add
          </button>
          
          <button 
            onClick={() => {
              setActiveBatchPreset('');
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-sm text-sm"
          >
            <Plus size={18} /> Add Single
          </button>
        </div>
      </div>

      {/* Stats Cards - Dynamic Generation for All Batches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Total Volunteers Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-nss-blue rounded-xl flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Total Volunteers</p>
            <p className="text-2xl font-black text-gray-900">{filteredVolunteers.length}</p>
          </div>
        </div>
        
        {/* Dynamic Card for each Batch */}
        {distinctBatches.map((batchYear, idx) => {
          const batchList = batchMap.get(batchYear) || [];
          const stats = getStats(batchList);
          const colorStyles = [
            { bg: 'bg-green-50', text: 'text-green-600' },
            { bg: 'bg-purple-50', text: 'text-purple-600' },
            { bg: 'bg-amber-50', text: 'text-amber-600' },
            { bg: 'bg-teal-50', text: 'text-teal-600' },
            { bg: 'bg-indigo-50', text: 'text-indigo-600' },
            { bg: 'bg-rose-50', text: 'text-rose-600' },
          ];
          const color = colorStyles[idx % colorStyles.length];

          return (
            <div key={batchYear} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`w-12 h-12 ${color.bg} ${color.text} rounded-xl flex items-center justify-center shrink-0`}>
                <User size={24} />
              </div>
              <div className="w-full min-w-0">
                <p className="text-sm font-bold text-gray-500 truncate">{batchYear} Batch</p>
                <div className="flex justify-between items-end gap-2">
                  <p className="text-2xl font-black text-gray-900">{stats.total}</p>
                  <div className="text-right text-xs text-gray-500 whitespace-nowrap">
                    <p>M: <span className="font-bold text-gray-800">{stats.male}</span> | F: <span className="font-bold text-gray-800">{stats.female}</span></p>
                    <p>Hosteller: <span className="font-bold text-gray-800">{stats.hosteller}</span> | Day: <span className="font-bold text-gray-800">{stats.dayScholar}</span></p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search volunteers by name, reg no, email, or contact..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-nss-blue text-sm"
          />
        </div>

        {/* Global Multi-Select Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedIds.length > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-nss-blue bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                {selectedIds.length} volunteer{selectedIds.length > 1 ? 's' : ''} selected
              </span>

              <button
                onClick={handleClearSelection}
                className="text-xs font-semibold text-gray-500 hover:text-gray-800 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Clear Selection
              </button>

              <button
                onClick={handleSelectAllFiltered}
                className="text-xs font-semibold text-gray-700 hover:text-nss-blue px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Select All ({filteredVolunteers.length})
              </button>
            </div>
          ) : (
            <button
              onClick={handleSelectAllFiltered}
              disabled={filteredVolunteers.length === 0}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-nss-blue px-3 py-2 rounded-xl hover:bg-gray-50 border border-gray-200 transition-colors disabled:opacity-50"
            >
              <CheckSquare size={14} /> Select All Volunteers
            </button>
          )}
        </div>
      </div>

      {/* Floating Multi-Action Bar when items are selected */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 animate-fade-in border border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold">
              {selectedIds.length} volunteer{selectedIds.length > 1 ? 's' : ''} marked for bulk operations
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Export Selected Only */}
            <button
              onClick={() => {
                const selectedData = filteredVolunteers.filter(v => selectedIds.includes(v._id));
                handleDownloadSheet(selectedData);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
            >
              <Download size={14} /> Export Selected Sheet
            </button>

            {/* Bulk Delete Button */}
            <button
              onClick={handleBulkDelete}
              disabled={isDeletingBulk}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isDeletingBulk ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={14} /> Delete Selected ({selectedIds.length})
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Tables Display for Each Batch */}
      {loading ? (
        <div className="p-12 text-center font-bold text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3">
          <RefreshCw size={24} className="animate-spin text-nss-blue" />
          <span>Loading volunteers database...</span>
        </div>
      ) : (
        <>
          {distinctBatches.map(batchYear => {
            const batchList = batchMap.get(batchYear) || [];
            return (
              <div key={batchYear}>
                <h2 className="text-xl font-black text-gray-900 mt-8 mb-4 flex items-center gap-2">
                  Batch {batchYear} <span className="text-sm font-semibold text-gray-500">({batchList.length} volunteers)</span>
                </h2>
                {renderTable(batchList, `Batch ${batchYear}`)}
              </div>
            );
          })}

          {unassignedVolunteers.length > 0 && (
            <div>
              <h2 className="text-xl font-black text-gray-900 mt-8 mb-4 flex items-center gap-2">
                Other / Unassigned <span className="text-sm font-semibold text-gray-500">({unassignedVolunteers.length} volunteers)</span>
              </h2>
              {renderTable(unassignedVolunteers, 'Other / Unassigned')}
            </div>
          )}

          {distinctBatches.length === 0 && unassignedVolunteers.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
              <Users size={36} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-bold text-gray-700">No Volunteers Found</h3>
              <p className="text-sm text-gray-500 mt-1">
                {searchQuery ? 'No volunteers match your search filter.' : 'Click "+ New Batch" or "Bulk Add" to onboard volunteers.'}
              </p>
            </div>
          )}
        </>
      )}

    </div>
  );
}
