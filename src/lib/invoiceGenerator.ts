export interface InvoiceData {
  orderId: string;
  botName: string;
  telegramUsername: string;
  category?: string;
  amount: number;
  payAmount: number;
  paidAt?: string;
  paymentMethod?: string;
}

export async function generateInvoicePDF(data: InvoiceData): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [51, 144, 236]; // #3390ec
  const darkColor = [28, 36, 43]; // #1c242b
  const grayColor = [112, 117, 121]; // #707579
  const lightBg = [244, 247, 250]; // #f4f7fa
  const successColor = [16, 185, 129]; // #10b981
  const successBg = [236, 253, 245]; // #ecfdf5

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // 1. Header Brand Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('TELERANK', margin, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Telegram Bot Leaderboard & Promotion', margin + 45, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('BUKTI PEMBAYARAN', pageWidth - margin, 18, { align: 'right' });

  // 2. Invoice Meta Section
  let y = 42;

  // Status Badge (Draw green badge box + vector dot + clean ASCII text)
  const badgeWidth = 36;
  const badgeHeight = 9;
  const badgeX = pageWidth - margin - badgeWidth;
  const badgeY = y - 5;

  doc.setFillColor(successBg[0], successBg[1], successBg[2]);
  doc.setDrawColor(successColor[0], successColor[1], successColor[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 2, 2, 'FD');

  // Vector green dot
  doc.setFillColor(successColor[0], successColor[1], successColor[2]);
  doc.circle(badgeX + 5, badgeY + badgeHeight / 2, 1.2, 'F');

  // Text inside badge
  doc.setTextColor(successColor[0], successColor[1], successColor[2]);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('LUNAS / PAID', badgeX + 9, badgeY + 6);

  // Invoice Number & Date
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`INVOICE: #${data.orderId}`, margin, y);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  const dateStr = data.paidAt
    ? new Date(data.paidAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })
    : new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
  doc.text(`Tanggal Transaksi: ${dateStr}`, margin, y + 6);
  doc.text(`Metode: ${data.paymentMethod || 'QRIS Instan (BCA / Mandiri / GoPay / OVO / Dana)'}`, margin, y + 11);

  // Divider Line
  y += 20;
  doc.setDrawColor(228, 236, 242);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);

  // 3. Target Bot Information Card
  y += 8;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(margin, y, contentWidth, 28, 3, 3, 'F');

  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('DETAIL TARGET BOT TELEGRAM', margin + 6, y + 7);

  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const cleanBotTitle = data.botName || `@${data.telegramUsername.replace('@', '')}`;
  doc.text(cleanBotTitle, margin + 6, y + 14);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`@${data.telegramUsername.replace('@', '')}`, margin + 6, y + 20);

  if (data.category) {
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.setFontSize(9);
    doc.text(`Kategori: ${data.category}`, pageWidth - margin - 6, y + 14, { align: 'right' });
  }

  // 4. Table Header
  y += 38;
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('DESKRIPSI LAYANAN', margin + 4, y + 5.5);
  doc.text('JUMLAH', pageWidth - margin - 4, y + 5.5, { align: 'right' });

  // Table Row 1
  y += 8;
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, contentWidth, 14, 'F');
  doc.setDrawColor(228, 236, 242);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, contentWidth, 14, 'S');

  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Sponsor Leaderboard Ranking TeleRank', margin + 4, y + 6);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text(`Listing & promosi bot @${data.telegramUsername.replace('@', '')} ke audiens aktif`, margin + 4, y + 10.5);

  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rp ${data.amount.toLocaleString('id-ID')}`, pageWidth - margin - 4, y + 7.5, { align: 'right' });

  // Table Row 2: Unique Fee (if any)
  y += 14;
  const uniqueFee = Math.max(0, data.payAmount - data.amount);

  if (uniqueFee > 0) {
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, y, contentWidth, 10, 'F');
    doc.setDrawColor(228, 236, 242);
    doc.rect(margin, y, contentWidth, 10, 'S');

    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Biaya Sistem & Kode Unik Verifikasi', margin + 4, y + 6.5);
    doc.text(`Rp ${uniqueFee.toLocaleString('id-ID')}`, pageWidth - margin - 4, y + 6.5, { align: 'right' });
    y += 10;
  }

  // Grand Total Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(margin, y, contentWidth, 16, 'F');
  doc.setDrawColor(200, 215, 230);
  doc.rect(margin, y, contentWidth, 16, 'S');

  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL PEMBAYARAN', margin + 4, y + 10);

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rp ${data.payAmount.toLocaleString('id-ID')}`, pageWidth - margin - 4, y + 10.5, { align: 'right' });

  // 5. Verification Notice Card
  y += 26;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'F');
  doc.setDrawColor(220, 230, 240);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'S');

  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('STATUS TRANSAKSI RESMI', margin + 6, y + 7);

  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Pembayaran QRIS telah diverifikasi secara otomatis oleh sistem TeleRank.', margin + 6, y + 13);
  doc.text(`ID Referensi Transaksi: ${data.orderId}`, margin + 6, y + 18);
  doc.text('Posisi peringkat bot Anda telah langsung diperbarui di leaderboard utama.', margin + 6, y + 23);

  // 6. Footer Note
  const footerY = 270;
  doc.setDrawColor(228, 236, 242);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Dokumen ini adalah bukti transaksi sah yang diterbitkan otomatis oleh sistem TeleRank.', margin, footerY + 5);
  doc.text('TeleRank Indonesia - Platform Kurasi & Leaderboard Bot Telegram Terpercaya', margin, footerY + 9);
  doc.text('telerank', pageWidth - margin, footerY + 5, { align: 'right' });

  doc.save(`Invoice-TeleRank-${data.orderId}.pdf`);
}
