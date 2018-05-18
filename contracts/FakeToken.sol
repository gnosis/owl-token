pragma solidity ^0.4.23;

import "@gnosis.pm/util-contracts/contracts/Math.sol";
import "@gnosis.pm/util-contracts/contracts/StandardToken.sol";

contract FakeToken is StandardToken {
    using Math for *;

    string public constant name = "Fake Token";
    string public constant symbol = "FAKE";
    uint8 public constant decimals = 18;

    /// @dev Creates a fake token where the creator starts with uint max worth of coin
    constructor()
        public
    {
        balances[msg.sender] = 2**256-1;
        emit Transfer(0, msg.sender, 2**256-1);
        totalTokens = 2**256-1;
    }

}
