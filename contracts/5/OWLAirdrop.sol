pragma solidity ^0.5.2;

import "@gnosis.pm/gno-token/contracts/TokenGNO.sol";
import "./TokenOWL.sol";

contract OWLAirdrop {
    using GnosisMath for *;

    TokenOWL public tokenOWL;
    TokenGNO public tokenGNO;
    mapping(address => uint) public lockedGNO;
    uint public endTime;
    uint public multiplier;

    /// @dev Creates and starts the airdrop
    /// @param _tokenOWL The OWL token contract
    /// @param _tokenGNO The GNO token contract
    /// @param _endTime The unix epoch timestamp in seconds of the time airdrop ends
    constructor(TokenOWL _tokenOWL, TokenGNO _tokenGNO, uint _endTime, uint _multiplier) public {
        require(block.timestamp <= _endTime, "The end time cannot be in the past");
        tokenOWL = _tokenOWL;
        tokenGNO = _tokenGNO;
        endTime = _endTime;
        multiplier = _multiplier;
    }

    /// @dev Locks GNO inside this contract and mints OWL for GNO if endTime is not past
    /// @param amount Amount of GNO to lock
    function lockGNO(uint amount) public {
        require(block.timestamp <= endTime, "The locking period has ended");
        require(tokenGNO.transferFrom(msg.sender, address(this), amount), "The GNO transfer must succeed");
        lockedGNO[msg.sender] = lockedGNO[msg.sender].add(amount);
        tokenOWL.mintOWL(msg.sender, amount.mul(multiplier));
    }

    /// @dev Withdraws locked GNO if endTime is past
    function withdrawGNO() public {
        require(block.timestamp > endTime, "It's not allowed to withdraw during the locking time");
        require(tokenGNO.transfer(msg.sender, lockedGNO[msg.sender]), "The GNO withdrawal must succeed");
        lockedGNO[msg.sender] = 0;
    }
}
