const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 8000;

// CORS ve JSON desteği
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Images klasörünü statik olarak serve et
app.use('/images', express.static('images'));

// Images klasörünü oluştur (yoksa)
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Multer yapılandırması - resimleri images klasörüne kaydet
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        // Orijinal dosya adını koru, eğer çakışma varsa timestamp ekle
        const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const timestamp = Date.now();
        const ext = path.extname(originalName);
        const name = path.basename(originalName, ext);
        cb(null, `${name}_${timestamp}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        // Sadece resim dosyalarına izin ver
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Sadece resim dosyaları yüklenebilir!'));
        }
    }
});

// Tüm yüklenen resimleri listele
app.get('/api/images', (req, res) => {
    try {
        const files = fs.readdirSync(imagesDir)
            .filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
            })
            .map(file => ({
                filename: file,
                url: `/images/${file}`
            }));
        
        res.json({ success: true, images: files });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Resim yükle (çoklu)
app.post('/api/upload', upload.array('images', 20), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, error: 'Resim seçilmedi!' });
        }

        const uploadedFiles = req.files.map(file => ({
            filename: file.filename,
            url: `/images/${file.filename}`
        }));

        res.json({
            success: true,
            message: `${uploadedFiles.length} resim başarıyla yüklendi!`,
            images: uploadedFiles
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Resim sil
app.delete('/api/images/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(imagesDir, filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ success: true, message: 'Resim silindi!' });
        } else {
            res.status(404).json({ success: false, error: 'Resim bulunamadı!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
    console.log(`📁 Resimler kaydediliyor: ${imagesDir}`);
});



