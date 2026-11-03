import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useCollection<T>(collectionName: string, orderField = "order") {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try ordered query first
        const q = query(collection(db, collectionName), orderBy(orderField));
        const snap = await getDocs(q);
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T));
      } catch {
        try {
          // Fallback: unordered if index missing
          const snap = await getDocs(collection(db, collectionName));
          setData(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T));
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Failed to load data";
          console.error(`[useCollection] Failed to load "${collectionName}":`, err);
          setError(msg);
          setData([]);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [collectionName, orderField]);

  return { data, loading, error };
}
