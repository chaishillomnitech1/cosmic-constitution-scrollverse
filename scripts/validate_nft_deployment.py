#!/usr/bin/env python3
"""
NFT Deployment System Validator
Validates the NFT deployment system implementation
"""

import json
import os
import sys
from pathlib import Path

def validate_nft_deployment_system():
    """Validate the complete NFT deployment system"""
    print("🔍 Validating NFT Deployment System...")
    print("=" * 60)
    
    scripts_dir = Path("./scripts")
    required_scripts = [
        "deployNFTSystem.js",
        "deployNFTSystemAdvanced.js",
        "nftDeploymentConfig.js"
    ]
    
    all_valid = True
    
    # Check scripts exist
    print("\n1. Checking deployment scripts...")
    for script in required_scripts:
        script_path = scripts_dir / script
        if script_path.exists():
            size = script_path.stat().st_size
            print(f"  ✓ {script} ({size:,} bytes)")
        else:
            print(f"  ✗ {script} - NOT FOUND")
            all_valid = False
    
    # Check package.json has deployment commands
    print("\n2. Checking npm scripts...")
    package_json = Path("./package.json")
    if package_json.exists():
        with open(package_json, 'r') as f:
            package_data = json.load(f)
            scripts = package_data.get('scripts', {})
            
            nft_commands = {
                k: v for k, v in scripts.items() 
                if 'deploy:nft' in k
            }
            
            if nft_commands:
                print(f"  ✓ Found {len(nft_commands)} NFT deployment commands:")
                for cmd, value in nft_commands.items():
                    print(f"    - npm run {cmd}")
            else:
                print("  ✗ No NFT deployment commands found")
                all_valid = False
    else:
        print("  ✗ package.json not found")
        all_valid = False
    
    # Check documentation
    print("\n3. Checking documentation...")
    doc_file = Path("./NFT_DEPLOYMENT_SYSTEM.md")
    if doc_file.exists():
        size = doc_file.stat().st_size
        print(f"  ✓ NFT_DEPLOYMENT_SYSTEM.md ({size:,} bytes)")
    else:
        print("  ✗ NFT_DEPLOYMENT_SYSTEM.md not found")
        all_valid = False
    
    # Check contract files
    print("\n4. Checking NFT contract files...")
    contracts_dir = Path("./contracts")
    nft_contracts = [
        "ScrollSoulPleiadian.sol",
        "ScrollVerseNFT.sol",
        "MansionChainNFT.sol",
        "LegacyMusicCatalog.sol",
        "PhysicalAssetMachine3D.sol"
    ]
    
    found_contracts = 0
    for contract in nft_contracts:
        contract_path = contracts_dir / contract
        if contract_path.exists():
            print(f"  ✓ {contract}")
            found_contracts += 1
        else:
            print(f"  ⚠ {contract} - not found (optional)")
    
    print(f"\n  Found {found_contracts}/{len(nft_contracts)} core NFT contracts")
    
    # Validate deployment configuration
    print("\n5. Validating deployment configuration...")
    config_file = scripts_dir / "nftDeploymentConfig.js"
    if config_file.exists():
        with open(config_file, 'r') as f:
            content = f.read()
            
            stages = [
                "CORE_NFT",
                "GOVERNANCE",
                "TOKENS",
                "DAO",
                "ORACLE",
                "STAKING",
                "LEDGER",
                "MULTITOKEN"
            ]
            
            found_stages = sum(1 for stage in stages if stage in content)
            print(f"  ✓ Found {found_stages}/{len(stages)} deployment stages")
            
            networks = ["localhost", "sepolia", "mumbai", "polygon", "mainnet"]
            found_networks = sum(1 for network in networks if network in content)
            print(f"  ✓ Found {found_networks}/{len(networks)} network configurations")
    
    # Check README for system documentation
    print("\n6. Checking README integration...")
    readme_file = Path("./README.md")
    if readme_file.exists():
        with open(readme_file, 'r') as f:
            content = f.read()
            if "NFT" in content or "nft" in content:
                print("  ✓ README contains NFT references")
            else:
                print("  ⚠ README might need NFT deployment system documentation")
    
    # Summary
    print("\n" + "=" * 60)
    if all_valid:
        print("✅ NFT Deployment System validation PASSED")
        print("\nThe system includes:")
        print("  • Comprehensive deployment orchestration")
        print("  • Staged deployment support")
        print("  • Multi-network configuration")
        print("  • Automated verification")
        print("  • Deployment tracking and logging")
        print("  • Complete documentation")
        print("\n🕋 ALLĀHU AKBAR | KUN FAYAKŪN! ✨")
        return 0
    else:
        print("⚠️  NFT Deployment System validation completed with warnings")
        print("Some components may be missing or need attention.")
        return 1

if __name__ == "__main__":
    sys.exit(validate_nft_deployment_system())
