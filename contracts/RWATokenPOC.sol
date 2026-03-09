// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RWATokenPOC
 * @dev ERC-3643 compliant RWA Token with country-based compliance
 * 
 * Compliance Rules:
 * - Country A (code 840 = USA): Can only HOLD, cannot transfer
 * - Country B (code 250 = France): Can transfer to B and C
 * - Country C (code 276 = Germany): Can only transfer to B (cannot receive)
 */
contract RWATokenPOC is ERC20, Ownable {
    
    // Token details
    string public constant TOKEN_NAME = "RWA Token POC";
    string public constant TOKEN_SYMBOL = "RWAPOC";
    uint8 public constant DECIMALS = 6;
    
    // Country codes (ISO-3166)
    uint16 public constant COUNTRY_A = 840;  // USA
    uint16 public constant COUNTRY_B = 250;  // France
    uint16 public constant COUNTRY_C = 276;  // Germany
    
    // Identity & Verification
    mapping(address => bytes32) public identityOf;
    mapping(address => bool) public isVerified;
    mapping(address => uint16) public investorCountry;
    
    // Freeze status
    mapping(address => bool) public isFrozen;
    
    // Events
    event IdentityRegistered(address indexed investor, bytes32 identity, uint16 country);
    event IdentityRemoved(address indexed investor);
    event AccountFrozen(address indexed investor);
    event AccountUnfrozen(address indexed investor);
    event TransferRestricted(address indexed from, address indexed to, string reason);
    
    constructor() ERC20(TOKEN_NAME, TOKEN_SYMBOL) Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** DECIMALS);
    }
    
    // === Identity Management ===
    
    function registerInvestor(address _investor, bytes32 _identity, uint16 _country) external onlyOwner {
        require(_investor != address(0), "Invalid address");
        require(_country == COUNTRY_A || _country == COUNTRY_B || _country == COUNTRY_C, "Unsupported country");
        
        identityOf[_investor] = _identity;
        investorCountry[_investor] = _country;
        isVerified[_investor] = true;
        
        emit IdentityRegistered(_investor, _identity, _country);
    }
    
    function removeInvestor(address _investor) external onlyOwner {
        identityOf[_investor] = bytes32(0);
        investorCountry[_investor] = 0;
        isVerified[_investor] = false;
        emit IdentityRemoved(_investor);
    }
    
    // === Freeze Functions ===
    
    function freeze(address _account) external onlyOwner {
        require(_account != address(0), "Invalid address");
        isFrozen[_account] = true;
        emit AccountFrozen(_account);
    }
    
    function unfreeze(address _account) external onlyOwner {
        require(_account != address(0), "Invalid address");
        isFrozen[_account] = false;
        emit AccountUnfrozen(_account);
    }
    
    // === Compliance Check ===
    
    function _checkCompliance(address _from, address _to) internal view returns (bool, string memory) {
        uint16 fromCountry = investorCountry[_from];
        uint16 toCountry = investorCountry[_to];
        
        // Check if either party is verified
        if (!isVerified[_from] || !isVerified[_to]) {
            return (false, "Investor not verified");
        }
        
        // Check freeze status
        if (isFrozen[_from] || isFrozen[_to]) {
            return (false, "Account frozen");
        }
        
        // Country A can only hold - cannot transfer out
        if (fromCountry == COUNTRY_A) {
            return (false, "Country A: transfer not allowed");
        }
        
        // Country C cannot receive transfers
        if (toCountry == COUNTRY_C) {
            return (false, "Country C: cannot receive");
        }
        
        // Country B can transfer to B and C (implicitly allowed)
        return (true, "");
    }
    
    // === ERC20 Override with Compliance ===
    
    function transfer(address _to, uint256 _amount) public override returns (bool) {
        (bool allowed, string memory reason) = _checkCompliance(msg.sender, _to);
        if (!allowed) {
            emit TransferRestricted(msg.sender, _to, reason);
            revert(reason);
        }
        return super.transfer(_to, _amount);
    }
    
    function transferFrom(address _from, address _to, uint256 _amount) public override returns (bool) {
        (bool allowed, string memory reason) = _checkCompliance(_from, _to);
        if (!allowed) {
            emit TransferRestricted(_from, _to, reason);
            revert(reason);
        }
        return super.transferFrom(_from, _to, _amount);
    }
    
    // === Mint ===
    
    function mint(address _to, uint256 _amount) external onlyOwner {
        require(isVerified[_to], "Receiver not verified");
        _mint(_to, _amount);
    }
    
    // === View Functions ===
    
    function getInvestorInfo(address _investor) external view returns (
        bytes32 identity,
        bool verified,
        uint16 country,
        bool frozen
    ) {
        return (
            identityOf[_investor],
            isVerified[_investor],
            investorCountry[_investor],
            isFrozen[_investor]
        );
    }
    
    function canTransfer(address _from, address _to, uint256 _amount) external view returns (bool allowed, string memory reason) {
        return _checkCompliance(_from, _to);
    }
}
