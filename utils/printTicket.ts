import type { Ticket } from '../types';

export function printTicket(ticket: Ticket, isReceipt: boolean): void {
  
  const qrCodeHtml = (isReceipt && ticket.qrCodeData) 
    ? `
      <div class="qr-code">
        <p style="font-size: 11px; margin-bottom: 5px;">Scan to verify with KRA</p>
        <img 
          src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(ticket.qrCodeData)}" 
          alt="KRA QR Code" 
        />
        ${ticket.etimsInvoiceNumber ? `<p style="font-size: 10px; margin-top: 5px; font-family: monospace;">Inv No: ${ticket.etimsInvoiceNumber}</p>` : ''}
      </div>
    `
    : '';

  const content = `
    <html>
      <head>
        <title>${isReceipt ? 'Receipt' : 'Bill'}</title>
        <style>
          body {
            font-family: 'Courier New', Courier, monospace;
            width: 300px;
            margin: 0 auto;
            padding: 10px;
            color: #000;
          }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 20px; }
          .header p { margin: 2px 0; font-size: 12px; }
          .info { margin-bottom: 10px; font-size: 12px; border-top: 1px dashed #000; padding-top: 10px; }
          .info p { margin: 2px 0; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { padding: 4px 0; }
          .items thead { border-bottom: 1px dashed #000; }
          .items tfoot { border-top: 1px dashed #000; }
          .text-left { text-align: left; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .totals td:first-child { font-weight: normal; }
          .totals td { font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; border-top: 1px dashed #000; padding-top: 10px;}
          .qr-code { display: flex; flex-direction: column; align-items: center; margin: 15px 0; border-top: 1px dashed #000; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Tribal Bistro</h1>
          <p>Cafe & Restaurant</p>
          <p>Nairobi, Kenya</p>
        </div>
        <div class="info">
          <p><strong>${isReceipt ? 'Receipt' : 'Bill'} #:</strong> ${ticket.id}</p>
          <p><strong>Date:</strong> ${new Date(ticket.paidAt || Date.now()).toLocaleString()}</p>
        </div>
        <table class="items">
          <thead>
            <tr>
              <th class="text-left">Item</th>
              <th class="text-center">Qty</th>
              <th class="text-right">Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${ticket.items.map(item => `
              <tr>
                <td class="text-left">${item.menuItem.name}</td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">${item.menuItem.price.toFixed(2)}</td>
                <td class="text-right">${(item.menuItem.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="totals">
              <td colspan="3" class="text-right">Subtotal</td>
              <td class="text-right">${ticket.subtotal.toFixed(2)}</td>
            </tr>
            <tr class="totals">
              <td colspan="3" class="text-right">Tax (16%)</td>
              <td class="text-right">${ticket.tax.toFixed(2)}</td>
            </tr>
            <tr class="totals">
              <td colspan="3" class="text-right"><strong>Total</strong></td>
              <td class="text-right"><strong>${ticket.total.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
        ${isReceipt ? `
          <div class="info">
            <p><strong>Payment Method:</strong> ${ticket.paymentMethod?.toUpperCase()}</p>
            <p><strong>Status:</strong> PAID</p>
          </div>
          ${qrCodeHtml}
          <div class="footer">
            <p>Thank you for your visit!</p>
          </div>
        ` : ''}
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    // Use onload to ensure images (like the QR code) are loaded before printing
    printWindow.onload = function() {
        printWindow.print();
        printWindow.close();
    };
  } else {
    alert('Please allow popups for this website to print the ticket.');
  }
}
