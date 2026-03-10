// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import "../IModularCompliance.sol";
import "../../../registry/interface/IIdentityRegistry.sol";
import "../../../token/IToken.sol";
import "./AbstractModuleUpgradeable.sol";

/**
 * @title CountryRestrictModule
 * @dev Module that enforces country-based transfer restrictions
 */
contract CountryRestrictModule is AbstractModuleUpgradeable {

    mapping(address => mapping(uint16 => bool)) private _blockedSenderCountries;
    mapping(address => mapping(uint16 => bool)) private _blockedReceiverCountries;
    mapping(address => bool) private _countryRestrictionsEnabled;

    event SenderCountryBlocked(address indexed compliance, uint16 indexed country);
    event SenderCountryUnblocked(address indexed compliance, uint16 indexed country);
    event ReceiverCountryBlocked(address indexed compliance, uint16 indexed country);
    event ReceiverCountryUnblocked(address indexed compliance, uint16 indexed country);

    function initialize() external initializer {
        __AbstractModule_init();
    }

    function moduleCheck(
        address _from,
        address _to,
        uint256 _value,
        address _compliance
    ) external view override returns (bool) {
        // Allow minting (from = address(0))
        if (_from == address(0)) {
            return true;
        }

        if (!_countryRestrictionsEnabled[_compliance]) {
            return true;
        }

        IModularCompliance compliance = IModularCompliance(_compliance);
        address token = compliance.getTokenBound();
        IToken tokenContract = IToken(token);
        IIdentityRegistry identityRegistry = tokenContract.identityRegistry();
        
        uint16 fromCountry = identityRegistry.investorCountry(_from);
        uint16 toCountry = identityRegistry.investorCountry(_to);

        if (_blockedSenderCountries[_compliance][fromCountry]) {
            return false;
        }

        if (_blockedReceiverCountries[_compliance][toCountry]) {
            return false;
        }

        return true;
    }

    function enableCountryRestrictions(address _compliance) external onlyOwner {
        _countryRestrictionsEnabled[_compliance] = true;
    }

    function blockSenderCountry(address _compliance, uint16 _country) external onlyOwner {
        _blockedSenderCountries[_compliance][_country] = true;
        emit SenderCountryBlocked(_compliance, _country);
    }

    function blockReceiverCountry(address _compliance, uint16 _country) external onlyOwner {
        _blockedReceiverCountries[_compliance][_country] = true;
        emit ReceiverCountryBlocked(_compliance, _country);
    }

    function moduleTransferAction(address _from, address _to, uint256 _value) external override onlyComplianceCall {}
    function moduleMintAction(address _to, uint256 _value) external override onlyComplianceCall {}
    function moduleBurnAction(address _from, uint256 _value) external override onlyComplianceCall {}
    function canComplianceBind(address _compliance) external pure returns (bool) { return true; }
    function isPlugAndPlay() external pure returns (bool) { return true; }
    function name() public pure returns (string memory _name) { return "CountryRestrictModule"; }
}
