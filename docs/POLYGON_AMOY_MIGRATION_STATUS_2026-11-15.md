# Polygon Amoy Migration — Cosmic Constitution ScrollVerse

**Updated:** 2026-11-15  
**Status:** Frontend network migration prepared; deployment toolchain remains blocked. No deployment performed.

## Network targets

| Target | Chain ID | Wallet/Hardhat name | RPC environment |
|---|---:|---|---|
| Polygon Amoy | 80002 | `polygonAmoy` | `AMOY_RPC_URL` / `REACT_APP_AMOY_RPC_URL` |
| Polygon PoS mainnet | 137 | `polygon` | `POLYGON_RPC_URL` / `REACT_APP_POLYGON_RPC_URL` |

Polygon Mumbai (80001) is retired. No public Polygon RPC fallback is configured in the updated frontend environment example.

## Frontend changes

- Wagmi chain configuration now imports Polygon Amoy instead of Polygon Mumbai.
- The network map uses chain ID 80002 and the explicit `REACT_APP_AMOY_RPC_URL` variable.
- Mainnet and Amoy RPC environment values are blank in the example file and must be supplied from a maintained provider in the secure runtime.
- Contract address environment values remain empty until exact deployment evidence is published.

## Deployment blocker

The current `hardhat.config.js` on the default branch contains malformed/duplicated configuration blocks and does not provide a valid, tested Amoy deployment path. The package manifest also declares Hardhat 3.1.2 alongside `@nomicfoundation/hardhat-toolbox` 6.1.0, which is on the Hardhat 2 compatibility line. Hardhat 3's recommended Ethers/Mocha toolbox is `@nomicfoundation/hardhat-toolbox-mocha-ethers`; its plugin and verification configuration must be migrated as a separate, tested toolchain change.

Until the Hardhat configuration and dependencies are repaired:
- Do not run the old `deploy:queens:mumbai` command.
- Do not assume a `polygonAmoy` frontend entry makes the deployment toolchain operational.
- Do not deploy to Polygon mainnet.
- Treat all contract addresses, oracle integrations, auto-minting, and airdrop descriptions in legacy docs as unverified plans unless supported by chain transaction and explorer evidence.

## Required next engineering steps

1. Repair Hardhat 3 configuration and use the supported plugin registration model.
2. Add explicit Amoy RPC configuration (80002) and explorer chain descriptor.
3. Add a Polygon mainnet (137) network only behind a separate exact release confirmation and multisig preflight.
4. Review every Queens Sovereignty deployment script for fallback treasury, recipient, metadata, owner, and oracle values.
5. Add tests for chain-ID validation, placeholder rejection, owner/multisig setup, and deployment manifest output.
6. Compile and run the full test suite on CI before any Amoy deployment.
7. Deploy to Amoy only after the script and constructor arguments are reviewed; record addresses, transactions, block numbers, source commit, compiler settings, and explorer verification.
8. Require independent audit, verified source, reviewed multisig owners/threshold, and explicit human authorization before mainnet.

## Preservation

This migration is additive. Historical Mumbai screenshots and original deployment notes remain preserved. New status records must link to source commit and evidence rather than overwriting earlier claims.
