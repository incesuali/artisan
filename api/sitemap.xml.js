const { list } = require('@vercel/blob');

const BLOG_POSTS_FILE = 'data/blog-posts.json';
const BASE_URL = 'https://a-parqueteur.xyz';

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
    return [];
  }
}

// Slug oluştur
function createSlug(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Tarihi formatla (YYYY-MM-DD)
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

module.exports = async function handler(req, res) {
  try {
    // Blog yazılarını yükle
    const blogPosts = await loadBlogPosts();
    
    // Sitemap XML oluştur
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <!-- Homepage -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="fr-FR" href="${BASE_URL}/"/>
  </url>
  
  <!-- Blog Page -->
  <url>
    <loc>${BASE_URL}/blog.html</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="fr-FR" href="${BASE_URL}/blog.html"/>
  </url>
  
`;

    // Blog yazılarını ekle
    blogPosts.forEach(post => {
      const slug = createSlug(post.title);
      const lastmod = formatDate(post.date);
      const postUrl = `${BASE_URL}/blog-post.html?id=${post.id}&slug=${encodeURIComponent(slug)}`;
      
      sitemap += `  <!-- Blog Post: ${post.title} -->
  <url>
    <loc>${postUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="fr-FR" href="${postUrl}"/>
  </url>
  
`;
    });
    
    sitemap += `</urlset>`;
    
    // XML olarak döndür
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    return res.status(200).send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><error>Internal Server Error</error>');
  }
};


