# Google Tag Manager Kullanım Rehberi

## ✅ GTM Kurulumu Tamamlandı

GTM kodu tüm sayfalara eklendi:
- ✅ `index.html` - Ana sayfa
- ✅ `blog.html` - Blog listesi
- ✅ `blog-post.html` - Blog yazısı sayfası

GTM ID: `GTM-MH5CT2K8`

## 🎯 GTM'de Etiket Nasıl Eklenir?

### 1. Yeni Etiket Oluşturma

1. **"Yeni" (New)** butonuna tıklayın
2. **Etiket Yapılandırması (Tag Configuration)** bölümünde:
   - Etiket türünü seçin (örn: Google Analytics: GA4 Configuration)
   - Gerekli bilgileri doldurun (Measurement ID: G-5Z3M609QKT)

3. **Tetikleyici Seçimi (Triggering)** bölümünde:
   - Etiketin ne zaman tetikleneceğini seçin:
     - **All Pages** (Tüm sayfalar) - Her sayfa yüklendiğinde
     - **Page View** - Sayfa görüntüleme
     - **Click** - Tıklama olayı
     - **Custom Event** - Özel event (örn: whatsapp_click)

4. **Kaydet (Save)** butonuna tıklayın

### 2. Etiketi Yayınlama (ÖNEMLİ!)

Etiket oluşturduktan sonra mutlaka **yayınlamanız** gerekiyor:

1. Sağ üstte **"Gönder" (Submit)** butonuna tıklayın
2. **Versiyon adı** verin (örn: "İlk Google Analytics etiketi")
3. **Açıklama** ekleyin (opsiyonel)
4. **"Yayınla" (Publish)** butonuna tıklayın

### 3. Etiketler Otomatik Yüklenir

✅ **Evet! Etiketler otomatik olarak siteye eklenir!**

- Kod değişikliği gerekmez
- Siteyi yeniden deploy etmeye gerek yok
- Etiketler GTM container'dan dinamik olarak yüklenir
- Değişiklikler anında aktif olur

## 🧪 Test Etme (Önizleme Modu)

### 1. Preview Modu Açma
1. GTM'de **"Önizleme" (Preview)** butonuna tıklayın
2. Site URL'ini girin: `https://artisanparqueteurnord.xyz`
3. Yeni bir sekmede siteniz açılır ve debug modu aktif olur

### 2. Preview'da Ne Görürsünüz?
- Hangi etiketlerin tetiklendiği
- Hangi trigger'ların çalıştığı
- DataLayer'deki veriler
- Hata mesajları (varsa)

### 3. Tag Assistant Kontrolü
- Google Tag Assistant eklentisi ile de kontrol edebilirsiniz
- Hangi tag'lerin yüklendiğini görebilirsiniz

## 📊 Örnek: Google Analytics Tag Ekleme

### Adım 1: Yeni Etiket Oluştur
1. **"Yeni"** butonuna tıklayın
2. Etiket adı: `GA4 - Configuration`

### Adım 2: Tag Configuration
1. **Etiket Türü:** `Google Analytics: GA4 Configuration` seçin
2. **Measurement ID:** `G-5Z3M609QKT` girin
3. **Configuration Tag:** Yeni bir configuration tag oluşturun

### Adım 3: Triggering
1. **Tetikleyici Seç:** `All Pages` seçin
   - Bu, etiketin her sayfada yüklenmesini sağlar

### Adım 4: Kaydet ve Yayınla
1. **Kaydet (Save)** butonuna tıklayın
2. **"Gönder" (Submit)** butonuna tıklayın
3. Versiyon adı verin ve **"Yayınla" (Publish)**

### Adım 5: Test Et
1. **Preview** modu ile test edin
2. Siteyi ziyaret edin
3. Tag'in tetiklendiğini kontrol edin

## 🎯 Örnek: WhatsApp Click Event Tag

### Adım 1: Yeni Etiket Oluştur
- Etiket adı: `GA4 - WhatsApp Click Event`

### Adım 2: Tag Configuration
1. **Etiket Türü:** `Google Analytics: GA4 Event` seçin
2. **Configuration Tag:** Daha önce oluşturduğunuz GA4 Configuration tag'ini seçin
3. **Event Name:** `whatsapp_click`
4. **Event Parameters:**
   - `event_category`: `Contact`
   - `event_label`: `WhatsApp Button`
   - `value`: `1`

### Adım 3: Triggering
1. **Tetikleyici Türü:** `Custom Event` seçin
2. **Event name:** `whatsapp_click` (dataLayer'den gelen event adı)

**NOT:** Bu event, `script.js` dosyasında zaten tanımlı ve gönderiliyor. GTM'de sadece bu event'i dinleyip GA4'e göndermeniz yeterli.

### Adım 4: Kaydet ve Yayınla

## ⚠️ ÖNEMLİ NOTLAR

### 1. Gönder Butonuna Basmayı Unutmayın!
- Etiket oluşturduktan sonra mutlaka **"Gönder" (Submit)** butonuna basın
- Basmazsanız etiketler siteye eklenmez!

### 2. Kod Değişikliği Gerekmez
- GTM kullanırken, yeni etiketler için kod değişikliği yapmaya gerek yok
- Her şey GTM arayüzünden yönetilir

### 3. Mevcut Google Analytics Kodu
- Şu anda hem direkt Google Analytics kodu hem de GTM var
- İkisi birlikte çalışabilir, ancak:
  - **İsterseniz:** Direkt GA kodunu kaldırıp sadece GTM kullanabilirsiniz
  - **Ya da:** İkisini birlikte kullanabilirsiniz (event tracking için)

### 4. Preview Modu Önemli
- Yayınlamadan önce mutlaka Preview modu ile test edin
- Hataları önceden yakalayın

## 🚀 Hızlı Başlangıç Checklist

- [ ] GTM kodu siteye eklendi ✅ (Tamamlandı)
- [ ] İlk etiket oluştur (GA4 Configuration)
- [ ] Preview modu ile test et
- [ ] "Gönder" butonuna bas ve yayınla
- [ ] Siteyi ziyaret et ve etiketlerin çalıştığını kontrol et
- [ ] Google Analytics'te verilerin geldiğini kontrol et

## 📝 Özet

✅ **Evet, GTM'de etiket ekledikten sonra "Gönder" butonuna bastığınızda, etiketler otomatik olarak siteye eklenir!**

- Kod değişikliği gerekmez
- Yeniden deploy gerekmez
- Anında aktif olur
- GTM container'dan dinamik yüklenir

