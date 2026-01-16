# Backend Kurulum ve Kullanım

## 📦 Kurulum

1. **Node.js paketlerini yükle:**
```bash
npm install
```

Eğer npm hatası alırsan:
```bash
sudo chown -R $(whoami) ~/.npm
npm install
```

## 🚀 Sunucuyu Başlat

```bash
npm start
```

veya

```bash
node server.js
```

Sunucu **http://localhost:8000** adresinde çalışacak.

## 📁 Resim Yükleme

- Admin panelinden yüklenen resimler **`images/`** klasörüne kaydedilir
- Her resim benzersiz bir isimle kaydedilir (timestamp eklenir)
- Maksimum 20 resim yüklenebilir
- Resim boyutu limiti: 10MB

## 🔧 API Endpoints

- `GET /api/images` - Tüm resimleri listele
- `POST /api/upload` - Resim yükle (çoklu)
- `DELETE /api/images/:filename` - Resim sil

## ⚠️ Önemli Notlar

- Sunucu çalışırken admin panelinden resim yükleyebilirsin
- Resimler `images/` klasörüne fiziksel olarak kaydedilir
- Ana sayfa resimleri otomatik olarak sunucudan yükler
- Sunucu kapalıysa localStorage'dan yüklenir (fallback)

## 🛑 Sunucuyu Durdur

Terminal'de `Ctrl + C` tuşlarına bas.



