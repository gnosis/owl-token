pragma solidity ^0.5.2;

import "@gnosis.pm/util-contracts/contracts/GnosisStandardToken.sol";
import "@gnosis.pm/util-contracts/contracts/Proxy.sol";

contract TokenOWLProxy is Proxy, GnosisStandardToken {
    using GnosisMath for *;

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
    constructor(address proxied) public Proxy(proxied) {
        creator = msg.sender;
    }
}
