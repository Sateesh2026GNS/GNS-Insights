import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check, XCircle } from "lucide-react";

import { useToast } from "../../context/ToastContext";
import {
  getProducts,
  getMachines,
  quickCreateWorkOrder,
  seedProducts,
} from "../../api/productionApi";
import useTenantId from "../../hooks/useTenantId";



/** 3-step flow: Product → Quantity → Machine → Save → Done */
export default function QuickCreateWorkOrder() {
  const tenantId = useTenantId();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [form, setForm] = useState({
    product_id: "",
    planned_quantity: "",
    machine_id: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let pRes = await getProducts(tenantId);
        let prodList = pRes?.data || [];
        if (prodList.length === 0) {
          setSeeding(true);
          await seedProducts();
          pRes = await getProducts(tenantId);
          prodList = pRes?.data || [];
          setSeeding(false);
        }
        const mRes = await getMachines(tenantId);
        setProducts(prodList);
        setMachines(mRes?.data || []);
      } catch (e) {
        console.error(e);
        setProducts([]);
        setMachines([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "planned_quantity") {
      const cleaned = value.replace(/[^0-9]/g, "");
      setForm((prev) => ({ ...prev, [name]: cleaned }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rawQuantity = String(form.planned_quantity ?? "").trim();
    const qty = Number(rawQuantity);
    const isPositiveInteger = /^\d+$/.test(rawQuantity) && Number(rawQuantity) > 0;
    if (!form.product_id || !rawQuantity || !isPositiveInteger) {
      setError("Product and quantity are required. Quantity must be a whole number greater than 0.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await quickCreateWorkOrder({
        tenant_id: tenantId,
        product_id: Number(form.product_id),
        planned_quantity: qty,
        machine_id: form.machine_id ? Number(form.machine_id) : null,
      });
      addToast("Work order created successfully", "success");
      navigate("/production/work-orders");
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail.map((d) => d.msg || d.message).join(", ")
        : typeof detail === "string"
          ? detail
          : "Unable to create work order.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-6 w-48 rounded bg-slate-200" />
        <div className="mt-6 space-y-4">
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl text-left">
        <div className="flex items-start justify-between border-b px-5 py-4">
          <h2 className="text-xl font-bold text-slate-900">
            {t("quickCreateWorkOrder.title", { defaultValue: "Create Work Order" })}
          </h2>
          <Link
            to="/production/work-orders"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <XCircle className="h-5 w-5" />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4">
          <div>
            <label
              htmlFor="product_id"
              className="block text-xs font-semibold text-slate-500 uppercase"
            >
              1. {t("quickCreateWorkOrder.product", { defaultValue: "Product" })}
            </label>
            <select
              id="product_id"
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
              required
              disabled={products.length === 0}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white font-medium text-slate-700 disabled:opacity-50"
            >
              <option value="">
                {products.length === 0
                  ? (seeding ? "Loading..." : "No products – seed first")
                  : t("quickCreateWorkOrder.selectProduct", { defaultValue: "Select product" })}
              </option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="planned_quantity"
              className="block text-xs font-semibold text-slate-500 uppercase"
            >
              2. {t("quickCreateWorkOrder.quantity", { defaultValue: "Quantity" })}
            </label>
            <input
              id="planned_quantity"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="planned_quantity"
              value={form.planned_quantity}
              onChange={handleChange}
              required
              minLength="1"
              placeholder="e.g. 100"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="machine_id"
              className="block text-xs font-semibold text-slate-500 uppercase"
            >
              3. {t("quickCreateWorkOrder.machine", { defaultValue: "Machine" })} (optional)
            </label>
            <select
              id="machine_id"
              name="machine_id"
              value={form.machine_id}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white font-medium text-slate-700"
            >
              <option value="">{t("quickCreateWorkOrder.selectMachine", { defaultValue: "None" })}</option>
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.code})
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 border-t pt-4">
            <Link
              to="/production/work-orders"
              className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {t("common.cancel", { defaultValue: "Cancel" })}
            </Link>
            <button
              type="submit"
              disabled={saving || products.length === 0}
              className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving
                ? t("quickCreateWorkOrder.creating", { defaultValue: "Creating..." })
                : t("quickCreateWorkOrder.save", { defaultValue: "Save & Done" })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}