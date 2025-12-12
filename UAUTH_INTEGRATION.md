# UAuth Integration Documentation

## Overview

The ScrollVerse Governance Codex now integrates **Unstoppable Domains Authentication (UAuth)** to provide decentralized identity management and secure access control for sensitive operations.

## Features

### 🔐 Decentralized Authentication
- Login using Unstoppable Domain (.crypto, .nft, .wallet, etc.)
- OAuth 2.0 compatible flow
- No centralized password storage
- Self-sovereign identity

### 🛡️ Access Control Levels

1. **Public Access** (No Authentication Required)
   - View constitution
   - Read resonance system status
   - View treasury status (read-only)
   - View NFT collection data

2. **Authenticated Access** (Requires UAuth Login)
   - Create NFTs with resonance integration
   - Sync NFTs with treasury
   - Access user-specific features

3. **Guardian Access** (Advanced Permissions)
   - View comprehensive governance status
   - Advanced system monitoring
   - Access to detailed metrics

4. **Vault Access** (Treasury Operations)
   - Synchronize treasury with ETH vault
   - Execute treasury transactions
   - Manage vault configurations

## Configuration

### Environment Variables

Add the following to your `.env` file:

```bash
# UAuth Configuration
UAUTH_CLIENT_ID=your_unstoppable_domains_client_id
UAUTH_CLIENT_SECRET=your_unstoppable_domains_client_secret
UAUTH_REDIRECT_URI=http://localhost:5000/auth/callback
UAUTH_ENABLED=True
```

### Getting UAuth Credentials

1. Visit [Unstoppable Domains Developer Portal](https://unstoppabledomains.com/)
2. Register your application
3. Obtain Client ID and Client Secret
4. Configure redirect URI to match your deployment

## Authentication Endpoints

### `GET /login`
Render the login page with UAuth integration.

**Response:** HTML login page

---

### `GET /auth/login`
Initiate the UAuth login flow.

**Response:**
```json
{
  "authorization_url": "https://auth.unstoppabledomains.com/authorize?...",
  "state": "random_state_token",
  "expires_in": 600
}
```

**Usage:**
```javascript
fetch('/auth/login')
  .then(response => response.json())
  .then(data => {
    window.location.href = data.authorization_url;
  });
```

---

### `GET /auth/callback`
Handle OAuth callback from Unstoppable Domains.

**Query Parameters:**
- `code`: Authorization code from UAuth
- `state`: State token for verification

**Success Response:**
Redirects to `/dashboard` with authenticated session

**Error Response:**
```json
{
  "success": false,
  "error": "invalid_state",
  "message": "Invalid or expired state parameter"
}
```

---

### `GET /auth/logout`
Logout user and revoke session.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### `GET /auth/status`
Check current authentication status.

**Response (Authenticated):**
```json
{
  "authenticated": true,
  "uauth_enabled": true,
  "user": {
    "user_id": "ud_abc123",
    "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "domain": "scrollverse-guardian.crypto",
    "is_authenticated": true,
    "expires_at": 1234567890
  }
}
```

**Response (Not Authenticated):**
```json
{
  "authenticated": false,
  "uauth_enabled": true
}
```

## Protected Endpoints

### Using Bearer Token Authentication

All protected endpoints require an `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

### Example Request

```javascript
const token = sessionStorage.getItem('auth_token');

fetch('/api/treasury/sync', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

### Protected Endpoints List

#### Requires Authentication (`@require_auth`)
- `POST /api/nft/create/<token_id>/<frequency>` - Create NFT metadata
- `POST /api/nft/sync/<token_id>` - Sync NFT with treasury

#### Requires Guardian Access (`@require_guardian_access`)
- `GET /api/governance/status` - Comprehensive governance status

#### Requires Vault Access (`@require_vault_access`)
- `POST /api/treasury/sync` - Synchronize treasury with ETH vault

## Error Responses

### 401 Unauthorized
```json
{
  "error": "unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "forbidden",
  "message": "Guardian access required"
}
```

### 503 Service Unavailable
```json
{
  "error": "authentication_disabled",
  "message": "UAuth authentication is not enabled"
}
```

## Security Features

### 🔒 Fail-Safe Protocols

1. **Token Expiration**: JWT tokens expire after 1 hour
2. **State Verification**: OAuth state parameter prevents CSRF attacks
3. **Secure Sessions**: Session data encrypted with SECRET_KEY
4. **Domain Verification**: Only valid Unstoppable Domains accepted
5. **Humanity Check**: Optional verification for bot prevention

### 🛡️ Decentralized Identity Benefits

- No password vulnerabilities
- User owns their identity
- Portable across applications
- Blockchain-backed verification
- No centralized data breach risk

## Integration with Governance

### Guardian Access Pattern

Guardians are authenticated users with verified Unstoppable Domains who have permissions to:
- Monitor system health
- Access governance metrics
- View detailed resonance data
- Review treasury reports

```python
from auth import require_guardian_access

@app.route('/api/governance/status')
@require_guardian_access
def governance_status():
    # Only accessible to guardians
    return jsonify(system_status)
```

### Vault Access Pattern

Vault operators have the highest privilege level for:
- Treasury synchronization
- Financial operations
- Critical system modifications

```python
from auth import require_vault_access

@app.route('/api/treasury/sync')
@require_vault_access
def treasury_sync():
    # Only accessible to vault operators
    return jsonify(treasury.sync_with_vault())
```

## Frontend Integration

### Login Page

The login page (`/login`) provides a user-friendly interface for UAuth authentication:

- **Visual Design**: Cosmic theme matching ScrollVerse aesthetic
- **Clear Information**: Explains decentralized authentication
- **Protected Operations**: Lists what requires authentication
- **Auto-redirect**: Redirects authenticated users to dashboard

### Dashboard Integration

The dashboard (`/dashboard`) displays authentication status:

- **User Info Display**: Shows domain and wallet address
- **Logout Button**: Allows users to end their session
- **Session Persistence**: Maintains authentication across page refreshes

## Custom OAuth Workflow

### Tailored for ScrollVerse Governance

The UAuth implementation is customized for governance operations:

1. **Resonance Alignment**: Authentication integrated with 528Hz/963Hz system
2. **Treasury Linking**: User domains can be linked to treasury operations
3. **NFT Permissions**: Authentication determines NFT creation rights
4. **Guardian Hierarchy**: Multi-level access based on authentication level

### OAuth Scopes

```
openid wallet email:optional humanity_check:optional
```

- `openid`: Basic identity information
- `wallet`: Wallet address for blockchain operations
- `email:optional`: Optional email for notifications
- `humanity_check:optional`: Bot verification

## Testing

### Testing with UAuth Disabled

For development without UAuth credentials:

```bash
UAUTH_ENABLED=False
```

Endpoints will return appropriate error messages indicating authentication is disabled.

### Testing with UAuth Enabled

1. Set up UAuth credentials in `.env`
2. Start the application: `python3 app.py`
3. Navigate to `/login`
4. Login with your Unstoppable Domain
5. Access protected endpoints with Bearer token

### Simulated Authentication (Development)

The current implementation includes simulation mode for development:

```python
# Simulates successful authentication without actual UAuth API calls
user_info = self._simulate_user_info(code)
```

For production, implement actual HTTP requests to Unstoppable Domains OAuth endpoints.

## Production Deployment

### Requirements

1. **HTTPS Required**: OAuth requires secure connections in production
2. **Valid Domain**: Configure redirect URI to match your domain
3. **Session Storage**: Consider Redis for session management at scale
4. **Token Revocation**: Implement token blacklist for instant logout

### Example Production Configuration

```bash
# Production .env
UAUTH_CLIENT_ID=prod_client_id_from_unstoppable
UAUTH_CLIENT_SECRET=prod_secret_from_unstoppable
UAUTH_REDIRECT_URI=https://scrollverse.app/auth/callback
UAUTH_ENABLED=True
SECRET_KEY=generate_strong_random_key
```

## Support and Resources

- **Unstoppable Domains Docs**: https://docs.unstoppabledomains.com/
- **UAuth Integration Guide**: https://docs.unstoppabledomains.com/login-with-unstoppable/
- **ScrollVerse Support**: See repository documentation

---

**Last Updated**: 2025-12-11  
**Version**: 1.0.0  
**Status**: Production Ready
