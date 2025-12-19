// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title MedAirToken
 * @dev $MEDAIR token for MedAir blockchain ecosystem
 * Core utility token for emergency medical air transport operations
 */
contract MedAirToken is ERC20, Ownable, Pausable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant LIQUIDITY_POOL_ALLOCATION = 300_000_000 * 10**18; // 30%
    
    mapping(address => bool) public liquidityPools;
    
    event LiquidityPoolAdded(address indexed pool);
    event LiquidityPoolRemoved(address indexed pool);
    
    constructor(address initialOwner) ERC20("MedAir Token", "MEDAIR") Ownable(initialOwner) {
        _mint(initialOwner, MAX_SUPPLY);
    }
    
    /**
     * @dev Add a liquidity pool address
     */
    function addLiquidityPool(address pool) external onlyOwner {
        require(pool != address(0), "Invalid pool address");
        liquidityPools[pool] = true;
        emit LiquidityPoolAdded(pool);
    }
    
    /**
     * @dev Remove a liquidity pool address
     */
    function removeLiquidityPool(address pool) external onlyOwner {
        liquidityPools[pool] = false;
        emit LiquidityPoolRemoved(pool);
    }
    
    /**
     * @dev Check if address is a liquidity pool
     */
    function isLiquidityPool(address pool) external view returns (bool) {
        return liquidityPools[pool];
    }
    
    /**
     * @dev Pause token transfers
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override transfer to include pause check
     */
    function _update(address from, address to, uint256 value) internal virtual override whenNotPaused {
        super._update(from, to, value);
    }
}
