pragma solidity ^0.4.24;

import "../../vendor/tokenbridge-contracts/contracts/PermittableToken.sol";

/// @dev A contract to implement OWL tokens on a bridged chain (e.g. XDai).
/// Implements "burning" by allocating the amount to a dedicated receiver,
/// which can transfor it to the native chain (e.g. Mainnet) and complete
/// the burn there.
contract BridgedTokenOwl is PermittableToken {
    address public burnReceiver;

    event Burnt(address indexed from, address indexed user, uint256 amount);

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _chainId,
        address _burnReceiver
    ) public PermittableToken(_name, _symbol, _decimals, _chainId) {
        burnReceiver = _burnReceiver;
    }

    /// @dev Burns OWL.
    /// @param user Address of OWL owner
    /// @param amount Amount of OWL to be burnt
    function burnOWL(address user, uint256 amount) public {
        allowed[user][msg.sender] = allowed[user][msg.sender].sub(amount);
        balances[user] = balances[user].sub(amount);
        balances[burnReceiver] = balances[burnReceiver].add(amount);
        emit Burnt(msg.sender, user, amount);
        emit Transfer(user, burnReceiver, amount);
    }

    function setBurnReceiver(address newBurnReceiver) public {
        require(msg.sender == burnReceiver, "Only current receiver");
        burnReceiver = newBurnReceiver;
    }
}
