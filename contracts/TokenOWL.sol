pragma solidity ^0.4.18;

import "./Math.sol";
import "./StandardToken.sol";

contract TokenOWL is StandardToken {
    using Math for *;

    string public constant name = "OWL Token";
    string public constant symbol = "OWL";
    uint8 public constant decimals = 18;

    event Minted(address indexed to, uint256 amount);
    event Burnt(address indexed from, uint256 amount);

    address public creator;
    address public minter;

    /// @dev Constructor of the contract OWL, which distributes tokens
    function TokenOWL()
        public
    {
        creator = msg.sender;
    }

    /// @dev Set minter. Only the creator of this contract can call this.
    /// @param newMinter The new address authorized to mint this token
    function setMinter(address newMinter)
        public
    {
        require(msg.sender == creator);
        minter = newMinter;
    }

    /// @dev Mints OWL.
    /// @param to Address to which the minted token will be given
    /// @param amount Amount of OWL to be minted
    function mintOWL(address to, uint amount)
        public
    {
        require(minter != 0 && msg.sender == minter);
        balances[to] = balances[to].add(amount);
        totalTokens = totalTokens.add(amount);
        Minted(to, amount);
    }

    /// @dev Burns OWL.
    /// @param amount Amount of OWL to be burnt
    function burnOWL(uint amount)
        public
    {
        balances[msg.sender] = balances[msg.sender].sub(amount);
        totalTokens = totalTokens.sub(amount);
        Burnt(msg.sender, amount);
    }
}
