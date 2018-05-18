pragma solidity ^0.4.23;

import "@gnosis.pm/util-contracts/contracts/StandardToken.sol";
import "./ProxyMaster.sol";

contract TokenOWLProxy is ProxyMaster, StandardToken {
    using Math for *;

    string public constant name = "OWL Token";
    string public constant symbol = "OWL";
    uint8 public constant decimals = 18;

    struct masterCopyCountdownType {
        address masterCopy;
        uint timeWhenAvailable;
    }

    masterCopyCountdownType masterCopyCountdown;

    address public creator;
    address public minter;

    /// @dev Constructor of the contract OWL, which distributes tokens
    constructor(address proxied)
        ProxyMaster(proxied)
        public
    {
        creator = msg.sender;
    }
}