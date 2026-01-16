# Google Tag Manager'da Google Analytics 4 Kurulumu

## 🎯 Yöntem 1: GA4 Configuration Tag (ÖNERİLEN - Daha Kolay)

### Adım 1: Custom HTML Yerine GA4 Tag Seçin
1. **Etiket Türü (Tag Type)** alanına tıklayın
2. Arama kutusuna `GA4` yazın
3. **"Google Analytics: GA4 Configuration"** seçin
4. (Custom HTML yerine bu kullanılmalı)

### Adım 2: Configuration Ayarları
1. **Measurement ID:** `G-5Z3M609QKT` girin
2. **Configuration Tag:** "Yeni Tag Oluştur" seçin (veya mevcut birini seçin)

### Adım 3: Tetikleyici Seçimi (Triggering)
1. **Tetikleyici Seç** alanına tıklayın
2. **"All Pages"** (Tüm Sayfalar) seçin
   - Bu, etiketin her sayfada yüklenmesini sağlar

### Adım 4: Etiket Adı ve Kaydetme
1. Üstte **"Adsız Etiket" (Untitled Tag)** yerine:
   - **Etiket Adı:** `GA4 - Configuration` yazın
2. **"Kaydet" (Save)** butonuna tıklayın

### Adım 5: Yayınlama
1. Sağ üstte **"Gönder" (Submit)** butonuna tıklayın
2. Versiyon adı: `İlk GA4 Tag` yazın
3. **"Yayınla" (Publish)** butonuna tıklayın

✅ **Tamamlandı! Google Analytics artık GTM üzerinden çalışıyor.**

---

## 🎯 Yöntem 2: Custom HTML ile (Alternatif)

Eğer Custom HTML kullanmak istiyorsanız, HTML alanına şunu yapıştırın:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-5Z3M609QKT"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-5Z3M609QKT');
</script>
```

**Ancak Yöntem 1 daha önerilir çünkü:**
- Daha kolay yönetim
- GTM arayüzünden tüm ayarlar yapılabilir
- Debugging daha kolay

---

## 📋 Önerilen Workflow

### 1. Custom HTML Yerine GA4 Tag Kullanın
- **Etiket Türü:** Google Analytics: GA4 Configuration
- **Measurement ID:** G-5Z3M609QKT
- **Tetikleyici:** All Pages

### 2. Direkt GA Kodunu Kaldırın (Opsiyonel)
GTM üzerinden yönetmek isterseniz:
- `index.html`, `blog.html`, `blog-post.html` dosyalarından direkt Google Analytics kodunu kaldırabilirsiniz
- GTM zaten var, yeterli olacaktır

### 3. Test Edin
- **Preview** modu ile test edin
- Siteyi ziyaret edin
- Google Analytics'te Realtime görünümü kontrol edin

---

## 🔍 Sorun Giderme

### Custom HTML Görüyorsanız:
1. "Etiket Türü" alanına tıklayın
2. Arama yapın: `GA4` veya `Google Analytics`
3. **"Google Analytics: GA4 Configuration"** seçin
4. Custom HTML değil, bu şablonu kullanın

### Etiket Çalışmıyorsa:
1. **Preview** modu ile test edin
2. Trigger'ın "All Pages" olduğundan emin olun
3. "Gönder" butonuna bastığınızdan emin olun
4. Siteyi hard refresh yapın (Ctrl+Shift+R / Cmd+Shift+R)

---

## ✅ Checklist

- [ ] Etiket Türü: **Google Analytics: GA4 Configuration** (Custom HTML değil!)
- [ ] Measurement ID: **G-5Z3M609QKT**
- [ ] Trigger: **All Pages**
- [ ] Etiket adı verildi
- [ ] **Kaydet** butonuna basıldı
- [ ] **Gönder** butonuna basıldı
- [ ] **Yayınla** butonuna basıldı
- [ ] Preview modu ile test edildi


