'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle,
  Trash2,
  Table,
  Phone
} from 'lucide-react';
import api from '@/lib/axios';

interface BulkAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface ParsedVolunteer {
  name: string;
  registrationNumber: string;
  email: string;
  phoneNumber: string;
  batch: string;
  gender: string;
  residenceType: string;
  isValid: boolean;
  rawText: string;
}

export default function BulkAddModal({ isOpen, onClose, onSuccess }: BulkAddModalProps) {
  const [csvData, setCsvData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  // Smart Parser Function
  const parsedVolunteers = useMemo(() => {
    if (!csvData || !csvData.trim()) return [];

    // Pre-process: split concatenated multi-records if newlines were accidentally omitted
    let normalized = csvData.replace(
      /(Hosteller|Days*Scholar|20d{2}|[6-9]d{9})s+([A-Z][a-zA-Zs.']+,?s*d{2}[A-Za-z]{2,5}d{4,5})/gi,
      '$1\n$2'
    );

    const lines = normalized
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (lines.length === 0) return [];

    // Check if line is a header
    const isHeaderLine = (line: string) => {
      const l = line.toLowerCase();
      const keywords = ['name', 'reg', 'registration', 'email', 'phone', 'contact', 'mobile', 'batch', 'gender', 'residence', 'hostel', 'scholar'];
      let matches = 0;
      keywords.forEach(k => {
        if (l.includes(k)) matches++;
      });
      return matches >= 2;
    };

    let headerMap: Record<number, string> | null = null;
    const results: ParsedVolunteer[] = [];

    lines.forEach((line, lineIdx) => {
      // Check first line for header keywords
      if (lineIdx === 0 && isHeaderLine(line)) {
        const delimiter = line.includes('\t') ? '\t' : line.includes(';') ? ';' : ',';
        const cols = line.split(delimiter).map(c => c.trim().toLowerCase());
        headerMap = {};
        cols.forEach((col, idx) => {
          if (col.includes('name')) headerMap![idx] = 'name';
          else if (col.includes('reg')) headerMap![idx] = 'registrationNumber';
          else if (col.includes('email') || col.includes('mail')) headerMap![idx] = 'email';
          else if (col.includes('phone') || col.includes('contact') || col.includes('mobile')) headerMap![idx] = 'phoneNumber';
          else if (col.includes('batch') || col.includes('year')) headerMap![idx] = 'batch';
          else if (col.includes('gender') || col.includes('sex')) headerMap![idx] = 'gender';
          else if (col.includes('residence') || col.includes('hostel') || col.includes('scholar')) headerMap![idx] = 'residenceType';
        });
        return; // Skip adding header line as a volunteer
      }

      const delimiter = line.includes('\t') ? '\t' : line.includes(';') ? ';' : ',';
      const rawTokens = line.split(delimiter).map(t => t.trim());
      if (rawTokens.filter(Boolean).length === 0) return;

      const volunteer: ParsedVolunteer = {
        name: '',
        registrationNumber: '',
        email: '',
        phoneNumber: '',
        batch: '',
        gender: '',
        residenceType: '',
        isValid: false,
        rawText: line
      };

      // 1. If headerMap exists, attempt header-based mapping first
      if (headerMap && Object.keys(headerMap).length > 0) {
        rawTokens.forEach((token, colIdx) => {
          const field = headerMap![colIdx];
          if (field && token) {
            (volunteer as any)[field] = token;
          }
        });
      }

      // 2. Run Smart Auto-Classifier for missing or unmapped values
      const nonMatchedTokens: Array<{ token: string; idx: number }> = [];

      rawTokens.forEach((token, idx) => {
        if (!token) return;

        // A. Email pattern
        if (!volunteer.email && /\S+@\S+\.\S+/.test(token)) {
          volunteer.email = token.toLowerCase();
          return;
        }

        // B. Phone Number pattern (10-12 digits, optional +91)
        const cleanDigits = token.replace(/[^0-9]/g, '');
        if (!volunteer.phoneNumber && (cleanDigits.length === 10 || (cleanDigits.length === 12 && cleanDigits.startsWith('91')))) {
          volunteer.phoneNumber = cleanDigits.length === 12 ? cleanDigits.slice(2) : cleanDigits;
          return;
        }

        // C. Gender pattern
        const lowerToken = token.toLowerCase();
        if (!volunteer.gender && ['male', 'm', 'female', 'f', 'other', 'o'].includes(lowerToken)) {
          if (lowerToken === 'm' || lowerToken === 'male') volunteer.gender = 'Male';
          else if (lowerToken === 'f' || lowerToken === 'female') volunteer.gender = 'Female';
          else volunteer.gender = 'Other';
          return;
        }

        // D. Residence Type pattern
        if (!volunteer.residenceType && (lowerToken.includes('hostel') || lowerToken === 'h' || lowerToken.includes('day') || lowerToken === 'ds')) {
          if (lowerToken.includes('hostel') || lowerToken === 'h') volunteer.residenceType = 'Hosteller';
          else volunteer.residenceType = 'Day Scholar';
          return;
        }

        // E. Batch pattern (e.g. 2021-2028 or 'Batch of 2024')
        if (!volunteer.batch && /(?:batch\s*(?:of)?\s*)?20\d{2}/i.test(token)) {
          const match = token.match(/20\d{2}/);
          if (match) {
            volunteer.batch = match[0];
            return;
          }
        }

        // F. Registration Number pattern (e.g. 24BAI10589, 21BCE10000)
        if (!volunteer.registrationNumber && /^\d{2}[A-Za-z]{2,5}\d{4,5}$/i.test(token)) {
          volunteer.registrationNumber = token.toUpperCase();
          return;
        }

        // Store unclassified tokens
        nonMatchedTokens.push({ token, idx });
      });

      // G. Registration Number fallback for other alphanumeric codes
      if (!volunteer.registrationNumber) {
        const regIdx = nonMatchedTokens.findIndex(item => 
          /^[0-9A-Za-z]{7,12}$/.test(item.token) && /[A-Za-z]/.test(item.token) && /[0-9]/.test(item.token)
        );
        if (regIdx !== -1) {
          volunteer.registrationNumber = nonMatchedTokens[regIdx].token.toUpperCase();
          nonMatchedTokens.splice(regIdx, 1);
        }
      }

      // H. Name assignment from remaining alphabetical string
      if (!volunteer.name) {
        const nameIdx = nonMatchedTokens.findIndex(item => 
          /^[A-Za-z\s\.\'\-]+$/.test(item.token) && item.token.length >= 2
        );
        if (nameIdx !== -1) {
          volunteer.name = nonMatchedTokens[nameIdx].token;
          nonMatchedTokens.splice(nameIdx, 1);
        } else if (nonMatchedTokens.length > 0) {
          volunteer.name = nonMatchedTokens[0].token;
          nonMatchedTokens.splice(0, 1);
        }
      }

      // I. Position-based fallbacks if standard positional order was pasted without keywords
      if (!volunteer.name && rawTokens[0]) volunteer.name = rawTokens[0];
      if (!volunteer.registrationNumber && rawTokens[1]) volunteer.registrationNumber = rawTokens[1].toUpperCase();
      if (!volunteer.email && rawTokens[2] && rawTokens[2].includes('@')) volunteer.email = rawTokens[2];

      // Mark valid if at least name and regNumber or email is identified
      volunteer.isValid = Boolean(volunteer.name && (volunteer.registrationNumber || volunteer.email));

      results.push(volunteer);
    });

    return results;
  }, [csvData]);

  const validCount = parsedVolunteers.filter(v => v.isValid).length;

  const handleInsertSample = () => {
    setCsvData(
`Aditi Prakash, 24BAI10589, aditi@vitbhopal.ac.in, 9470042709, 2024, Female, Hosteller
Rahul Sharma, 22BCG10055, rahul@vitbhopal.ac.in, 9988776655, 2024, , Hosteller
Jane Smith, 21BCE10001, jane@vitbhopal.ac.in, 9123456780, 2023, Female, Day Scholar`
    );
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const toSubmit = parsedVolunteers.filter(v => v.isValid).map(v => ({
      name: v.name,
      registrationNumber: v.registrationNumber,
      email: v.email || undefined,
      phoneNumber: v.phoneNumber || undefined,
      batch: v.batch || undefined,
      gender: v.gender || undefined,
      residenceType: v.residenceType || undefined,
    }));

    if (toSubmit.length === 0) {
      setError('No valid volunteer rows found. Each volunteer must have at least a Name and Registration Number.');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/users/bulk', { volunteers: toSubmit });
      setSuccessMsg(data.message || 'Volunteers imported successfully!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 900);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to bulk import volunteers.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden my-8 border border-slate-100 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/60 shrink-0">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-nss-blue flex items-center justify-center shadow-xs">
                  <Upload size={18} />
                </div>
                Bulk Add Volunteers
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Paste comma-separated (CSV) or tab-separated (Excel) rows with smart auto-column detection.
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
            {/* Format Instructions Banner */}
            <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-blue-50/90 text-slate-700 p-4 rounded-2xl text-xs border border-blue-100 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-nss-blue text-sm">
                  <FileText size={16} />
                  <span>CSV / Excel Format Supported</span>
                </div>
                <button
                  type="button"
                  onClick={handleInsertSample}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-nss-blue text-[11px] font-bold hover:bg-blue-50 transition-colors cursor-pointer shadow-2xs"
                >
                  <Sparkles size={12} /> Fill Sample
                </button>
              </div>

              <div>
                <p className="text-slate-600 mb-1.5">
                  Paste values one volunteer per line. Include Contact No directly in the sequence:
                </p>
                <div className="bg-white p-2.5 rounded-xl border border-blue-200/80 font-mono text-[11px] text-slate-800 flex items-center justify-between overflow-x-auto">
                  <span>Name, RegNo, Email, <strong>ContactNo</strong>, Batch, Gender, ResidenceType</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-blue-900/80 bg-blue-100/50 p-2 rounded-xl">
                <span className="flex items-center gap-1 font-semibold">
                  <Sparkles size={12} className="text-nss-blue" /> Smart Auto-Mapping:
                </span>
                <span>• Empty columns (e.g. blank gender or batch) are handled automatically</span>
                <span>• Copy-pasting directly from <strong>Excel / Google Sheets</strong> is supported</span>
              </div>
            </div>

            {/* Error or Success notification */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* CSV Input Textarea */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <label htmlFor="csv-input">Paste Volunteer Data Below:</label>
                {csvData && (
                  <button
                    type="button"
                    onClick={() => setCsvData('')}
                    className="text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} /> Clear Text
                  </button>
                )}
              </div>
              <textarea 
                id="csv-input"
                rows={6}
                value={csvData}
                onChange={e => setCsvData(e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:border-nss-blue focus:ring-3 focus:ring-blue-100 font-mono text-xs text-slate-800 resize-y leading-relaxed bg-slate-50/40"
                placeholder={`Aditi Prakash, 24BAI10589, aditi@vitbhopal.ac.in, 9470042709, 2024, Female, Hosteller\nRahul Sharma, 22BCG10055, rahul@vitbhopal.ac.in, 9988776655, 2024, , Hosteller\nJane Smith, 21BCE10001, jane@vitbhopal.ac.in, 9123456780, 2023, Female, Day Scholar`}
              />
            </div>

            {/* Live Parsing Preview Section */}
            {parsedVolunteers.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Table size={14} className="text-nss-blue" />
                      Live Data Preview
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 text-nss-blue">
                      {validCount} of {parsedVolunteers.length} Recognized
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-xs font-semibold text-nss-blue hover:underline cursor-pointer"
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                </div>

                {showPreview && (
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white max-h-56 shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] sticky top-0">
                        <tr>
                          <th className="p-2.5">#</th>
                          <th className="p-2.5">Name</th>
                          <th className="p-2.5">Reg No.</th>
                          <th className="p-2.5">Contact No.</th>
                          <th className="p-2.5">Email</th>
                          <th className="p-2.5">Batch</th>
                          <th className="p-2.5">Gender</th>
                          <th className="p-2.5">Residence</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedVolunteers.map((vol, idx) => (
                          <tr key={idx} className={vol.isValid ? 'hover:bg-slate-50/60' : 'bg-rose-50/40 text-slate-400'}>
                            <td className="p-2.5 font-bold text-slate-400">{idx + 1}</td>
                            <td className="p-2.5 font-bold text-slate-900">
                              {vol.name || <span className="text-rose-500 italic">Missing name</span>}
                            </td>
                            <td className="p-2.5 font-mono text-slate-800 font-semibold">
                              {vol.registrationNumber || <span className="text-rose-500 italic">Missing</span>}
                            </td>
                            <td className="p-2.5 font-mono text-slate-700">
                              {vol.phoneNumber ? (
                                <span className="inline-flex items-center gap-1">
                                  <Phone size={10} className="text-slate-400" /> {vol.phoneNumber}
                                </span>
                              ) : (
                                <span className="text-slate-300 font-normal">—</span>
                              )}
                            </td>
                            <td className="p-2.5 text-slate-600 truncate max-w-[140px]" title={vol.email}>
                              {vol.email || <span className="text-slate-300">—</span>}
                            </td>
                            <td className="p-2.5 text-slate-700">
                              {vol.batch ? `Batch of ${vol.batch}` : <span className="text-slate-300">—</span>}
                            </td>
                            <td className="p-2.5">
                              {vol.gender ? (
                                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                                  {vol.gender}
                                </span>
                              ) : (
                                <span className="text-slate-300">—</span>
                              )}
                            </td>
                            <td className="p-2.5">
                              {vol.residenceType ? (
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  vol.residenceType === 'Hosteller' 
                                    ? 'bg-purple-100 text-purple-700' 
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {vol.residenceType}
                                </span>
                              ) : (
                                <span className="text-slate-300">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex gap-3 shrink-0">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading || validCount === 0}
                className="flex-1 px-5 py-3 bg-nss-blue hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                {loading ? 'Importing Volunteers...' : (
                  <>
                    <Upload size={18} /> 
                    {validCount > 0 ? `Import ${validCount} Volunteer${validCount > 1 ? 's' : ''}` : 'Import Volunteers'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
