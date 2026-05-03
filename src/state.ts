import type { Memento } from "vscode";

const STATE_KEY = "threads.records";

export interface ThreadMeta {
  id: string;
  createdAt: string;
  inquiry: string;
  scratchPath: string;
  sourcePath: string;
  selectedText: string;
  scratchFilename: string;
  startLine: number;
  endLine: number;
}

export function listThreads(memento: Memento): ThreadMeta[] {
  return memento.get<ThreadMeta[]>(STATE_KEY, []);
}

export async function addThread(memento: Memento, thread: ThreadMeta): Promise<void> {
  const records = listThreads(memento);
  await memento.update(STATE_KEY, [...records, thread]);
}

export async function removeThread(memento: Memento, id: string): Promise<void> {
  const records = listThreads(memento).filter((t) => t.id !== id);
  await memento.update(STATE_KEY, records);
}
