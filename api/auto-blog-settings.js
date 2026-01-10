const { put, list, del } = require('@vercel/blob');

const SETTINGS_FILE = 'data/auto-blog-settings.json';

// Ayarları yükle
async function loadSettings() {
  try {
    const { blobs } = await list({
      prefix: SETTINGS_FILE,
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
    console.error('Load settings error:', error);
    return null;
  }
}

// Ayarları kaydet
async function saveSettings(settings) {
  try {
    const data = JSON.stringify(settings, null, 2);
    const buffer = Buffer.from(data, 'utf-8');

    // Eski dosyaları sil
    const { blobs } = await list({
      prefix: SETTINGS_FILE,
    });

    await Promise.all(blobs.map(blob => del(blob.url)));

    // Yeni dosyayı yükle
    const blob = await put(SETTINGS_FILE, buffer, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    return { success: true, url: blob.url };
  } catch (error) {
    console.error('Save settings error:', error);
    throw error;
  }
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const settings = await loadSettings();
      
      if (!settings) {
        return res.status(200).json({
          success: true,
          settings: {
            enabled: true, // Varsayılan olarak etkin
            lastAutoBlogDate: null,
          }
        });
      }

      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      return res.status(200).json({
        success: true,
        settings: settings,
      });
    } catch (error) {
      console.error('GET settings error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Ayarlar yüklenirken bir hata oluştu!'
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { enabled, lastAutoBlogDate } = req.body;

      const settings = {
        enabled: enabled !== undefined ? enabled : true,
        lastAutoBlogDate: lastAutoBlogDate || null,
      };

      const result = await saveSettings(settings);

      return res.status(200).json({
        success: true,
        message: 'Ayarlar başarıyla kaydedildi!',
        ...result
      });
    } catch (error) {
      console.error('POST settings error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Ayarlar kaydedilirken bir hata oluştu!'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

