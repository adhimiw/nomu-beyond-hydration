# NOMU Beverages — Defensive Security Architecture & Threat Model

Comprehensive technical review of modern web vulnerability vectors, threat modeling, and defensive controls implemented across the NOMU decoupled architecture.

---

## 1. Threat Landscape & Vulnerability Analysis

### 1.1 Server-Side Request Forgery (SSRF)
* **Risk Scenario**: In modern CMS applications where administrators can update media URLs (hero videos, harvest photos, bottle packshots), an attacker with access or an intercepted request could attempt to supply internal URIs such as `http://169.254.169.254/latest/meta-data/`, `http://127.0.0.1:6379`, or `file:///etc/passwd` to probe local network services, Redis instances, or cloud metadata.
* **Defensive Controls**:
  - Direct server-side HTTP fetching of arbitrary URLs is avoided. Media is either selected from verified internal relative paths (`/img/...`, `/video/...`, `/uploads/...`) or uploaded directly via multi-part form.
  - Strict URI sanitization: External URLs are validated with regex ensuring only `https://` schemes pointing to approved image/video CDNs are allowed. All private IP spaces (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.0.0/16`, `::1`) and protocols (`file:`, `gopher:`, `dict:`, `data:`, `javascript:`) are explicitly blocked.

### 1.2 Unrestricted File Upload & Remote Code Execution (RCE)
* **Risk Scenario**: Attackers uploading malicious executable scripts (`shell.php`, `exploit.phtml`, double-extension `payload.php.png`, or files containing PHP code in EXIF metadata) into media directories to trigger execution via the web server.
* **Defensive Controls**:
  - **MIME Validation via Magic Bytes**: MIME types are determined by file content inspection (`finfo_file(FILEINFO_MIME_TYPE)`), rejecting client-supplied spoofed `Content-Type` headers.
  - **Strict Allowlist**: Only `image/jpeg`, `image/png`, `image/webp`, `video/mp4`, and `video/webm` are permitted. Executables, scripts, HTML, and SVGs with XML payloads are disallowed.
  - **Cryptographic Filename Hashing**: Uploaded files are stripped of original filenames and renamed to cryptographically random 128-bit hex tokens (`bin2hex(random_bytes(16)) . '.' . $safeExt`), defeating path traversal (`../../`) and null-byte injection (`%00`).
  - **Execution Barrier**: The upload directory contains an `.htaccess` rule enforcing `php_flag engine off` and removing script handlers. In Nginx, FastCGI processing is restricted to application endpoints only.

### 1.3 Cross-Site Scripting (XSS)
* **Risk Scenario**: Malicious scripts injected via review headlines, customer comments, CMS copy, or `javascript:` / `data:` URI schemes embedded in image `src` or video `src` tags.
* **Defensive Controls**:
  - Strict input sanitization via `strip_tags()` and context-aware entity encoding via `htmlspecialchars(..., ENT_QUOTES, 'UTF-8')`.
  - Content-Security-Policy (CSP) headers enforcing trusted script execution origins.
  - `X-Content-Type-Options: nosniff` preventing browsers from MIME-sniffing non-executable responses into executable scripts.

### 1.4 Clickjacking & Preview Framing
* **Risk Scenario**: Embedding the admin console or storefront inside malicious iframes to deceive users into submitting unauthorized actions.
* **Defensive Controls**:
  - `X-Frame-Options: SAMEORIGIN` applied globally on all responses.
  - Inside the Operations Console, the interactive "Live Website Preview" is loaded strictly from same-origin endpoints (`/` and `/admin/`) with sandboxed frame attributes.

### 1.5 Parameter Tampering & SQL Injection (SQLi)
* **Risk Scenario**: Manipulating review moderation IDs, order statuses, or search filters to extract sensitive customer data or alter order states.
* **Defensive Controls**:
  - 100% Parameterized PDO prepared statements across all SQLite and MySQL queries. Zero dynamic SQL string concatenation.
  - Strict enum validation on status fields (`pending`, `confirmed`, `dispatched`, `delivered`, `cancelled`).
  - Input type casting (`(int)`, `(float)`) on all numerical parameters.

### 1.6 Authentication & Timing Attacks
* **Risk Scenario**: Brute-forcing administrative bearer tokens using timing variances in string comparison functions.
* **Defensive Controls**:
  - Constant-time verification using PHP's `hash_equals()` to prevent timing leakages.
  - Rate limiting on administrative authentication endpoints.

---

## 2. Defensive Controls Matrix

| Vulnerability Vector | Threat Impact | Mitigation Mechanism |
| :--- | :--- | :--- |
| **SSRF** | Cloud metadata theft, internal port scanning | Scheme validation, private IP denial, relative path preference |
| **File Upload RCE** | Server takeover, webshell deployment | `finfo_file` magic bytes, randomized filenames, execution disabled |
| **Stored XSS** | Session hijacking, client credential theft | `strip_tags()`, `htmlspecialchars(..., ENT_QUOTES)`, URL scheme check |
| **SQL Injection** | Database leakage, unauthorized data modification | Parameterized PDO statements, prepared query bindings |
| **Clickjacking** | UI redressing, coerced administrative actions | `X-Frame-Options: SAMEORIGIN`, CSP `frame-ancestors 'self'` |
| **Timing Attacks** | Secret key leakage through string comparisons | `hash_equals()` constant-time comparison |
| **Automated Flooding** | DoS on order/review queues | Honeypot fields (`_hp_security_check`), rate-limiting, regex filters |
