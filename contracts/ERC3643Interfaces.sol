// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IERC3643
 * @dev Interface for the ERC-3643 (T-REX) token standard
 */
interface IERC3643 {
    function issue(address _to, uint256 _amount) external;
    function revoke(address _to) external;
    function suspend(address _account) external;
    function unsuspend(address _account) external;
    function freeze(address _account) external;
    function unfreeze(address _account) external;
    
    function getIdentity(address _account) external view returns (bytes32);
    function setIdentity(address _account, bytes32 _identity) external;
    
    function canTransfer(address _from, address _to, uint256 _amount) external view returns (bool, bytes32);
    function canTransferFrom(address _from, address _to, address _delegate, uint256 _amount) external view returns (bool, bytes32);
    
    event Issued(address indexed _to, uint256 _amount, bytes _identity);
    event Revoked(address indexed _to, uint256 _amount);
    event Frozen(address indexed _account);
    event Unfrozen(address indexed _account);
    event Suspended(address indexed _account);
    event Unsuspended(address indexed _account);
    event IdentityUpdated(address indexed _account, bytes32 _identity);
}

/**
 * @title IIdentityRegistry
 * @dev Interface for the Identity Registry
 */
interface IIdentityRegistry {
    function registerIdentity(address _account, bytes32 _identity, address _country) external;
    function deleteIdentity(address _account) external;
    function setCountry(address _account, address _country) external;
    
    function identityOf(address _account) external view returns (bytes32);
    function countryOf(address _account) external view returns (address);
    function isVerified(address _account) external view returns (bool);
    
    event IdentityRegistered(address indexed _account, bytes32 _identity);
    event IdentityDeleted(address indexed _account);
    event CountryUpdated(address indexed _account, address indexed _country);
}

/**
 * @title ICompliance
 * @dev Interface for the Compliance module
 */
interface ICompliance {
    function canTransfer(address _from, address _to, uint256 _amount) external view returns (bool, bytes32);
    function moduleCheck(address _from, address _to, uint256 _amount) external view returns (bytes32);
    
    function added(address _identityRegistry) external;
    function removed() external;
}

/**
 * @title ITrustedIssuersRegistry
 * @dev Interface for the Trusted Issuers Registry
 */
interface ITrustedIssuersRegistry {
    function addTrustedIssuer(address _issuer, bytes32 _details) external;
    function removeTrustedIssuer(address _issuer) external;
    function isTrustedIssuer(address _issuer) external view returns (bool);
    function getTrustedIssuers() external view returns (address[] memory);
}
