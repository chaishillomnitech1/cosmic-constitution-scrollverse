// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title SigilToken
 * @dev $SIGIL governance and staking token for ScrollVerse-MedAir alignment
 * Provides enhanced yields and voting power in the ecosystem
 */
contract SigilToken is ERC20, Ownable, Pausable {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100 million tokens
    
    mapping(address => bool) public authorizedMinters;
    
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    
    constructor(address initialOwner) ERC20("Sigil Token", "SIGIL") Ownable(initialOwner) {
        _mint(initialOwner, MAX_SUPPLY / 10); // Mint 10% initially
    }
    
    /**
     * @dev Add authorized minter for staking rewards
     */
    function addMinter(address minter) external onlyOwner {
        require(minter != address(0), "Invalid minter address");
        authorizedMinters[minter] = true;
        emit MinterAdded(minter);
    }
    
    /**
     * @dev Remove authorized minter
     */
    function removeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRemoved(minter);
    }
    
    /**
     * @dev Mint tokens for staking rewards (only authorized minters)
     */
    function mintRewards(address to, uint256 amount) external {
        require(authorizedMinters[msg.sender], "Unauthorized minter");
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
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
