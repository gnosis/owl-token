pragma solidity ^0.5.2;

import "@gnosis.pm/util-contracts/contracts/Math.sol";
import "@gnosis.pm/util-contracts/contracts/GnosisStandardToken.sol";

contract FakeToken is GnosisStandardToken {
    using GnosisMath for *;

    string public constant name = "Fake Token";
    string public constant symbol = "FAKE";
    uint8 public constant decimals = 18;

    /// @dev Creates a fake token where the creator starts with uint max worth of coin
    constructor() public {
        balances[msg.sender] = 2 ** 256 - 1;
        emit Transfer(address(0), msg.sender, 2 ** 256 - 1);
        totalTokens = 2 ** 256 - 1;
    }

}
