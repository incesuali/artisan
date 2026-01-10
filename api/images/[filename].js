const { del, list } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  // Sadece DELETE isteklerini kabul et
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename } = req.query;

    if (!filename) {
      return res.status(400).json({ 
        success: false, 
        error: 'Dosya adı belirtilmedi!' 
      });
    }

    // Önce blob'u bul
    const { blobs } = await list({
      prefix: `images/${filename}`,
    });

    if (blobs.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Resim bulunamadı!' 
      });
    }

    // İlk eşleşen blob'u sil
    const blob = blobs[0];
    
    try {
      await del(blob.url);
      return res.status(200).json({ 
        success: true, 
        message: 'Resim başarıyla silindi!' 
      });
    } catch (delError) {
      return res.status(404).json({ 
        success: false, 
        error: 'Resim silinirken bir hata oluştu!' 
      });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Resim silinirken bir hata oluştu!' 
    });
  }
};

