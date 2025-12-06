
        
import { OrderDetailModel, getOrderDetail } from "./order";

/**
 * Model professional untuk Nota Pembayaran/Invoice.
 */
export interface InvoiceModel {
  invoiceId: string;
  orderId: string;
  issuedDate: string;
  dueDate: string;
  billingAddress: string;
  items: OrderDetailModel['items'];
  subTotal: number;
  taxRate: number; // Misalnya PPN 11%
  taxAmount: number;
  grandTotal: number;
  paymentStatus: 'LUNAS' | 'BELUM_LUNAS';
  paymentDetails: OrderDetailModel['payment'];
  notes?: string;
}

const generateInvoice = (orderId: string): InvoiceModel | undefined => {
  const order = getOrderDetail(orderId);
  if (!order) return undefined;

  const taxRate = 0.11; // 11% PPN
  const subTotal = order.totalAmount / (1 + taxRate);
  const taxAmount = order.totalAmount - subTotal;

  return {
    invoiceId: `INV-${order.orderId.split('-').pop()}`,
    orderId: order.orderId,
    issuedDate: new Date(order.tanggalPesan).toLocaleDateString('id-ID'),
    dueDate: new Date(new Date(order.tanggalPesan).setDate(new Date(order.tanggalPesan).getDate() + 7)).toLocaleDateString('id-ID'), // 7 days later
    billingAddress: order.pangkalan.alamatSingkat,
    items: order.items,
    subTotal: Math.floor(subTotal),
    taxRate: taxRate * 100,
    taxAmount: Math.floor(taxAmount),
    grandTotal: order.totalAmount,
    paymentStatus: order.payment.isPaid ? 'LUNAS' : 'BELUM_LUNAS',
    paymentDetails: order.payment,
    notes: "Mohon lakukan pembayaran tepat waktu. Terima kasih atas kerja sama Anda.",
  };
};

export const MOCK_INVOICE_LUNAS: InvoiceModel = generateInvoice("ORD-20251203-001")!;
        
      