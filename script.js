// Konfigürasyon - LocalStorage'dan veya varsayılan değerlerden
const CONFIG = {
    whatsappNumber: localStorage.getItem('whatsappNumber') || '33627943616',  // WhatsApp numarası (Fransa: 0627943616 -> 33627943616, ülke kodu ile, + işareti olmadan)
    phoneNumber: localStorage.getItem('phoneNumber') || '0627943616',  // Telefon numarası (SMS için)
    email: localStorage.getItem('email') || 'artisanparqueteurnord@gmail.com',        // E-mail adresi
    whatsappMessage: localStorage.getItem('whatsappMessage') || 'Bonjour, je souhaiterais obtenir un devis pour des travaux de parquet.' // Ön tanımlı mesaj
};

// Sayfa yüklendiğinde çalışacak
document.addEventListener('DOMContentLoaded', function() {
    // E-mail adresini yerleştir
    const emailElement = document.getElementById('email');
    if (emailElement) {
        emailElement.textContent = CONFIG.email;
    }

    // WhatsApp butonunu ayarla
    const whatsappBtn = document.getElementById('whatsapp-btn');
    if (whatsappBtn) {
        const encodedMessage = encodeURIComponent(CONFIG.whatsappMessage);
        whatsappBtn.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
    }

    // "Nos réalisations" butonu işlevi - Modal aç
    const btnRealizations = document.querySelector('.btn-realizations');
    
    if (btnRealizations) {
        btnRealizations.addEventListener('click', function() {
            openImageModal();
        });
    }
    
    // "Devis par message" butonu işlevi - SMS aç
    const btnMessage = document.querySelector('.btn-message');
    
    if (btnMessage) {
        btnMessage.addEventListener('click', function() {
            // SMS protokolü ile telefon numarasını aç
            const phoneNumber = CONFIG.phoneNumber.replace(/\s/g, ''); // Boşlukları kaldır
            window.location.href = `sms:${phoneNumber}`;
        });
    }
    
    // Modal kontrolleri
    setupImageModal();

    // Fotoğrafların yüklenmesini kontrol et
    checkImages();
    
    // Galeri resimlerini yükle (cache ile hızlı yükleme)
    loadGalleryFromStorage();
    
    // İlk 4 resmi preload et (hızlı görüntüleme için)
    preloadFirstImages();
    
    // Otomatik blog sistemini kontrol et (her sayfa yüklendiğinde)
    // 2 saniye bekle (tüm scriptlerin yüklenmesi için)
    setTimeout(async function() {
        if (typeof checkAutoBlogScheduleGlobal === 'function') {
            await checkAutoBlogScheduleGlobal();
        }
    }, 2000);
});

// ========== OTOMATIK BLOG SİSTEMİ (Global - Her Sayfada Çalışır) ==========

// Rastgele seçim fonksiyonu (global)
function getRandomElementsGlobal(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// SEO blog yazısı oluştur (global) - VERCEL BLOB STORAGE'DAN KELİMELERİ AL!
async function generateSEOBlogPostGlobal() {
    console.log('📝 generateSEOBlogPostGlobal çağrıldı - kelimeler yükleniyor...');
    
    // ÖNCE VERCEL BLOB STORAGE'DAN KELİMELERİ YÜKLE (localStorage'dan değil!)
    let words1 = [], words2 = [], words3 = [], words4 = [];
    
    try {
        console.log('📥 Kelimeler Vercel Blob Storage\'dan alınıyor...');
        const keywordsResponse = await fetch(`/api/seo-keywords?t=${Date.now()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            cache: 'no-store'
        });
        
        if (keywordsResponse.ok) {
            const keywordsData = await keywordsResponse.json();
            if (keywordsData.success && keywordsData.keywords) {
                words1 = keywordsData.keywords.category1 || [];
                words2 = keywordsData.keywords.category2 || [];
                words3 = keywordsData.keywords.category3 || [];
                words4 = keywordsData.keywords.category4 || [];
                console.log('✅ Kelimeler Vercel Blob Storage\'dan alındı:', {
                    words1: words1.length,
                    words2: words2.length,
                    words3: words3.length,
                    words4: words4.length
                });
                
                // localStorage'a da kaydet (fallback için)
                localStorage.setItem('seoKeywords1', JSON.stringify(words1));
                localStorage.setItem('seoKeywords2', JSON.stringify(words2));
                localStorage.setItem('seoKeywords3', JSON.stringify(words3));
                localStorage.setItem('seoKeywords4', JSON.stringify(words4));
            }
        }
    } catch (error) {
        console.error('⚠️ Vercel Blob Storage\'dan kelime yükleme hatası, localStorage\'dan yüklenecek:', error);
    }
    
    // Eğer Vercel Blob Storage'dan yüklenemediyse, localStorage'dan yükle (fallback)
    if (words1.length === 0) {
        words1 = JSON.parse(localStorage.getItem('seoKeywords1') || '[]');
        words2 = JSON.parse(localStorage.getItem('seoKeywords2') || '[]');
        words3 = JSON.parse(localStorage.getItem('seoKeywords3') || '[]');
        words4 = JSON.parse(localStorage.getItem('seoKeywords4') || '[]');
        console.log('💾 Fallback: Kelimeler localStorage\'dan alındı:', {
            words1: words1.length,
            words2: words2.length,
            words3: words3.length,
            words4: words4.length
        });
    }
    
    if (words1.length < 4 || words2.length < 3 || words3.length < 7) {
        console.error('❌ Yeterli kelime yok!', {
            words1: words1.length,
            words2: words2.length,
            words3: words3.length
        });
        return null;
    }
    
    // Blog yazısı sayısını kontrol et (her 4'te bir 4. alandan kelime) - VERCEL BLOB STORAGE'DAN!
    let blogPostsCount = 0;
    try {
        console.log('📥 Blog yazı sayısı Vercel Blob Storage\'dan alınıyor...');
        const postsResponse = await fetch(`/api/blog-posts?t=${Date.now()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            cache: 'no-store'
        });
        
        if (postsResponse.ok) {
            const postsData = await postsResponse.json();
            if (postsData.success && postsData.posts && Array.isArray(postsData.posts)) {
                blogPostsCount = postsData.posts.length;
                console.log('✅ Mevcut blog yazı sayısı (Vercel Blob Storage):', blogPostsCount);
            }
        }
    } catch (error) {
        console.error('⚠️ Blog yazı sayısı alınırken hata, localStorage\'dan yüklenecek:', error);
        const localPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        blogPostsCount = localPosts.length;
        console.log('💾 Fallback: Blog yazı sayısı (localStorage):', blogPostsCount);
    }
    
    const useCategory4 = (blogPostsCount + 1) % 4 === 0;
    console.log('📊 Blog yazı sayısı:', blogPostsCount, '- 4. kategori kullanılacak mı?', useCategory4);
    
    // Kelimeleri seç
    const selected1 = getRandomElementsGlobal(words1, 4);
    const selected2 = getRandomElementsGlobal(words2, Math.min(4, words2.length));
    const selected3 = getRandomElementsGlobal(words3, 7);
    const selected4 = useCategory4 && words4.length >= 2 ? getRandomElementsGlobal(words4, 2) : [];
    
    // Blog başlığı oluştur
    const titleTemplates = [
        `${selected1[0]} : Notre Expertise ${selected2[0]}`,
        `${selected1[1]} à ${selected2[1]} : Guide Complet`,
        `${selected1[2]} ${selected2[2]} : Solutions Professionnelles`,
        `Expert ${selected1[3]} dans le Nord`,
        `${selected1[0]} et ${selected1[1]} : Nos Services`
    ];
    const title = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
    
    // Blog içeriği oluştur (14 satır limiti)
    const paragraphs = [];
    paragraphs.push(`Besoin d'un expert ${selected1[0]} à ${selected2[0]} ? Notre ${selected3[0]} d'${selected3[1]} vous accompagne.`);
    paragraphs.push(`Que vous soyez à ${selected2[1]} ou ${selected2[2]}, notre ${selected3[2]} en ${selected1[1]} est à votre service.`);
    paragraphs.push(`Pour la ${selected1[2]} ou la ${selected1[3]}, nous garantissons un travail de ${selected3[3]}.`);
    paragraphs.push(`Notre équipe ${selected3[4]} vous propose des solutions adaptées à vos besoins.`);
    paragraphs.push(`De la pose traditionnelle à la rénovation moderne, nous sublimons vos intérieurs.`);
    
    if (selected4.length >= 2) {
        paragraphs.push(`Découvrez nos ${selected4[0]} et nos ${selected4[1]} sur mesure.`);
    } else {
        paragraphs.push(`Avec notre savoir-faire d'${selected3[5]} et notre expérience, nous sommes votre partenaire ${selected3[6]}.`);
    }
    
    paragraphs.push('Contactez-nous pour un devis gratuit et personnalisé.');
    
    const content = paragraphs.join('\n\n');
    const lineCount = content.split('\n').length;
    
    if (lineCount > 14) {
        console.warn('⚠️ İçerik 14 satırı geçiyor, düzenleniyor...');
        return {
            title: title,
            content: paragraphs.slice(0, 6).join('\n\n') + '\n\n' + paragraphs[paragraphs.length - 1],
            date: new Date().toISOString()
        };
    }
    
    return {
        title: title,
        content: content,
        date: new Date().toISOString()
    };
}

// Blog yazısı oluştur (global) - ASYNC YAPILDI!
async function generateBlogPostNowGlobal(isAuto = false) {
    console.log('🚀 generateBlogPostNowGlobal çağrıldı, isAuto:', isAuto);
    
    // generateSEOBlogPostGlobal artık async, await ekle!
    const blogPost = await generateSEOBlogPostGlobal();
    
    if (!blogPost) {
        console.error('❌ Blog yazısı oluşturulamadı - kelimeler eksik veya Vercel Blob Storage\'dan yüklenemedi!');
        if (typeof showAutoBlogMessage === 'function') {
            showAutoBlogMessage('❌ Blog yazısı oluşturulamadı! Önce kelimeleri Vercel Blob Storage\'a kaydedin.', 'error');
        }
        return false;
    }
    
    const lineCount = blogPost.content.split('\n').length;
    console.log('✅ Blog yazısı oluşturuldu:', {
        title: blogPost.title,
        contentLines: lineCount,
        date: blogPost.date
    });
    
    if (lineCount > 14) {
        console.error('❌ HATA: Blog içeriği 14 satırı geçiyor!');
        if (typeof showAutoBlogMessage === 'function') {
            showAutoBlogMessage('❌ Blog içeriği 14 satırı geçiyor!', 'error');
        }
        return false;
    }
    
    // Blog yazısı ekle
    const blogPostObj = {
        id: Date.now().toString(),
        title: blogPost.title,
        content: blogPost.content,
        date: blogPost.date
    };
    
    // ÖNCE VERCEL BLOB STORAGE'DAN MEVCUT YAZILARI AL (ÖNEMLİ - localStorage'dan değil!)
    let blogPosts = [];
    try {
        console.log('📥 Mevcut blog yazıları Vercel Blob Storage\'dan alınıyor...');
        const getResponse = await fetch(`/api/blog-posts?t=${Date.now()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            cache: 'no-store'
        });
        
        if (getResponse.ok) {
            const getData = await getResponse.json();
            if (getData.success && getData.posts && Array.isArray(getData.posts)) {
                blogPosts = getData.posts;
                console.log('✅ Mevcut blog yazıları alındı:', blogPosts.length, 'yazı');
            }
        }
    } catch (error) {
        console.error('⚠️ Mevcut blog yazıları alınırken hata, localStorage\'dan yüklenecek:', error);
        // Fallback: localStorage'dan al
        blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    }
    
    // Eğer Vercel Blob Storage'dan alamazsak, localStorage'dan al
    if (blogPosts.length === 0) {
        blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        console.log('💾 Fallback: localStorage\'dan mevcut blog yazıları alındı:', blogPosts.length);
    }
    
    // Yeni blog yazısını ekle
    blogPosts.push(blogPostObj);
    console.log('➕ Yeni blog yazısı eklendi. Toplam:', blogPosts.length, 'yazı');
    
    // ŞİMDI VERCEL BLOB STORAGE'A KAYDET (TÜM YAZILARLA BİRLİKTE)
    try {
        console.log('💾 Vercel Blob Storage\'a kaydediliyor...', blogPosts.length, 'yazı');
        const response = await fetch('/api/blog-posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ posts: blogPosts }),
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Blog yazısı Vercel Blob Storage\'a kaydedildi!');
            console.log('📊 Kaydedilen blog yazı sayısı:', blogPosts.length);
            console.log('📝 Yeni blog yazısı:', { id: blogPostObj.id, title: blogPostObj.title, date: blogPostObj.date });
            
            // localStorage'a da kaydet (fallback için)
            localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
            
            // Son oluşturma tarihini kaydet - VERCEL BLOB STORAGE'A DA KAYDET!
            localStorage.setItem('lastAutoBlogDate', blogPost.date);
            
            // Vercel Blob Storage'daki settings'i de güncelle
            try {
                const settingsResponse = await fetch('/api/auto-blog-settings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        enabled: localStorage.getItem('autoBlogEnabled') !== 'false',
                        lastAutoBlogDate: blogPost.date
                    }),
                });
                if (settingsResponse.ok) {
                    const settingsData = await settingsResponse.json();
                    if (settingsData.success) {
                        console.log('✅ Auto blog settings Vercel Blob Storage\'a kaydedildi!');
                    }
                }
            } catch (error) {
                console.error('⚠️ Settings kaydetme hatası:', error);
            }
            
            console.log('✅ Blog yazısı kaydedildi. Toplam blog sayısı:', blogPosts.length);
            
            // Admin panelinde varsa listeyi yenile (cache bypass ile)
            if (typeof loadBlogPosts === 'function') {
                // Biraz bekle ki Vercel Blob Storage güncellensin
                await new Promise(resolve => setTimeout(resolve, 1500));
                await loadBlogPosts();
            }
            
            // Admin panelinde varsa durumu güncelle
            if (typeof updateAutoBlogStatus === 'function') {
                const nextDate = new Date();
                nextDate.setDate(nextDate.getDate() + 10);
                updateAutoBlogStatus(blogPost.date, nextDate.toISOString());
            }
            
            // Blog sayfasını da yenilemek için event gönder (eğer açıksa)
            if (typeof window !== 'undefined' && window.dispatchEvent) {
                window.dispatchEvent(new CustomEvent('blogPostsUpdated', { 
                    detail: { count: blogPosts.length, newPost: blogPostObj } 
                }));
                console.log('📢 Blog güncelleme eventi gönderildi');
            }
            
            return true;
        } else {
            throw new Error(data.error || 'Bilinmeyen hata');
        }
    } catch (error) {
        console.error('❌ Vercel Blob Storage kaydetme hatası:', error);
        
            // Hata durumunda localStorage'a kaydet (fallback)
            localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
            localStorage.setItem('lastAutoBlogDate', blogPost.date);
            
            console.warn('⚠️ Blog yazısı localStorage\'a kaydedildi (Vercel Blob Storage hatası)');
            console.warn('⚠️ Lütfen admin panelinden "Şimdi Blog Yazısı Oluştur" butonuna tekrar basın veya sayfayı yenileyin.');
            
            if (typeof showAutoBlogMessage === 'function') {
                showAutoBlogMessage('⚠️ Blog yazısı localStorage\'a kaydedildi. Vercel Blob Storage hatası. Lütfen tekrar deneyin.', 'error');
            }
            
            // Admin panelinde varsa listeyi yenile
            if (typeof loadBlogPosts === 'function') {
                await loadBlogPosts();
            }
            
            return false; // Hata oldu ama localStorage'a kaydedildi
        }
}

// Otomatik blog zamanlamasını kontrol et (global) - ASYNC YAPILDI!
async function checkAutoBlogScheduleGlobal() {
    console.log('🔍 checkAutoBlogScheduleGlobal çağrıldı - Otomatik blog kontrolü');
    
    // Eğer ayar yoksa, varsayılan olarak etkin yap
    let enabledValue = localStorage.getItem('autoBlogEnabled');
    if (enabledValue === null || enabledValue === '') {
        enabledValue = 'true';
        localStorage.setItem('autoBlogEnabled', 'true');
        console.log('✅ Otomatik blog üretimi varsayılan olarak etkinleştirildi');
    }
    
    const enabled = enabledValue === 'true';
    
    if (!enabled) {
        console.log('⏸️ Otomatik blog üretimi devre dışı');
        return;
    }
    
    const lastDate = localStorage.getItem('lastAutoBlogDate');
    const now = new Date();
    
    if (!lastDate) {
        // İlk kez - hemen oluştur (ancak kelimeler varsa)
        // Kelimeleri Vercel Blob Storage'dan kontrol et
        try {
            const keywordsResponse = await fetch(`/api/seo-keywords?t=${Date.now()}`, {
                method: 'GET',
                cache: 'no-store'
            });
            if (keywordsResponse.ok) {
                const keywordsData = await keywordsResponse.json();
                const words1 = keywordsData.keywords?.category1 || [];
                if (words1.length >= 4) {
                    console.log('🚀 İlk blog yazısı oluşturuluyor...');
                    await generateBlogPostNowGlobal(true);
                } else {
                    console.log('⏳ İlk blog yazısı için kelimelerin Vercel Blob Storage\'a yüklenmesini bekliyor...');
                }
            }
        } catch (error) {
            console.error('⚠️ Kelime kontrolü hatası:', error);
        }
        return;
    }
    
    const last = new Date(lastDate);
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    
    console.log('📅 Son blog tarihi:', formatDateGlobal(lastDate));
    console.log('📊 Son blog tarihinden bu yana geçen gün:', diffDays);
    
    // Admin panelinde varsa UI'ı güncelle
    if (typeof updateAutoBlogStatus === 'function') {
        const nextDate = new Date(last);
        nextDate.setDate(nextDate.getDate() + 10);
        updateAutoBlogStatus(lastDate, nextDate.toISOString());
    }
    
    if (diffDays >= 10) {
        console.log('✅ 10 gün geçti! Yeni blog yazısı oluşturuluyor...');
        await generateBlogPostNowGlobal(true);
    } else {
        const remainingDays = 10 - diffDays;
        console.log(`⏳ Henüz 10 gün geçmedi. Kalan gün: ${remainingDays}`);
    }
}

// Tarih formatla (global)
function formatDateGlobal(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('tr-TR', options);
}

// İlk 4 resmi preload et
function preloadFirstImages() {
    setTimeout(() => {
        fetch('/api/images', { cache: 'force-cache' })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                return null;
            })
            .then(data => {
                if (data && data.success && data.images && data.images.length > 0) {
                    // İlk 4 resmi preload et
                    const firstFour = data.images.slice(0, 4);
                    firstFour.forEach(img => {
                        const link = document.createElement('link');
                        link.rel = 'preload';
                        link.as = 'image';
                        link.href = img.url || img.filename;
                        link.fetchPriority = 'high';
                        document.head.appendChild(link);
                    });
                }
            })
            .catch(error => {
                console.log('Preload hatası:', error);
            });
    }, 100);
}

// Fotoğrafların yüklenip yüklenmediğini kontrol et
function checkImages() {
    const images = document.querySelectorAll('.gallery-item img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Fotoğraf yüklenemezse placeholder göster
            this.parentElement.classList.add('no-image');
        });
    });
}

// E-mail adresine tıklandığında
const emailElement = document.getElementById('email');
if (emailElement) {
    emailElement.style.cursor = 'pointer';
    emailElement.addEventListener('click', function() {
        window.location.href = `mailto:${CONFIG.email}`;
    });
}

// Galeri resimlerini sunucudan yükle
function loadGalleryFromStorage() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) {
        console.log('Galeri grid bulunamadı');
        return;
    }
    
    // Önce sunucudan yükle
    fetch('/api/images')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('API yanıt vermedi');
        })
        .then(data => {
            if (data.success && data.images && data.images.length > 0) {
                const imageUrls = data.images.map(img => {
                    let url = img.url || img.filename;
                    // Vercel Blob Storage URL'leri tam URL'dir (https://...), normalize etme
                    // Sadece relative path'leri normalize et
                    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:')) {
                    if (url.startsWith('/')) {
                        url = url.substring(1);
                    }
                    if (!url.startsWith('images/')) {
                        url = 'images/' + url;
                        }
                    }
                    return url;
                });
                
                console.log('✅ Sunucudan galeri resimleri yüklendi:', imageUrls.length);
                
                // LocalStorage'a kaydet
                localStorage.setItem('galleryImages', JSON.stringify(imageUrls));
                
                // Galeriyi güncelle
                updateGalleryGrid(imageUrls);
            } else {
                throw new Error('Backend\'de resim yok');
            }
        })
        .catch(error => {
            console.log('Backend yok, fallback kullanılıyor:', error.message);
            // Hata durumunda images klasöründeki tüm resimleri göster
            const fallbackImages = getImagesFromFolder();
            console.log('📸 Fallback resimler:', fallbackImages.length);
            if (fallbackImages.length > 0) {
                updateGalleryGrid(fallbackImages);
                // LocalStorage'a da kaydet
                localStorage.setItem('galleryImages', JSON.stringify(fallbackImages));
            } else {
                // Son çare: localStorage'dan yükle
                const storedImages = localStorage.getItem('galleryImages');
                if (storedImages) {
                    try {
                        const images = JSON.parse(storedImages);
                        if (images.length > 0) {
                            console.log('LocalStorage\'dan galeri yüklendi:', images.length);
                            updateGalleryGrid(images);
                        }
                    } catch (e) {
                        console.error('LocalStorage parse hatası:', e);
                    }
                }
            }
        });
}

// Galeri grid'ini güncelle
function updateGalleryGrid(images) {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    // Mevcut galeriyi temizle
    galleryGrid.innerHTML = '';
    
    // Yeni resimleri ekle
    images.forEach((imageUrl, index) => {
        // URL'yi normalize et - Vercel Blob Storage URL'leri tam URL'dir (https://...)
        let src = imageUrl;
        // Eğer tam URL değilse (http/https/data ile başlamıyorsa) normalize et
        if (!src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('data:')) {
        if (src.startsWith('/')) {
            src = src.substring(1);
        }
        if (!src.startsWith('images/')) {
            src = 'images/' + src;
            }
        }
        
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        // İlk 4 resmi hemen yükle, diğerlerini lazy loading ile
        if (index < 4) {
            img.src = src;
            // Preload için link ekle
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        } else {
            img.loading = 'lazy';
            img.decoding = 'async';
        img.src = src;
        }
        img.alt = `Réalisation ${index + 1}`;
        img.fetchPriority = index < 4 ? 'high' : 'low';
        img.onerror = function() {
            console.error('Galeri resmi yüklenemedi:', src);
            this.style.display = 'none';
        };
        
        galleryItem.appendChild(img);
        galleryGrid.appendChild(galleryItem);
    });
    
    // Resim yükleme hatalarını kontrol et
    checkImages();
}

// Image Modal Fonksiyonları
let currentImageIndex = 0;
let galleryImages = [];

// Modal kurulumu
function setupImageModal() {
    const modal = document.getElementById('image-modal');
    const closeBtn = document.getElementById('modal-close');
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    
    if (!modal) return;
    
    // Kapat butonu
    if (closeBtn) {
        closeBtn.addEventListener('click', closeImageModal);
    }
    
    // Önceki resim
    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigateImage(-1));
    }
    
    // Sonraki resim
    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigateImage(1));
    }
    
    // ESC tuşu ile kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeImageModal();
        }
        if (e.key === 'ArrowLeft' && modal.classList.contains('active')) {
            navigateImage(-1);
        }
        if (e.key === 'ArrowRight' && modal.classList.contains('active')) {
            navigateImage(1);
        }
    });
    
    // Modal dışına tıklayınca kapat
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeImageModal();
        }
    });
}

// Modal aç
function openImageModal() {
    const modal = document.getElementById('image-modal');
    
    if (!modal) {
        console.error('Modal bulunamadı!');
        alert('Modal bulunamadı!');
        return;
    }
    
    console.log('Modal açılıyor...');
    
    // Önce backend'den resimleri dene
    fetch('/api/images')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('API yanıt vermedi');
        })
        .then(data => {
            if (data.success && data.images && data.images.length > 0) {
                galleryImages = data.images.map(img => {
                    let url = img.url || img.filename;
                    // Vercel Blob Storage URL'leri tam URL'dir (https://...), normalize etme
                    // Sadece relative path'leri normalize et
                    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:')) {
                    if (url.startsWith('/')) {
                        url = url.substring(1);
                    }
                    if (!url.startsWith('images/')) {
                        url = 'images/' + url;
                        }
                    }
                    return url;
                });
                console.log('✅ Backend\'den resimler yüklendi:', galleryImages.length);
            } else {
                throw new Error('Backend\'de resim yok');
            }
            openModalWithImages();
        })
        .catch(error => {
            console.log('Backend yok, fallback kullanılıyor:', error.message);
            // Backend yoksa, images klasöründeki tüm resimleri kullan
            galleryImages = getImagesFromFolder();
            
            if (galleryImages.length === 0) {
                // Son çare: localStorage'dan yükle
                const storedImages = localStorage.getItem('galleryImages');
                if (storedImages) {
                    try {
                        galleryImages = JSON.parse(storedImages);
                        console.log('LocalStorage\'dan resimler yüklendi:', galleryImages.length);
                    } catch (e) {
                        console.error('LocalStorage parse hatası:', e);
                    }
                }
            }
            
            console.log('📸 Toplam resim sayısı:', galleryImages.length);
            console.log('📸 Resimler:', galleryImages);
            
            openModalWithImages();
        });
}

// Modal'ı resimlerle aç
function openModalWithImages() {
    const modal = document.getElementById('image-modal');
    
    if (galleryImages.length === 0) {
        alert('Henüz resim yüklenmemiş! Lütfen admin panelinden resim yükleyin veya images klasörüne resim ekleyin.');
        return;
    }
    
    console.log('Modal açılıyor, toplam resim:', galleryImages.length);
    
    currentImageIndex = 0;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Kısa bir gecikme ile resmi göster (modal animasyonu için)
    setTimeout(() => {
        showImage(currentImageIndex);
    }, 100);
}

// Images klasöründeki resimleri bul (fallback)
function getImagesFromFolder() {
    // Önce sayfadaki tüm resimleri topla
    const pageImages = [];
    const allImgTags = document.querySelectorAll('img');
    
    allImgTags.forEach(img => {
        let src = img.src || img.getAttribute('src');
        if (src && (src.includes('images/') || src.includes('/images/'))) {
            // URL'yi normalize et
            if (src.includes('http://') || src.includes('https://')) {
                try {
                    const url = new URL(src);
                    src = url.pathname;
                } catch (e) {
                    // URL parse edilemezse, images/ kısmını al
                    const match = src.match(/\/?images\/[^"'\s?]+/);
                    if (match) {
                        src = match[0];
                    }
                }
            }
            
            // Başında / varsa kaldır, images/ ile başlamalı
            if (src.startsWith('/')) {
                src = src.substring(1);
            }
            
            // images/ ile başlamıyorsa ekle
            if (!src.startsWith('images/')) {
                src = 'images/' + src;
            }
            
            if (src && !pageImages.includes(src)) {
                pageImages.push(src);
            }
        }
    });
    
    // Images klasöründeki bilinen tüm resimler
    const knownImages = [
        'images/Gemini_Generated_Image_24gfcm24gfcm24gf.png',
        'images/Gemini_Generated_Image_aehbrgaehbrgaehb.png',
        'images/Gemini_Generated_Image_b3pgk5b3pgk5b3pg.png',
        'images/Gemini_Generated_Image_f38oj4f38oj4f38o.png',
        'images/Gemini_Generated_Image_l3v3exl3v3exl3v3.png',
        'images/Gemini_Generated_Image_lxp5qolxp5qolxp5.png',
        'images/Gemini_Generated_Image_pc13odpc13odpc13.png',
        'images/Gemini_Generated_Image_r9blz9r9blz9r9bl.png',
        'images/photo1.jpg',
        'images/photo2.jpg',
        'images/photo3.jpg',
        'images/photo4.jpg'
    ];
    
    // Sayfadaki resimlerle bilinen resimleri birleştir
    const allImages = [...new Set([...pageImages, ...knownImages])];
    
    console.log('Images klasöründeki tüm resimler:', allImages);
    return allImages;
}

// Modal kapat
function closeImageModal() {
    const modal = document.getElementById('image-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Scroll'u geri aç
}

// Resim göster
function showImage(index) {
    const modalImage = document.getElementById('modal-image');
    const currentIndexSpan = document.getElementById('current-index');
    const totalImagesSpan = document.getElementById('total-images');
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    
    if (!modalImage) {
        console.error('Modal image elementi bulunamadı!');
        return;
    }
    
    // Geçerli index kontrolü
    if (index < 0 || index >= galleryImages.length) {
        console.error('Geçersiz resim indexi:', index, 'Toplam resim:', galleryImages.length);
        return;
    }
    
    let imageUrl = galleryImages[index];
    if (!imageUrl) {
        console.error('Resim URL bulunamadı:', index);
        return;
    }
    
    // URL'yi normalize et - images/ ile başlıyorsa olduğu gibi bırak
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
        // Eğer zaten images/ ile başlıyorsa, / ekleme
        if (!imageUrl.startsWith('/') && !imageUrl.startsWith('images/')) {
            imageUrl = 'images/' + imageUrl;
        } else if (!imageUrl.startsWith('/') && imageUrl.startsWith('images/')) {
            // images/ ile başlıyorsa olduğu gibi bırak
        } else if (imageUrl.startsWith('/')) {
            // Zaten / ile başlıyorsa olduğu gibi bırak
        }
    }
    
    console.log('Resim gösteriliyor:', imageUrl, 'Index:', index, 'Toplam:', galleryImages.length);
    
    // Resmi yüklemeden önce loading göster
    modalImage.style.opacity = '0';
    modalImage.src = ''; // Önceki resmi temizle
    
    // Önceki ve sonraki resimleri preload et (hızlı yükleme için)
    const nextIndex = (index + 1) % galleryImages.length;
    const prevIndex = (index - 1 + galleryImages.length) % galleryImages.length;
    
    if (galleryImages[nextIndex]) {
        const nextImg = new Image();
        nextImg.src = galleryImages[nextIndex];
    }
    
    if (galleryImages[prevIndex]) {
        const prevImg = new Image();
        prevImg.src = galleryImages[prevIndex];
    }
    
    // Yeni resmi yükle - hızlı yükleme için fetchPriority ve decoding kullan
    const img = new Image();
    img.fetchPriority = 'high';
    img.decoding = 'async';
    img.onload = function() {
        console.log('✅ Resim başarıyla yüklendi:', imageUrl);
        modalImage.src = imageUrl;
        modalImage.style.opacity = '1';
    };
    img.onerror = function() {
        console.error('❌ Resim yüklenemedi:', imageUrl);
        console.error('Denenen yol:', imageUrl);
        modalImage.style.opacity = '1';
        // Hata durumunda placeholder göster
        modalImage.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EResim yüklenemedi%3C/text%3E%3C/svg%3E';
    };
    
    // Resmi yükle
    console.log('🔄 Resim yükleniyor:', imageUrl);
    img.src = imageUrl;
    
    // Sayaçları güncelle
    if (currentIndexSpan) {
        currentIndexSpan.textContent = index + 1;
    }
    
    if (totalImagesSpan) {
        totalImagesSpan.textContent = galleryImages.length;
    }
    
    // Okları göster/gizle
    if (prevBtn) {
        prevBtn.style.display = galleryImages.length > 1 ? 'flex' : 'none';
    }
    
    if (nextBtn) {
        nextBtn.style.display = galleryImages.length > 1 ? 'flex' : 'none';
    }
}

// Resim gezin
function navigateImage(direction) {
    if (galleryImages.length === 0) return;
    
    currentImageIndex += direction;
    
    // Döngüsel gezinme
    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }
    
    showImage(currentImageIndex);
}

