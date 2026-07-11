import { useCallback, useEffect, useState } from "react";

import { getNotifications, markNotificationsRead } from "../api/alertsApi";
import useAuth from "./useAuth";

const POLL_MS = 60_000;

function unreadCount(items) {
  return items.filter((n) => !n.read).length;
}

export default function useNotifications() {
  const { isAuthenticated } = useAuth();
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCount(0);
      setNotifications([]);
      setError(null);
      return;
    }
    setLoading(true);
    try {
      const res = await getNotifications();
      const data = res.data ?? {};
      const items = data.notifications ?? [];
      setNotifications(items);
      setCount(data.count ?? unreadCount(items));
      setError(null);
    } catch (err) {
      setCount(0);
      setNotifications([]);
      setError(err.response?.data?.detail || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const markRead = useCallback(
    async (notificationIds) => {
      if (!isAuthenticated || !notificationIds?.length) return;

      let previousNotifications = [];
      let previousCount = 0;

      setNotifications((prev) => {
        previousNotifications = prev;
        previousCount = unreadCount(prev);
        const ids = new Set(notificationIds);
        const next = prev.map((n) => (ids.has(n.id) && !n.read ? { ...n, read: true } : n));
        setCount(unreadCount(next));
        return next;
      });

      try {
        const res = await markNotificationsRead(notificationIds);
        const data = res.data ?? {};
        const items = data.notifications ?? [];
        setNotifications(items);
        setCount(data.count ?? unreadCount(items));
      } catch {
        setNotifications(previousNotifications);
        setCount(previousCount);
        await refresh();
      }
    },
    [isAuthenticated, refresh]
  );

  useEffect(() => {
    refresh();
    if (!isAuthenticated) return undefined;
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [refresh, isAuthenticated]);

  return { count, notifications, loading, error, refresh, markRead };
}
