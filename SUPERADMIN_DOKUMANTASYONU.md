# Superadmin ve Yetkilendirme Sistemi Dokümantasyonu

## Genel Bakış
Bu dokümantasyon, ManusHotspot projesine eklenen superadmin kullanıcısı ve yetkilendirme sistemi hakkında bilgi vermektedir. Sistem, farklı kullanıcı rollerini (Superadmin, Organization Admin, User) ve bu rollere ait izinleri yönetmek için tasarlanmıştır.

## Superadmin Kullanıcısı
Superadmin kullanıcısı, sistemdeki tüm kullanıcıları, organizasyonları, firewall cihazlarını ve logları yönetebilme yetkisine sahiptir.

**Superadmin Bilgileri:**
- Kullanıcı adı: ali@mrtbt.com
- Şifre: 123654Aa

## Kullanıcı Rolleri ve İzinleri

### Roller
Sistem üç temel rol içermektedir:

1. **Super Admin**
   - Tüm sistem erişimine sahiptir
   - Tüm organizasyonları ve kullanıcıları yönetebilir
   - Kullanıcıları organizasyonlara atayabilir

2. **Organization Admin**
   - Kendi organizasyonundaki kullanıcıları yönetebilir
   - Kendi organizasyonuna ait firewall cihazlarını yönetebilir
   - Kendi organizasyonuna ait logları görüntüleyebilir ve dışa aktarabilir

3. **User**
   - Sınırlı erişime sahiptir
   - Firewall cihazlarını görüntüleyebilir
   - Logları görüntüleyebilir

### İzinler
Sistem aşağıdaki izinleri içermektedir:

#### Kullanıcı Yönetimi İzinleri
- user_view: Kullanıcıları görüntüleme
- user_create: Kullanıcı oluşturma
- user_edit: Kullanıcı düzenleme
- user_delete: Kullanıcı silme

#### Organizasyon Yönetimi İzinleri
- organization_view: Organizasyonları görüntüleme
- organization_create: Organizasyon oluşturma
- organization_edit: Organizasyon düzenleme
- organization_delete: Organizasyon silme

#### Firewall Yönetimi İzinleri
- firewall_view: Firewall cihazlarını görüntüleme
- firewall_create: Firewall cihazı oluşturma
- firewall_edit: Firewall cihazı düzenleme
- firewall_delete: Firewall cihazı silme

#### Log Yönetimi İzinleri
- log_view: Logları görüntüleme
- log_export: Logları dışa aktarma

#### Kullanıcı-Organizasyon Atama İzinleri
- assign_user_to_organization: Kullanıcıları organizasyonlara atama

## Veritabanı Değişiklikleri

### Yeni Modeller
- **FirewallLog**: Firewall loglarını saklamak için oluşturulmuştur

### Yeni İlişkiler
- Organization - FirewallLog: Bir organizasyonun birden çok firewall logu olabilir
- FirewallConfig - FirewallLog: Bir firewall cihazının birden çok logu olabilir

## API Endpoint'leri

### Superadmin Kurulumu
- `POST /api/v1/admin/setup`: Superadmin kullanıcısını ve rol izinlerini oluşturur

### Kullanıcı-Organizasyon Yönetimi
- `POST /api/v1/user-organization/assign`: Bir kullanıcıyı bir organizasyona atar
- `GET /api/v1/user-organization/:organizationId/users`: Bir organizasyondaki tüm kullanıcıları getirir
- `DELETE /api/v1/user-organization/:userId/remove`: Bir kullanıcıyı organizasyondan çıkarır

### Firewall Yönetimi
- `GET /api/v1/firewall-configs`: Tüm firewall yapılandırmalarını getirir
- `GET /api/v1/firewall-configs/:id`: ID'ye göre firewall yapılandırmasını getirir
- `POST /api/v1/firewall-configs`: Yeni bir firewall yapılandırması oluşturur
- `PUT /api/v1/firewall-configs/:id`: Firewall yapılandırmasını günceller
- `DELETE /api/v1/firewall-configs/:id`: Firewall yapılandırmasını siler

### Log Yönetimi
- `GET /api/v1/firewall-logs`: Firewall loglarını getirir (filtreleme ve sayfalama ile)
- `GET /api/v1/firewall-logs/export`: Firewall loglarını JSON veya CSV formatında dışa aktarır
- `POST /api/v1/firewall-logs`: Yeni bir firewall log kaydı ekler

## Kurulum ve Test

Superadmin kullanıcısını ve rol izinlerini oluşturmak için:

1. API endpoint'i kullanarak:
   ```
   POST /api/v1/admin/setup
   ```

2. Test script'i kullanarak:
   ```
   node src/scripts/testSuperAdminSetup.js
   ```

## Güvenlik Önlemleri

- Tüm API endpoint'leri kimlik doğrulama ve yetkilendirme kontrolleri içermektedir
- Kullanıcılar yalnızca kendi organizasyonlarına ait verilere erişebilirler
- Hassas bilgiler (şifreler, API anahtarları) veritabanında şifrelenmiş olarak saklanmaktadır
- Superadmin yetkileri yalnızca yetkili kullanıcılara verilmelidir

## Sonuç

Bu implementasyon, ManusHotspot projesine kapsamlı bir kullanıcı yönetim sistemi eklemektedir. Superadmin kullanıcısı tüm sistemi yönetebilirken, organizasyon adminleri yalnızca kendi organizasyonlarına ait kaynakları yönetebilmektedir. Bu, güvenli ve ölçeklenebilir bir yönetim yapısı sağlamaktadır.
