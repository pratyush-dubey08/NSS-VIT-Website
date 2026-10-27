'use client';

import { compressImage } from '@/lib/imageCompressor';

import { useState, useEffect } from 'react';
import { Plus, Trash2, FileText, Upload, Download, Sparkles, Link as LinkIcon, ExternalLink, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';
import api from '@/lib/axios';

const COLOR_PRESETS = [
  { name: 'Dark', value: '#111827' },
  { name: 'NSS Blue', value: '#003366' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Crimson', value: '#dc2626' },
  { name: 'Purple', value: '#7c3aed' }
];

export default function AdminResources() {
  const [activeTab, setActiveTab] = useState<'forms' | 'files'>('forms');

  // File Resources state
  const [resources, setResources] = useState<any[]>([]);
  const [fileTitle, setFileTitle] = useState('');
  const [category, setCategory] = useState('document');
  const [file, setFile] = useState<File | null>(null);
  const [directUrl, setDirectUrl] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [loadingFiles, setLoadingFiles] = useState(true);

  // Volunteer Forms state
  const [volunteerForms, setVolunteerForms] = useState<any[]>([]);
  const [loadingForms, setLoadingForms] = useState(true);
  const [isCreatingForm, setIsCreatingForm] = useState(false);

  // Form Fields with rich formatting
  const [formTitle, setFormTitle] = useState('');
  const [titleBold, setTitleBold] = useState(true);
  const [titleItalic, setTitleItalic] = useState(false);
  const [titleUnderline, setTitleUnderline] = useState(false);
  const [titleColor, setTitleColor] = useState('#111827');

  const [formDescription, setFormDescription] = useState('');
  const [descriptionBold, setDescriptionBold] = useState(false);
  const [descriptionItalic, setDescriptionItalic] = useState(false);
  const [descriptionUnderline, setDescriptionUnderline] = useState(false);
  const [descriptionColor, setDescriptionColor] = useState('#4b5563');

  const [googleFormUrl, setGoogleFormUrl] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    fetchResources();
    fetchVolunteerForms();
  }, []);

  const fetchResources = async () => {
    try {
      const { data } = await api.get('/resources');
      setResources(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const fetchVolunteerForms = async () => {
    try {
      const { data } = await api.get('/volunteer-forms');
      setVolunteerForms(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingForms(false);
    }
  };

  // Upload File Resource with Dedicated Cloud Upload & Progress Tracking
  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileTitle.trim()) {
      alert('Please enter a Resource Title');
      return;
    }
    if (!file && !directUrl.trim()) {
      alert('Please select a file from your device or provide a direct document URL');
      return;
    }

    setIsUploadingFile(true);
    setUploadProgress(5);
    try {
      let finalFileUrl = directUrl.trim();

      // If file selected, upload via /upload endpoint
      if (file) {
        let fileToUpload: File = file;

        // Auto-compress large photos and scans using client-side canvas optimization
        if (file.type.startsWith('image/')) {
          try {
            fileToUpload = await compressImage(file, { maxWidth: 2400, quality: 0.85 });
          } catch (compErr) {
            console.warn('Could not compress image, proceeding with original:', compErr);
          }
        }

        const uploadFormData = new FormData();
        uploadFormData.append('file', fileToUpload);

        const uploadRes = await api.post('/upload', uploadFormData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 90) / progressEvent.total);
              setUploadProgress(Math.max(10, percent));
            }
          }
        });

        finalFileUrl = uploadRes.data?.url || uploadRes.data?.fileUrl || uploadRes.data?.secure_url;
        if (!finalFileUrl && uploadRes.data?.filename) {
          finalFileUrl = `/uploads/${uploadRes.data.filename}`;
        }

        if (!finalFileUrl) {
          throw new Error('Upload succeeded on server but returned an empty URL.');
        }
      }

      setUploadProgress(95);

      // Save resource document in MongoDB
      await api.post('/resources', {
        title: fileTitle.trim(),
        category: category || 'document',
        fileUrl: finalFileUrl
      });

      setUploadProgress(100);
      setFileTitle('');
      setFile(null);
      setDirectUrl('');

      const fileInput = document.getElementById('resource-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      fetchResources();
      alert('✓ Resource saved and published successfully!');
    } catch (err: any) {
      console.error('Resource upload failed:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to upload resource';
      alert('Failed to upload resource: ' + msg);
    } finally {
      setIsUploadingFile(false);
      setUploadProgress(null);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await api.delete(`/resources/${id}`);
      setResources(resources.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Create Volunteer Form
  const handleCreateVolunteerForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !googleFormUrl.trim()) {
      alert('Please provide Form Title and Google Form URL');
      return;
    }

    setIsCreatingForm(true);
    try {
      await api.post('/volunteer-forms', {
        title: formTitle.trim(),
        titleBold,
        titleItalic,
        titleUnderline,
        titleColor,
        description: formDescription.trim(),
        descriptionBold,
        descriptionItalic,
        descriptionUnderline,
        descriptionColor,
        googleFormUrl: googleFormUrl.trim(),
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        isActive: true
      });

      setFormTitle('');
      setFormDescription('');
      setGoogleFormUrl('');
      setDeadline('');
      fetchVolunteerForms();
      alert('✓ Volunteer Form published successfully! It will now appear on Volunteer Resources and Dashboard.');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create volunteer form');
    } finally {
      setIsCreatingForm(false);
    }
  };

  const handleToggleFormStatus = async (form: any) => {
    try {
      await api.put(`/volunteer-forms/${form._id}`, { isActive: !form.isActive });
      setVolunteerForms(volunteerForms.map(f => f._id === form._id ? { ...f, isActive: !f.isActive } : f));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVolunteerForm = async (id: string) => {
    if (!confirm('Are you sure you want to delete this volunteer form?')) return;
    try {
      await api.delete(`/volunteer-forms/${id}`);
      setVolunteerForms(volunteerForms.filter((f) => f._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Resource Management & Volunteer Forms</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Publish Google Forms, guidelines, and document resources for volunteers.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('forms')}
          className={'px-5 py-3 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ' + (
            activeTab === 'forms' ? 'border-nss-blue text-nss-blue' : 'border-transparent text-gray-500 hover:text-gray-800'
          )}
        >
          <Sparkles size={16} /> Volunteer Forms (Google Forms)
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-blue-50 text-nss-blue font-bold">
            ({volunteerForms.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={'px-5 py-3 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ' + (
            activeTab === 'files' ? 'border-nss-blue text-nss-blue' : 'border-transparent text-gray-500 hover:text-gray-800'
          )}
        >
          <FileText size={16} /> Uploaded Files & Documents
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-700 font-bold">
            ({resources.length})
          </span>
        </button>
      </div>

      {/* TAB 1: VOLUNTEER FORMS */}
      {activeTab === 'forms' && (
        <div className="space-y-8">
          {/* Create Form Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Plus size={18} className="text-nss-blue" />
                Publish New Volunteer Form (Google Form)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Volunteers will see this form in their <strong>Resources Tab</strong> and at the top of their <strong>Dashboard Home</strong> so they never miss filling it out.
              </p>
            </div>

            <form onSubmit={handleCreateVolunteerForm} className="space-y-6">
              {/* Title with Formatting Toolbar */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-gray-700">Form Title</label>
                  <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setTitleBold(!titleBold)}
                      className={'w-7 h-7 text-xs font-black rounded-lg transition-all ' + (titleBold ? 'bg-nss-blue text-white' : 'text-gray-600 hover:bg-gray-200')}
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => setTitleItalic(!titleItalic)}
                      className={'w-7 h-7 text-xs italic font-serif rounded-lg transition-all ' + (titleItalic ? 'bg-nss-blue text-white' : 'text-gray-600 hover:bg-gray-200')}
                      title="Italic"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => setTitleUnderline(!titleUnderline)}
                      className={'w-7 h-7 text-xs underline rounded-lg transition-all ' + (titleUnderline ? 'bg-nss-blue text-white' : 'text-gray-600 hover:bg-gray-200')}
                      title="Underline"
                    >
                      U
                    </button>
                    <div className="w-[1px] h-5 bg-gray-200 mx-1" />
                    <div className="flex items-center gap-1">
                      {COLOR_PRESETS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setTitleColor(c.value)}
                          className={'w-5 h-5 rounded-full border transition-all ' + (titleColor === c.value ? 'ring-2 ring-offset-1 ring-nss-blue scale-110' : 'opacity-70 hover:opacity-100')}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Annual Camp Volunteer Registration Form"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-nss-blue outline-none"
                  style={{
                    color: titleColor,
                    fontWeight: titleBold ? 'bold' : 'normal',
                    fontStyle: titleItalic ? 'italic' : 'normal',
                    textDecoration: titleUnderline ? 'underline' : 'none'
                  }}
                />
              </div>

              {/* Description with Formatting Toolbar */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-gray-700">Form Description</label>
                  <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setDescriptionBold(!descriptionBold)}
                      className={'w-7 h-7 text-xs font-black rounded-lg transition-all ' + (descriptionBold ? 'bg-nss-blue text-white' : 'text-gray-600 hover:bg-gray-200')}
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescriptionItalic(!descriptionItalic)}
                      className={'w-7 h-7 text-xs italic font-serif rounded-lg transition-all ' + (descriptionItalic ? 'bg-nss-blue text-white' : 'text-gray-600 hover:bg-gray-200')}
                      title="Italic"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescriptionUnderline(!descriptionUnderline)}
                      className={'w-7 h-7 text-xs underline rounded-lg transition-all ' + (descriptionUnderline ? 'bg-nss-blue text-white' : 'text-gray-600 hover:bg-gray-200')}
                      title="Underline"
                    >
                      U
                    </button>
                    <div className="w-[1px] h-5 bg-gray-200 mx-1" />
                    <div className="flex items-center gap-1">
                      {COLOR_PRESETS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setDescriptionColor(c.value)}
                          className={'w-5 h-5 rounded-full border transition-all ' + (descriptionColor === c.value ? 'ring-2 ring-offset-1 ring-nss-blue scale-110' : 'opacity-70 hover:opacity-100')}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g., Mandatory for all 2nd and 3rd year volunteers attending the rural outreach initiative."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-nss-blue outline-none"
                  style={{
                    color: descriptionColor,
                    fontWeight: descriptionBold ? 'bold' : 'normal',
                    fontStyle: descriptionItalic ? 'italic' : 'normal',
                    textDecoration: descriptionUnderline ? 'underline' : 'none'
                  }}
                />
              </div>

              {/* Google Form URL & Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Google Form Link (URL) *
                  </label>
                  <input
                    type="url"
                    required
                    value={googleFormUrl}
                    onChange={(e) => setGoogleFormUrl(e.target.value)}
                    placeholder="https://forms.gle/... or https://docs.google.com/forms/..."
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-nss-blue outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Submission Deadline Limit (Date & Time)
                  </label>
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-nss-blue outline-none"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Volunteers will see this deadline clearly so they submit on time.
                  </p>
                </div>
              </div>

              {/* Live Preview Card */}
              {(formTitle || formDescription) && (
                <div className="p-4 bg-slate-50 border border-gray-200 rounded-2xl space-y-2">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Live Volunteer View Preview:
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-2">
                    <h4
                      style={{
                        color: titleColor,
                        fontWeight: titleBold ? 'bold' : 'normal',
                        fontStyle: titleItalic ? 'italic' : 'normal',
                        textDecoration: titleUnderline ? 'underline' : 'none'
                      }}
                      className="text-base"
                    >
                      {formTitle || 'Sample Title'}
                    </h4>
                    {formDescription && (
                      <p
                        style={{
                          color: descriptionColor,
                          fontWeight: descriptionBold ? 'bold' : 'normal',
                          fontStyle: descriptionItalic ? 'italic' : 'normal',
                          textDecoration: descriptionUnderline ? 'underline' : 'none'
                        }}
                        className="text-xs"
                      >
                        {formDescription}
                      </p>
                    )}
                    {deadline && (
                      <p className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        <Clock size={13} /> Deadline: {new Date(deadline).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isCreatingForm}
                  className="px-6 py-3 bg-nss-blue hover:bg-blue-900 text-white font-bold text-xs rounded-xl transition-all shadow-xs disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isCreatingForm ? 'Publishing...' : <><Plus size={16} /> Publish Volunteer Form</>}
                </button>
              </div>
            </form>
          </div>

          {/* List of Published Volunteer Forms */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-gray-900">
              Published Volunteer Forms ({volunteerForms.length})
            </h3>

            {loadingForms ? (
              <p className="text-xs text-gray-400">Loading forms...</p>
            ) : volunteerForms.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 p-6 text-gray-500 text-xs">
                No volunteer forms published yet. Create one above to gather responses from volunteers!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {volunteerForms.map((vf) => {
                  const isExpired = vf.deadline && new Date(vf.deadline) < new Date();
                  return (
                    <div
                      key={vf._id}
                      className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            style={{
                              color: vf.titleColor || '#111827',
                              fontWeight: vf.titleBold ? 'bold' : 'normal',
                              fontStyle: vf.titleItalic ? 'italic' : 'normal',
                              textDecoration: vf.titleUnderline ? 'underline' : 'none'
                            }}
                            className="text-sm sm:text-base leading-snug"
                          >
                            {vf.title}
                          </h4>

                          <span className={'px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ' + (
                            !vf.isActive
                              ? 'bg-gray-100 text-gray-600'
                              : isExpired
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                          )}>
                            {!vf.isActive ? 'Inactive' : isExpired ? 'Expired' : 'Active'}
                          </span>
                        </div>

                        {vf.description && (
                          <p
                            style={{
                              color: vf.descriptionColor || '#4b5563',
                              fontWeight: vf.descriptionBold ? 'bold' : 'normal',
                              fontStyle: vf.descriptionItalic ? 'italic' : 'normal',
                              textDecoration: vf.descriptionUnderline ? 'underline' : 'none'
                            }}
                            className="text-xs line-clamp-2"
                          >
                            {vf.description}
                          </p>
                        )}

                        {vf.deadline && (
                          <div className={'text-xs font-bold flex items-center gap-1.5 ' + (isExpired ? 'text-rose-600' : 'text-amber-700')}>
                            <Clock size={13} />
                            <span>Deadline: {new Date(vf.deadline).toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                        <a
                          href={vf.googleFormUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-nss-blue hover:underline flex items-center gap-1"
                        >
                          <ExternalLink size={13} /> Open Google Form
                        </a>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleFormStatus(vf)}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer"
                          >
                            {vf.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVolunteerForm(vf._id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FILES & DOCUMENTS */}
      {activeTab === 'files' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
              <Upload size={18} className="text-nss-blue" /> Upload Document / Audio
            </h2>
            <form onSubmit={handleUploadFile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Resource Title</label>
                <input 
                  type="text" 
                  required
                  value={fileTitle}
                  onChange={(e) => setFileTitle(e.target.value)}
                  placeholder="e.g. NSS Volunteer Handbook 2026"
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-nss-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-nss-blue outline-none bg-white"
                >
                  <option value="document">Document / PDF</option>
                  <option value="audio">Audio / Song</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-gray-700">Option 1: Choose File from Device (PDF, Docs, Audio, Photos up to 100MB)</label>
                    {file && (
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB {file.type.startsWith('image/') ? '• Auto-Optimized' : ''}
                      </span>
                    )}
                  </div>
                  <input 
                    id="resource-file-input"
                    type="file" 
                    onChange={(e) => {
                      setFile(e.target.files?.[0] || null);
                      if (e.target.files?.[0]) setDirectUrl('');
                    }}
                    className="w-full text-xs px-3.5 py-2 border border-gray-200 rounded-xl file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-nss-blue hover:file:bg-blue-100"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    High-speed cloud optimization enabled. Images are auto-compressed on client side; large files stream safely up to 100MB.
                  </p>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink mx-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">OR</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Option 2: Direct Document / Google Drive Link</label>
                  <input 
                    type="url"
                    value={directUrl}
                    onChange={(e) => {
                      setDirectUrl(e.target.value);
                      if (e.target.value) {
                        setFile(null);
                        const fi = document.getElementById('resource-file-input') as HTMLInputElement;
                        if (fi) fi.value = '';
                      }
                    }}
                    placeholder="https://drive.google.com/file/d/.../view or direct file URL"
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-nss-blue outline-none"
                  />
                </div>

                {uploadProgress !== null && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-nss-blue">
                      <span>Uploading to Cloud...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-nss-blue to-emerald-500 h-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 flex justify-end mt-2">
                <button 
                  type="submit" 
                  disabled={isUploadingFile}
                  className="flex items-center gap-2 bg-nss-blue text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-900 transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {isUploadingFile ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {uploadProgress !== null ? `Uploading (${uploadProgress}%)...` : 'Uploading...'}
                    </>
                  ) : (
                    <><Plus size={16} /> Upload Resource</>
                  )}
                </button>
              </div>
            </form>
          </div>

          <h3 className="text-base font-black text-gray-900 mb-3">Uploaded Documents ({resources.length})</h3>
          {loadingFiles ? (
            <p className="text-xs text-gray-400">Loading resources...</p>
          ) : resources.length === 0 ? (
            <p className="text-xs text-gray-500">No file resources uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((res) => (
                <div key={res._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-nss-blue">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{res.title}</h4>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">{res.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <a 
                      href={res.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200"
                    >
                      View
                    </a>
                    <a 
                      href={res.fileUrl} 
                      download={res.title || 'nss-resource.pdf'}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-blue-50 text-nss-blue text-xs font-bold rounded-lg hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                    >
                      <Download size={12} /> Download
                    </a>
                    <button 
                      onClick={() => handleDeleteResource(res._id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
