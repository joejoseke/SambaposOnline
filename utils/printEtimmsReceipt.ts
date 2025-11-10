import type { Ticket } from '../types';

export function printEtimmsReceipt(ticket: Ticket): void {
  // Simulate ETIMMS data
  const kraPin = "P000123456X";
  const cuSerialNumber = "KRA-POS-001";
  const invoiceNumber = `INV-${ticket.id.slice(-6)}`;
  
  // Data for QR code
  const qrData = JSON.stringify({
    invoice: invoiceNumber,
    date: ticket.paidAt,
    total: ticket.total,
    pin: kraPin,
  });
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrData)}`;

  const content = `
    <html>
      <head>
        <title>ETIMMS Receipt</title>
        <style>
          body {
            font-family: 'Courier New', Courier, monospace;
            width: 300px;
            margin: 0 auto;
            padding: 10px;
            color: #000;
          }
          .header { text-align: center; margin-bottom: 10px; }
          .header h1 { margin: 0; font-size: 20px; }
          .header p { margin: 2px 0; font-size: 12px; }
          .info, .fiscal-info { margin-bottom: 10px; font-size: 12px; border-top: 1px dashed #000; padding-top: 10px; }
          .info p, .fiscal-info p { margin: 2px 0; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { padding: 4px 0; }
          .items thead { border-bottom: 1px dashed #000; }
          .items tfoot { border-top: 1px dashed #000; }
          .text-left { text-align: left; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .totals td:first-child { font-weight: normal; }
          .totals td { font-weight: bold; }
          .footer { text-align: center; margin-top: 10px; font-size: 12px; border-top: 1px dashed #000; padding-top: 10px;}
          .qr-code { display: flex; justify-content: center; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Tribal Bistro</h1>
          <p>Cafe & Restaurant</p>
          <p>Nairobi, Kenya</p>
          <p>PIN: ${kraPin}</p>
        </div>
        <div class="info">
          <p><strong>Official ETIMMS Receipt</strong></p>
          <p><strong>Date:</strong> ${new Date(ticket.paidAt || Date.now()).toLocaleString()}</p>
        </div>
        <table class="items">
          <thead>
            <tr>
              <th class="text-left">Item</th>
              <th class="text-center">Qty</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${ticket.items.map(item => `
              <tr>
                <td colspan="3" class="text-left">${item.menuItem.name}</td>
              </tr>
              <tr>
                <td class="text-left"></td>
                <td class="text-center">${item.quantity} x ${item.menuItem.price.toFixed(2)}</td>
                <td class="text-right">${(item.menuItem.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="totals">
              <td colspan="2" class="text-right">Total Taxable</td>
              <td class="text-right">${ticket.subtotal.toFixed(2)}</td>
            </tr>
            <tr class="totals">
              <td colspan="2" class="text-right">VAT (16%)</td>
              <td class="text-right">${ticket.tax.toFixed(2)}</td>
            </tr>
            <tr class="totals">
              <td colspan="2" class="text-right"><strong>Total</strong></td>
              <td class="text-right"><strong>${ticket.total.toFixed(2)}</strong></td>
            </tr>
             <tr class="totals">
              <td colspan="2" class="text-right">Paid via</td>
              <td class="text-right">${ticket.paymentMethod?.toUpperCase()}</td>
            </tr>
          </tfoot>
        </table>
        <div class="fiscal-info">
            <p><strong>Invoice No:</strong> ${invoiceNumber}</p>
            <p><strong>CU Serial No:</strong> ${cuSerialNumber}</p>
        </div>
        <div class="qr-code">
            <img src="${qrCodeUrl}" alt="QR Code" />
        </div>
        <div class="footer">
            <p>This is a fiscal receipt.</p>
            <p>Thank you for your business!</p>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    // Allow images to load before printing
    printWindow.onload = function() {
        printWindow.print();
        printWindow.close();
    };
  } else {
    alert('Please allow popups for this website to print the receipt.');
  }
}