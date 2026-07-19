import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { XCircle } from "lucide-react";

import { createProductionOrder, getProductionOrderDetail, getProducts, seedProducts, updateProductionOrder } from "../../api/productionApi";
import useTenantId from "../../hooks/useTenantId";



export default function CreateProduction() {
  const tenantId = useTenantId();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: editId } = useParams(); // Will be defined when route is /production/edit/:id
  const isEditMode = !!editId;

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [form, setForm] = useState({
    tenant_id: tenantId,
    product_id: "",
    order_number: "",
    planned_quantity: "",
    start_date: "",
    due_date: "",
    status: "planned",
    customer_name: "",
    priority: "medium",
    bom_version: "BOM v1.0",
    shift: "Shift A",
    department: "Production",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const loadProducts = () => {
    setLoadingProducts(true);
    getProducts(tenantId)
      .then((r) => {
        const list = r.data || [];
        if (list.length === 0) {
          setSeeding(true);
          return seedProducts()
            .then(() => getProducts(tenantId))
            .finally(() => setSeeding(false));
        }
        return { data: list };
      })
      .then((r) => setProducts(r?.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Load existing order data when in edit mode
  useEffect(() => {
    if (!isEditMode || !editId) return;
    const orderId = Number(editId);
    if (isNaN(orderId)) return;

    setLoadingOrder(true);
    getProductionOrderDetail(orderId)
      .then((res) => {
        const order = res.data;
        if (order) {
          // Format datetime for datetime-local input
          const formatForInput = (val) => {
            if (!val) return "";
            const d = new Date(val);
            if (isNaN(d.getTime())) return "";
            // Format as YYYY-MM-DDTHH:MM
            return d.toISOString().slice(0, 16);
          };
          setForm({
            tenant_id: order.tenant_id || tenantId,
            product_id: order.product_id ? String(order.product_id) : "",
            order_number: order.order_number || "",
            planned_quantity: order.planned_quantity != null ? String(order.planned_quantity) : "",
            start_date: formatForInput(order.start_date),
            due_date: formatForInput(order.due_date),
            status: order.status || "planned",
            customer_name: order.customer_name || "",
            priority: order.priority || "medium",
            bom_version: order.bom_version || "BOM v1.0",
            shift: order.shift || "Shift A",
            department: order.department || "Production",
          });
        }
      })
      .catch(() => {
        setError("Failed to load production order for editing.");
      })
      .finally(() => setLoadingOrder(false));
  }, [editId, isEditMode, tenantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Strip spaces from order_number as user types
    let sanitized = value;

      if (name === "order_number") {
        sanitized = value.replace(/\s/g, "");
      }

      if (name === "planned_quantity") {
        // Allow only digits
        sanitized = value.replace(/\D/g, "");
      }
    setForm((prev) => ({ ...prev, [name]: sanitized }));
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
    setError("");
  };

  // Order number must start with "PO-", then only digits and hyphens, at least one digit, no spaces
  const ORDER_NUMBER_REGEX = /^PO-[0-9][0-9-]*$/;

  const validate = () => {
    const errs = {};

    // Order number validation
    if (!form.order_number) {
      errs.order_number = "Order number is required";
    } else if (/\s/.test(form.order_number)) {
      errs.order_number = "Order number must not contain spaces";
    } else if (!ORDER_NUMBER_REGEX.test(form.order_number)) {
      errs.order_number = 'Order number must start with \"PO-\" followed by at least one number (digits and hyphens only, e.g. PO-2026-1)';
    }

   const qty = Number(form.planned_quantity);

      if (form.planned_quantity === "") {
        errs.planned_quantity = "Planned quantity is required";
      } else if (!/^[1-9]\d*$/.test(form.planned_quantity)) {
        errs.planned_quantity =
          "Planned quantity must be a whole number greater than or equal to 1";
      } else if (!Number.isInteger(qty)) {
        errs.planned_quantity =
          "Planned quantity must be a whole number";
      }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };
   
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        product_id: Number(form.product_id),
        planned_quantity: Number(form.planned_quantity),
        start_date: form.start_date || null,
        due_date: form.due_date || null,
        customer_name: form.customer_name ? String(form.customer_name).trim() : null,
        priority: form.priority || "medium",
        bom_version: form.bom_version ? String(form.bom_version).trim() : null,
        shift: form.shift || "Shift A",
        department: form.department || "Production",
      };

      if (isEditMode) {
        await updateProductionOrder(Number(editId), payload);
      } else {
        await createProductionOrder(payload);
      }
      navigate("/production/planning");
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail.map((d) => d.msg || d.message).join(", ")
        : typeof detail === "string"
          ? detail
          : isEditMode
            ? "Unable to update production order."
            : "Unable to create production order.";
      if (msg.toLowerCase().includes("already exists")) {
        setFieldErrors((prev) => ({ ...prev, order_number: msg }));
      } else {
        setError(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  const pageTitle = isEditMode ? "Edit Production Order" : t("createProduction.title");
  const submitLabel = isEditMode
    ? (saving ? "Updating..." : "Update Order")
    : (saving ? t("createProduction.creating") : t("createProduction.createOrder"));

  if (loadingOrder) {
    return (
      <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-slate-500">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading production order...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl text-left">
        <div className="flex items-start justify-between border-b px-5 py-4">
          <h2 className="text-xl font-bold text-slate-900">{pageTitle}</h2>
          <Link
            to="/production/planning"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <XCircle className="h-5 w-5" />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4">
          <div>
            <label htmlFor="product_id" className="block text-xs font-semibold text-slate-500 uppercase">
              {t("createProduction.product")}
            </label>
            <select
              id="product_id"
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
              required
              disabled={loadingProducts}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white font-medium text-slate-700 disabled:bg-slate-50 disabled:text-slate-500"
            >
              <option value="">{loadingProducts ? t("createProduction.loading") : t("createProduction.selectProduct")}</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>
            {products.length === 0 && !loadingProducts && (
              <div className="mt-2 flex items-center gap-2">
                <p className="text-xs text-amber-600">{t("createProduction.noProducts")}</p>
                <button
                  type="button"
                  onClick={loadProducts}
                  disabled={seeding}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                >
                  {seeding ? t("createProduction.loading") : t("createProduction.loadSampleProducts")}
                </button>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="order_number" className="block text-xs font-semibold text-slate-500 uppercase">
              Order Number
            </label>
            <input
              id="order_number"
              type="text"
              name="order_number"
              value={form.order_number}
              onChange={handleChange}
              required
              placeholder="e.g. PO-2026-01"
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                fieldErrors.order_number
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
            />
            <p className="mt-1 text-[10px] text-slate-400">
              Must start with PO- followed by numbers only (hyphens allowed, no spaces)
            </p>
            {fieldErrors.order_number && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.order_number}</p>
            )}
          </div>

          <div>
            <label htmlFor="planned_quantity" className="block text-xs font-semibold text-slate-500 uppercase">
              {t("createProduction.plannedQuantity")}
            </label>
            <input
              id="planned_quantity"
              type="number"
              name="planned_quantity"
              value={form.planned_quantity}
              onChange={handleChange}
              required
              min="1"
              step="1"
              inputMode="numeric"
              placeholder="e.g. 100"
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                fieldErrors.planned_quantity
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
            />
            {fieldErrors.planned_quantity && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.planned_quantity}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="start_date" className="block text-xs font-semibold text-slate-500 uppercase">
                Start Date
              </label>
              <input
                id="start_date"
                type="datetime-local"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white text-slate-700"
              />
            </div>
            <div>
              <label htmlFor="due_date" className="block text-xs font-semibold text-slate-500 uppercase">
                {t("createProduction.dueDate")}
              </label>
              <input
                id="due_date"
                type="datetime-local"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  fieldErrors.due_date
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
              />
              {fieldErrors.due_date && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.due_date}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="customer_name" className="block text-xs font-semibold text-slate-500 uppercase">
                Customer Name
              </label>
              <input
                id="customer_name"
                type="text"
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                placeholder="e.g. Tata Motors"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="bom_version" className="block text-xs font-semibold text-slate-500 uppercase">
                BOM Version
              </label>
              <input
                id="bom_version"
                type="text"
                name="bom_version"
                value={form.bom_version}
                onChange={handleChange}
                placeholder="e.g. BOM v1.0"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="priority" className="block text-xs font-semibold text-slate-500 uppercase">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border px-2 py-2 text-sm bg-white font-medium text-slate-700"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label htmlFor="shift" className="block text-xs font-semibold text-slate-500 uppercase">
                Shift
              </label>
              <select
                id="shift"
                name="shift"
                value={form.shift}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border px-2 py-2 text-sm bg-white font-medium text-slate-700"
              >
                <option value="Shift A">Shift A</option>
                <option value="Shift B">Shift B</option>
                <option value="Shift C">Shift C</option>
              </select>
            </div>
            <div>
              <label htmlFor="department" className="block text-xs font-semibold text-slate-500 uppercase">
                Department
              </label>
              <select
                id="department"
                name="department"
                value={form.department}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border px-2 py-2 text-sm bg-white font-medium text-slate-700"
              >
                <option value="Production">Production</option>
                <option value="Machining">Machining</option>
                <option value="Assembly">Assembly</option>
                <option value="Fabrication">Fabrication</option>
                <option value="Packaging">Packaging</option>
                <option value="Quality Control">Quality Control</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <div className="flex justify-end gap-2 border-t pt-4">
            <Link
              to="/production/planning"
              className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {t("createProduction.cancel")}
            </Link>
            <button
              type="submit"
              disabled={saving || loadingProducts}
              className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-slate-400"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}