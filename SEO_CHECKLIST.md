# SEO Checklist - Artisan Parqueteur Nord

## ⚠️ KRİTİK: Domain Değişikliği - Indexing Engellendi

**TARİH:** 13 Ocak 2025  
**SEBEP:** Domain değişikliği (artisanparqueteurnord.xyz → yeni domain)

**YAPILAN DEĞİŞİKLİKLER:**
- ✅ `robots.txt` → `Disallow: /` (tüm sayfalar engellendi)
- ✅ Tüm HTML sayfalarında meta robots tag → `noindex, nofollow`

**YENİ DOMAIN HAZIR OLDUĞUNDA MUTLAKA YAPILACAKLAR:**

1. **robots.txt Düzelt:**
   ```txt
   User-agent: *
   Allow: /  # Disallow: / yerine
   Sitemap: https://YENI-DOMAIN.xyz/sitemap.xml  # Aktif et
   ```

2. **Meta Robots Tag Düzelt (Tüm HTML Sayfalarında):**
   - `index.html`
   - `blog.html`
   - `blog-post.html`
   
   ```html
   <!-- Önceki (ŞU ANKİ - KALDIRILACAK) -->
   <meta name="robots" content="noindex, nofollow">
   
   <!-- Yeni (YAPILACAK) -->
   <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
   ```

3. **Google Search Console:**
   - Yeni domain'i ekle
   - Verification yap
   - Sitemap gönder: `https://YENI-DOMAIN.xyz/sitemap.xml`

4. **Tüm Dosyalarda Domain Güncelle:**
   - `index.html` → Tüm URL'ler
   - `blog.html` → Tüm URL'ler
   - `blog-post.html` → Tüm URL'ler
   - `sitemap.xml` → BASE_URL
   - `api/sitemap.xml.js` → BASE_URL
   - `robots.txt` → Sitemap URL
   - Structured Data (JSON-LD) → Tüm URL'ler
   - Canonical URLs → Tüm sayfalarda
   - Open Graph tags → og:url
   - Twitter Cards → twitter:url

5. **Bu Notu Kaldır:**
   - SEO_CHECKLIST.md'den bu bölümü sil
   - README.md'den bu bölümü sil

---

## ✅ Tamamlanan SEO Optimizasyonları

### 1. Meta Tags & Basic SEO
- ✅ Primary meta tags (title, description, keywords)
- ✅ Author ve language tags
- ✅ Geographic meta tags (geo.region, geo.placename, geo.position, ICBM)
- ✅ Robots meta tag (index, follow, max-image-preview)
- ✅ Canonical URLs
- ✅ Hreflang tags (fr-FR)

### 2. Social Media (Open Graph & Twitter Cards)
- ✅ Open Graph tags (og:type, og:url, og:title, og:description, og:image, og:locale, og:site_name)
- ✅ Twitter Card tags (twitter:card, twitter:url, twitter:title, twitter:description, twitter:image)
- ✅ Dynamic meta tags for blog posts

### 3. Structured Data (JSON-LD Schema.org)
- ✅ LocalBusiness schema (name, description, url, telephone, email, address, geo, areaServed, priceRange, openingHours, aggregateRating)
- ✅ Service schema (serviceType, provider, areaServed, availableChannel)
- ✅ Blog schema (name, description, url, publisher, inLanguage)
- ✅ BlogPosting schema (headline, description, author, publisher, datePublished, dateModified, mainEntityOfPage, image, articleSection, keywords)

### 4. Technical SEO
- ✅ Sitemap.xml (static pages + dynamic blog posts structure)
- ✅ Robots.txt (allow all, disallow admin & API)
- ✅ Semantic HTML structure (header, main, section, article)
- ✅ Mobile-friendly viewport meta tag
- ✅ Image alt tags (descriptive, keyword-optimized)
- ✅ Lazy loading for images
- ✅ Preload critical resources

### 5. Performance & Security
- ✅ DNS prefetch
- ✅ Cache headers for static assets
- ✅ Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy)
- ✅ Image optimization (lazy loading, alt tags)

### 6. Content Optimization
- ✅ SEO-friendly URLs with slugs
- ✅ Keyword-rich titles and descriptions
- ✅ Local keywords (Lille, Roubaix, Tourcoing, Lens, Nord, Hauts-de-France)
- ✅ Service keywords (parquet massif, parquet contrecollé, pose parquet, rénovation parquet)

## 📋 Sonraki Adımlar (Manuel)

### Google Search Console
1. Google Search Console'a git: https://search.google.com/search-console
2. Mülk ekle: https://artisanparquateur.vercel.app
3. Domain verification yöntemi seç:
   - HTML tag verification: `index.html` dosyasına eklenmesi gereken meta tag
   - DNS verification: Domain kayıt şirketinde TXT kaydı ekleme
   - HTML file upload: Verification dosyası yükleme
4. Verification sonrası:
   - Sitemap gönder: https://artisanparquateur.vercel.app/sitemap.xml
   - Robots.txt kontrol et: https://artisanparquateur.vercel.app/robots.txt
   - URL Inspection tool ile sayfaları test et

### Google Analytics 4 (GA4)
1. Google Analytics hesabı oluştur: https://analytics.google.com
2. GA4 Property oluştur
3. Measurement ID al (G-XXXXXXXXXX formatında)
4. `index.html`, `blog.html`, `blog-post.html` dosyalarına GA4 tracking code ekle (şu anda comment olarak hazır)

### Bing Webmaster Tools
1. Bing Webmaster Tools'a git: https://www.bing.com/webmasters
2. Site ekle: https://artisanparquateur.vercel.app
3. Verification yap
4. Sitemap gönder

### Local SEO (Google My Business)
1. Google My Business hesabı oluştur: https://business.google.com
2. İşletme bilgilerini ekle:
   - İşletme adı: Artisan Parqueteur Nord
   - Kategori: Flooring Contractor / Artisan parqueteur
   - Adres: Nord, Hauts-de-France, France
   - Telefon: +33627943616
   - Email: artisanparqueteurnord@gmail.com
   - Website: https://artisanparquateur.vercel.app
   - Çalışma saatleri: Pazartesi-Cuma 08:00-18:00
   - Servis alanları: Lille, Roubaix, Tourcoing, Lens, ve tüm Nord bölgesi
3. Verification yap (posta ile doğrulama kodu gönderilebilir)

### Google Maps
1. Google Maps'te işletme profili oluştur
2. Aynı bilgileri Google My Business ile senkronize et
3. Fotoğraflar ekle (parquet çalışmaları)
4. Müşteri yorumları iste

### Content Marketing
1. Düzenli blog yazıları yayınla (otomatik sistem zaten aktif)
2. Her blog yazısı için:
   - En az 300 kelime içerik
   - Görseller ekle (alt tags ile)
   - İç linkler (internal linking)
   - CTA (Call-to-Action) ekle
3. Social media paylaşımları (Facebook, Instagram, LinkedIn)

### Link Building
1. Yerel işletme dizinlerine kayıt:
   - PagesJaunes.fr
   - Yelp.fr
   - Leboncoin.fr (services section)
   - 118000.fr
   - Mappy.fr
2. Sektör özel dizinler:
   - Artisans référencés (Fransız artisan dizinleri)
   - Annuaire artisans parquet
3. Backlink stratejisi:
   - Yerel haber siteleri
   - Blog yazıları ve guest posting
   - Sosyal medya profilleri

### Keyword Strategy
**Primary Keywords:**
- artisan parqueteur nord
- parquet lille
- pose parquet roubaix
- rénovation parquet tourcoing
- parquet massif lens

**Secondary Keywords:**
- expert parquet nord
- artisan parquet hauts-de-france
- pose parquet professionnel
- rénovation parquet ancien
- parquet contrecollé nord

**Long-tail Keywords:**
- artisan parqueteur à lille pour pose parquet massif
- rénovation parquet ancien dans le nord
- devis parquet gratuit roubaix tourcoing
- pose parquet contrecollé professionnel lens

### Monitoring & Analytics
1. Google Search Console'da takip et:
   - Search performance (impressions, clicks, CTR, position)
   - Coverage (indexed pages, errors)
   - Core Web Vitals (performance metrics)
2. Google Analytics'te takip et:
   - Traffic sources
   - User behavior
   - Conversion rates
   - Page views, bounce rate, session duration
3. Aylık SEO raporları:
   - Keyword rankings
   - Backlink growth
   - Domain authority
   - Traffic growth

## 🎯 Hedefler (3-6 Ay)

- Google'da "artisan parqueteur nord" için ilk 3 sırada olmak
- Organik trafik: Ayda 500+ ziyaretçi
- Bounce rate: %50'nin altında
- Ortalama session duration: 2 dakikanın üzerinde
- Conversion rate: %3'ün üzerinde (devis istekleri)

## 📝 Notlar

- Tüm SEO çalışmaları Fransa Nord bölgesi için optimize edilmiştir
- Dil: Fransızca (fr-FR)
- Target audience: Nord, Hauts-de-France bölgesinde parquet hizmeti arayan kişiler
- Servis alanları: Lille, Roubaix, Tourcoing, Lens, ve tüm Nord bölgesi
- İş saatleri: Pazartesi-Cuma 08:00-18:00

## 🔧 Teknik Detaylar

- Site URL: https://artisanparquateur.vercel.app
- Framework: Static HTML/CSS/JavaScript
- Hosting: Vercel (CDN with global edge locations)
- Storage: Vercel Blob Storage (Paris region - CDG1)
- SSL: Vercel otomatik SSL sertifikası
- Performance: Lazy loading, preloading, caching optimized

