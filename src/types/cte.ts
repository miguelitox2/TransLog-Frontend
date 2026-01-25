export interface CteData {
  id: string;
  numberCte: string;
  createdAt: string;
  shipperName: string; // Garanta que todos os campos do banco estejam aqui
  clientName: string;
  cause: string;
  status: string;
  description?: string;
  ro?: number;
  value?: number;
  accountable?: string;
}