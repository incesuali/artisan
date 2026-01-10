// Konfigürasyon - LocalStorage'dan veya varsayılan değerlerden
const CONFIG = {
    whatsappNumber: localStorage.getItem('whatsappNumber') || '905555555555',  // WhatsApp numarası (ülke kodu ile, + işareti olmadan)
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
});

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

