const { put } = require('@vercel/blob');
const Busboy = require('busboy');

module.exports = async function handler(req, res) {
  // Sadece POST isteklerini kabul et
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const busboy = Busboy({ headers: req.headers });
    const files = [];
    const uploadPromises = [];

    // FormData'dan dosyaları oku
    busboy.on('file', (fieldname, file, info) => {
      const { filename, encoding, mimeType } = info;
      
      if (fieldname === 'images') {
        const chunks = [];
        
        file.on('data', (chunk) => {
          chunks.push(chunk);
        });

        file.on('end', () => {
          const buffer = Buffer.concat(chunks);
          
          // Vercel Blob Storage'a yükle
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
      }
    });

    busboy.on('finish', async () => {
      try {
        const uploadedFiles = await Promise.all(uploadPromises);
        
        return res.status(200).json({
          success: true,
          message: `${uploadedFiles.length} resim başarıyla yüklendi!`,
          images: uploadedFiles,
        });
      } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Resim yüklenirken bir hata oluştu!' 
        });
      }
    });

    req.pipe(busboy);

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Resim yüklenirken bir hata oluştu!' 
    });
  }
};

