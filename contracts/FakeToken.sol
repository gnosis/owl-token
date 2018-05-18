pragma solidity ^0.4.18;

import "@gnosis.pm/pm-contracts/contracts/Utils/Math.sol";
import "@gnosis.pm/pm-contracts/contracts/Tokens/StandardToken.sol";

contract FakeToken is StandardToken {
    using Math for *;

    string public constant name = "Fake Token";
    string public constant symbol = "FAKE";
    uint8 public constant decimals = 18;

    /// @dev Creates a fake token where the creator starts with uint max worth of coin
    function FakeToken()
        public
    {
        balances[msg.sender] = 2**256-1;
        Transfer(0, msg.sender, 2**256-1);
        totalTokens = 2**256-1;
    }

}
