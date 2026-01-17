const { put, list, del } = require('@vercel/blob');

const KEYWORDS_FILE = 'data/seo-keywords.json';

// Kelimeleri yükle
async function loadKeywords() {
  try {
    const { blobs } = await list({
      prefix: KEYWORDS_FILE,
    });

    if (blobs.length === 0) {
      return null;
    }

    // En son güncellenen dosyayı al
    const latestBlob = blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];
    
    // Blob'dan içeriği oku (public URL'den)
    const response = await fetch(latestBlob.url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Load keywords error:', error);
    return null;
  }
}

// Kelimeleri kaydet
async function saveKeywords(keywords) {
  try {
    // Vercel Blob Storage token kontrolü
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN environment variable eksik!');
      throw new Error('Vercel Blob Storage token yapılandırılmamış. Lütfen Vercel dashboard\'da Storage ayarlarını kontrol edin.');
    }

    const data = JSON.stringify(keywords, null, 2);
    const buffer = Buffer.from(data, 'utf-8');

    // Eski dosyaları sil
    const { blobs } = await list({
      prefix: KEYWORDS_FILE,
    });

    if (blobs.length > 0) {
      await Promise.all(blobs.map(blob => del(blob.url)));
    }

    // Yeni dosyayı yükle
    const blob = await put(KEYWORDS_FILE, buffer, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    console.log('✅ Keywords saved to Vercel Blob Storage:', blob.url);
    return { success: true, url: blob.url };
  } catch (error) {
    console.error('❌ Save keywords error:', error.message || error);
    throw error;
  }
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const keywords = await loadKeywords();
      
      if (!keywords) {
        return res.status(200).json({
          success: true,
          keywords: {
            category1: [],
            category2: [],
            category3: [],
            category4: [],
          }
        });
      }

      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      return res.status(200).json({
        success: true,
        keywords: keywords,
      });
    } catch (error) {
      console.error('GET keywords error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Kelimeler yüklenirken bir hata oluştu!'
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { category1, category2, category3, category4 } = req.body;

      if (!Array.isArray(category1) || !Array.isArray(category2) || 
          !Array.isArray(category3) || !Array.isArray(category4)) {
        return res.status(400).json({
          success: false,
          error: 'Geçersiz veri formatı!'
        });
      }

      const keywords = {
        category1,
        category2,
        category3,
        category4,
      };

      const result = await saveKeywords(keywords);

      return res.status(200).json({
        success: true,
        message: 'Kelimeler başarıyla kaydedildi!',
        ...result
      });
    } catch (error) {
      console.error('POST keywords error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Kelimeler kaydedilirken bir hata oluştu!'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

