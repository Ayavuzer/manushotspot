# Hotspot Uygulaması Mimari Tasarımı

## Genel Mimari Yapı

Bu belge, web tabanlı hotspot uygulamasının mimari tasarımını detaylandırmaktadır. Uygulama, React tabanlı bir yönetim paneli ve Node.js tabanlı bir backend API'den oluşmaktadır.

```
+-------------------+        +-------------------+        +-------------------+
|                   |        |                   |        |                   |
|  React Frontend   |<------>|   Node.js API    |<------>|   PostgreSQL DB   |
|  (Yönetim Paneli) |        |    (Backend)     |        |                   |
|                   |        |                   |        |                   |
+-------------------+        +-------------------+        +-------------------+
                                      ^
                                      |
                                      v
                             +-------------------+
                             |                   |
                             |      Redis        |
                             |   (Önbellek)      |
                             |                   |
                             +-------------------+
                                      ^
                                      |
                                      v
                             +-------------------+
                             |                   |
                             |    RabbitMQ       |
                             |    (Kuyruk)       |
                             |                   |
                             +-------------------+
                                      ^
                                      |
                                      v
                             +-------------------+
                             |                   |
                             |    Firewall       |
                             |  Entegrasyonları  |
                             |                   |
                             +-------------------+
```

## Backend Mimarisi (Node.js)

Backend, modüler bir yapıda tasarlanmıştır ve aşağıdaki ana bileşenlerden oluşmaktadır:

### 1. API Katmanı
- Express.js tabanlı RESTful API
- JWT tabanlı kimlik doğrulama
- Rol tabanlı yetkilendirme
- API rate limiting ve güvenlik önlemleri
- OpenAPI/Swagger dokümantasyonu

### 2. Servis Katmanı
- AuthService: Kimlik doğrulama ve yetkilendirme işlemleri
- UserService: Kullanıcı yönetimi
- OrganizationService: Organizasyon yönetimi
- FirewallService: Firewall entegrasyonları
- LoggingService: 5651 loglama
- GuestService: Misafir yönetimi
- SessionService: Oturum yönetimi
- ReportingService: Raporlama
- NotificationService: Bildirim yönetimi
- IntegrationService: PMS ve diğer entegrasyonlar

### 3. Veri Erişim Katmanı
- Sequelize ORM kullanımı
- Repository pattern uygulaması
- Transaction yönetimi
- Veritabanı bağlantı havuzu

### 4. Altyapı Katmanı
- Redis önbellek yönetimi
- RabbitMQ mesaj kuyruğu entegrasyonu
- Loglama altyapısı (Winston)
- Hata yönetimi
- Yapılandırma yönetimi

## Frontend Mimarisi (React)

Frontend, modern React uygulaması olarak tasarlanmıştır:

### 1. Uygulama Yapısı
- Create React App veya Next.js tabanlı
- TypeScript kullanımı
- Redux veya Context API ile durum yönetimi
- React Router ile sayfa yönlendirme

### 2. Bileşen Mimarisi
- Atomic Design prensipleri
- Yeniden kullanılabilir UI bileşenleri
- Responsive tasarım
- Tema desteği

### 3. Ana Modüller
- Dashboard: Genel bakış ve özet bilgiler
- User Management: Kullanıcı ve rol yönetimi
- Organization Management: Organizasyon yönetimi
- Firewall Management: Firewall entegrasyonları
- Guest Management: Misafir yönetimi
- Session Management: Oturum yönetimi
- Reports: Raporlar ve analizler
- Logs: 5651 logları ve sistem logları
- Settings: Sistem ayarları

## Kimlik Doğrulama ve Yetkilendirme

### Kimlik Doğrulama Yöntemleri
- JWT tabanlı token sistemi
- Refresh token desteği
- Otel PMS entegrasyonu
- SMS doğrulama
- Sosyal medya girişi (Facebook, Google, Twitter, Apple)

### Yetkilendirme Sistemi
- Rol tabanlı erişim kontrolü (RBAC)
- İzin tabanlı yetkilendirme
- Organizasyon bazlı veri izolasyonu
- Süper admin yetkileri

## Firewall Entegrasyonları

Aşağıdaki firewall sistemleri için entegrasyon modülleri:

- Sophos: REST API entegrasyonu
- Fortinet: FortiOS API entegrasyonu
- Cisco: Cisco ASA/Firepower API entegrasyonu
- Mikrotik: RouterOS API entegrasyonu

Her entegrasyon modülü şunları içerecektir:
- Bağlantı yönetimi
- Kimlik doğrulama
- Hotspot kuralları yönetimi
- Bant genişliği kontrolü
- Kullanıcı yönetimi
- Log toplama

## 5651 Loglama Sistemi

Türkiye 5651 yasası gereksinimlerini karşılayan loglama sistemi:

- IP ve MAC adresi kayıtları
- Zaman damgalı log kayıtları
- Erişim logları
- Oturum başlangıç/bitiş kayıtları
- Log bütünlüğü ve değişmezliği
- Log arşivleme ve saklama
- Log arama ve filtreleme

## Veri Depolama Stratejisi

### PostgreSQL
- Ana veritabanı olarak kullanılacak
- Tüm yapısal veriler burada saklanacak
- Veritabanı şeması migration sistemi ile yönetilecek

### Redis
- Oturum önbelleği
- API yanıt önbelleği
- Rate limiting
- Geçici veri depolama

### RabbitMQ
- Asenkron işlemler için mesaj kuyruğu
- Firewall komut kuyruğu
- Bildirim kuyruğu
- Log işleme kuyruğu
- Rapor oluşturma kuyruğu

## API Endpoint Yapısı

RESTful API tasarımı aşağıdaki ana endpoint gruplarını içerecektir:

```
/api/v1/auth - Kimlik doğrulama işlemleri
/api/v1/users - Kullanıcı yönetimi
/api/v1/organizations - Organizasyon yönetimi
/api/v1/roles - Rol yönetimi
/api/v1/permissions - İzin yönetimi
/api/v1/firewalls - Firewall yönetimi
/api/v1/guests - Misafir yönetimi
/api/v1/sessions - Oturum yönetimi
/api/v1/logs - Log yönetimi
/api/v1/reports - Rapor yönetimi
/api/v1/settings - Ayar yönetimi
/api/v1/integrations - Entegrasyon yönetimi
/api/v1/notifications - Bildirim yönetimi
```

## Güvenlik Önlemleri

- HTTPS zorunluluğu
- JWT token güvenliği
- API rate limiting
- CORS yapılandırması
- SQL injection koruması
- XSS koruması
- CSRF koruması
- Hassas verilerin şifrelenmesi
- Güvenli şifre politikaları
- Brute force koruması
- IP kısıtlamaları

## Ölçeklenebilirlik

- Yatay ölçeklenebilir API tasarımı
- Durumsuz (stateless) servisler
- Önbellek stratejisi
- Veritabanı indeksleme ve optimizasyon
- Asenkron işlem kuyruğu
- Mikroservis mimarisine geçiş hazırlığı

## Dağıtım Stratejisi

- Docker konteyner desteği
- Docker Compose ile geliştirme ortamı
- CI/CD pipeline entegrasyonu
- Ortam bazlı yapılandırma
- Sürüm yönetimi
- Otomatik yedekleme
- Felaket kurtarma planı
