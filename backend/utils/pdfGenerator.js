const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generatePassPDF = (pass, visitor, host, organization) => {
  return new Promise((resolve, reject) => {
    const passFolder = path.join(__dirname, '..', 'uploads', 'passes');

    if (!fs.existsSync(passFolder)) {
      fs.mkdirSync(passFolder, { recursive: true });
    }

    const fileName = `pass-${pass._id}.pdf`;
    const filePath = path.join(passFolder, fileName);

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(20).text('Visitor Pass', {
      align: 'center'
    });

    doc.moveDown();

    doc.fontSize(12).text(`Organization: ${organization?.name || 'N/A'}`);
    doc.text(`Visitor Name: ${visitor.name}`);
    doc.text(`Phone: ${visitor.phone}`);
    doc.text(`Email: ${visitor.email}`);

    doc.moveDown();

    doc.text(`Host: ${host?.name || 'N/A'}`);

    doc.moveDown();

    doc.text(
      `Expiry Date: ${new Date(pass.expiryDate).toLocaleString()}`
    );

    doc.moveDown();

    if (pass.qrCode) {
      const base64Data = pass.qrCode.replace(
        /^data:image\/\w+;base64,/,
        ''
      );

      const qrBuffer = Buffer.from(
        base64Data,
        'base64'
      );

      doc.image(qrBuffer, {
        width: 150
      });
    }

    doc.end();

    stream.on('finish', () => {
      resolve(fileName);
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
};