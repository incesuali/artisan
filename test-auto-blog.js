// Otomatik blog sistemi test fonksiyonu
// Bu dosyayı konsola yapıştırarak test edebilirsiniz

console.log('=== OTOMATİK BLOG SİSTEMİ TEST ===');

// 1. Kelimelerin yüklendiğini kontrol et
const words1 = JSON.parse(localStorage.getItem('seoKeywords1') || '[]');
const words2 = JSON.parse(localStorage.getItem('seoKeywords2') || '[]');
const words3 = JSON.parse(localStorage.getItem('seoKeywords3') || '[]');
const words4 = JSON.parse(localStorage.getItem('seoKeywords4') || '[]');

console.log('Kelimeler:');
console.log('- 1. Alan:', words1.length, 'kelime');
console.log('- 2. Alan:', words2.length, 'kelime');
console.log('- 3. Alan:', words3.length, 'kelime');
console.log('- 4. Alan:', words4.length, 'kelime');

if (words1.length < 4 || words2.length < 3 || words3.length < 7) {
    console.error('❌ HATA: Yeterli kelime yok!');
} else {
    console.log('✅ Kelimeler yeterli');
}

// 2. Otomatik blog ayarını kontrol et
const autoEnabled = localStorage.getItem('autoBlogEnabled');
console.log('\nOtomatik Blog Ayarı:', autoEnabled || 'false (varsayılan: true)');

// 3. Son blog tarihini kontrol et
const lastDate = localStorage.getItem('lastAutoBlogDate');
console.log('Son Blog Tarihi:', lastDate || 'Henüz üretilmemiş');

if (lastDate) {
    const last = new Date(lastDate);
    const now = new Date();
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    console.log('Son blog tarihinden bu yana geçen gün:', diffDays);
    console.log('Kalan gün (10 günlük periyot):', Math.max(0, 10 - diffDays));
    
    if (diffDays >= 10) {
        console.log('✅ 10 gün geçti - yeni blog oluşturulmalı!');
    } else {
        console.log('⏳ Henüz 10 gün geçmedi');
    }
}

// 4. Blog yazısı oluşturmayı test et
console.log('\n=== Blog Yazısı Oluşturma Testi ===');
if (typeof generateSEOBlogPost === 'function') {
    const testPost = generateSEOBlogPost();
    if (testPost) {
        console.log('✅ Blog yazısı başarıyla oluşturuldu!');
        console.log('Başlık:', testPost.title);
        console.log('İçerik satır sayısı:', testPost.content.split('\n').length);
        console.log('İçerik (ilk 200 karakter):', testPost.content.substring(0, 200));
        
        if (testPost.content.split('\n').length > 14) {
            console.error('❌ HATA: İçerik 14 satırı geçiyor!');
        } else {
            console.log('✅ İçerik 14 satır limitine uygun');
        }
    } else {
        console.error('❌ HATA: Blog yazısı oluşturulamadı!');
    }
} else {
    console.error('❌ HATA: generateSEOBlogPost fonksiyonu bulunamadı!');
}

// 5. Mevcut blog yazılarını kontrol et
const blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
console.log('\nMevcut Blog Yazıları:', blogPosts.length);
if (blogPosts.length > 0) {
    console.log('Son blog yazısı:', blogPosts[blogPosts.length - 1].title);
}

console.log('\n=== TEST TAMAMLANDI ===');

