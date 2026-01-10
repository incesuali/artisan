// Admin sayfası JavaScript

// Seçilen resimleri sakla (henüz yüklenmedi)
let selectedFiles = [];

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // Mevcut değerleri yükle
    loadCurrentValues();
    loadGalleryImages();
    loadBlogPosts();
    
    // Kaydet butonları
    const saveBtn = document.getElementById('save-btn');
    const saveEmailBtn = document.getElementById('save-email-btn');
    const saveImagesBtn = document.getElementById('save-images-btn');
    const cancelSelectionBtn = document.getElementById('cancel-selection-btn');
    const addBlogBtn = document.getElementById('add-blog-btn');
    
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
    
    // Resim yükleme
    setupImageUpload();
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

// Blog yazılarını yükle ve göster
function loadBlogPosts() {
    const blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const container = document.getElementById('blog-posts-list');
    
    if (!container) return;
    
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

// Blog yazısı ekle
function addBlogPost() {
    const titleInput = document.getElementById('blog-title');
    const contentInput = document.getElementById('blog-content');
    const messageDiv = document.getElementById('blog-message');
    
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
    
    // LocalStorage'a kaydet
    const blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    blogPosts.push(blogPost);
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    
    // Formu temizle
    titleInput.value = '';
    contentInput.value = '';
    
    // Listeyi yenile
    loadBlogPosts();
    
    showBlogMessage('✅ Blog yazısı başarıyla eklendi!', 'success');
    
    // Forma scroll et (yeni eklenen yazıyı görmek için)
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

