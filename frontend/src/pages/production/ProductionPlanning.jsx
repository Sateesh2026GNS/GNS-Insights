import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import EmptyState from "../../components/common/EmptyState";
import { getProductionOrders } from "../../api/productionApi";

const TENANT_ID = 1;

function formatDate(val) {
  if (!val) return "—";
  const d = new Date(val);
  return isNaN(d.getTime()) ? val : d.toLocaleDateString(undefined, { dateStyle: "short" });
}

export default function ProductionPlanning() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const response = await getProductionOrders(TENANT_ID);
        setOrders(response.data || []);
      } catch (error) {
        console.error("Failed to load production orders", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return <Loader label={t("production.loadingProduction")} />;
  }

  const columns = [
    { key: "order_number", label: t("dashboard.order") },
    { key: "product_id", label: t("dashboard.product") },
    { key: "planned_quantity", label: t("production.plannedQty") },
    { key: "start_date", label: t("createProduction.startDate").replace(" Date", ""), render: (r) => formatDate(r.start_date) },
    { key: "due_date", label: t("createProduction.dueDate").replace(" Date", ""), render: (r) => formatDate(r.due_date) },
    { key: "status", label: t("dashboard.status"), statusBadge: true },
  ];

  const emptyState = (
    <EmptyState
      icon="clipboard"
      title={t("production.noDataAvailable")}
      description={t("production.createFirstProductionOrder")}
      actionLabel={t("production.newProductionOrderShort")}
      actionHref="/production/create"
    />
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("production.productionPlanning")}
        subtitle={t("production.productionPlanningSubtitle")}
        action={
          <Link
            to="/production/create"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <span>+</span>
            {t("dashboard.newProductionOrder")}
          </Link>
        }
      />

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <DataTable
          columns={columns}
          data={orders}
          searchPlaceholder={t("common.search")}
          searchKeys={["order_number", "product_id"]}
          emptyState={emptyState}
        />
      </div>
    </div>
  );
}
