# Google Analytics Goals (Hedefler) Kurulum Rehberi

## 📊 Takip Edilen Event'ler

Sitenizde şu event'ler otomatik olarak Google Analytics'e gönderiliyor:

### 1. WhatsApp Buton Tıklaması
- **Event Name:** `whatsapp_click`
- **Event Category:** `Contact`
- **Event Label:** `WhatsApp Button` (Ana sayfa) veya `WhatsApp Button Blog` (Blog sayfası)
- **Value:** `1`

### 2. SMS Buton Tıklaması
- **Event Name:** `sms_click`
- **Event Category:** `Contact`
- **Event Label:** `SMS Button` (Ana sayfa) veya `SMS Button Blog` (Blog sayfası)
- **Value:** `1`

## 🎯 Google Analytics'te Goal (Hedef) Kurulumu

### Adım 1: Google Analytics'e Giriş
1. [Google Analytics](https://analytics.google.com) hesabınıza giriş yapın
2. Doğru Property'yi seçin (G-5Z3M609QKT)
3. Sol menüden **Admin** (Yönetim) ikonuna tıklayın

### Adım 2: Goals Oluşturma
1. **Goals** (Hedefler) bölümüne gidin:
   - Admin → Goals → + New Goal

### Adım 3: WhatsApp Button Goal
1. **Goal Setup:**
   - Template seçin: **Custom** (Özel)
   - Goal name: `WhatsApp Button Click`
   - Goal slot ID: `1` (veya boş bir slot)

2. **Goal Details:**
   - Type: **Event** seçin
   - **Event conditions:**
     - Category: `equals` → `Contact`
     - Action: `equals` → `whatsapp_click`
     - Label: `contains` → `WhatsApp Button`
   - **Value:** `1` (isteğe bağlı)

3. **Save** (Kaydet) butonuna tıklayın

### Adım 4: SMS Button Goal
1. **Goal Setup:**
   - Template: **Custom**
   - Goal name: `SMS Button Click`
   - Goal slot ID: `2` (veya boş bir slot)

2. **Goal Details:**
   - Type: **Event**
   - **Event conditions:**
     - Category: `equals` → `Contact`
     - Action: `equals` → `sms_click`
     - Label: `contains` → `SMS Button`
   - **Value:** `1` (isteğe bağlı)

3. **Save** (Kaydet) butonuna tıklayın

### Adım 5: Toplam Contact Goal (İsteğe Bağlı)
Tüm iletişim butonlarını birleştirmek için:

1. **Goal Setup:**
   - Template: **Custom**
   - Goal name: `Total Contact Clicks`
   - Goal slot ID: `3`

2. **Goal Details:**
   - Type: **Event**
   - **Event conditions:**
     - Category: `equals` → `Contact`
     - Action: `matches regex` → `whatsapp_click|sms_click`

3. **Save** (Kaydet)

## 📈 Verileri Görüntüleme

### Realtime (Gerçek Zamanlı) Görünüm
1. Sol menüden **Realtime** → **Events** seçin
2. Butonlara tıkladığınızda 30-60 saniye içinde görünmeli

### Reports (Raporlar)
1. **Reports** → **Engagement** → **Events**
2. Event'leri görebilirsiniz:
   - `whatsapp_click`
   - `sms_click`

### Goals (Hedefler) Raporu
1. **Reports** → **Conversions** → **Goals** → **Overview**
2. Goal completion sayılarını görebilirsiniz

## 🔍 Test Etme

### 1. Realtime Test
1. Google Analytics'te **Realtime** → **Events** sekmesine gidin
2. Sitenizi açın ve WhatsApp/SMS butonlarına tıklayın
3. 30-60 saniye içinde event'ler görünmeli

### 2. Browser Console Test
1. Tarayıcıda F12 → Console'u açın
2. Butonlara tıkladığınızda şu mesajı görmelisiniz:
   - `📊 Google Analytics: WhatsApp button click tracked`
   - `📊 Google Analytics: SMS button click tracked`

### 3. Google Analytics DebugView
1. Google Analytics'te **Admin** → **DebugView** açın
2. Sitenizde butonlara tıklayın
3. Event'ler anında görünmeli

## 📊 Önemli Metrikler

### Takip Edilecek Metrikler:
- **Goal Completions:** Kaç kişi WhatsApp/SMS butonuna tıkladı
- **Goal Conversion Rate:** Tıklama oranı (%)
- **Event Count:** Toplam event sayısı
- **Event Value:** Toplam değer (her tıklama = 1)

### Haftalık/Aylık Raporlar:
- Hangi buton daha çok kullanılıyor? (WhatsApp vs SMS)
- Hangi sayfadan daha çok tıklama geliyor? (Ana sayfa vs Blog)
- Günlük/haftalık trendler

## 🎯 Conversion Rate Optimizasyonu

### İyileştirme Önerileri:
1. **A/B Testing:** Buton renkleri, metinleri, konumları
2. **Heatmap Analysis:** Kullanıcıların butonları görüp görmediğini kontrol edin
3. **Mobile vs Desktop:** Hangi cihazda daha çok tıklama var?
4. **Time Analysis:** Hangi saatlerde daha çok tıklama oluyor?

## 🔧 Sorun Giderme

### Event'ler görünmüyor:
1. Google Analytics kodunun yüklendiğinden emin olun (F12 → Network → gtag.js)
2. Ad blocker'ları kapatın
3. Browser console'da hata var mı kontrol edin
4. Google Analytics'te doğru Property seçili mi kontrol edin

### Goals çalışmıyor:
1. Goal kurulumunu kontrol edin (Category, Action, Label doğru mu?)
2. Event'lerin gerçekten gönderildiğini kontrol edin (Realtime → Events)
3. Goal'ların aktif olduğundan emin olun (Admin → Goals → Status: Active)

## 📝 Notlar

- Event'ler otomatik olarak gönderiliyor, ekstra kod gerekmez
- Her buton tıklaması = 1 event
- Event'ler anında Google Analytics'e gönderilir
- Goals, event'lerden 24 saat sonra tam olarak çalışmaya başlar
- Realtime görünümde hemen görünebilir

## 🚀 Sonraki Adımlar

1. ✅ Goals kurulumunu tamamlayın
2. 📊 İlk verileri bekleyin (24-48 saat)
3. 📈 Haftalık raporları inceleyin
4. 🎯 Conversion rate'i optimize edin
5. 📱 Mobile vs Desktop analizi yapın


