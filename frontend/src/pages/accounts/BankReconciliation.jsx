import { useEffect, useState, useCallback } from "react";
import { RefreshCw, CheckCircle, HelpCircle, FileSpreadsheet, Upload, Check } from "lucide-react";
import FinanceFilters from "../../components/finance/FinanceFilters";
import Loader from "../../components/common/Loader";
import { useToast } from "../../context/ToastContext";
import { getExtendedReports } from "../../api/accountsApi";
import { formatInr } from "../../data/financeMasterData";

export default function BankReconciliation() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [financialYear, setFinancialYear] = useState("2026-27");
  const [month, setMonth] = useState("All Months");
  const [branch, setBranch] = useState("");
  const [search, setSearch] = useState("");
  const [ledgerLines, setLedgerLines] = useState([]);
  const [bankLines, setBankLines] = useState([]);
  const [cashBalance, setCashBalance] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getExtendedReports(financialYear, month, branch);
      if (res.data) {
        setLedgerLines(res.data.ledger_lines || []);
        setBankLines(res.data.bank_lines || []);
        setCashBalance(res.data.cash_balance || 0);
      }
    } catch {
      addToast("Failed to load Bank Reconciliation data", "error");
    } finally {
      setLoading(false);
    }
  }, [financialYear, month, branch, addToast]);

  useEffect(() => { load(); }, [load]);

  const [selectedLedger, setSelectedLedger] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);

  const handleMatch = () => {
    if (selectedLedger !== null && selectedBank !== null) {
      const ledgerObj = ledgerLines.find((l) => l.id === selectedLedger);
      const bankObj = bankLines.find((b) => b.id === selectedBank);
      if (Math.abs(ledgerObj.amount) === Math.abs(bankObj.amount)) {
        setLedgerLines((prev) =>
          prev.map((l) => (l.id === selectedLedger ? { ...l, reconciled: true } : l))
        );
        setBankLines((prev) =>
          prev.map((b) => (b.id === selectedBank ? { ...b, matched: true } : b))
        );
        setSelectedLedger(null);
        setSelectedBank(null);
        addToast("Transactions successfully reconciled!", "success");
      } else {
        alert("⚠️ Transaction amounts do not match! Cannot reconcile.");
      }
    }
  };

  const unreconciledLedger = ledgerLines.filter((l) => !l.reconciled).reduce((s, x) => s + x.amount, 0);
  const unreconciledBank = bankLines.filter((b) => !b.matched).reduce((s, x) => s + x.amount, 0);

  if (loading) return <Loader label="Loading Bank Reconciliation..." />;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 border-b-0 pb-0">Bank Reconciliation</h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">Verify company cash postings against monthly bank statements to ensure ledger integrity.</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all">
            <Upload className="h-4 w-4 text-slate-400" />
            Upload Bank statement
          </button>
          <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Books Cash Balance" value={formatInr(cashBalance)} icon={FileSpreadsheet} color="bg-blue-600" />
        <KpiCard label="Bank Statement Balance" value={formatInr(cashBalance + 450)} icon={CheckCircle} color="bg-green-600" />
        <KpiCard label="Ledger Unreconciled" value={formatInr(unreconciledLedger)} icon={HelpCircle} color="bg-amber-500" />
        <KpiCard label="Statement Unreconciled" value={formatInr(unreconciledBank)} icon={HelpCircle} color="bg-red-500" />
      </div>

      <FinanceFilters
        search={search}
        onSearchChange={setSearch}
        financialYear={financialYear}
        onFinancialYearChange={setFinancialYear}
        month={month}
        onMonthChange={setMonth}
        branch={branch}
        onBranchChange={setBranch}
        searchPlaceholder="Search postings..."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Side: Ledger Cash Postings */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="font-bold text-slate-900">Ledger Cash Postings</h2>
            <span className="text-xs font-semibold text-slate-500">Select to match</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {ledgerLines.map((l) => (
              <div
                key={l.id}
                onClick={() => !l.reconciled && setSelectedLedger(l.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                  l.reconciled ? "bg-green-50/50 border-green-200 text-slate-400 cursor-default" :
                  selectedLedger === l.id ? "border-[#2563EB] ring-2 ring-blue-100 bg-blue-50/20" : "hover:bg-slate-50 bg-white"
                }`}
              >
                <div>
                  <span className="text-xs font-semibold text-slate-400">{l.date}</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{l.desc}</p>
                  {l.ref && <span className="text-[10px] text-slate-400">Ref: {l.ref}</span>}
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className={`text-sm font-bold tabular-nums ${l.amount < 0 ? "text-red-600" : "text-green-600"}`}>
                    {l.amount < 0 ? "-" : "+"}{formatInr(Math.abs(l.amount))}
                  </span>
                  {l.reconciled && <Check className="h-4 w-4 text-green-600 shrink-0" />}
                </div>
              </div>
            ))}
            {ledgerLines.length === 0 && (
              <div className="text-center p-6 text-slate-400">No ledger lines found</div>
            )}
          </div>
        </div>

        {/* Right Side: Uploaded Bank Statement */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="font-bold text-slate-900">Bank Statement Lines</h2>
            <span className="text-xs font-semibold text-slate-500">Select to match</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {bankLines.map((b) => (
              <div
                key={b.id}
                onClick={() => !b.matched && setSelectedBank(b.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                  b.matched ? "bg-green-50/50 border-green-200 text-slate-400 cursor-default" :
                  selectedBank === b.id ? "border-[#2563EB] ring-2 ring-blue-100 bg-blue-50/20" : "hover:bg-slate-50 bg-white"
                }`}
              >
                <div>
                  <span className="text-xs font-semibold text-slate-400">{b.date}</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{b.desc}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className={`text-sm font-bold tabular-nums ${b.amount < 0 ? "text-red-600" : "text-green-600"}`}>
                    {b.amount < 0 ? "-" : "+"}{formatInr(Math.abs(b.amount))}
                  </span>
                  {b.matched && <Check className="h-4 w-4 text-green-600 shrink-0" />}
                </div>
              </div>
            ))}
            {bankLines.length === 0 && (
              <div className="text-center p-6 text-slate-400">No bank statement transactions uploaded</div>
            )}
          </div>
        </div>
      </div>

      {selectedLedger !== null && selectedBank !== null && (
        <div className="bg-blue-600 text-white rounded-2xl p-4 flex justify-between items-center shadow-lg animate-bounce">
          <div className="text-sm font-semibold">
            Ready to match selected ledger posting with bank statement item!
          </div>
          <button
            onClick={handleMatch}
            className="bg-white hover:bg-slate-100 text-blue-700 rounded-xl px-4 py-2 text-sm font-bold transition-all shadow-sm"
          >
            Confirm Reconciliation Match
          </button>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{value}</p>
        </div>
        {Icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
