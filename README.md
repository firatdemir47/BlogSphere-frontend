## BlogSphere Frontend

BlogSphere; blog yazıları, yorumlar, kategori keşfi ve yer imleri gibi özellikleri barındıran modern bir React arayüzüdür. Proje Vite ile başlatıldı, `react-router-dom` ile sayfalanıyor ve sade bir tasarım sistemi üzerine inşa edildi.

### Ekran Görüntüleri

![WhatsApp Image 2025-08-26 at 16 01 35 (1)](https://github.com/user-attachments/assets/0032ddaf-f9b7-4662-83aa-e4f652b9a014)


![WhatsApp Image 2025-08-26 at 16 01 07 (2)](https://github.com/user-attachments/assets/0a05606e-2648-46d2-877b-10804ecb546c)

![WhatsApp Image 2025-08-26 at 16 01 19 (1)](https://github.com/user-attachments/assets/d0146105-e96c-41c2-99e1-05f384df605b)


## Kurulum

```bash
git clone <repo-url>
cd BlogSphere-frontend-main
npm install
```

### Çalıştırma

```bash
npm run dev
```

### Üretim için derleme

```bash
npm run build
npm run preview
```

## Ortam Değişkenleri

API adresini yapılandırmak için bir `.env` dosyası oluşturabilirsiniz. Tanımlanmazsa varsayılan olarak `http://localhost:3000/api` kullanılır.

```bash
VITE_API_URL=https://api.ornek.com/api
```

Bu değer `src/config/api.js` dosyasında okunur ve aşağıdaki uç noktalara yayılır: `BLOGS`, `USERS`, `AUTH`, `CATEGORIES`, `COMMENTS`, `REACTIONS`, `BOOKMARKS`, `TAGS`, `NOTIFICATIONS`.

## Öne Çıkan Özellikler

- **Modern gezinme çubuğu**: Koyu tema, yaz/düzenle butonu, kullanıcı menüsü ve bildirim simgesi.
- **Kimlik doğrulama sayfaları**: Kayıt ve giriş formlarında anlık doğrulama, başarılı akışta yönlendirme ve mesaj gösterimi.
- **Kategori keşfi**: Kategoriler için ikon/renk eşlemesi ve temiz kart düzeni.
- **Yer imleri ve yorumlar**: Bileşenler ve stiller dahil edilmiştir; API bağlandığında hazır çalışır.
- **Duyarlı tasarım**: Mobil menü ve küçük ekran optimizasyonları.

## Komutlar

```bash
npm run dev       # Geliştirme sunucusu
npm run build     # Üretim derlemesi
npm run preview   # Yerel üretim önizlemesi
npm run lint      # ESLint kontrolü
```

## Dizinde Neler Var?

```text
/src
  ├─ component/        # Ortak bileşenler (Navigation, BlogList, vb.)
  ├─ routes/           # Sayfalar (Login, Register, Categories, Write, vb.)
  ├─ config/api.js     # API tabanı ve uç nokta sabitleri
  ├─ data/             # Statik veri/kategoriler
  ├─ App.jsx           # Ana uygulama
  └─ index.css         # Stil dosyaları
```

## Geliştirme Notları

- Kimlik doğrulama akışı `localStorage` üzerinde `token` ve `user` bilgilerini saklar. Çıkış işlemi bunları temizler.
- Router yönlendirmeleri `react-router-dom` ile yapılır; menü aktiflik durumu `useLocation` üzerinden takip edilir.
- Kategori ikon/renk eşlemesi `src/config/api.js` içinde `CATEGORY_CONFIG` ile tanımlıdır.

## API Entegrasyonu

Formlar, `API_ENDPOINTS` sabitleri üzerinden `fetch` ile istek gönderir. Akışın nasıl işlendiğini görmek için `src/routes/Login.jsx` ve `src/routes/Register.jsx` dosyalarına göz atabilirsiniz. Arayüzde e‑posta biçimi, şifre uzunluğu ve şifre tekrar kontrolü gibi doğrulamalar hazırdır.

## Katkıda Bulunma

Katkı sağlamak isterseniz kısa yol:

- Depoyu forklayın ve yeni bir dal (branch) açın.
- Değişikliklerinizi yapın ve `npm run lint` ile denetleyin.
- Açıklayıcı bir başlık ve özetle çekme isteği (pull request) gönderin.

## Lisans

Bu proje kişisel/öğrenim amaçlı bir örnektir. Farklı bir lisans gerekiyorsa depo sahibiyle iletişime geçebilirsiniz.
