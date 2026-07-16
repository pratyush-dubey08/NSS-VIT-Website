'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Upload, Edit, Users, User, ShieldAlert, Trash2 } from 'lucide-react';
import api from '@/lib/axios';

import AddVolunteerModal from '@/components/admin/AddVolunteerModal';
import BulkAddModal from '@/components/admin/BulkAddModal';
import EditVolunteerModal from '@/components/admin/EditVolunteerModal';

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState<any>(null);

  const fetchVolunteers = async () => {
    try {
      const { data } = await api.get('/users');
      setVolunteers(data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVolunteer = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this volunteer? This cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/users/${id}`);
      alert('Volunteer deleted successfully');
      fetchVolunteers();
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      alert('Failed to delete volunteer');
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const filteredVolunteers = volunteers.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const batch2024 = filteredVolunteers.filter(v => v.batch === '2024');
  const batch2025 = filteredVolunteers.filter(v => v.batch === '2025');

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

  const renderTable = (data: any[]) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-bold text-gray-500">
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
                <td colSpan={6} className="p-8 text-center font-bold text-gray-500">No volunteers found.</td>
              </tr>
            ) : data.map(volunteer => (
              <tr key={volunteer._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-gray-900">{volunteer.name}</div>
                  <div className="text-xs text-gray-500">{volunteer.email}</div>
                </td>
                <td className="p-4 text-gray-600 font-medium">{volunteer.registrationNumber}</td>
                <td className="p-4 text-gray-600">{volunteer.phoneNumber || '-'}</td>
                <td className="p-4">
                  <div className="text-sm text-gray-900 font-medium">{volunteer.gender || '-'}</div>
                  <div className="text-xs text-gray-500">{volunteer.residenceType || '-'}</div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-nss-blue font-bold text-sm">
                    {volunteer.participatedActivities?.length || 0}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setEditingVolunteer(volunteer)}
                      className="p-2 text-gray-400 hover:text-nss-blue hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Edit size={16} /> <span className="text-sm font-bold">Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteVolunteer(volunteer._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Trash2 size={16} /> <span className="text-sm font-bold">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Volunteers</h1>
          <p className="text-sm text-gray-500">View and manage all registered NSS volunteers.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Upload size={18} /> Bulk Add
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors"
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

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or reg no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-blue outline-none transition-shadow text-sm"
          />
        </div>
      </div>

      {/* Tables */}
      {loading ? (
        <div className="p-8 text-center font-bold text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">Loading volunteers...</div>
      ) : (
        <>
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Batch 2024</h2>
          {renderTable(batch2024)}

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Batch 2025</h2>
          {renderTable(batch2025)}
        </>
      )}

    </div>
  );
}
