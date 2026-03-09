import { z } from "zod";

export const barcodeSchema = z.object({
  barcode: z
    .string()
    .min(21, "O código de barras deve ter pelo menos 21 caracteres")
    .max(22, "Código de barras muito longo")
    .regex(/^[a-zA-Z0-9]+$/, "O código deve conter apenas letras e números"),
});

export type BarcodeFormData = z.infer<typeof barcodeSchema>;
