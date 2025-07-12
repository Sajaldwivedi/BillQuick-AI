import jsPDF from "jspdf";
import type { Bill } from "@/types";

export const generateInvoicePdf = (bill: Bill) => {
  const doc = new jsPDF();

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("BillQuick AI Invoice", 105, 20, { align: "center" });

  // Bill Details
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Bill ID: ${bill.id}`, 20, 40);
  doc.text(`Date: ${bill.createdAt.toLocaleDateString()}`, 20, 45);
  if (bill.customerName) {
    doc.text(`Customer Name: ${bill.customerName}`, 20, 50);
  }

  // Line
  doc.line(20, 60, 190, 60);

  // Table Header
  let y = 70;
  doc.setFont("helvetica", "bold");
  doc.text("Product", 20, y);
  doc.text("Qty", 110, y, { align: "center" });
  doc.text("Price", 145, y, { align: "right" });
  doc.text("Subtotal", 185, y, { align: "right" });
  y += 5;
  doc.line(20, y, 190, y);
  y += 8;

  // Table Body
  doc.setFont("helvetica", "normal");
  bill.items.forEach((item) => {
    const splitName = doc.splitTextToSize(item.name, 80);
    doc.text(splitName, 20, y);
    doc.text(item.quantity.toString(), 110, y, { align: "center" });
    doc.text(`₹${item.price.toFixed(2)}`, 145, y, { align: "right" });
    doc.text(`₹${(item.price * item.quantity).toFixed(2)}`, 185, y, {
      align: "right",
    });
    y += (splitName.length > 1 ? splitName.length * 5 : 0) + 7;
  });

  // Line before total
  y += 5;
  doc.line(120, y, 190, y);
  y += 8;

  // Total
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total", 120, y);
  doc.text(`₹${bill.total.toFixed(2)}`, 185, y, { align: "right" });

  // Footer
  y += 20;
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("Thank you for your business!", 105, y, { align: "center" });

  doc.save(`invoice-${bill.id.substring(0, 8)}.pdf`);
};
