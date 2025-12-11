"""
UAuth Integration Module
Manages Unstoppable Domains decentralized authentication
"""
from datetime import datetime, timedelta
from typing import Dict, Optional
import jwt
import hashlib
import secrets
from functools import wraps
from flask import request, jsonify, session


class UAuthManager:
    """Manages Unstoppable Domains authentication and decentralized identity"""
    
    def __init__(self, client_id: str, client_secret: str, redirect_uri: str, secret_key: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri
        self.secret_key = secret_key
        self.authorized_sessions = {}  # In-memory session store (use Redis in production)
        
    def generate_authorization_url(self, state: str = None) -> Dict:
        """Generate UAuth authorization URL for OAuth flow"""
        if not state:
            state = secrets.token_urlsafe(32)
            
        # Store state for verification
        self.authorized_sessions[state] = {
            'created_at': datetime.utcnow(),
            'status': 'pending'
        }
        
        # Unstoppable Domains OAuth endpoint
        auth_url = (
            f"https://auth.unstoppabledomains.com/authorize"
            f"?client_id={self.client_id}"
            f"&redirect_uri={self.redirect_uri}"
            f"&response_type=code"
            f"&scope=openid wallet email:optional humanity_check:optional"
            f"&state={state}"
        )
        
        return {
            'authorization_url': auth_url,
            'state': state,
            'expires_in': 600  # 10 minutes
        }
    
    def verify_callback(self, code: str, state: str) -> Dict:
        """Verify OAuth callback and exchange code for token"""
        if state not in self.authorized_sessions:
            return {
                'success': False,
                'error': 'invalid_state',
                'message': 'Invalid or expired state parameter'
            }
        
        session_data = self.authorized_sessions[state]
        
        # Check if state is expired (10 minutes)
        if datetime.utcnow() - session_data['created_at'] > timedelta(minutes=10):
            del self.authorized_sessions[state]
            return {
                'success': False,
                'error': 'expired_state',
                'message': 'Authorization state has expired'
            }
        
        # In production, this would make actual HTTP request to Unstoppable Domains
        # For now, we'll simulate successful authentication
        # token_response = self._exchange_code_for_token(code)
        
        # Simulate successful token exchange
        user_info = self._simulate_user_info(code)
        
        # Generate session token
        session_token = self._generate_session_token(user_info)
        
        # Update session
        session_data['status'] = 'authenticated'
        session_data['user_info'] = user_info
        session_data['token'] = session_token
        session_data['authenticated_at'] = datetime.utcnow()
        
        return {
            'success': True,
            'token': session_token,
            'user': user_info,
            'expires_in': 3600  # 1 hour
        }
    
    def _exchange_code_for_token(self, code: str) -> Dict:
        """Exchange authorization code for access token"""
        # In production, make POST request to:
        # POST https://auth.unstoppabledomains.com/oauth/token
        # with code, client_id, client_secret, redirect_uri, grant_type
        pass
    
    def _simulate_user_info(self, code: str) -> Dict:
        """Simulate user info from Unstoppable Domains"""
        # Generate a deterministic user ID from code
        user_hash = hashlib.sha256(code.encode()).hexdigest()[:16]
        
        return {
            'sub': f'ud_{user_hash}',
            'wallet_address': f'0x{user_hash}',
            'domain': f'scrollverse-guardian-{user_hash[:8]}.crypto',
            'email': None,  # Optional scope
            'humanity_check': True,  # Verified human
            'auth_method': 'unstoppable_domains',
            'authenticated_at': datetime.utcnow().isoformat()
        }
    
    def _generate_session_token(self, user_info: Dict) -> str:
        """Generate JWT session token"""
        payload = {
            'sub': user_info['sub'],
            'wallet_address': user_info['wallet_address'],
            'domain': user_info['domain'],
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(hours=1)
        }
        
        token = jwt.encode(payload, self.secret_key, algorithm='HS256')
        return token
    
    def verify_token(self, token: str) -> Optional[Dict]:
        """Verify JWT session token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    def get_session_info(self, token: str) -> Optional[Dict]:
        """Get session information from token"""
        payload = self.verify_token(token)
        if not payload:
            return None
        
        return {
            'user_id': payload['sub'],
            'wallet_address': payload['wallet_address'],
            'domain': payload['domain'],
            'is_authenticated': True,
            'expires_at': payload['exp']
        }
    
    def revoke_session(self, token: str) -> bool:
        """Revoke a session token"""
        payload = self.verify_token(token)
        if not payload:
            return False
        
        # In production, add token to revocation list
        # For now, tokens will expire naturally
        return True
    
    def check_guardian_access(self, token: str) -> bool:
        """Check if user has guardian-level access"""
        payload = self.verify_token(token)
        if not payload:
            return False
        
        # Guardian access based on wallet address or domain
        # Could be extended to check on-chain NFT ownership, etc.
        return True
    
    def check_vault_access(self, token: str) -> bool:
        """Check if user has vault access permissions"""
        payload = self.verify_token(token)
        if not payload:
            return False
        
        # Vault access for treasury operations
        # Could verify specific NFT holdings or governance tokens
        return True


def require_auth(f):
    """Decorator to require authentication for routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({
                'error': 'unauthorized',
                'message': 'Authentication required'
            }), 401
        
        # Extract token from "Bearer <token>"
        try:
            token = auth_header.split(' ')[1]
        except IndexError:
            return jsonify({
                'error': 'invalid_token',
                'message': 'Invalid authorization header format'
            }), 401
        
        # Verify token
        from flask import current_app
        auth_manager = current_app.config.get('UAUTH_MANAGER')
        
        if not auth_manager:
            return jsonify({
                'error': 'configuration_error',
                'message': 'Authentication not configured'
            }), 500
        
        user_info = auth_manager.get_session_info(token)
        
        if not user_info:
            return jsonify({
                'error': 'invalid_token',
                'message': 'Token is invalid or expired'
            }), 401
        
        # Add user info to request context
        request.user = user_info
        
        return f(*args, **kwargs)
    
    return decorated_function


def require_guardian_access(f):
    """Decorator to require guardian-level access"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({
                'error': 'unauthorized',
                'message': 'Guardian authentication required'
            }), 401
        
        try:
            token = auth_header.split(' ')[1]
        except IndexError:
            return jsonify({
                'error': 'invalid_token',
                'message': 'Invalid authorization header format'
            }), 401
        
        from flask import current_app
        auth_manager = current_app.config.get('UAUTH_MANAGER')
        
        if not auth_manager or not auth_manager.check_guardian_access(token):
            return jsonify({
                'error': 'forbidden',
                'message': 'Guardian access required'
            }), 403
        
        user_info = auth_manager.get_session_info(token)
        request.user = user_info
        
        return f(*args, **kwargs)
    
    return decorated_function


def require_vault_access(f):
    """Decorator to require vault access permissions"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({
                'error': 'unauthorized',
                'message': 'Vault authentication required'
            }), 401
        
        try:
            token = auth_header.split(' ')[1]
        except IndexError:
            return jsonify({
                'error': 'invalid_token',
                'message': 'Invalid authorization header format'
            }), 401
        
        from flask import current_app
        auth_manager = current_app.config.get('UAUTH_MANAGER')
        
        if not auth_manager or not auth_manager.check_vault_access(token):
            return jsonify({
                'error': 'forbidden',
                'message': 'Vault access required'
            }), 403
        
        user_info = auth_manager.get_session_info(token)
        request.user = user_info
        
        return f(*args, **kwargs)
    
    return decorated_function
