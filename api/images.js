const { list } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  // Sadece GET isteklerini kabul et
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Vercel Blob Storage'dan tüm resimleri listele (CDG1 - Paris region'ında)
    const { blobs } = await list({
      prefix: 'images/',
    });

    // Sadece resim dosyalarını filtrele
    const images = blobs
      .filter(blob => {
        const ext = blob.pathname.toLowerCase().split('.').pop();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
      })
      .map(blob => ({
        filename: blob.pathname.split('/').pop(),
        url: blob.url,
        pathname: blob.pathname,
      }));

    // Cache headers ekle - hızlı yükleme için
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    return res.status(200).json({
      success: true,
      images: images,
    });
  } catch (error) {
    console.error('List images error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Resimler yüklenirken bir hata oluştu!' 
    });
  }
};

