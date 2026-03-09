// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RWAToken
 * @dev ERC-3643 compliant RWA Token
 */
contract RWAToken is ERC20, Ownable {
    
    string public constant NAME = "RWA Token";
    string public constant SYMBOL = "RWA";
    uint8 public constant DECIMALS = 6;
    
    mapping(address => bytes32) public identityOf;
    mapping(address => bool) public isVerified;
    mapping(address => bool) public isFrozen;
    mapping(address => bool) public isSuspended;
    mapping(address => mapping(address => bool)) public delegates;
    
    event IdentitySet(address indexed _account, bytes32 _identity);
    event IdentityRemoved(address indexed _account);
    event AccountFrozen(address indexed _account);
    event AccountUnfrozen(address indexed _account);
    event AccountSuspended(address indexed _account);
    event AccountUnsuspended(address indexed _account);
    event DelegateAdded(address indexed _account, address indexed _delegate);
    event DelegateRemoved(address indexed _account, address indexed _delegate);
    
    modifier whenNotFrozen(address _account) {
        require(!isFrozen[_account], "Account is frozen");
        _;
    }
    
    modifier whenNotSuspended(address _account) {
        require(!isSuspended[_account], "Account is suspended");
        _;
    }
    
    constructor() ERC20(NAME, SYMBOL) Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** DECIMALS);
    }
    
    // Identity Management
    function setIdentity(address _account, bytes32 _identity) external onlyOwner {
        require(_account != address(0), "Invalid address");
        identityOf[_account] = _identity;
        isVerified[_account] = true;
        emit IdentitySet(_account, _identity);
    }
    
    function setIdentityWithCountry(address _account, bytes32 _identity, bytes32 _country) external onlyOwner {
        require(_account != address(0), "Invalid address");
        identityOf[_account] = _identity;
        isVerified[_account] = true;
        emit IdentitySet(_account, _identity);
    }
    
    function removeIdentity(address _account) external onlyOwner {
        identityOf[_account] = bytes32(0);
        isVerified[_account] = false;
        emit IdentityRemoved(_account);
    }
    
    // Freeze/Unfreeze
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
    
    // Suspend/Unsuspend
    function suspend(address _account) external onlyOwner {
        require(_account != address(0), "Invalid address");
        isSuspended[_account] = true;
        emit AccountSuspended(_account);
    }
    
    function unsuspend(address _account) external onlyOwner {
        require(_account != address(0), "Invalid address");
        isSuspended[_account] = false;
        emit AccountUnsuspended(_account);
    }
    
    // Delegate Management
    function addDelegate(address _delegate) external {
        require(_delegate != address(0), "Invalid delegate");
        delegates[msg.sender][_delegate] = true;
        emit DelegateAdded(msg.sender, _delegate);
    }
    
    function removeDelegate(address _delegate) external {
        require(_delegate != address(0), "Invalid delegate");
        delegates[msg.sender][_delegate] = false;
        emit DelegateRemoved(msg.sender, _delegate);
    }
    
    // Transfer Checks - view function
    function canTransfer(address _to, uint256 _amount) external view returns (bool allowed) {
        return _checkTransfer(msg.sender, _to, _amount);
    }
    
    function canTransferFrom(address _from, address _to, uint256 _amount) external view returns (bool allowed) {
        return _checkTransfer(_from, _to, _amount);
    }
    
    function _checkTransfer(address _from, address _to, uint256 _amount) internal view returns (bool) {
        if (isFrozen[_from]) return false;
        if (isSuspended[_from]) return false;
        if (isFrozen[_to]) return false;
        if (isSuspended[_to]) return false;
        return true;
    }
    
    // ERC20 Overrides
    function transfer(address _to, uint256 _amount) public override whenNotFrozen(msg.sender) whenNotSuspended(msg.sender) whenNotFrozen(_to) whenNotSuspended(_to) returns (bool) {
        require(_checkTransfer(msg.sender, _to, _amount), "Transfer not allowed");
        return super.transfer(_to, _amount);
    }
    
    function transferFrom(address _from, address _to, uint256 _amount) public override whenNotFrozen(_from) whenNotSuspended(_from) whenNotFrozen(_to) whenNotSuspended(_to) returns (bool) {
        require(_checkTransfer(_from, _to, _amount), "Transfer not allowed");
        return super.transferFrom(_from, _to, _amount);
    }
    
    // Mint/Burn
    function mint(address _to, uint256 _amount) external onlyOwner whenNotFrozen(_to) {
        _mint(_to, _amount);
    }
    
    function burn(uint256 _amount) external onlyOwner {
        _burn(msg.sender, _amount);
    }
    
    // Getters
    function getIdentity(address _account) external view returns (bytes32) {
        return identityOf[_account];
    }
    
    function isAccountVerified(address _account) external view returns (bool) {
        return isVerified[_account];
    }
    
    function isAccountFrozen(address _account) external view returns (bool) {
        return isFrozen[_account];
    }
    
    function isAccountSuspended(address _account) external view returns (bool) {
        return isSuspended[_account];
    }
    
    function isDelegateAuthorized(address _account, address _delegate) external view returns (bool) {
        return delegates[_account][_delegate];
    }
}
