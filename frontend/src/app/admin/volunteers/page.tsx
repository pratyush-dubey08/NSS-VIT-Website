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
  FileText
} from 'lucide-react';
import api from '@/lib/axios';

import AddVolunteerModal from '@/components/admin/AddVolunteerModal';
import BulkAddModal from '@/components/admin/BulkAddModal';
import EditVolunteerModal from '@/components/admin/EditVolunteerModal';
import VolunteerReportModal from '@/components/admin/VolunteerReportModal';

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState<any>(null);
  const [selectedReportVolunteer, setSelectedReportVolunteer] = useState<any>(null);

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

  useEffect(() => {
    fetchVolunteers();
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
      alert('Failed to delete volunteer');
    }
  };

  // Bulk Delete Functionality
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const confirmMessage = `Are you sure you want to permanently delete ${selectedIds.length} selected volunteer(s)?\n\nThis action cannot be undone.`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsDeletingBulk(true);
    try {
      try {
        await api.post('/users/bulk-delete', { ids: selectedIds });
      } catch (err: any) {
        // Fallback to parallel deletion if bulk endpoint isn't reached
        await Promise.all(selectedIds.map(id => api.delete(`/users/${id}`)));
      }

      alert(`Successfully deleted ${selectedIds.length} volunteer(s).`);
      setSelectedIds([]);
      fetchVolunteers();
    } catch (error) {
      console.error('Error in bulk delete:', error);
      alert('Some or all volunteers could not be deleted. Please check permissions and try again.');
      fetchVolunteers();
    } finally {
      setIsDeletingBulk(false);
    }
  };

  // One-Click Download Details Sheet (CSV with Excel BOM)
  const handleDownloadSheet = (targetData?: any[]) => {
    const dataToExport = targetData && targetData.length > 0 ? targetData : volunteers;

    if (dataToExport.length === 0) {
      alert('No volunteer data available to export.');
      return;
    }

    const headers = [
      'S.No.',
      'Full Name',
      'Registration Number',
      'Email Address',
      'Contact Number',
      'Gender',
      'Residential Status',
      'Batch',
      'Events Attended'
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = dataToExport.map((v, idx) => [
      escapeCsv(idx + 1),
      escapeCsv(v.name || ''),
      escapeCsv(v.registrationNumber || ''),
      escapeCsv(v.email || ''),
      escapeCsv(v.phoneNumber || ''),
      escapeCsv(v.gender || ''),
      escapeCsv(v.residenceType || ''),
      escapeCsv(v.batch || ''),
      escapeCsv(v.participatedActivities?.length || 0)
    ]);

    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\r\n');

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

  const batch2024 = filteredVolunteers.filter(v => v.batch === '2024');
  const batch2025 = filteredVolunteers.filter(v => v.batch === '2025');
  const otherBatches = filteredVolunteers.filter(v => v.batch !== '2024' && v.batch !== '2025');

  const getStats = (batchData: any[]) => {
    const total = batchData.length;
    const male = batchData.filter(v => v.gender === 'Male').length;
    const female = batchData.filter(v => v.gender === 'Female').length;
    const hosteller = batchData.filter(v => v.residenceType === 'Hosteller').length;
    const dayScholar = batchData.filter(v => v.residenceType === 'Day Scholar').length;
    return { total, male, female, hosteller, dayScholar };
  };

  const stats2024 = getStats(batch2024);
  const stats2025 = getStats(batch2025);

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
      <AddVolunteerModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchVolunteers} 
      />
      <BulkAddModal 
        isOpen={isBulkModalOpen} 
        onClose={() => setIsBulkModalOpen(false)} 
        onSuccess={fetchVolunteers} 
      />
      <EditVolunteerModal 
        isOpen={!!editingVolunteer}
        onClose={() => setEditingVolunteer(null)}
        onSuccess={fetchVolunteers}
        volunteer={editingVolunteer}
      />

      {/* Volunteer Info & Attendance Report Card Modal */}
      <VolunteerReportModal
        isOpen={!!selectedReportVolunteer}
        onClose={() => setSelectedReportVolunteer(null)}
        volunteer={selectedReportVolunteer}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Manage Volunteers</h1>
          <p className="text-sm text-gray-500">
            View, select, bulk manage and export registered NSS volunteers.
          </p>
        </div>
        
        {/* Top Action Buttons (Including One-Click Sheet Download) */}
        <div className="flex flex-wrap items-center gap-2">
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
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
          >
            <Upload size={18} /> Bulk Add
          </button>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-sm text-sm"
          >
            <Plus size={18} /> Add Single
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-nss-blue rounded-xl flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Total Volunteers</p>
            <p className="text-2xl font-black text-gray-900">{filteredVolunteers.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
            <User size={24} />
          </div>
          <div className="w-full">
            <p className="text-sm font-bold text-gray-500">2024 Batch</p>
            <div className="flex justify-between items-end">
              <p className="text-2xl font-black text-gray-900">{stats2024.total}</p>
              <div className="text-right">
                <p className="text-xs text-gray-500">M: <span className="font-bold">{stats2024.male}</span> | F: <span className="font-bold">{stats2024.female}</span></p>
                <p className="text-xs text-gray-500">Hosteller: <span className="font-bold">{stats2024.hosteller}</span> | Day Scholar: <span className="font-bold">{stats2024.dayScholar}</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <User size={24} />
          </div>
          <div className="w-full">
            <p className="text-sm font-bold text-gray-500">2025 Batch</p>
            <div className="flex justify-between items-end">
              <p className="text-2xl font-black text-gray-900">{stats2025.total}</p>
              <div className="text-right">
                <p className="text-xs text-gray-500">M: <span className="font-bold">{stats2025.male}</span> | F: <span className="font-bold">{stats2025.female}</span></p>
                <p className="text-xs text-gray-500">Hosteller: <span className="font-bold">{stats2025.hosteller}</span> | Day Scholar: <span className="font-bold">{stats2025.dayScholar}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name, reg no, email, or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-blue outline-none transition-shadow text-sm font-medium"
          />
        </div>

        {/* Global Multi-Select Actions (Select All Filtered / Export Filtered) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSelectAllFiltered}
            disabled={filteredVolunteers.length === 0}
            className="px-3.5 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <CheckSquare size={15} /> Select All Filtered ({filteredVolunteers.length})
          </button>

          {searchQuery && (
            <button
              onClick={() => handleDownloadSheet(filteredVolunteers)}
              className="px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Download size={15} /> Export Filtered ({filteredVolunteers.length})
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          STICKY MULTI-SELECT ACTION BAR (Appears when 1 or more volunteers selected)
      ========================================================================= */}
      {selectedIds.length > 0 && (
        <div className="sticky top-24 z-30 bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-slate-800 flex flex-wrap justify-between items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 font-black text-sm">
              {selectedIds.length}
            </span>
            <div>
              <p className="font-bold text-sm">
                {selectedIds.length} volunteer{selectedIds.length > 1 ? 's' : ''} selected
              </p>
              <p className="text-xs text-slate-400">
                You can delete them in one click or export only their details.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Download selected sheet */}
            <button
              onClick={() => {
                const selectedData = volunteers.filter(v => selectedIds.includes(v._id));
                handleDownloadSheet(selectedData);
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Download size={14} /> Export Selected ({selectedIds.length})
            </button>

            {/* Clear Selection */}
            <button
              onClick={handleClearSelection}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <X size={14} /> Deselect All
            </button>

            {/* Bulk Delete Selected Button */}
            <button
              onClick={handleBulkDelete}
              disabled={isDeletingBulk}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50"
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

      {/* Tables Display */}
      {loading ? (
        <div className="p-12 text-center font-bold text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3">
          <RefreshCw size={24} className="animate-spin text-nss-blue" />
          <span>Loading volunteers database...</span>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-black text-gray-900 mt-8 mb-4 flex items-center gap-2">
            Batch 2024 <span className="text-sm font-semibold text-gray-500">({batch2024.length} volunteers)</span>
          </h2>
          {renderTable(batch2024, 'Batch 2024')}

          <h2 className="text-xl font-black text-gray-900 mt-8 mb-4 flex items-center gap-2">
            Batch 2025 <span className="text-sm font-semibold text-gray-500">({batch2025.length} volunteers)</span>
          </h2>
          {renderTable(batch2025, 'Batch 2025')}

          {otherBatches.length > 0 && (
            <>
              <h2 className="text-xl font-black text-gray-900 mt-8 mb-4 flex items-center gap-2">
                Other Batches / Unassigned <span className="text-sm font-semibold text-gray-500">({otherBatches.length} volunteers)</span>
              </h2>
              {renderTable(otherBatches, 'Other Batches')}
            </>
          )}
        </>
      )}

    </div>
  );
}
