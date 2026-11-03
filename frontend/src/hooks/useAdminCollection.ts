import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useAdminCollection<T = Record<string, unknown>>(collectionName: string, orderField = "order") {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, collectionName), orderBy(orderField));
      const snap = await getDocs(q);
      setData(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T));
    } catch {
      // fallback without ordering if field doesn't exist yet
      const snap = await getDocs(collection(db, collectionName));
      setData(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T));
    } finally {
      setLoading(false);
    }
  }, [collectionName, orderField]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, refresh: fetch };
}
