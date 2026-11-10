# NOMU Seeder & Database Backup

**Timestamp**: 2026-11-10  
**Concierge WhatsApp**: `+91 93452 14712` (`919345214712`)  
**Master Brand Logo**: `/img/nomu/nomu_symbol_master.png`  

---

## Contents of this Backup Archive

1. **`seed.php`**: CLI executable seeder runner.
   - Run default seed: `php seed.php`
   - Run force update: `php seed.php --force`
   - Check database status: `php seed.php --status`

2. **`database/seeders/DatabaseSeeder.php`**: Canonical seeder class.
   - Handles SQLite and MySQL drivers seamlessly.
   - Seeds 16 default CMS content entries with updated contact information (+91 93452 14712) and master brand symbol.
   - Seeds 16 media asset vault entries.
   - Seeds authentic community reviews with verified approval status.

3. **`database/migrations/`**: All database migration files defining the schema for:
   - `cms_contents`
   - `media_assets`
   - `reviews`
   - `orders`

4. **`public/nomu_database.sqlite`**: Pre-seeded SQLite database ready for direct deployment.

5. **`public/img/nomu/`**:
   - `nomu_symbol_master.png` (Official master brand symbol)
   - `nomu_wordmark_transparent.png` (Architectural wordmark)

---

## How to Restore

### 1. In Local PHP Development
```bash
cp -r database/ ../
cp seed.php ../
cp public/nomu_database.sqlite ../public/
cp -r public/img/nomu/* ../public/img/nomu/
php ../seed.php --status
```

### 2. In Production (Hostinger / Apache / Nginx)
Upload `nomu_database.sqlite` directly to the `api/` directory on Hostinger, or run:
```bash
php seed.php --force
```
