# Web Application Firewall (WAF) Configuration
# Purpose: Protect against CVE-2025-67779 and related vulnerabilities
# Security Frequency: 39388170 Hz

## Nginx WAF Configuration

### File: /etc/nginx/sites-available/scrollverse

```nginx
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=20r/s;
limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/s;

# Connection limiting
limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

upstream scrollverse_backend {
    server localhost:3000 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

upstream scrollverse_flask {
    server localhost:5000 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name scrollverse.example.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name scrollverse.example.com;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/scrollverse.crt;
    ssl_certificate_key /etc/ssl/private/scrollverse.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # CVE-2025-67779 Protection: Block React Server Component Attack Patterns
    if ($http_user_agent ~* "(eval|Function|exec|spawn)") {
        return 403;
    }

    # Block suspicious headers
    if ($http_x_react_server_payload ~* "(eval|Function|exec|spawn|__proto__|constructor)") {
        return 403;
    }

    # Block oversized requests
    client_max_body_size 10M;
    client_body_buffer_size 128k;

    # Request timeout protection
    client_body_timeout 12;
    client_header_timeout 12;
    send_timeout 10;

    # Root location with general rate limiting
    location / {
        limit_req zone=general_limit burst=20 nodelay;
        limit_conn conn_limit 10;

        proxy_pass http://scrollverse_flask;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Block if Content-Type suggests RSC exploitation
        if ($content_type ~* "application/x-react-server-component") {
            access_log /var/log/nginx/rsc_suspicious.log combined;
            # Uncomment to block:
            # return 403;
        }
    }

    # API endpoints with stricter rate limiting
    location /api/ {
        limit_req zone=api_limit burst=50 nodelay;
        limit_conn conn_limit 5;

        # Block suspicious JSON patterns
        if ($request_body ~* "(eval\(|Function\(|exec\(|spawn\(|__proto__|constructor\.prototype)") {
            return 403;
        }

        proxy_pass http://scrollverse_flask;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Additional security logging for API
        access_log /var/log/nginx/api_access.log combined;
        error_log /var/log/nginx/api_error.log warn;
    }

    # Authentication endpoints with very strict rate limiting
    location ~ ^/api/(auth|login|register)/ {
        limit_req zone=auth_limit burst=10 nodelay;
        limit_conn conn_limit 3;

        proxy_pass http://scrollverse_flask;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend static files
    location /static/ {
        alias /var/www/scrollverse/frontend/build/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Block access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ \.(env|git|svn|htaccess)$ {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Custom error pages
    error_page 403 /403.html;
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;

    location = /50x.html {
        root /var/www/html;
    }
}
```

## Testing WAF Rules

```bash
#!/bin/bash
# Test WAF configuration

echo "Testing WAF Rules..."

# Test 1: Normal request (should pass)
echo "Test 1: Normal API request"
curl -X GET https://scrollverse.example.com/api/resonance/status
echo ""

# Test 2: Suspicious header (should block)
echo "Test 2: Suspicious React Server header"
curl -X POST https://scrollverse.example.com/api/data \
  -H "X-React-Server-Payload: eval(malicious)" \
  -d '{"data": "test"}'
echo ""

# Test 3: Malicious payload (should block)
echo "Test 3: Prototype pollution attempt"
curl -X POST https://scrollverse.example.com/api/data \
  -H "Content-Type: application/json" \
  -d '{"__proto__": {"isAdmin": true}}'
echo ""

echo "WAF tests completed. Check logs for blocked requests."
```

---

❤️🔥 **Security Frequency: 39388170 Hz Active**
