const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generates a beautiful PDF visitor pass badge
exports.generatePassPDF = (pass, visitor, host, organization) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: [300, 480], margin: 15 });
      const filename = `pass-${pass._id}.pdf`;
      const pdfFilePath = path.join(__dirname, '..', 'uploads', 'passes', filename);
      const writeStream = fs.createWriteStream(pdfFilePath);

      doc.pipe(writeStream);

      // Gradient header design
      doc.rect(0, 0, 300, 60).fill('#1e293b'); // Dark Slate Grey

      // Header text
      doc.fillColor('#ffffff')
         .fontSize(14)
         .font('Helvetica-Bold')
         .text(organization.name.toUpperCase(), 15, 20, { align: 'center', width: 270 });

      // Visitor photo
      const photoX = 100;
      const photoY = 75;
      const photoWidth = 100;
      const photoHeight = 100;

      let photoAdded = false;
      if (visitor.photo) {
        const photoPath = path.join(__dirname, '..', 'uploads', visitor.photo);
        if (fs.existsSync(photoPath)) {
          doc.image(photoPath, photoX, photoY, {
            fit: [photoWidth, photoHeight],
            align: 'center',
            valign: 'center'
          });
          photoAdded = true;
        }
      }

      if (!photoAdded) {
        // Draw placeholder photo border
        doc.rect(photoX, photoY, photoWidth, photoHeight)
           .lineWidth(1)
           .strokeColor('#cbd5e1')
           .stroke();
        doc.fillColor('#64748b')
           .fontSize(10)
           .font('Helvetica')
           .text('NO PHOTO', photoX, photoY + 45, { align: 'center', width: photoWidth });
      }

      // Visitor credentials text
      doc.fillColor('#0f172a')
         .fontSize(14)
         .font('Helvetica-Bold')
         .text(visitor.name, 15, 190, { align: 'center', width: 270 });

      doc.fillColor('#475569')
         .fontSize(10)
         .font('Helvetica')
         .text(`Phone: ${visitor.phone}`, 15, 210, { align: 'center', width: 270 })
         .text(`Email: ${visitor.email}`, 15, 225, { align: 'center', width: 270 });

      // Separator line
      doc.moveTo(15, 245)
         .lineTo(285, 245)
         .lineWidth(1)
         .strokeColor('#e2e8f0')
         .stroke();

      // Host information
      doc.fillColor('#334155')
         .fontSize(11)
         .font('Helvetica-Bold')
         .text(`HOST: ${host.name}`, 15, 255, { align: 'center', width: 270 });

      // Embed Base64 QR Code
      if (pass.qrCode) {
        // Extract base64 buffer from base64 string
        const base64Data = pass.qrCode.replace(/^data:image\/\w+;base64,/, "");
        const qrBuffer = Buffer.from(base64Data, 'base64');
        doc.image(qrBuffer, 100, 275, { width: 100 });
      }

      // Valid range / Expiry footer
      const formattedExpiry = new Date(pass.expiryDate).toLocaleString();
      doc.fillColor('#ef4444')
         .fontSize(9)
         .font('Helvetica-Bold')
         .text(`EXPIRES: ${formattedExpiry}`, 15, 390, { align: 'center', width: 270 });

      // Footer notice
      doc.fillColor('#94a3b8')
         .fontSize(8)
         .font('Helvetica')
         .text('Please scan QR code at the reception for check-in / check-out.', 15, 415, { align: 'center', width: 270 });

      // Finalize PDF Document
      doc.end();

      writeStream.on('finish', () => {
        resolve(filename);
      });

      writeStream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};
