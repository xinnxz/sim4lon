
        
import { PaymentMethod } from "./enums";

/**
 * Model untuk detail rekaman pembayaran.
 */
export interface PaymentRecordModel {
  paymentId: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  paymentDate: string;
  proofUrl?: string; // Hanya jika Transfer Bank
  recordedByUserId: string;
}

export const MOCK_PAYMENT_PROOF_IMAGE_URL: string = "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/12/3/106a398a-f0e5-458b-856e-24a243bb5283.png";
        
      