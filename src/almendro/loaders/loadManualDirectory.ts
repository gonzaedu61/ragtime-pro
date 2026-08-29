import directoryData from "@rag_data_almendro/manualDirectory.json";

export interface ManualEntry {
  doc_id: string;
  description: string;
}

export const MANUAL_DIRECTORY: ManualEntry[] = directoryData as ManualEntry[];
