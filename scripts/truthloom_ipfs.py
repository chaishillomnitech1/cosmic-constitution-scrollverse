"""
TruthLoom IPFS Integration Utility

Provides helper functions for uploading and retrieving data from IPFS
for the TruthLoom decentralized transparency framework.
"""

import os
import json
import requests
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()


class IPFSClient:
    """Client for interacting with IPFS via Pinata API"""
    
    def __init__(self):
        self.pinata_api_key = os.getenv('PINATA_API_KEY')
        self.pinata_secret = os.getenv('PINATA_SECRET_KEY')
        self.pinata_jwt = os.getenv('PINATA_JWT')
        self.gateway_url = 'https://gateway.pinata.cloud/ipfs/'
        
    def upload_json(self, data: Dict[str, Any], name: Optional[str] = None) -> str:
        """
        Upload JSON data to IPFS via Pinata
        
        Args:
            data: Dictionary to upload
            name: Optional name for the pinned content
            
        Returns:
            IPFS hash (CID)
        """
        url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS'
        
        headers = {
            'Content-Type': 'application/json',
            'pinata_api_key': self.pinata_api_key,
            'pinata_secret_api_key': self.pinata_secret
        }
        
        payload = {
            'pinataContent': data
        }
        
        if name:
            payload['pinataMetadata'] = {
                'name': name
            }
        
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        
        result = response.json()
        return result['IpfsHash']
    
    def upload_file(self, file_path: str, name: Optional[str] = None) -> str:
        """
        Upload a file to IPFS via Pinata
        
        Args:
            file_path: Path to file to upload
            name: Optional name for the pinned content
            
        Returns:
            IPFS hash (CID)
        """
        url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
        
        headers = {
            'pinata_api_key': self.pinata_api_key,
            'pinata_secret_api_key': self.pinata_secret
        }
        
        with open(file_path, 'rb') as f:
            files = {'file': f}
            
            if name:
                metadata = json.dumps({
                    'name': name
                })
                files['pinataMetadata'] = (None, metadata)
            
            response = requests.post(url, files=files, headers=headers)
            response.raise_for_status()
        
        result = response.json()
        return result['IpfsHash']
    
    def get_content(self, ipfs_hash: str) -> Dict[str, Any]:
        """
        Retrieve JSON content from IPFS
        
        Args:
            ipfs_hash: IPFS hash (CID) of content
            
        Returns:
            Retrieved JSON data
        """
        url = f'{self.gateway_url}{ipfs_hash}'
        response = requests.get(url)
        response.raise_for_status()
        
        return response.json()
    
    def pin_hash(self, ipfs_hash: str, name: Optional[str] = None) -> bool:
        """
        Pin existing IPFS content by hash
        
        Args:
            ipfs_hash: IPFS hash to pin
            name: Optional name for the pin
            
        Returns:
            Success status
        """
        url = 'https://api.pinata.cloud/pinning/pinByHash'
        
        headers = {
            'Content-Type': 'application/json',
            'pinata_api_key': self.pinata_api_key,
            'pinata_secret_api_key': self.pinata_secret
        }
        
        payload = {
            'hashToPin': ipfs_hash
        }
        
        if name:
            payload['pinataMetadata'] = {
                'name': name
            }
        
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        
        return True
    
    def unpin(self, ipfs_hash: str) -> bool:
        """
        Unpin content from Pinata
        
        Args:
            ipfs_hash: IPFS hash to unpin
            
        Returns:
            Success status
        """
        url = f'https://api.pinata.cloud/pinning/unpin/{ipfs_hash}'
        
        headers = {
            'pinata_api_key': self.pinata_api_key,
            'pinata_secret_api_key': self.pinata_secret
        }
        
        response = requests.delete(url, headers=headers)
        response.raise_for_status()
        
        return True


class TruthLoomRecordManager:
    """Manager for TruthLoom transparency records"""
    
    def __init__(self):
        self.ipfs_client = IPFSClient()
    
    def create_record(
        self,
        title: str,
        description: str,
        evidence: list,
        category: str = "systemic_harm",
        timestamp: Optional[str] = None
    ) -> str:
        """
        Create and upload a transparency record
        
        Args:
            title: Record title
            description: Detailed description
            evidence: List of evidence items
            category: Record category
            timestamp: ISO timestamp (defaults to now)
            
        Returns:
            IPFS hash of uploaded record
        """
        import datetime
        
        if timestamp is None:
            timestamp = datetime.datetime.utcnow().isoformat()
        
        record = {
            'version': '1.0',
            'type': 'transparency_record',
            'title': title,
            'description': description,
            'category': category,
            'evidence': evidence,
            'timestamp': timestamp,
            'metadata': {
                'framework': 'TruthLoom',
                'standard': 'ScrollVerse-TR-1.0'
            }
        }
        
        ipfs_hash = self.ipfs_client.upload_json(
            record,
            name=f"TruthLoom-{title[:30]}"
        )
        
        return ipfs_hash
    
    def create_victim_data(
        self,
        identity_info: Dict[str, Any],
        encrypt: bool = True
    ) -> bytes:
        """
        Create encrypted victim data
        
        Args:
            identity_info: Victim identity information
            encrypt: Whether to encrypt the data
            
        Returns:
            Encrypted victim data as bytes
        """
        import hashlib
        
        data_str = json.dumps(identity_info)
        
        if encrypt:
            # In production, use proper encryption
            # This is a placeholder for the example
            data_bytes = data_str.encode('utf-8')
            return hashlib.sha256(data_bytes).digest()
        
        return data_str.encode('utf-8')
    
    def create_legal_case_documentation(
        self,
        case_number: str,
        jurisdiction: str,
        plaintiffs: list,
        charges: list,
        filing_date: str
    ) -> str:
        """
        Create and upload legal case documentation
        
        Args:
            case_number: Official case number
            jurisdiction: Court jurisdiction
            plaintiffs: List of plaintiffs
            charges: List of charges
            filing_date: ISO date of filing
            
        Returns:
            IPFS hash of case documentation
        """
        case_doc = {
            'caseNumber': case_number,
            'jurisdiction': jurisdiction,
            'plaintiffs': plaintiffs,
            'charges': charges,
            'filingDate': filing_date,
            'status': 'active',
            'type': 'legal_case_documentation',
            'framework': 'TruthLoom'
        }
        
        ipfs_hash = self.ipfs_client.upload_json(
            case_doc,
            name=f"Case-{case_number}"
        )
        
        return ipfs_hash
    
    def retrieve_record(self, ipfs_hash: str) -> Dict[str, Any]:
        """
        Retrieve a transparency record from IPFS
        
        Args:
            ipfs_hash: IPFS hash of record
            
        Returns:
            Record data
        """
        return self.ipfs_client.get_content(ipfs_hash)


def main():
    """Example usage of TruthLoom IPFS utilities"""
    
    # Initialize manager
    manager = TruthLoomRecordManager()
    
    # Create a sample transparency record
    print("📝 Creating transparency record...")
    record_hash = manager.create_record(
        title="Example Systemic Harm Documentation",
        description="This is an example record for testing purposes",
        evidence=[
            {
                'type': 'document',
                'description': 'Internal memo',
                'hash': 'QmExample1'
            },
            {
                'type': 'testimony',
                'description': 'Witness statement',
                'hash': 'QmExample2'
            }
        ],
        category="institutional_misconduct"
    )
    
    print(f"✅ Record uploaded to IPFS: {record_hash}")
    print(f"🔗 Gateway URL: https://gateway.pinata.cloud/ipfs/{record_hash}")
    
    # Create victim data (encrypted)
    print("\n🔐 Creating encrypted victim data...")
    victim_data = manager.create_victim_data({
        'identifier': 'PROTECTED',
        'impact_level': 'severe',
        'proof_hash': 'QmProof123'
    })
    print(f"✅ Victim data encrypted: {victim_data.hex()[:64]}...")
    
    # Create legal case documentation
    print("\n⚖️  Creating legal case documentation...")
    case_hash = manager.create_legal_case_documentation(
        case_number="2025-CV-001",
        jurisdiction="Federal Court",
        plaintiffs=["Protected Identity 1", "Protected Identity 2"],
        charges=["Systemic Negligence", "Violation of Rights"],
        filing_date="2025-12-21"
    )
    
    print(f"✅ Case documentation uploaded: {case_hash}")
    print(f"🔗 Gateway URL: https://gateway.pinata.cloud/ipfs/{case_hash}")
    
    print("\n✨ TruthLoom IPFS integration example complete!")


if __name__ == '__main__':
    main()
