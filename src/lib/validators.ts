import { z } from "zod";

export const tradeSchema = z.object({
    coinGeckoId: z.string().min(1, "Seleccioná una criptomoneda"),
    type: z.enum(["BUY", "SELL"]),
    quantity: z
        .number()
        .positive("La cantidad debe ser mayor a 0")
        .max(999999999, "Cantidad demasiado grande"),
    currentPrice: z.number().positive("El precio debe ser mayor a 0"),
});

export const depositSchema = z.object({
    amount: z
        .number()
        .positive("El monto debe ser mayor a 0")
        .max(999999999, "Monto demasiado grande"),
    currency: z.enum(["USD", "ARS"]),
});

export type TradeInput = z.infer<typeof tradeSchema>;
export type DepositInput = z.infer<typeof depositSchema>;
