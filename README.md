# Parke Döşeme Ustası İletişim Sitesi

Mobil odaklı, tek sayfalık iletişim sitesi.

## ✅ SEO ve İndeksleme Durumu

**TARİH:** 13 Ocak 2025

**DURUM:** Site Google ve diğer arama motorları tarafından indekslenebilir durumda.

**AKTİF AYARLAR:**
- ✅ `robots.txt` → `Allow: /` (tüm sayfalar izinli)
- ✅ Tüm HTML sayfalarında meta robots tag → `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`
- ✅ Sitemap aktif: `https://a-parqueteur.xyz/sitemap.xml`

Google Search Console'da sitemap'inizi gönderebilir ve URL'lerinizi manuel olarak indeksleme isteği yapabilirsiniz.

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


