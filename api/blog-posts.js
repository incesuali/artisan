const { put, list, del, head } = require('@vercel/blob');

const BLOG_POSTS_FILE = 'data/blog-posts.json';

// Blog yazılarını yükle
async function loadBlogPosts() {
  try {
    const { blobs } = await list({
      prefix: BLOG_POSTS_FILE,
    });

    if (blobs.length === 0) {
      return [];
    }

    // En son güncellenen dosyayı al
    const latestBlob = blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];
    
    // Blob'dan içeriği oku (public URL'den)
    const response = await fetch(latestBlob.url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Load blog posts error:', error);
    // Hata durumunda boş array döndür
    return [];
  }
}

// Blog yazılarını kaydet
async function saveBlogPosts(posts) {
  try {
    const data = JSON.stringify({ posts }, null, 2);
    const buffer = Buffer.from(data, 'utf-8');

    // Eski dosyaları sil
    const { blobs } = await list({
      prefix: BLOG_POSTS_FILE,
    });

    await Promise.all(blobs.map(blob => del(blob.url)));

    // Yeni dosyayı yükle
    const blob = await put(BLOG_POSTS_FILE, buffer, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    return { success: true, url: blob.url };
  } catch (error) {
    console.error('Save blog posts error:', error);
    throw error;
  }
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const posts = await loadBlogPosts();
      // Cache'i kısa tut ama yine de cache'le (performans için)
      // Client-side'da cache: 'no-cache' kullanıyoruz, bu header sadece CDN için
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate, s-maxage=30');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      return res.status(200).json({
        success: true,
        posts: posts,
        count: posts.length,
        timestamp: new Date().toISOString() // Debug için timestamp ekle
      });
    } catch (error) {
      console.error('GET blog posts error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Blog yazıları yüklenirken bir hata oluştu!'
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { posts } = req.body;

      if (!Array.isArray(posts)) {
        return res.status(400).json({
          success: false,
          error: 'Geçersiz veri formatı!'
        });
      }

      const result = await saveBlogPosts(posts);

      return res.status(200).json({
        success: true,
        message: `${posts.length} blog yazısı başarıyla kaydedildi!`,
        ...result
      });
    } catch (error) {
      console.error('POST blog posts error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Blog yazıları kaydedilirken bir hata oluştu!'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

