# Parke Döşeme Ustası İletişim Sitesi

Mobil odaklı, tek sayfalık iletişim sitesi.

## ⚠️ ÖNEMLİ: Domain Değişikliği - Indexing Engellendi

**TARİH:** 13 Ocak 2025

**DURUM:** Site şu anda Google'a indekslenmesi engellenmiş durumda (domain değişikliği nedeniyle).

**YAPILAN DEĞİŞİKLİKLER:**
1. `robots.txt` → `Disallow: /` (tüm sayfalar engellendi)
2. Tüm HTML sayfalarında meta robots tag → `noindex, nofollow`

**YENİ DOMAIN HAZIR OLDUĞUNDA YAPILACAKLAR:**
1. `robots.txt` dosyasını düzelt:
   - `Disallow: /` → `Allow: /` yap
   - Sitemap satırını aktif et
2. Tüm HTML sayfalarında (`index.html`, `blog.html`, `blog-post.html`):
   - Meta robots tag'ini `noindex, nofollow` → `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` yap
3. Google Search Console'a yeni domain ekle
4. Sitemap'i yeniden gönder
5. SEO_CHECKLIST.md dosyasındaki bu notu kaldır

## Kurulum ve Kullanım

### 1. Fotoğraf Yükleme
- `images` klasörüne fotoğraflarınızı şu isimlerle kaydedin:
  - `photo1.jpg`
  - `photo2.jpg`
  - `photo3.jpg`
  - `photo4.jpg`

### 2. İletişim Bilgilerini Düzenleme
`script.js` dosyasını açın ve CONFIG bölümünü düzenleyin:

```javascript
const CONFIG = {
    phoneNumber: '0555 555 55 55',      // Telefon numaranız
    whatsappNumber: '905555555555',     // WhatsApp numaranız (90 ile başlayan, boşluksuz)
    location: 'İstanbul',               // Konum bilginiz
    whatsappMessage: 'Merhaba, parke döşeme hizmeti hakkında bilgi almak istiyorum.'
};
```

### 3. Siteyi Çalıştırma
- `index.html` dosyasına çift tıklayarak tarayıcıda açın
- Veya bir web sunucusu kullanın

### Özellikler
✅ Mobil odaklı tasarım
✅ Tek ekranda tüm içerik (scroll yok)
✅ 4 fotoğraflı galeri
✅ WhatsApp direkt mesajlaşma
✅ Telefon numarasına tıklayarak arama
✅ Responsive tasarım

### Dosya Yapısı
```
Artisan/
├── index.html          # Ana HTML dosyası
├── style.css           # Stil dosyası
├── script.js           # JavaScript dosyası
├── images/             # Fotoğraflar buraya
│   ├── photo1.jpg
│   ├── photo2.jpg
│   ├── photo3.jpg
│   └── photo4.jpg
└── README.md           # Bu dosya
```


