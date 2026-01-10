// Admin sayfası JavaScript

// Seçilen resimleri sakla (henüz yüklenmedi)
let selectedFiles = [];

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // Mevcut değerleri yükle
    loadCurrentValues();
    loadGalleryImages();
    loadBlogPosts();
    loadKeywords();
    loadAutoBlogSettings();
    checkAutoBlogSchedule();
    
    // Kaydet butonları
    const saveBtn = document.getElementById('save-btn');
    const saveEmailBtn = document.getElementById('save-email-btn');
    const saveImagesBtn = document.getElementById('save-images-btn');
    const cancelSelectionBtn = document.getElementById('cancel-selection-btn');
    const addBlogBtn = document.getElementById('add-blog-btn');
    const saveKeywordsBtn = document.getElementById('save-keywords-btn');
    const generateBlogNowBtn = document.getElementById('generate-blog-now-btn');
    const testGenerationBtn = document.getElementById('test-generation-btn');
    const autoBlogEnabled = document.getElementById('auto-blog-enabled');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveWhatsAppSettings);
    }
    
    if (saveEmailBtn) {
        saveEmailBtn.addEventListener('click', saveEmailSettings);
    }
    
    if (saveImagesBtn) {
        saveImagesBtn.addEventListener('click', saveSelectedImages);
    }
    
    if (cancelSelectionBtn) {
        cancelSelectionBtn.addEventListener('click', cancelSelection);
    }
    
    if (addBlogBtn) {
        addBlogBtn.addEventListener('click', addBlogPost);
    }
    
    if (saveKeywordsBtn) {
        saveKeywordsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Kelimeleri Kaydet butonuna tıklandı');
            saveKeywords();
        });
    } else {
        console.error('save-keywords-btn elementi bulunamadı!');
    }
    
    if (generateBlogNowBtn) {
        generateBlogNowBtn.addEventListener('click', generateBlogPostNow);
    }
    
    if (testGenerationBtn) {
        testGenerationBtn.addEventListener('click', testBlogGeneration);
    }
    
    if (autoBlogEnabled) {
        autoBlogEnabled.addEventListener('change', saveAutoBlogSettings);
    }
    
    // Resim yükleme
    setupImageUpload();
    
    // Her saat otomatik blog kontrolü yap (sayfa açıkken)
    setInterval(function() {
        if (typeof checkAutoBlogSchedule === 'function') {
            checkAutoBlogSchedule();
        }
    }, 3600000); // 1 saat
    
    // İlk kontrol (sayfa yüklendiğinde, tüm scriptler yüklendikten sonra)
    setTimeout(function() {
        if (typeof checkAutoBlogSchedule === 'function') {
            console.log('İlk otomatik blog kontrolü yapılıyor...');
            checkAutoBlogSchedule();
        }
    }, 2000); // 2 saniye bekle
    
    // İlk kontrol (sayfa yüklendiğinde)
    setTimeout(function() {
        if (typeof checkAutoBlogSchedule === 'function') {
            checkAutoBlogSchedule();
        }
    }, 2000); // 2 saniye bekle (tüm scriptlerin yüklenmesi için)
});

// Mevcut değerleri yükle
function loadCurrentValues() {
    // WhatsApp numarası
    const whatsappNumber = localStorage.getItem('whatsappNumber') || '905555555555';
    const whatsappMessage = localStorage.getItem('whatsappMessage') || 'Bonjour, je souhaiterais obtenir un devis pour des travaux de parquet.';
    const email = localStorage.getItem('email') || 'ornek@gmail.com';
    
    // Input alanlarını doldur
    const numberInput = document.getElementById('whatsapp-number');
    const messageInput = document.getElementById('whatsapp-message');
    const emailInput = document.getElementById('email');
    
    if (numberInput) {
        numberInput.value = whatsappNumber;
    }
    
    if (messageInput) {
        messageInput.value = whatsappMessage;
    }
    
    if (emailInput) {
        emailInput.value = email;
    }
    
    // Mevcut değerleri göster
    const currentNumber = document.getElementById('current-number');
    const currentEmail = document.getElementById('current-email');
    
    if (currentNumber) {
        currentNumber.textContent = whatsappNumber || 'Henüz ayarlanmamış';
    }
    
    if (currentEmail) {
        currentEmail.textContent = email || 'Henüz ayarlanmamış';
    }
}

// WhatsApp ayarlarını kaydet
function saveWhatsAppSettings() {
    const numberInput = document.getElementById('whatsapp-number');
    const messageInput = document.getElementById('whatsapp-message');
    const messageDiv = document.getElementById('message');
    
    if (!numberInput || !messageInput) return;
    
    let whatsappNumber = numberInput.value.trim();
    const whatsappMessage = messageInput.value.trim();
    
    // Validasyon
    if (!whatsappNumber) {
        showMessage('Lütfen WhatsApp numarası girin!', 'error');
        return;
    }
    
    // Sadece rakamları al
    whatsappNumber = whatsappNumber.replace(/\D/g, '');
    
    if (whatsappNumber.length < 10) {
        showMessage('Geçerli bir WhatsApp numarası girin!', 'error');
        return;
    }
    
    // LocalStorage'a kaydet
    localStorage.setItem('whatsappNumber', whatsappNumber);
    localStorage.setItem('whatsappMessage', whatsappMessage);
    
    // Mevcut numarayı güncelle
    const currentNumber = document.getElementById('current-number');
    if (currentNumber) {
        currentNumber.textContent = whatsappNumber;
    }
    
    showMessage('✅ WhatsApp ayarları başarıyla kaydedildi!', 'success');
    
    // 2 saniye sonra mesajı gizle
    setTimeout(() => {
        if (messageDiv) {
            messageDiv.style.display = 'none';
        }
    }, 3000);
}

// E-mail ayarlarını kaydet
function saveEmailSettings() {
    const emailInput = document.getElementById('email');
    const messageDiv = document.getElementById('message');
    
    if (!emailInput) return;
    
    const email = emailInput.value.trim();
    
    // Validasyon
    if (!email) {
        showMessage('Lütfen e-mail adresi girin!', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Geçerli bir e-mail adresi girin!', 'error');
        return;
    }
    
    // LocalStorage'a kaydet
    localStorage.setItem('email', email);
    
    // Mevcut e-mail'i güncelle
    const currentEmail = document.getElementById('current-email');
    if (currentEmail) {
        currentEmail.textContent = email;
    }
    
    showMessage('✅ E-mail başarıyla kaydedildi!', 'success');
    
    // 2 saniye sonra mesajı gizle
    setTimeout(() => {
        if (messageDiv) {
            messageDiv.style.display = 'none';
        }
    }, 3000);
}

// Mesaj göster
function showMessage(text, type) {
    // Galeri mesajı için özel alan
    let messageDiv = document.getElementById('gallery-message');
    
    // Eğer galeri mesajı yoksa, WhatsApp ayarları mesajını kullan
    if (!messageDiv) {
        messageDiv = document.getElementById('message');
    }
    
    // Hala yoksa oluştur
    if (!messageDiv) {
        const gallerySection = document.querySelector('.admin-section:last-child');
        if (gallerySection) {
            messageDiv = document.createElement('div');
            messageDiv.id = 'gallery-message';
            messageDiv.className = 'message';
            const uploadArea = document.getElementById('upload-area');
            if (uploadArea && uploadArea.parentNode) {
                uploadArea.parentNode.insertBefore(messageDiv, uploadArea);
            }
        }
    }
    
    if (!messageDiv) return;
    
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    // Başarılı mesajı 3 saniye sonra gizle
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

// Resim yükleme kurulumu
function setupImageUpload() {
    const uploadArea = document.getElementById('upload-area');
    const imageInput = document.getElementById('image-input');
    const selectBtn = document.getElementById('select-images-btn');
    
    if (!uploadArea || !imageInput || !selectBtn) return;
    
    // Tıklayarak seç
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });
    
    selectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        imageInput.click();
    });
    
    // Dosya seçildiğinde
    imageInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    
    // Drag & Drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
}

// Dosyaları işle (artık direkt yükleme, önce önizleme)
function handleFiles(files) {
    const maxImages = 20;
    const currentImages = getGalleryImages();
    const remainingSlots = maxImages - currentImages.length;
    
    if (remainingSlots <= 0) {
        showMessage('Maksimum 20 resim yüklenebilir! Önce bazı resimleri silin.', 'error');
        return;
    }
    
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
        showMessage('Lütfen geçerli resim dosyaları seçin!', 'error');
        return;
    }
    
    const filesToProcess = imageFiles.slice(0, remainingSlots);
    
    if (imageFiles.length > remainingSlots) {
        showMessage(`${remainingSlots} resim seçilecek. ${imageFiles.length - remainingSlots} resim atlandı.`, 'error');
    }
    
    // Seçilen dosyaları sakla ve önizleme göster
    selectedFiles = filesToProcess;
    showSelectedPreview(filesToProcess);
}

// Seçilen resimlerin önizlemesini göster
function showSelectedPreview(files) {
    const previewSection = document.getElementById('selected-preview-section');
    const previewContainer = document.getElementById('selected-preview');
    
    if (!previewSection || !previewContainer) return;
    
    previewContainer.innerHTML = '';
    
    files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'selected-preview-item';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = file.name;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-selected';
            removeBtn.textContent = '×';
            removeBtn.onclick = () => removeFromSelection(index);
            
            previewItem.appendChild(img);
            previewItem.appendChild(removeBtn);
            previewContainer.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    });
    
    previewSection.style.display = 'block';
}

// Seçimden resim kaldır
function removeFromSelection(index) {
    selectedFiles.splice(index, 1);
    if (selectedFiles.length === 0) {
        cancelSelection();
    } else {
        showSelectedPreview(selectedFiles);
    }
}

// Seçimi iptal et
function cancelSelection() {
    selectedFiles = [];
    const previewSection = document.getElementById('selected-preview-section');
    if (previewSection) {
        previewSection.style.display = 'none';
    }
    const imageInput = document.getElementById('image-input');
    if (imageInput) {
        imageInput.value = '';
    }
}

// Seçilen resimleri kaydet
function saveSelectedImages() {
    if (selectedFiles.length === 0) {
        showMessage('Lütfen önce resim seçin!', 'error');
        return;
    }
    
    const saveBtn = document.getElementById('save-images-btn');
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = '⏳ Kaydediliyor...';
    }
    
    // Backend'e yükleme dene
    const formData = new FormData();
    selectedFiles.forEach(file => {
        formData.append('images', file);
    });
    
    fetch('/api/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Backend yanıt vermedi');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Yüklenen resimlerin URL'lerini direkt kaydet
            if (data.images && data.images.length > 0) {
                const currentImages = getGalleryImages();
                const newImageUrls = data.images.map(img => img.url || img.filename);
                const allImages = [...currentImages, ...newImageUrls];
                saveGalleryImages(allImages);
                renderGallery();
                updateImagesCount();
            }
            
            showMessage('✅ Resimler başarıyla kaydedildi! (Vercel Blob Storage)', 'success');
            cancelSelection();
        } else {
            throw new Error(data.error || 'Bilinmeyen hata');
        }
        
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Resimleri Kaydet';
        }
    })
    .catch(error => {
        console.error('Backend yükleme hatası:', error);
        
        // Backend yoksa, localStorage'a kaydet (base64)
        console.log('Backend yok, localStorage\'a kaydediliyor...');
        showMessage('⚠️ Backend bulunamadı. Resimler localStorage\'a kaydedilecek (sadece bu tarayıcıda görünür).', 'error');
        saveToLocalStorage();
    });
}

// LocalStorage'a kaydet (backend yoksa)
function saveToLocalStorage() {
    const saveBtn = document.getElementById('save-images-btn');
    const maxImages = 20;
    
    if (selectedFiles.length === 0) {
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Resimleri Kaydet';
        }
        return;
    }
    
    const currentImages = getGalleryImages();
    const remainingSlots = maxImages - currentImages.length;
    
    if (remainingSlots <= 0) {
        showMessage(`Maksimum ${maxImages} resim olabilir! Önce bazı resimleri silin.`, 'error');
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Resimleri Kaydet';
        }
        return;
    }
    
    const filesToSave = selectedFiles.slice(0, remainingSlots);
    
    if (filesToSave.length < selectedFiles.length) {
        showMessage(`Maksimum ${maxImages} resim olabilir! Sadece ${remainingSlots} resim kaydedilecek.`, 'error');
    }
    
    const newImages = [];
    let processed = 0;
    let hasError = false;
    
    if (filesToSave.length === 0) {
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Resimleri Kaydet';
        }
        return;
    }
    
    filesToSave.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                newImages.push(e.target.result); // base64
                processed++;
                
                if (processed === filesToSave.length && !hasError) {
                    // Tüm resimleri ekle
                    const allImages = [...currentImages, ...newImages];
                    saveGalleryImages(allImages);
                    renderGallery();
                    updateImagesCount();
                    
                    showMessage(`✅ ${newImages.length} resim başarıyla kaydedildi! (LocalStorage - sadece bu tarayıcıda görünür)`, 'success');
                    cancelSelection();
                }
            } catch (error) {
                console.error('Kaydetme hatası:', error);
                hasError = true;
            } finally {
                if (processed === filesToSave.length) {
                    if (saveBtn) {
                        saveBtn.disabled = false;
                        saveBtn.textContent = '💾 Resimleri Kaydet';
                    }
                }
            }
        };
        reader.onerror = function(error) {
            console.error('Resim okuma hatası:', error);
            hasError = true;
            processed++;
            if (processed === filesToSave.length) {
                showMessage('❌ Bazı resimler kaydedilemedi!', 'error');
                if (saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.textContent = '💾 Resimleri Kaydet';
                }
            }
        };
        reader.readAsDataURL(file);
    });
}

// Resimleri sunucuya yükle (eski fonksiyon, artık kullanılmıyor ama yedek olarak bırakıldı)
function uploadImagesToServer(files) {
    saveSelectedImages();
}

// Sunucudan galeri resimlerini yükle
function loadGalleryFromServer() {
    fetch('/api/images')
        .then(response => {
            if (!response.ok) {
                throw new Error('Backend yanıt vermedi');
            }
            return response.json();
        })
        .then(data => {
            if (data.success && data.images && data.images.length > 0) {
                const imageUrls = data.images.map(img => {
                    let url = img.url || img.filename;
                    // Vercel Blob Storage URL'leri tam URL'dir (https://...), normalize etme
                    // Sadece relative path'leri normalize et
                    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:')) {
                        if (!url.startsWith('images/') && !url.startsWith('/images/')) {
                            url = 'images/' + url;
                        }
                    }
                    return url;
                });
                saveGalleryImages(imageUrls);
                renderGallery();
                updateImagesCount();
            } else {
                // Backend'de resim yoksa localStorage'dan yükle
                loadGalleryImages();
            }
        })
        .catch(error => {
            console.log('Backend yok, localStorage kullanılıyor:', error.message);
            // Backend yoksa localStorage'dan yükle
            loadGalleryImages();
        });
}

// Galeri resimlerini al
function getGalleryImages() {
    const stored = localStorage.getItem('galleryImages');
    return stored ? JSON.parse(stored) : [];
}

// Galeri resimlerini kaydet
function saveGalleryImages(images) {
    localStorage.setItem('galleryImages', JSON.stringify(images));
}

// Galeriyi render et
function renderGallery() {
    const galleryPreview = document.getElementById('gallery-preview');
    if (!galleryPreview) return;
    
    const images = getGalleryImages();
    
    galleryPreview.innerHTML = images.map((imageData, index) => `
        <div class="gallery-item-preview">
            <img src="${imageData}" alt="Resim ${index + 1}">
            <button class="delete-btn" onclick="deleteImage(${index})" title="Sil">×</button>
            <span class="item-number">${index + 1}</span>
        </div>
    `).join('');
}

// Resim sil
function deleteImage(index) {
    if (!confirm('Bu resmi silmek istediğinize emin misiniz?')) return;
    
    const images = getGalleryImages();
    const imageUrl = images[index];
    
    // URL'den dosya adını çıkar
    const filename = imageUrl.split('/').pop();
    
    // Sunucudan sil
    fetch(`/api/images/${filename}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // LocalStorage'dan da sil
            images.splice(index, 1);
            saveGalleryImages(images);
            renderGallery();
            updateImagesCount();
            showMessage('✅ Resim silindi!', 'success');
        } else {
            showMessage(`❌ Hata: ${data.error}`, 'error');
        }
    })
    .catch(error => {
        console.error('Silme hatası:', error);
        showMessage('❌ Resim silinirken bir hata oluştu!', 'error');
    });
}

// Resim sayısını güncelle
function updateImagesCount() {
    const countElement = document.getElementById('images-count');
    if (!countElement) return;
    
    const count = getGalleryImages().length;
    countElement.textContent = `${count} / 20 resim yüklendi`;
    
    if (count >= 20) {
        countElement.style.background = '#ffeaa7';
        countElement.style.color = '#d63031';
    } else {
        countElement.style.background = '#e8f8f5';
        countElement.style.color = '#25D366';
    }
}

// Galeri resimlerini yükle
function loadGalleryImages() {
    // Önce sunucudan yükle, yoksa localStorage'dan
    loadGalleryFromServer();
}

// ========== BLOG YÖNETİMİ ==========

// Blog yazılarını yükle ve göster (Vercel Blob Storage'dan veya localStorage'dan)
async function loadBlogPosts() {
    const container = document.getElementById('blog-posts-list');
    if (!container) return;
    
    let blogPosts = [];
    
    // Önce Vercel Blob Storage'dan yükle
    try {
        const response = await fetch('/api/blog-posts');
        const data = await response.json();
        
        if (data.success && data.posts && Array.isArray(data.posts)) {
            blogPosts = data.posts;
            console.log('✅ Blog yazıları Vercel Blob Storage\'dan yüklendi:', blogPosts.length);
            
            // localStorage'a da kaydet (fallback için)
            localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
        }
    } catch (error) {
        console.error('⚠️ Vercel Blob Storage\'dan yükleme hatası (localStorage\'dan yüklenecek):', error);
    }
    
    // Vercel Blob Storage'da yoksa veya hata varsa, localStorage'dan yükle
    if (blogPosts.length === 0) {
        blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        console.log('✅ Blog yazıları localStorage\'dan yüklendi:', blogPosts.length);
    }
    
    if (blogPosts.length === 0) {
        container.innerHTML = '<p style="color: #666; font-style: italic;">Henüz blog yazısı eklenmemiş.</p>';
        return;
    }
    
    // Tarihe göre sırala (en yeni üstte)
    blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = blogPosts.map((post, index) => `
        <div class="blog-post-item" style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 10px 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
            <div style="flex: 1; min-width: 0;">
                <h4 style="margin: 0; color: #2c3e50; font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(post.title)}</h4>
            </div>
            <div style="display: flex; gap: 6px; flex-shrink: 0;">
                <button onclick="editBlogPost('${post.id}')" class="edit-btn" style="background: #007bff; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer; font-size: 12px; white-space: nowrap;">✏️ Düzenle</button>
                <button onclick="deleteBlogPost('${post.id}')" class="delete-btn" style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer; font-size: 12px; white-space: nowrap;">🗑️ Sil</button>
            </div>
        </div>
    `).join('');
}

// Blog yazısı ekle (Vercel Blob Storage'a kaydet)
async function addBlogPost() {
    const titleInput = document.getElementById('blog-title');
    const contentInput = document.getElementById('blog-content');
    
    if (!titleInput || !contentInput) return;
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    // Validasyon
    if (!title) {
        showBlogMessage('Lütfen blog yazısı başlığı girin!', 'error');
        return;
    }
    
    if (!content) {
        showBlogMessage('Lütfen blog yazısı içeriği girin!', 'error');
        return;
    }
    
    // Blog yazısı oluştur
    const blogPost = {
        id: Date.now().toString(),
        title: title,
        content: content,
        date: new Date().toISOString()
    };
    
    // Önce localStorage'dan mevcut yazıları al
    let blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    blogPosts.push(blogPost);
    
    // Vercel Blob Storage'a kaydet
    try {
        const response = await fetch('/api/blog-posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ posts: blogPosts }),
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Blog yazısı Vercel Blob Storage\'a kaydedildi');
            
            // localStorage'a da kaydet (fallback için)
            localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
            
            // Formu temizle
            titleInput.value = '';
            contentInput.value = '';
            
            // Listeyi yenile
            await loadBlogPosts();
            
            showBlogMessage('✅ Blog yazısı başarıyla eklendi! (Vercel Blob Storage)', 'success');
        } else {
            throw new Error(data.error || 'Bilinmeyen hata');
        }
    } catch (error) {
        console.error('⚠️ Vercel Blob Storage kaydetme hatası, localStorage\'a kaydediliyor:', error);
        
        // Hata durumunda localStorage'a kaydet (fallback)
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
        await loadBlogPosts();
        showBlogMessage('⚠️ Blog yazısı localStorage\'a kaydedildi (Vercel Blob Storage hatası). Lütfen tekrar deneyin.', 'error');
    }
    
    // Forma scroll et
    setTimeout(() => {
        const blogPostsList = document.getElementById('blog-posts-list');
        if (blogPostsList) {
            blogPostsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
}

// Blog yazısı düzenle
let editingBlogPostId = null;

function editBlogPost(id) {
    const blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const post = blogPosts.find(p => p.id === id);
    
    if (!post) {
        showBlogMessage('Blog yazısı bulunamadı!', 'error');
        return;
    }
    
    // Formu doldur
    const titleInput = document.getElementById('blog-title');
    const contentInput = document.getElementById('blog-content');
    const addBtn = document.getElementById('add-blog-btn');
    
    if (titleInput) titleInput.value = post.title;
    if (contentInput) contentInput.value = post.content;
    
    // Butonu güncelle
    if (addBtn) {
        addBtn.textContent = '💾 Değişiklikleri Kaydet';
        addBtn.onclick = function() {
            updateBlogPost(id);
        };
    }
    
    // Düzenlenen ID'yi sakla
    editingBlogPostId = id;
    
    // Forma scroll et
    const blogSection = document.querySelector('.admin-section:last-child');
    if (blogSection) {
        blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    showBlogMessage('✏️ Blog yazısını düzenleyin ve kaydedin.', 'success');
}

// Blog yazısı güncelle
function updateBlogPost(id) {
    const titleInput = document.getElementById('blog-title');
    const contentInput = document.getElementById('blog-content');
    const addBtn = document.getElementById('add-blog-btn');
    
    if (!titleInput || !contentInput) return;
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    // Validasyon
    if (!title) {
        showBlogMessage('Lütfen blog yazısı başlığı girin!', 'error');
        return;
    }
    
    if (!content) {
        showBlogMessage('Lütfen blog yazısı içeriği girin!', 'error');
        return;
    }
    
    // LocalStorage'dan al ve güncelle
    const blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const postIndex = blogPosts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
        showBlogMessage('Blog yazısı bulunamadı!', 'error');
        return;
    }
    
    // Mevcut tarihi koru, sadece içerik ve başlığı güncelle
    blogPosts[postIndex].title = title;
    blogPosts[postIndex].content = content;
    
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    
    // Formu temizle ve butonu sıfırla
    titleInput.value = '';
    contentInput.value = '';
    
    if (addBtn) {
        addBtn.textContent = '➕ Yeni Blog Yazısı Ekle';
        addBtn.onclick = addBlogPost;
    }
    
    editingBlogPostId = null;
    
    // Listeyi yenile
    loadBlogPosts();
    
    showBlogMessage('✅ Blog yazısı başarıyla güncellendi!', 'success');
}

// Blog yazısı sil
function deleteBlogPost(id) {
    if (!confirm('Bu blog yazısını silmek istediğinize emin misiniz?')) return;
    
    const blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const filteredPosts = blogPosts.filter(post => post.id !== id);
    localStorage.setItem('blogPosts', JSON.stringify(filteredPosts));
    
    // Eğer silinen yazı düzenleniyorsa, formu temizle
    if (editingBlogPostId === id) {
        const titleInput = document.getElementById('blog-title');
        const contentInput = document.getElementById('blog-content');
        const addBtn = document.getElementById('add-blog-btn');
        
        if (titleInput) titleInput.value = '';
        if (contentInput) contentInput.value = '';
        
        if (addBtn) {
            addBtn.textContent = '➕ Yeni Blog Yazısı Ekle';
            addBtn.onclick = addBlogPost;
        }
        
        editingBlogPostId = null;
    }
    
    loadBlogPosts();
    showBlogMessage('✅ Blog yazısı silindi!', 'success');
}

// Blog mesajı göster
function showBlogMessage(text, type) {
    const messageDiv = document.getElementById('blog-message');
    if (!messageDiv) return;
    
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    // Başarılı mesajı 3 saniye sonra gizle
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

// HTML escape (blog için)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Tarihi formatla (blog için)
function formatDate(dateString) {
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

// ========== SEO OTOMATIK BLOG YAZISI ÜRETİCİ ==========

// Kelimeleri yükle (Vercel Blob Storage'dan veya localStorage'dan)
async function loadKeywords() {
    const keywords1 = document.getElementById('keywords-1');
    const keywords2 = document.getElementById('keywords-2');
    const keywords3 = document.getElementById('keywords-3');
    const keywords4 = document.getElementById('keywords-4');
    
    // Önce Vercel Blob Storage'dan yükle
    try {
        const response = await fetch('/api/seo-keywords');
        const data = await response.json();
        
        if (data.success && data.keywords) {
            const kw = data.keywords;
            
            if (keywords1) keywords1.value = (kw.category1 || []).join('\n');
            if (keywords2) keywords2.value = (kw.category2 || []).join('\n');
            if (keywords3) keywords3.value = (kw.category3 || []).join('\n');
            if (keywords4) keywords4.value = (kw.category4 || []).join('\n');
            
            // localStorage'a da kaydet (fallback için)
            if (kw.category1 && kw.category1.length > 0) {
                localStorage.setItem('seoKeywords1', JSON.stringify(kw.category1));
                localStorage.setItem('seoKeywords2', JSON.stringify(kw.category2 || []));
                localStorage.setItem('seoKeywords3', JSON.stringify(kw.category3 || []));
                localStorage.setItem('seoKeywords4', JSON.stringify(kw.category4 || []));
            }
            
            // Eğer kelimeler varsa, varsayılan kelimeleri kullanma
            if (kw.category1 && kw.category1.length > 0) {
                console.log('✅ Kelimeler Vercel Blob Storage\'dan yüklendi');
                return;
            }
        }
    } catch (error) {
        console.error('Vercel Blob Storage\'dan yükleme hatası:', error);
        // Hata durumunda localStorage'dan yükle
    }
    
    // Vercel Blob Storage'da yoksa veya hata varsa, localStorage'dan yükle
    let stored1 = JSON.parse(localStorage.getItem('seoKeywords1') || '[]');
    let stored2 = JSON.parse(localStorage.getItem('seoKeywords2') || '[]');
    let stored3 = JSON.parse(localStorage.getItem('seoKeywords3') || '[]');
    let stored4 = JSON.parse(localStorage.getItem('seoKeywords4') || '[]');
    
    // Varsayılan kelimeler (eğer hiç yoksa)
    const defaultKeywords1 = [
        'Parquet massif', 'Parquet contrecollé', 'Parquet stratifié', 'Parquet flottant',
        'Parquet adhésif', 'Parquet sur mesure', 'Parquet vieilli', 'Parquet exotique',
        'Revêtement de sol vinyle', 'Parquet en chêne', 'Parquet en bambou',
        'Parquet huilé', 'Parquet verni', 'Parquet brut', 'Parquet huilé-cire'
    ];
    
    const defaultKeywords2 = [
        'Pose à l\'anglaise', 'Pose à la française', 'Parquet point de Hongrie',
        'Parquet bâtons rompus', 'Dalles de Versailles', 'Pose en coupe de pierre',
        'Pose à bâtons rompus double', 'Pose en échelle', 'Pose en damier',
        'Pose en vannerie', 'Pose en fougère', 'Pose à joints perdus',
        'Pose à joints alignés', 'Pose mosaïque'
    ];
    
    const defaultKeywords3 = [
        'Lille', 'Roubaix', 'Tourcoing', 'Villeneuve-d\'Ascq', 'Marcq-en-Barœul',
        'Lambersart', 'Armentières', 'Loos', 'Hazebrouck', 'Bailleul',
        'La Madeleine', 'Mons-en-Barœul', 'Croix', 'Wasquehal', 'Halluin',
        'Hem', 'Roncq', 'Wattrelos', 'Faches-Thumesnil', 'Haubourdin',
        'Wattignies', 'Saint-André-lez-Lille', 'Bondues', 'Mouvaux', 'Seclin',
        'Marquette-lez-Lille', 'Wambrechies', 'Linselles', 'Lys-lez-Lannoy',
        'Leers', 'Comines', 'Neuville-en-Ferrain', 'Nienie', 'Quesnoy-sur-Deûle',
        'Houplines', 'La Chapelle-d\'Armentières', 'Erquinghem-Lys', 'Wavrin',
        'Sainghin-en-Weppes', 'Annœullin', 'Provin', 'Bauvin', 'Wingles',
        'Lens', 'Liévin', 'Hénin-Beaumont', 'Carvin', 'Libercourt', 'Courrières',
        'Harnes', 'Méricourt', 'Billy-Montigny', 'Sallaumines', 'Noyelles-Godault',
        'Montigny-en-Gohelle', 'Oignies', 'Dourges', 'Ostricourt', 'Orchies',
        'Cysoing', 'Baisieux', 'Templeuve-en-Pévèle', 'Pont-à-Marcq', 'Lesquin',
        'Ronchin', 'Vendin-le-Vieil', 'Loison-sous-Lens', 'Avion', 'Douai',
        'Sin-le-Noble', 'Auby', 'Cuincy', 'Lauwin-Planque', 'Roost-Warendin',
        'Flers-en-Escrebieux', 'Pecquencourt', 'Aniche', 'Somain',
        'Mouscron (BE)', 'Tournai (BE)', 'Menen (BE)', 'Kortrijk (BE)',
        'Comines-Warneton (BE)', 'Estaimpuis (BE)', 'Péruwelz (BE)'
    ];
    
    const defaultKeywords4 = [
        'Leroy Merlin', 'Castorama', 'Brico Dépôt', 'Bricoman',
        'Bricorama', 'Bricomarché', 'Mr.Bricolage'
    ];
    
    // Eğer localStorage boşsa, varsayılan kelimeleri kullan
    if (stored1.length === 0) {
        stored1 = defaultKeywords1;
    }
    if (stored2.length === 0) {
        stored2 = defaultKeywords2;
    }
    if (stored3.length === 0) {
        stored3 = defaultKeywords3;
    }
    if (stored4.length === 0) {
        stored4 = defaultKeywords4;
    }
    
    // UI'ya yükle
    keywords1.value = stored1.join('\n');
    keywords2.value = stored2.join('\n');
    keywords3.value = stored3.join('\n');
    keywords4.value = stored4.join('\n');
    
    // localStorage'a kaydet (fallback için)
    localStorage.setItem('seoKeywords1', JSON.stringify(stored1));
    localStorage.setItem('seoKeywords2', JSON.stringify(stored2));
    localStorage.setItem('seoKeywords3', JSON.stringify(stored3));
    localStorage.setItem('seoKeywords4', JSON.stringify(stored4));
    
    console.log('✅ Kelimeler yüklendi (localStorage/varsayılan)');
}

// Kelimeleri kaydet (Vercel Blob Storage'a ve localStorage'a)
async function saveKeywords() {
    console.log('saveKeywords fonksiyonu çağrıldı');
    
    const keywords1 = document.getElementById('keywords-1');
    const keywords2 = document.getElementById('keywords-2');
    const keywords3 = document.getElementById('keywords-3');
    const keywords4 = document.getElementById('keywords-4');
    
    if (!keywords1 || !keywords2 || !keywords3 || !keywords4) {
        console.error('Kelimeler alanları bulunamadı!');
        alert('Hata: Kelime alanları bulunamadı. Sayfayı yenileyin.');
        return;
    }
    
    const words1 = keywords1.value.split('\n').map(w => w.trim()).filter(w => w);
    const words2 = keywords2.value.split('\n').map(w => w.trim()).filter(w => w);
    const words3 = keywords3.value.split('\n').map(w => w.trim()).filter(w => w);
    const words4 = keywords4.value.split('\n').map(w => w.trim()).filter(w => w);
    
    console.log('Kelimeler:', { words1: words1.length, words2: words2.length, words3: words3.length, words4: words4.length });
    
    // Validasyon
    if (words1.length < 4) {
        showAutoBlogMessage('1. alandan en az 4 kelime girmelisiniz! (Şu anda ' + words1.length + ' kelime)', 'error');
        return;
    }
    
    if (words2.length < 3) {
        showAutoBlogMessage('2. alandan en az 3 kelime girmelisiniz! (Şu anda ' + words2.length + ' kelime)', 'error');
        return;
    }
    
    if (words3.length < 7) {
        showAutoBlogMessage('3. alandan en az 7 kelime girmelisiniz! (Şu anda ' + words3.length + ' kelime)', 'error');
        return;
    }
    
    // Önce Vercel Blob Storage'a kaydet
    try {
        const response = await fetch('/api/seo-keywords', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category1: words1,
                category2: words2,
                category3: words3,
                category4: words4,
            }),
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Kelimeler Vercel Blob Storage\'a kaydedildi');
            
            // localStorage'a da kaydet (fallback için)
            localStorage.setItem('seoKeywords1', JSON.stringify(words1));
            localStorage.setItem('seoKeywords2', JSON.stringify(words2));
            localStorage.setItem('seoKeywords3', JSON.stringify(words3));
            localStorage.setItem('seoKeywords4', JSON.stringify(words4));
            
            showAutoBlogMessage('✅ Kelimeler başarıyla kaydedildi! (Vercel Blob Storage) (1. Alan: ' + words1.length + ', 2. Alan: ' + words2.length + ', 3. Alan: ' + words3.length + ', 4. Alan: ' + words4.length + ')', 'success');
        } else {
            throw new Error(data.error || 'Bilinmeyen hata');
        }
    } catch (error) {
        console.error('⚠️ Vercel Blob Storage kaydetme hatası, localStorage\'a kaydediliyor:', error);
        
        // Hata durumunda localStorage'a kaydet (fallback)
        try {
            localStorage.setItem('seoKeywords1', JSON.stringify(words1));
            localStorage.setItem('seoKeywords2', JSON.stringify(words2));
            localStorage.setItem('seoKeywords3', JSON.stringify(words3));
            localStorage.setItem('seoKeywords4', JSON.stringify(words4));
            
            showAutoBlogMessage('⚠️ Kelimeler localStorage\'a kaydedildi (Vercel Blob Storage hatası). Lütfen tekrar deneyin.', 'error');
        } catch (localError) {
            console.error('localStorage kaydetme hatası:', localError);
            showAutoBlogMessage('❌ Kelimeler kaydedilirken bir hata oluştu: ' + error.message, 'error');
        }
    }
}

// Rastgele seçim fonksiyonu
function getRandomElements(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// SEO blog yazısı oluştur
function generateSEOBlogPost() {
    const words1 = JSON.parse(localStorage.getItem('seoKeywords1') || '[]');
    const words2 = JSON.parse(localStorage.getItem('seoKeywords2') || '[]');
    const words3 = JSON.parse(localStorage.getItem('seoKeywords3') || '[]');
    const words4 = JSON.parse(localStorage.getItem('seoKeywords4') || '[]');
    
    if (words1.length < 4 || words2.length < 3 || words3.length < 7) {
        return null;
    }
    
    // Blog yazısı sayısını kontrol et (her 4'te bir 4. alandan kelime)
    const blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const useCategory4 = (blogPosts.length + 1) % 4 === 0;
    
    // Kelimeleri seç (1. alan: 4 kelime, 2. alan: 3-4 kelime, 3. alan: 7 kelime)
    const selected1 = getRandomElements(words1, 4);
    const selected2 = getRandomElements(words2, Math.min(4, words2.length)); // 3-4 kelime
    const selected3 = getRandomElements(words3, 7);
    const selected4 = useCategory4 && words4.length >= 2 ? getRandomElements(words4, 2) : [];
    
    // Blog yazısı içeriği oluştur (14 satırı geçmeyecek)
    const content = generateBlogContent(selected1, selected2, selected3, selected4);
    
    // Başlık oluştur
    const title = generateBlogTitle(selected1, selected2);
    
    return {
        title: title,
        content: content,
        date: new Date().toISOString()
    };
}

// Blog başlığı oluştur
function generateBlogTitle(words1, words2) {
    const titleTemplates = [
        `${words1[0]} : Notre Expertise ${words2[0]}`,
        `${words1[1]} à ${words2[1]} : Guide Complet`,
        `${words1[2]} ${words2[2]} : Solutions Professionnelles`,
        `Expert ${words1[3]} dans le Nord`,
        `${words1[0]} et ${words1[1]} : Nos Services`
    ];
    
    return titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
}

// Blog içeriği oluştur (14 satırı geçmeyecek - kesin limit)
function generateBlogContent(words1, words2, words3, words4) {
    // Paragrafları oluştur (max 6 paragraf = 6 satır + 5 boş satır = 11 satır)
    const paragraphs = [];
    
    // Paragraf 1
    paragraphs.push(`Besoin d'un expert ${words1[0]} à ${words2[0]} ? Notre ${words3[0]} d'${words3[1]} vous accompagne.`);
    
    // Paragraf 2
    paragraphs.push(`Que vous soyez à ${words2[1]} ou ${words2[2]}, notre ${words3[2]} en ${words1[1]} est à votre service.`);
    
    // Paragraf 3
    paragraphs.push(`Pour la ${words1[2]} ou la ${words1[3]}, nous garantissons un travail de ${words3[3]}.`);
    
    // Paragraf 4
    paragraphs.push(`Notre équipe ${words3[4]} vous propose des solutions adaptées à vos besoins.`);
    
    // Paragraf 5
    paragraphs.push(`De la pose traditionnelle à la rénovation moderne, nous sublimons vos intérieurs.`);
    
    // Paragraf 6 (4. kategoriden kelime varsa ekle, yoksa standart)
    if (words4.length >= 2) {
        paragraphs.push(`Découvrez nos ${words4[0]} et nos ${words4[1]} sur mesure.`);
    } else {
        paragraphs.push(`Avec notre savoir-faire d'${words3[5]} et notre expérience, nous sommes votre partenaire ${words3[6]}.`);
    }
    
    // CTA paragrafı (7. paragraf - toplamda 7 + 6 boş = 13 satır, 14'ü geçmez)
    paragraphs.push('Contactez-nous pour un devis gratuit et personnalisé.');
    
    // Paragrafları birleştir (boş satır ile)
    const content = paragraphs.join('\n\n');
    
    // Satır sayısını kontrol et (kesin limit: 14 satır)
    const lineCount = content.split('\n').length;
    
    if (lineCount > 14) {
        console.warn('⚠️ UYARI: İçerik 14 satırı geçiyor! Son paragrafları kaldırılıyor...');
        // Son paragrafı kaldır, CTA'yı koru
        return paragraphs.slice(0, paragraphs.length - 2).join('\n\n') + '\n\n' + paragraphs[paragraphs.length - 1];
    }
    
    console.log('✅ Blog içeriği oluşturuldu:', lineCount, 'satır (limit: 14)');
    
    return content;
}

// Otomatik blog ayarlarını yükle
function loadAutoBlogSettings() {
    // Eğer ayar yoksa, varsayılan olarak etkin yap
    let enabled = localStorage.getItem('autoBlogEnabled');
    if (enabled === null || enabled === '') {
        enabled = 'true'; // Varsayılan olarak etkin
        localStorage.setItem('autoBlogEnabled', 'true');
    }
    
    const checkbox = document.getElementById('auto-blog-enabled');
    if (checkbox) {
        checkbox.checked = enabled === 'true';
    }
}

// Otomatik blog ayarlarını kaydet
function saveAutoBlogSettings() {
    const checkbox = document.getElementById('auto-blog-enabled');
    if (checkbox) {
        localStorage.setItem('autoBlogEnabled', checkbox.checked ? 'true' : 'false');
        showAutoBlogMessage(checkbox.checked ? '✅ Otomatik blog üretimi etkinleştirildi!' : '⏸️ Otomatik blog üretimi durduruldu.', 'success');
        checkAutoBlogSchedule();
    }
}

// Otomatik blog zamanlamasını kontrol et (global fonksiyonu kullan)
function checkAutoBlogSchedule() {
    // Eğer global fonksiyon varsa onu kullan, yoksa yerel versiyonu kullan
    if (typeof checkAutoBlogScheduleGlobal === 'function') {
        checkAutoBlogScheduleGlobal();
        
        // Admin paneli UI'ını güncelle
        const lastDate = localStorage.getItem('lastAutoBlogDate');
        const lastDateSpan = document.getElementById('last-blog-date');
        const nextDateSpan = document.getElementById('next-blog-date');
        
        if (lastDateSpan) {
            lastDateSpan.textContent = lastDate ? formatDate(lastDate) : 'Henüz üretilmemiş';
        }
        
        if (nextDateSpan && lastDate) {
            const nextDate = new Date(lastDate);
            nextDate.setDate(nextDate.getDate() + 10);
            nextDateSpan.textContent = formatDate(nextDate.toISOString());
        }
    } else {
        // Fallback: Yerel versiyon (eski kod)
        console.log('⚠️ Global fonksiyon bulunamadı, yerel versiyon kullanılıyor');
        checkAutoBlogScheduleLocal();
    }
}

// Yerel versiyon (fallback)
function checkAutoBlogScheduleLocal() {
    console.log('🔍 checkAutoBlogScheduleLocal çağrıldı');
    
    let enabledValue = localStorage.getItem('autoBlogEnabled');
    if (enabledValue === null || enabledValue === '') {
        enabledValue = 'true';
        localStorage.setItem('autoBlogEnabled', 'true');
    }
    
    const enabled = enabledValue === 'true';
    
    if (!enabled) {
        console.log('⏸️ Otomatik blog üretimi devre dışı');
        updateAutoBlogStatus(null, null);
        return;
    }
    
    const lastDate = localStorage.getItem('lastAutoBlogDate');
    const now = new Date();
    
    if (!lastDate) {
        const words1 = JSON.parse(localStorage.getItem('seoKeywords1') || '[]');
        if (words1.length >= 4 && typeof generateBlogPostNow === 'function') {
            console.log('🚀 İlk blog yazısı oluşturuluyor...');
            setTimeout(() => generateBlogPostNow(true), 1000);
        }
        return;
    }
    
    const last = new Date(lastDate);
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    
    const lastDateSpan = document.getElementById('last-blog-date');
    const nextDateSpan = document.getElementById('next-blog-date');
    
    if (lastDateSpan) {
        lastDateSpan.textContent = lastDate ? formatDate(lastDate) : 'Henüz üretilmemiş';
    }
    
    if (nextDateSpan && lastDate) {
        const nextDate = new Date(last);
        nextDate.setDate(nextDate.getDate() + 10);
        nextDateSpan.textContent = formatDate(nextDate.toISOString());
        
        if (diffDays >= 10 && typeof generateBlogPostNow === 'function') {
            console.log('✅ 10 gün geçti! Yeni blog yazısı oluşturuluyor...');
            setTimeout(() => generateBlogPostNow(true), 1000);
        }
    }
}

// Otomatik blog durumunu güncelle
function updateAutoBlogStatus(lastDate, nextDate) {
    const lastDateSpan = document.getElementById('last-blog-date');
    const nextDateSpan = document.getElementById('next-blog-date');
    
    if (lastDateSpan) {
        lastDateSpan.textContent = lastDate ? formatDate(lastDate) : 'Henüz üretilmemiş';
    }
    
    if (nextDateSpan) {
        nextDateSpan.textContent = nextDate ? formatDate(nextDate) : '-';
    }
}

// Şimdi blog yazısı oluştur (global fonksiyonu kullan)
function generateBlogPostNow(isAuto = false) {
    // Eğer global fonksiyon varsa onu kullan
    if (typeof generateBlogPostNowGlobal === 'function') {
        const result = generateBlogPostNowGlobal(isAuto);
        
        // Admin paneli özel işlemler
        if (typeof loadBlogPosts === 'function') {
            loadBlogPosts();
        }
        
        if (typeof updateAutoBlogStatus === 'function') {
            const lastDate = localStorage.getItem('lastAutoBlogDate');
            if (lastDate) {
                const nextDate = new Date(lastDate);
                nextDate.setDate(nextDate.getDate() + 10);
                updateAutoBlogStatus(lastDate, nextDate.toISOString());
            }
        }
        
        if (typeof showAutoBlogMessage === 'function' && result) {
            const blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
            const lastPost = blogPosts[blogPosts.length - 1];
            if (lastPost) {
                showAutoBlogMessage(isAuto ? 
                    `✅ Otomatik blog yazısı oluşturuldu: "${lastPost.title}"` : 
                    `✅ Blog yazısı başarıyla oluşturuldu: "${lastPost.title}"`, 'success');
            }
        }
        
        return result;
    } else {
        // Fallback: Yerel versiyon (eski kod)
        console.log('⚠️ Global fonksiyon bulunamadı, yerel versiyon kullanılıyor');
        return generateBlogPostNowLocal(isAuto);
    }
}

// Yerel versiyon (fallback)
function generateBlogPostNowLocal(isAuto = false) {
    const blogPost = generateSEOBlogPost();
    
    if (!blogPost) {
        if (typeof showAutoBlogMessage === 'function') {
            showAutoBlogMessage('❌ Blog yazısı oluşturulamadı! Önce kelimeleri kaydedin.', 'error');
        }
        return false;
    }
    
    const blogPostObj = {
        id: Date.now().toString(),
        title: blogPost.title,
        content: blogPost.content,
        date: blogPost.date
    };
    
    const blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    blogPosts.push(blogPostObj);
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    localStorage.setItem('lastAutoBlogDate', blogPost.date);
    
    if (typeof loadBlogPosts === 'function') {
        loadBlogPosts();
    }
    
    if (typeof updateAutoBlogStatus === 'function') {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 10);
        updateAutoBlogStatus(blogPost.date, nextDate.toISOString());
    }
    
    if (typeof showAutoBlogMessage === 'function') {
        showAutoBlogMessage(isAuto ? 
            `✅ Otomatik blog yazısı oluşturuldu: "${blogPost.title}"` : 
            `✅ Blog yazısı başarıyla oluşturuldu: "${blogPost.title}"`, 'success');
    }
    
    return true;
}

// Test: Blog oluşturma önizlemesi
function testBlogGeneration() {
    const blogPost = generateSEOBlogPost();
    const previewDiv = document.getElementById('test-preview');
    const previewContent = document.getElementById('test-preview-content');
    
    if (!blogPost) {
        showAutoBlogMessage('❌ Test blog yazısı oluşturulamadı! Önce kelimeleri kaydedin.', 'error');
        return;
    }
    
    if (previewDiv && previewContent) {
        const lineCount = blogPost.content.split('\n').length;
        previewContent.innerHTML = `
            <p><strong>Başlık:</strong> ${escapeHtml(blogPost.title)}</p>
            <p><strong>Satır Sayısı:</strong> ${lineCount} satır</p>
            <p><strong>İçerik:</strong></p>
            <pre style="background: white; padding: 10px; border-radius: 4px; white-space: pre-wrap;">${escapeHtml(blogPost.content)}</pre>
        `;
        previewDiv.style.display = 'block';
    }
}

// Otomatik blog mesajı göster
function showAutoBlogMessage(text, type) {
    console.log('showAutoBlogMessage çağrıldı:', text, type);
    const messageDiv = document.getElementById('auto-blog-message');
    
    if (!messageDiv) {
        console.error('auto-blog-message elementi bulunamadı!');
        // Fallback: alert göster
        alert(text);
        return;
    }
    
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    messageDiv.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    messageDiv.style.color = type === 'success' ? '#155724' : '#721c24';
    messageDiv.style.padding = '12px';
    messageDiv.style.borderRadius = '4px';
    messageDiv.style.marginTop = '10px';
    messageDiv.style.border = type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
    
    if (type === 'success') {
        setTimeout(() => {
            if (messageDiv) {
                messageDiv.style.display = 'none';
            }
        }, 5000);
    }
}

