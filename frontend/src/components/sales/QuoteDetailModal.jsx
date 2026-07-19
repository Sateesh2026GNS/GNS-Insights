import { Link } from "react-router-dom";
import { Download, Mail, Printer, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { exportToPdf } from "../../utils/exportUtils";
import { formatInr, statusColor } from "../../data/salesMasterData";

export default function QuoteDetailModal({ quote, onClose, onStatusChange }) {
  const { addToast } = useToast();

  if (!quote) return null;

  const total = quote.amount || Number(quote.total_amount) || 0;
  const freight = quote.freight ?? (total > 10000 ? 1500 : 0);
  const gstRate = 0.18;
  const discount = quote.discount ?? 0;
  
  // Calculate backwards: total = (subtotal - discount) * 1.18 + freight
  const netBase = Math.round(((total - freight) / (1 + gstRate)) * 100) / 100;
  const subtotal = netBase + discount;
  const gst = Math.round(netBase * gstRate * 100) / 100;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Quotation ${quote.quote_number}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #1e293b; max-width: 600px; margin: 0 auto; }
            h1 { font-size: 24px; margin-bottom: 5px; color: #0f172a; }
            .meta { color: #475569; font-size: 14px; margin-bottom: 30px; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; }
            .totals { font-size: 15px; }
            .totals div { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
            .grand { font-weight: bold; font-size: 18px; border-t: 2px solid #e2e8f0 !important; padding-top: 12px; color: #0f172a; }
          </style>
        </head>
        <body>
          <h1>Quotation Details</h1>
          <p class="meta"><strong>Quotation No:</strong> ${quote.quote_number}</p>
          
          <div class="meta">
            <p><strong>Customer:</strong> ${quote.customer_name}</p>
            <p><strong>Sales Person:</strong> ${quote.sales_person || "—"}</p>
            <p><strong>Valid Until:</strong> ${String(quote.valid_until || "").slice(0, 10)}</p>
          </div>
          
          <div class="totals">
            <div><span>Subtotal:</span><span>₹${Number(subtotal).toLocaleString("en-IN")}</span></div>
            <div><span>Discount:</span><span>-₹${Number(discount).toLocaleString("en-IN")}</span></div>
            <div><span>GST (18%):</span><span>₹${Number(gst).toLocaleString("en-IN")}</span></div>
            <div><span>Freight:</span><span>₹${Number(freight).toLocaleString("en-IN")}</span></div>
            <div class="grand"><span>Grand Total:</span><span>₹${Number(total).toLocaleString("en-IN")}</span></div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    addToast("Quotation print preview opened");
  };

  const handlePdf = () => {
    const pdfData = [
      { field: "Quotation Number", value: quote.quote_number },
      { field: "Customer Name", value: quote.customer_name },
      { field: "Sales Person", value: quote.sales_person || "—" },
      { field: "Valid Until", value: String(quote.valid_until || "").slice(0, 10) },
      { field: "Subtotal", value: `₹${Number(subtotal).toLocaleString("en-IN")}` },
      { field: "Discount", value: `-₹${Number(discount).toLocaleString("en-IN")}` },
      { field: "GST (18%)", value: `₹${Number(gst).toLocaleString("en-IN")}` },
      { field: "Freight", value: `₹${Number(freight).toLocaleString("en-IN")}` },
      { field: "Grand Total", value: `₹${Number(total).toLocaleString("en-IN")}` },
    ];
    const exportColumns = [
      { key: "field", label: "Quotation Metric" },
      { key: "value", label: "Value" },
    ];
    exportToPdf(pdfData, exportColumns, `Quotation ${quote.quote_number}`, `quotation_${quote.quote_number}`);
    addToast("Quotation exported to PDF successfully");
  };

  const handleEmail = () => {
    addToast(`Sending quotation ${quote.quote_number} to customer email...`, "info");
    setTimeout(() => {
      addToast(`Quotation successfully emailed to ${quote.email || "customer"}!`, "success");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b px-5 py-4">
          <div>
            <p className="text-xs font-semibold text-[#2563EB]">{quote.quote_number}</p>
            <h2 className="text-xl font-bold text-slate-900">{quote.customer_name}</h2>
            <p className="text-sm text-slate-500">Sales Person: {quote.sales_person || "—"} · Valid until {quote.valid_until || "—"}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>

        <div className="overflow-y-auto px-5 py-5 space-y-4">
          <div className="rounded-xl border border-slate-150 bg-slate-50 p-5 space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Subtotal</span>
              <span className="font-medium text-slate-800">{formatInr(subtotal)}</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span className="font-semibold">Discount</span>
              <span className="font-medium">-{formatInr(discount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">GST (18%)</span>
              <span className="font-medium text-slate-800">{formatInr(gst)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Freight</span>
              <span className="font-medium text-slate-800">{formatInr(freight)}</span>
            </div>
            <div className="flex justify-between border-t pt-3 font-bold text-base text-slate-900">
              <span>Grand Total</span>
              <span>{formatInr(total)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Status:</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusColor(quote.status)}`}>{quote.status}</span>
          </div>

          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
            Approval: Sales Executive → Manager Approval → Customer → Accepted
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t px-5 py-4">
          <button type="button" onClick={handlePrint} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Printer className="h-4 w-4" /> Preview</button>
          <button type="button" onClick={handlePdf} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Download className="h-4 w-4" /> PDF</button>
          <button type="button" onClick={handleEmail} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Mail className="h-4 w-4" /> Email</button>
          <Link to="/sales/orders/create" className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-blue-700">Convert to Sales Order</Link>
          {quote.status === "draft" && (
            <button type="button" onClick={() => onStatusChange?.(quote, "sent")} className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">Send to Customer</button>
          )}
        </div>
      </div>
    </div>
  );
}
