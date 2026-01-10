const { put } = require('@vercel/blob');
const Busboy = require('busboy');

// Vercel Blob Storage token otomatik olarak BLOB_READ_WRITE_TOKEN environment variable'ından alınır

module.exports = async function handler(req, res) {
  // Sadece POST isteklerini kabul et
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return new Promise((resolve, reject) => {
    try {
      const busboy = Busboy({ headers: req.headers });
      const uploadPromises = [];
      let fileCount = 0;

      // FormData'dan dosyaları oku
      busboy.on('file', (fieldname, file, info) => {
        const { filename, encoding, mimeType } = info;
        
        if (fieldname === 'images') {
          fileCount++;
          const chunks = [];
          
          file.on('data', (chunk) => {
            chunks.push(chunk);
          });

          file.on('end', () => {
            const buffer = Buffer.concat(chunks);
            
            // Vercel Blob Storage'a yükle
            // Token otomatik olarak BLOB_READ_WRITE_TOKEN environment variable'ından alınır
            const promise = put(`images/${filename}`, buffer, {
              access: 'public',
              addRandomSuffix: true,
              contentType: mimeType,
            }).then(blob => ({
              filename: blob.pathname.split('/').pop(),
              url: blob.url,
            }));

            uploadPromises.push(promise);
          });
        } else {
          file.resume(); // Diğer fieldları atla
        }
      });

      busboy.on('finish', async () => {
        try {
          if (uploadPromises.length === 0) {
            return res.status(400).json({
              success: false,
              error: 'Resim seçilmedi!'
            });
          }

          const uploadedFiles = await Promise.all(uploadPromises);
          
          // Cache headers ekle
          res.setHeader('Cache-Control', 'no-cache');
          
          res.status(200).json({
            success: true,
            message: `${uploadedFiles.length} resim başarıyla yüklendi!`,
            images: uploadedFiles,
          });
          resolve();
        } catch (error) {
          console.error('Upload error:', error);
          res.status(500).json({ 
            success: false, 
            error: error.message || 'Resim yüklenirken bir hata oluştu!' 
          });
          resolve();
        }
      });

      busboy.on('error', (error) => {
        console.error('Busboy error:', error);
        res.status(500).json({ 
          success: false, 
          error: error.message || 'Form parse hatası!' 
        });
        resolve();
      });

      req.pipe(busboy);

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Resim yüklenirken bir hata oluştu!' 
      });
      resolve();
    }
  });
};

