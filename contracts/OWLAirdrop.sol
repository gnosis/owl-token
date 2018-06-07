pragma solidity ^0.4.21;

import "@gnosis.pm/gno-token/contracts/TokenGNO.sol";
import "./TokenOWL.sol";

contract OWLAirdrop {
    using Math for *;

    TokenOWL public tokenOWL;
    TokenGNO public tokenGNO;
    mapping(address => uint) public lockedGNO;
    uint public endTime;

    /// @dev Creates and starts the airdrop
    /// @param _tokenOWL The OWL token contract
    /// @param _tokenGNO The GNO token contract
    /// @param _endTime The unix epoch timestamp in seconds of the time airdrop ends
    function OWLAirdrop(TokenOWL _tokenOWL, TokenGNO _tokenGNO, uint _endTime)
        public
    {
        require(now <= _endTime);
        tokenOWL = _tokenOWL;
        tokenGNO = _tokenGNO;
        endTime = _endTime;
    }

    /// @dev Locks GNO inside this contract and mints OWL for GNO if endTime is not past
    /// @param amount Amount of GNO to lock
    function lockGNO(uint amount)
        public
    {
        require(now <= endTime && tokenGNO.transferFrom(msg.sender, this, amount));
        lockedGNO[msg.sender] = lockedGNO[msg.sender].add(amount);
        tokenOWL.mintOWL(msg.sender, amount.mul(10));
    }

    /// @dev Withdraws locked GNO if endTime is past
    function withdrawGNO()
        public
    {
        require(now > endTime && tokenGNO.transfer(msg.sender, lockedGNO[msg.sender]));
        lockedGNO[msg.sender] = 0;
    }
}