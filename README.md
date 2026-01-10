# Parke Döşeme Ustası İletişim Sitesi

Mobil odaklı, tek sayfalık iletişim sitesi.

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


