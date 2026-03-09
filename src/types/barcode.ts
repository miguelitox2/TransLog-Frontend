export type BarcodeStatus = "PENDING" | "URGENT" | "FINISHED";

export interface BarcodeItem {
  id: string;
  barcode: string;
  productName?: string;
  firstReadAt: string;
  lastReadAt: string;
  status: BarcodeStatus;
  readCount: number; // Para exibir o "Leituras: X" da imagem
}
