# Vercel Blob Storage Kurulumu

Vercel Blob Storage'ı kullanmak için aşağıdaki adımları takip edin:

## 1. Vercel Dashboard'da Blob Storage'ı Etkinleştirin

1. Vercel Dashboard'a gidin
2. Projenize gidin
3. **Storage** sekmesine tıklayın
4. **Create Database** veya **Blob Storage** seçeneğini seçin
5. Blob Storage'ı oluşturun

## 2. Environment Variable Ekleyin

Vercel Dashboard'da:
1. **Settings** → **Environment Variables** sekmesine gidin
2. Aşağıdaki environment variable'ı ekleyin:
   - **Name:** `BLOB_READ_WRITE_TOKEN`
   - **Value:** Vercel Blob Storage'ın otomatik oluşturduğu token (Storage sayfasından alabilirsiniz)

**Not:** Vercel Blob Storage kullanıyorsanız, token genellikle otomatik olarak sağlanır. Ama manuel olarak da ekleyebilirsiniz.

## 3. Deployment

Deployment otomatik olarak başlatılacak. API route'ları şu endpoint'lerde çalışacak:

- `POST /api/upload` - Resim yükleme
- `GET /api/images` - Resim listesi
- `DELETE /api/images/[filename]` - Resim silme

## 4. Test

Admin panelinden resim yükleyerek test edin. Resimler artık Vercel Blob Storage'da saklanacak ve kalıcı olacak!

