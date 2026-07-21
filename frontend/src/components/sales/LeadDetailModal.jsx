import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, X } from "lucide-react";

import { formatInr, priorityColor, statusColor } from "../../data/salesMasterData";

const TABS = ["Overview", "Contacts", "Notes", "Timeline", "Activities"];

<<<<<<< HEAD
=======
function generateActivities(lead) {
  const activities = [];
  const exec = lead.sales_executive || "Ramesh Kumar";
  const source = lead.source || "Website Search";

  activities.push({
    title: "Lead Created",
    desc: `Lead registered automatically via ${source}. Assigned to sales executive ${exec}.`,
    date: "3 days ago",
    type: "system",
  });

  if (lead.status !== "new") {
    activities.push({
      title: "Email Sent",
      desc: `Introduction email sent to ${lead.email || "customer"} by ${exec}.`,
      date: "2 days ago",
      type: "email",
    });
  }

  if (["contacted", "qualified", "converted"].includes(lead.status)) {
    activities.push({
      title: "Call Logged",
      desc: `Outgoing call completed by ${exec}. Customer interested, requested pricing.`,
      date: "1 day ago",
      type: "call",
    });
  }

  if (["qualified", "converted"].includes(lead.status)) {
    activities.push({
      title: "Lead Qualified",
      desc: `Lead marked as Qualified. Estimated opportunity value: ₹${Number(lead.opportunity_value || 50000).toLocaleString("en-IN")}.`,
      date: "1 day ago",
      type: "qualification",
    });
  }

  if (lead.next_followup) {
    activities.push({
      title: "Follow-up Scheduled",
      desc: `Next follow-up task scheduled for ${lead.next_followup} to discuss quotation.`,
      date: "Today",
      type: "followup",
    });
  }

  if (lead.status === "converted") {
    activities.push({
      title: "Lead Converted",
      desc: "Successfully converted to active customer. Created customer profile and linked to Sales Order.",
      date: "Today",
      type: "conversion",
    });
  }

  return activities;
}

>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
export default function LeadDetailModal({ lead, onClose, onStatusChange }) {
  const [tab, setTab] = useState("Overview");
  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b px-5 py-4">
          <div>
            <p className="text-xs font-semibold text-[#2563EB]">{lead.lead_id}</p>
            <h2 className="text-xl font-bold text-slate-900">{lead.customer_name}</h2>
            <p className="text-sm text-slate-500">{lead.company} · {lead.industry}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b px-5">
          {TABS.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-semibold ${tab === t ? "border-[#2563EB] text-[#2563EB]" : "border-transparent text-slate-500"}`}>{t}</button>
          ))}
        </div>

        <div className="overflow-y-auto px-5 py-4">
          {tab === "Overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <Field label="Sales Executive" value={lead.sales_executive} />
                <Field label="Source" value={lead.source} />
                <Field label="Region" value={lead.region} />
                <Field label="Priority"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${priorityColor(lead.priority)}`}>{lead.priority}</span></Field>
                <Field label="Status"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusColor(lead.status)}`}>{lead.status}</span></Field>
                <Field label="Opportunity Value" value={lead.opportunity_value ? formatInr(lead.opportunity_value) : "—"} />
                <Field label="Next Follow-up" value={lead.next_followup || "—"} />
              </div>
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                Workflow: Lead → Qualification → Opportunity → Quotation → Sales Order
              </div>
            </div>
          )}
          {tab === "Contacts" && (
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" />{lead.contact || "—"}</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" />{lead.email || "—"}</p>
            </div>
          )}
          {tab === "Notes" && <p className="text-sm text-slate-600">{lead.notes || "No notes yet."}</p>}
          {tab === "Timeline" && (
            <ul className="space-y-2 text-sm">
              <li className="rounded-lg bg-slate-50 px-3 py-2">Lead created · {lead.next_followup || "Today"}</li>
              <li className="rounded-lg bg-slate-50 px-3 py-2">Follow-up scheduled</li>
            </ul>
          )}
<<<<<<< HEAD
          {tab === "Activities" && <p className="text-sm text-slate-500">Call and email history will appear here.</p>}
=======
          {tab === "Activities" && (
            <div className="flow-root py-2">
              <ul className="-mb-8">
                {generateActivities(lead).map((act, actIdx) => (
                  <li key={actIdx}>
                    <div className="relative pb-8">
                      {actIdx !== generateActivities(lead).length - 1 ? (
                        <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white ${
                            act.type === "call" ? "bg-green-50 text-green-600" :
                            act.type === "email" ? "bg-blue-50 text-blue-600" :
                            act.type === "qualification" ? "bg-purple-50 text-purple-600" :
                            act.type === "conversion" ? "bg-emerald-50 text-emerald-600" :
                            "bg-slate-100 text-slate-600"
                          }`}>
                            {act.type === "call" ? <Phone className="h-4 w-4" /> :
                             act.type === "email" ? <Mail className="h-4 w-4" /> :
                             <span className="h-2 w-2 rounded-full bg-current" />}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{act.title}</p>
                            <p className="mt-0.5 text-xs text-slate-600">{act.desc}</p>
                          </div>
                          <div className="whitespace-nowrap text-right text-xs text-slate-400">
                            <time>{act.date}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        </div>

        <div className="flex flex-wrap gap-2 border-t px-5 py-4">
          {lead.status !== "converted" && lead.status !== "lost" && (
            <select value={lead.status} onChange={(e) => onStatusChange?.(lead, e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
              {["new", "contacted", "qualified", "converted", "lost"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
          <Link to="/sales/quotations" className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white">Create Quotation</Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, children }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase text-slate-400">{label}</p>
      {children || <p className="mt-0.5 text-sm font-medium text-slate-800">{value ?? "—"}</p>}
    </div>
  );
}
