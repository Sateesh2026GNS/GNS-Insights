import { useEffect, useState, useCallback } from "react";
import { Plus, RefreshCw, FileText, Upload, Calendar, User, X, Save } from "lucide-react";

import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import { useToast } from "../../context/ToastContext";
import { getDocuments, createDocument } from "../../api/documentsApi";
import useTenantId from "../../hooks/useTenantId";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";

export default function HRDocuments() {
  const tenantId = useTenantId();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    file_name: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDocuments("hr");
      setDocuments(res.data || []);
    } catch (err) {
      addToast("Failed to load documents", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.file_name) {
      setError("Please fill in all required fields (Title and File Name).");
      return;
    }
    setSaving(true);
    setError("");

    try {
      await createDocument({
        tenant_id: tenantId,
        doc_type: "hr",
        title: form.title,
        description: form.description,
        file_name: form.file_name,
        file_path: `/uploads/hr/${form.file_name}`,
        uploaded_by: "HR Manager",
        reference_type: null,
      });

      addToast("Document registered successfully", "success");
      setShowUploadModal(false);
      // Reset form
      setForm({ title: "", description: "", file_name: "" });
      loadDocuments();
    } catch (err) {
      setError("Failed to register document.");
      addToast("Failed to save document", "error");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: "title",
      label: "Document Title",
      render: (r) => (
        <span className="flex items-center gap-2 font-semibold text-slate-900">
          <FileText className="h-4 w-4 text-[#2563EB]" />
          {r.title}
        </span>
      ),
    },
    { key: "description", label: "Description", render: (r) => <span className="text-slate-500 text-xs">{r.description || "—"}</span> },
    { key: "file_name", label: "File Name", render: (r) => <span className="font-mono text-xs text-slate-700 bg-slate-100 rounded px-2 py-0.5 border border-slate-200">{r.file_name}</span> },
    {
      key: "uploaded_by",
      label: "Uploaded By",
      render: (r) => (
        <span className="inline-flex items-center gap-1 text-slate-700 text-xs">
          <User className="h-3 w-3 text-slate-400" />
          {r.uploaded_by || "HR Manager"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Date Added",
      render: (r) => (
        <span className="inline-flex items-center gap-1 text-slate-600 text-xs">
          <Calendar className="h-3 w-3 text-slate-400" />
          {r.created_at ? String(r.created_at).slice(0, 10) : new Date().toISOString().slice(0, 10)}
        </span>
      ),
    },
  ];

  if (loading && documents.length === 0) return <Loader label="Loading HR documents archive..." />;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">HR Documents Archive</h1>
          <p className="mt-1 text-sm text-slate-500">Access and organize policy manuals, employee handbooks, and personnel files.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" /> Add Document
          </button>
          <button
            type="button"
            onClick={loadDocuments}
            className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-100 text-[#2563EB] shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Policy Docs</p>
            <p className="mt-0.5 text-xl font-bold text-slate-900">{documents.length}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-green-100 text-green-600 shrink-0">
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Secure Vault Storage</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-900">Encrypted (AES-256)</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-100 text-purple-600 shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Department Access</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-900">HR Admin & Management</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <DataTable
          columns={columns}
          data={documents}
          searchPlaceholder="Search documents title, file name..."
          searchKeys={["title", "description", "file_name"]}
        />
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add HR Document</h3>
                <p className="text-xs text-slate-500 mt-0.5">Register a policy document or contract to the system database.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Employee Handbook 2026"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">File Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. handbook_2026.pdf"
                  value={form.file_name}
                  onChange={(e) => setForm({ ...form, file_name: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea
                  rows="3"
                  placeholder="Summary of document purpose, department coverage..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Add Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
