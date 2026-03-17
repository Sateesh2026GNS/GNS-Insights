import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import EmptyState from "../../components/common/EmptyState";
import { getDailyReports } from "../../api/productionApi";

const TENANT_ID = 1;

function formatDate(val) {
  if (!val) return "—";
  const d = new Date(val);
  return isNaN(d.getTime()) ? val : d.toLocaleDateString(undefined, { dateStyle: "medium" });
}

export default function DailyReports() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        const response = await getDailyReports(TENANT_ID);
        setReports(response.data || []);
      } catch (error) {
        console.error("Failed to load daily reports", error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  if (loading) {
    return <Loader label={t("production.loadingReports")} />;
  }

  const columns = [
    { key: "report_date", label: t("dashboard.date"), render: (r) => formatDate(r.report_date) },
    { key: "product_id", label: t("dashboard.product") },
    { key: "work_order_id", label: t("production.workOrder") },
    { key: "machine_id", label: t("production.machine") },
    { key: "produced_quantity", label: t("dashboard.produced") },
    { key: "scrap_quantity", label: t("dashboard.scrap") },
    { key: "downtime_minutes", label: t("dashboard.downtime") },
  ];

  const emptyState = (
    <EmptyState
      icon="chart"
      title={t("production.noDataAvailable")}
      description={t("production.noDailyReports")}
    />
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("production.dailyReports")}
        subtitle={t("production.dailyReportsSubtitle")}
      />

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <DataTable
          columns={columns}
          data={reports}
          searchPlaceholder={t("common.search")}
          searchKeys={["report_date", "product_id", "work_order_id"]}
          emptyState={emptyState}
        />
      </div>
    </div>
  );
}
