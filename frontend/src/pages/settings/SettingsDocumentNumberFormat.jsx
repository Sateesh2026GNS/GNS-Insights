import { useState } from "react";
import { Pencil, Trash2, Plus, Shield } from "lucide-react";

const DOCUMENT_TYPES = [
  { id: "po", name: "Purchase Order", series: [{ name: "PO Series 1", prefix: "PO", nextNum: "00002", nextDoc: "PO00002" }] },
  { id: "so", name: "Service Order", series: [{ name: "SO Series 1", prefix: "SO", nextNum: "00001", nextDoc: "SO00001" }] },
  { id: "oc", name: "Order Confirmation", series: [{ name: "OC Series 1", prefix: "OC", nextNum: "00002", nextDoc: "OC00002" }] },
  { id: "sc", name: "Service Confirmation", series: [{ name: "SC Series 1", prefix: "SC", nextNum: "00001", nextDoc: "SC00001" }] },
  { id: "inv", name: "Invoice", series: [{ name: "TXIN Series 1", prefix: "TXIN", nextNum: "00001", nextDoc: "TXIN00001" }] },
  { id: "sq", name: "Sales Quotation", series: [{ name: "SQ Series 1", prefix: "SQ", nextNum: "00001", nextDoc: "SQ00001" }] },
  { id: "inward", name: "Inward Document", series: [{ name: "Inward Series 1", prefix: "WR", nextNum: "00002", nextDoc: "WR00002" }] },
  { id: "grn", name: "GRN / Quality Report", series: [{ name: "GRN Series 1", prefix: "GRN", nextNum: "00001", nextDoc: "GRN00001" }] },
  { id: "challan", name: "Challan", series: [{ name: "CL Series 1", prefix: "CL", nextNum: "00001", nextDoc: "CL00001" }] },
  { id: "pi", name: "Proforma Invoice", series: [{ name: "PI Series 1", prefix: "PI", nextNum: "00001", nextDoc: "PI00001" }] },
  { id: "cn", name: "Credit Note", series: [{ name: "CN Series 1", prefix: "CN", nextNum: "00001", nextDoc: "CN00001" }] },
  { id: "dn", name: "Debit Note", series: [{ name: "DN Series 1", prefix: "DN", nextNum: "00001", nextDoc: "DN00001" }] },
  { id: "rv", name: "Advance Receipt Voucher", series: [{ name: "RV Series 1", prefix: "RV", nextNum: "00001", nextDoc: "RV00001" }] },
  { id: "rein", name: "Purchase Return Challan", series: [{ name: "REIN Series 1", prefix: "REIN", nextNum: "00001", nextDoc: "REIN00001" }] },
  { id: "rfq", name: "Request for Quotation", series: [{ name: "RFQ Series 1", prefix: "RFQ", nextNum: "00001", nextDoc: "RFQ00001" }] },
  { id: "indent", name: "Indent", series: [{ name: "Indent Series 1", prefix: "IND", nextNum: "00001", nextDoc: "IND00001" }] },
  { id: "pmv", name: "Payment Voucher", series: [{ name: "Payment Series 1", prefix: "PMV", nextNum: "00001", nextDoc: "PMV00001" }] },
  { id: "rcv", name: "Receipt Voucher", series: [{ name: "Receipt Series 1", prefix: "RCV", nextNum: "00001", nextDoc: "RCV00001" }] },
  { id: "product", name: "Product", series: [{ name: "Product Series 1", prefix: "SKU", nextNum: "00008", nextDoc: "SKU00008" }] },
  { id: "iap", name: "Inventory Document Approval", series: [{ name: "Inventory Approval Series 1", prefix: "IAP", nextNum: "00004", nextDoc: "IAP00004" }] },
  { id: "maj", name: "Manual Adjustment", series: [{ name: "Manual Adjustment Series 1", prefix: "MAJ", nextNum: "00003", nextDoc: "MAJ00003" }] },
  { id: "psr", name: "Physical Stock Reconciliation", series: [{ name: "PSR Series 1", prefix: "PSR", nextNum: "00001", nextDoc: "PSR00001" }] },
  { id: "bom", name: "Bill of Material", series: [{ name: "BOM Series 1", prefix: "BOM", nextNum: "00001", nextDoc: "BOM00001" }] },
  { id: "process", name: "Process", series: [{ name: "Process Series 1", prefix: "PID", nextNum: "00001", nextDoc: "PID00001" }] },
  { id: "tc", name: "Test Certificate", series: [{ name: "Test Certificate Series 1", prefix: "TC", nextNum: "00001", nextDoc: "TC00001" }] },
  { id: "bii", name: "Barcode Item In", series: [{ name: "Barcode Item In Series 1", prefix: "BII", nextNum: "00001", nextDoc: "BII00001" }] },
  { id: "bio", name: "Barcode Item Out", series: [{ name: "Barcode Item Out Series 1", prefix: "BIO", nextNum: "00001", nextDoc: "BIO00001" }] },
  { id: "se", name: "Sales Enquiry", series: [{ name: "SE Series 1", prefix: "SEQ", nextNum: "00001", nextDoc: "SEQ00001" }] },
  { id: "st", name: "Stock Transfer", series: [{ name: "Stock Transfer Series 1", prefix: "BSF", nextNum: "00001", nextDoc: "BSF00001" }] },
  { id: "sr", name: "Sales Return", series: [{ name: "Sales Return Series 1", prefix: "SR", nextNum: "00001", nextDoc: "SR00001" }] },
];

function DocTypeSection({ docType, mode, onModeChange }) {
  const isAuto = mode === "auto";

  return (
    <div className="mb-8 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          {docType.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className={"text-xs font-medium " + (!isAuto ? "text-teal-600" : "text-slate-400")}>Manual</span>
          <button
            type="button"
            role="switch"
            aria-checked={isAuto}
            onClick={() => onModeChange(isAuto ? "manual" : "auto")}
            className={"relative inline-flex h-6 w-14 shrink-0 cursor-pointer rounded-full transition-colors " + (isAuto ? "bg-teal-600" : "bg-slate-200 dark:bg-slate-600")}
          >
            <span className={"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform mt-0.5 " + (isAuto ? "translate-x-7" : "translate-x-1")} />
          </button>
          <span className={"text-xs font-medium " + (isAuto ? "text-teal-600" : "text-slate-400")}>Auto</span>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-sky-50 dark:bg-sky-900/20">
              <th className="border-b border-slate-200 px-4 py-2 text-left text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300">Name</th>
              <th className="border-b border-slate-200 px-4 py-2 text-left text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300">Prefix/Template</th>
              <th className="border-b border-slate-200 px-4 py-2 text-left text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300">Next Number</th>
              <th className="border-b border-slate-200 px-4 py-2 text-left text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300">Reset Type</th>
              <th className="border-b border-slate-200 px-4 py-2 text-left text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300">Next Document Number</th>
              <th className="border-b border-slate-200 px-4 py-2 text-left text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {docType.series.map((s, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-b-0 dark:border-slate-700/50">
                <td className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300">{s.name}</td>
                <td className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300">{s.prefix}</td>
                <td className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300">{s.nextNum}</td>
                <td className="px-4 py-2 text-sm text-slate-400 dark:text-slate-500">—</td>
                <td className="px-4 py-2 text-sm font-medium text-slate-800 dark:text-slate-200">{s.nextDoc}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <button type="button" className="rounded p-1.5 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20" title="Edit"><Pencil className="h-4 w-4" /></button>
                    <button type="button" className="rounded p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="mt-3 flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400">
        <Plus className="h-4 w-4" />
        Add New Series
        <span className="inline-flex items-center gap-0.5 rounded border border-teal-600 bg-teal-50 px-1.5 py-0.5 text-[10px] font-medium text-teal-700 dark:border-teal-500 dark:bg-teal-900/30 dark:text-teal-400">
          <Shield className="h-3 w-3" /> PRO
        </span>
      </button>
    </div>
  );
}

export default function SettingsDocumentNumberFormat() {
  const [modes, setModes] = useState(Object.fromEntries(DOCUMENT_TYPES.map((d) => [d.id, "auto"])));

  const setMode = (id, mode) => setModes((prev) => ({ ...prev, [id]: mode }));

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Document Number Format
        </h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          List of your serial numbers for Documents, Items, Services, Processes & BOMs
        </p>
      </div>
      <div className="space-y-0">
        {DOCUMENT_TYPES.map((docType) => (
          <DocTypeSection
            key={docType.id}
            docType={docType}
            mode={modes[docType.id] ?? "auto"}
            onModeChange={(m) => setMode(docType.id, m)}
          />
        ))}
      </div>
    </div>
  );
}
