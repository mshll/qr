import { get, set } from "idb-keyval";
import type { QrState } from "./state";

export interface RecentItem {
  id: string;
  savedAt: number;
  label: string;
  payload: string;
  state: QrState;
  svg: string;
}

const KEY = "recent";
const LIMIT = 12;

export async function loadRecent(): Promise<RecentItem[]> {
  return (await get<RecentItem[]>(KEY)) ?? [];
}

export async function saveRecent(item: Omit<RecentItem, "id" | "savedAt">): Promise<RecentItem[]> {
  const items = await loadRecent();
  const rest = items.filter((existing) => existing.svg !== item.svg);
  const next = [{ ...item, id: crypto.randomUUID(), savedAt: Date.now() }, ...rest].slice(0, LIMIT);
  await set(KEY, next);
  return next;
}

export async function clearRecent(): Promise<void> {
  await set(KEY, []);
}
