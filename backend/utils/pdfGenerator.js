const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate visitor pass PDF with visitor details and QR code
exports.generatePassPDF = (pass, visitor, host, organization) => {
  return new Promise((resolve, reject) => {
    try {
      const passDirectory = path.join(
        __dirname,
        '..',
        'uploads',
        'passes'
      );

      if (!fs.existsSync(passDirectory)) {
        fs.mkdirSync(passDirectory, { recursive: true });
      }

      const filename = `pass-${pass._id}.pdf`;
      const pdfFilePath = path.join(passDirectory, filename);

      const doc = new PDFDocument({
        size: [300, 480],
        margin: 15
      });

      const writeStream = fs.createWriteStream(pdfFilePath);

      doc.pipe(writeStream);

      // Header Section

      doc.rect(0, 0, 300, 60).fill('#1e293b');

      doc.fillColor('#ffffff').fontSize(14).font('Helvetica-Bold').text(
          (organization?.name || 'Visitor Pass System').toUpperCase(),
          15,20,
          {
            align: 'center',
            width: 270
          }
        );
      // Visitor Photo
      
      const photoX = 100;
      const photoY = 75;
      const photoWidth = 100;
      const photoHeight = 100;

      let photoAdded = false;

      if (visitor.photo) {
        const photoPath = path.join(
          __dirname,
          '..',
          'uploads',
          visitor.photo
        );

        if (fs.existsSync(photoPath)) {
          doc.image(photoPath, photoX, photoY, {
            fit: [photoWidth, photoHeight],
            align: 'center',
            valign: 'center'
          });

          photoAdded = true;
        }
      }

      // Showing placeholder if photo doesn't exist
      if (!photoAdded) {
        doc.rect(photoX, photoY, photoWidth, photoHeight).lineWidth(1).strokeColor('#cbd5e1').stroke();

        doc.fillColor('#64748b').fontSize(10).font('Helvetica').text('NO PHOTO',
            photoX,
            photoY + 45,
            {
              align: 'center',
              width: photoWidth
            }
          );
      }

      // Visitor Information

      doc.fillColor('#0f172a').fontSize(14).font('Helvetica-Bold').text(
          visitor.name || 'Visitor',
          15,190,
          {
            align: 'center',
            width: 270
          }
        );

      doc.fillColor('#475569').fontSize(10).font('Helvetica').text(
          `Phone: ${visitor.phone || 'N/A'}`,
          15,210,
          {
            align: 'center',
            width: 270
          }
        )
        .text(
          `Email: ${visitor.email || 'N/A'}`,
          15,
          225,
          {
            align: 'center',
            width: 270
          }
        );

      // Separator
      doc.moveTo(15, 245).lineTo(285, 245).lineWidth(1).strokeColor('#e2e8f0').stroke();

      // Host Information

      doc.fillColor('#334155').fontSize(11).font('Helvetica-Bold').text(`HOST: ${host?.name || 'Not Assigned'}`,
          15,255,
          {
            align: 'center',
            width: 270
          }
        );

      // QR Code

      if (pass.qrCode) {
        const base64Data = pass.qrCode.replace(
          /^data:image\/\w+;base64,/,
          ''
        );

        const qrBuffer = Buffer.from(
          base64Data,
          'base64'
        );

        doc.image(qrBuffer, 100, 275, {
          width: 100
        });
      }

      // Expiry Information

      const formattedExpiry = new Date(
        pass.expiryDate
      ).toLocaleString();

      doc
        .fillColor('#ef4444')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text(
          `EXPIRES: ${formattedExpiry}`,
          15,
          390,
          {
            align: 'center',
            width: 270
          }
        );

      // Footer

      doc
        .fillColor('#94a3b8')
        .fontSize(8)
        .font('Helvetica')
        .text(
          'Please scan the QR code at reception for check-in and check-out.',
          15,
          415,
          {
            align: 'center',
            width: 270
          }
        );

      // Finalize PDF
      doc.end();

      writeStream.on('finish', () => {
        resolve(filename);
      });

      writeStream.on('error', (error) => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
};