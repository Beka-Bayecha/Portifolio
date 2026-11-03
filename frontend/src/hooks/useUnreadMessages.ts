import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./useAuth";

export function useUnreadMessages() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "messages"), where("read", "==", false));
    const unsub = onSnapshot(q, (snap) => setCount(snap.size), () => setCount(0));
    return unsub;
  }, [user]);

  return count;
}
