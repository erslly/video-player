# Gelişmiş Video Oynatıcı

Next.js ve React ile oluşturulmuş modern, özellik açısından zengin bir video oynatıcı. Bu oynatıcı, gelişmiş kontrollerle duyarlı tasarım, mobil dokunmatik desteği ve şık bir kullanıcı arayüzü sunar.

## ✨ Özellikler

- **Duyarlı Tasarım**: Masaüstü ve mobil cihazlarda sorunsuz çalışır
- **Özel Kontroller**: Oynat/duraklat, ses, tam ekran ve daha fazlası
- **Gelişmiş Özellikler**:
  - Oynatma hızı kontrolü (0.25x - 2x)
  - Video kalitesi seçimi
  - Resim içinde resim modu
  - Tiyatro modu
- **Mobil Optimizasyonu**:
  - İleri/geri sarmak ve ses kontrolü için dokunmatik hareketler
  - İleri/geri atlamak için çift dokunma
  - İleri/geri sarmak ve ses için kaydırma kontrolleri
  - Optimize edilmiş mobil kullanıcı arayüzü
- **Klavye Kısayolları**: Masaüstü kullanıcıları için kullanışlı klavye kontrolleri
- **Erişilebilirlik**: Erişilebilirlik göz önünde bulundurularak oluşturulmuştur

## 🚀 Başlarken

### Gereksinimler

- Node.js 16.8 veya daha yeni
- npm veya yarn

### Kurulum

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/erslly/video-player.git
   cd video-player
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   # veya
   yarn install
   ```

3. Geliştirme sunucusunu çalıştırın:
   ```bash
   npm run dev
   # veya
   yarn dev
   ```

4. Sonucu görmek için tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📖 Kullanım

### Temel Uygulama

```jsx
import VideoPlayer from "../components/video-player";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <VideoPlayer
        src="https://example.com/video.mp4"
        poster="/thumbnail.jpg"
        title="Developed By erslly"
      />
    </div>
  );
}
```

### Özellikler (Props)

| Özellik | Tür | Açıklama |
|---------|-----|----------|
| `src` | string | Video dosyasının URL'si (gerekli) |
| `poster` | string | Küçük resim görüntüsünün URL'si (isteğe bağlı) |
| `title` | string | Videonun başlığı (isteğe bağlı) |

## 📱 Mobil Özellikler

Video oynatıcı, çeşitli mobil özellikleri içerir:

- **Kaydırma Hareketleri**: Video içinde ilerlemek için yatay, ses seviyesini ayarlamak için dikey kaydırma
- **Çift Dokunma**: Geri/ileri atlamak için ekranın sol/sağ tarafına çift dokunma
- **Tam Ekran Yönlendirmesi**: Tam ekranda otomatik olarak yatay moda geçer (desteklenen cihazlarda)

## 🛠️ Kullanılan Teknolojiler

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - Kullanıcı arayüzleri oluşturmak için JavaScript kütüphanesi
- [TypeScript](https://www.typescriptlang.org/) - Tipli JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide React](https://lucide.dev/) - Güzel ve tutarlı simge araç seti
- [shadcn/ui](https://ui.shadcn.com/) - Radix UI ve Tailwind CSS ile oluşturulmuş yeniden kullanılabilir bileşenler

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen bir Pull Request göndermekten çekinmeyin.

1. Projeyi fork edin
2. Özellik dalınızı oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Harika bir özellik ekle'`)
4. Dalınıza push edin (`git push origin feature/amazing-feature`)
5. Bir Pull Request açın

## 🙏 Teşekkürler

- [HTML5 Video API](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement)
- [Next.js Dokümantasyonu](https://nextjs.org/docs)
- [Tailwind CSS Dokümantasyonu](https://tailwindcss.com/docs)

---

[erslly](https://github.com/erslly) tarafından ❤️ ile yapılmıştır
