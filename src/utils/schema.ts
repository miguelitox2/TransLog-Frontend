import { z } from "zod";

// Schema para o Cadastro de CTE
export const cteSchema = z.object({
  numberCte: z.string()
    .min(1, "O número do CTE é obrigatório")
    .transform(val => val.replace(/[-\s]/g, "")) // Limpa antes de validar
    .refine(val => /^(\d{1,6})([a-zA-Z])(\d{3})$/.test(val), {
      message: "Formato inválido. Ex: 123456w123"
    }),
  shipperName: z.string().min(3, "O nome do remetente deve ter no mínimo 3 caracteres"),
  clientName: z.string().min(1, "O nome do cliente é obrigatório"),
  ro: z.string().optional(),
  value: z.string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val.replace(',', '.'))), {
      message: "Valor inválido",
    }),
  cause: z.string().min(1, "Selecione o tipo"),
  description: z.string().max(300, "A descrição não pode passar de 300 caracteres").optional(),
  accountable: z.string().min(1, "Selecione o causador").optional(),
});

export type CteFormData = z.infer<typeof cteSchema>;