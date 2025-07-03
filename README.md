# İnteraktif Harita Çizim Uygulaması

Bu proje, Leaflet.js tabanlı interaktif bir harita uygulamasıdır. Kullanıcılar harita üzerinde noktalar ekleyebilir, rotalar çizebilir ve çizimlerini kaydedebilir.



<img src="src/assets/app.png" alt="Uygulama Ekran Görüntüsü" width="600">

## Özellikler

- **İnteraktif Harita**: CartoDB Light, OpenStreetMap, CartoDB Dark ve Satellite katmanları
- **Nokta Ekleme**: Farklı renklerde nokta işaretleyicileri
- **Rota Çizimi**: Özelleştirilebilir çizgi stilleri (düz, kesikli, noktalı)
- **Renk Seçimi**: Hex renk seçici ile özel renkler
- **Çizgi Kalınlığı**: 2-10px arası ayarlanabilir kalınlık
- **Geri Alma**: Son işlemleri geri alma özelliği
- **Kaydetme/Yükleme**: Çizimleri localStorage ve JSON dosyası olarak kaydetme
- **Klavye Kısayolları**: Hızlı erişim için klavye desteği


## Kullanım

### Temel İşlemler

1. **Nokta Ekleme**: "Point Ekle" butonuna tıklayın veya Ctrl+P tuşlarını kullanın
2. **Rota Çizimi**: "Rota Çiz" butonuna tıklayın veya Ctrl+R tuşlarını kullanın
3. **Renk Değiştirme**: Renk seçiciyi kullanarak çizim rengini değiştirin
4. **Stil Seçimi**: Açılır menüden çizgi stilini seçin (düz, kesikli, noktalı)
5. **Kalınlık Ayarı**: Kaydırıcı ile çizgi kalınlığını 2-10px arası ayarlayın

### Klavye Kısayolları

- `Ctrl+P`: Nokta ekleme modu
- `Ctrl+R`: Rota çizme modu
- `Ctrl+Z`: Geri alma
- `Ctrl+S`: Çizimleri kaydetme
- `Enter`: Mevcut rotayı bitirme
- `Esc`: Aktif modu kapatma

### Kontrol Paneli

Harita sol tarafında bulunan kontrol paneli aşağıdaki seçenekleri sunar:

- **Renk Seçici**: Çizim rengi belirleme
- **Çizgi Stili**: Düz, kesikli veya noktalı çizgi seçimi
- **Çizgi Kalınlığı**: 2-10px arası kalınlık ayarı
- **Mod Butonları**: Point ekleme ve rota çizme modları
- **İşlem Butonları**: Geri alma, temizleme ve kaydetme

## Teknik Detaylar

### Bağımlılıklar

- [Leaflet.js 1.9.4](https://leafletjs.com/) - Harita kütüphanesi
- [Leaflet.draw 1.0.4](https://github.com/Leaflet/Leaflet.draw) - Çizim araçları



## Katkıda Bulunma

Bu proje açık kaynak kodludur. katkıda bulunabilirsiniz. 

## Lisans

Bu proje eğitim amaçlı geliştirilmiştir ve açık kaynak kullanım için uygundur.
