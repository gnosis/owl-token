pragma solidity ^0.4.18;

import "@gnosis.pm/gnosis-core-contracts/contracts/Utils/Math.sol";
import "@gnosis.pm/gnosis-core-contracts/contracts/Tokens/StandardToken.sol";
import "./ProxyMaster.sol";


contract TokenOWL is ProxiedMaster, StandardToken {
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

    mapping (address => mapping (address => uint)) public allowancesToBurn;

    event Minted(address indexed to, uint256 amount);
    event Burnt(address indexed from, address indexed user, uint256 amount);

    modifier onlyCreator() {
        // R1
        require(msg.sender == creator);
        _;
    }
    /// @dev trickers the update process via the proxyMaster for a new address _masterCopy 
    /// updating is only possible after 30 days
    function startMasterCopyCountdown (
        address _masterCopy
     )
        public
        onlyCreator()
    {
        require(address(_masterCopy) != 0);

        // Update masterCopyCountdown
        masterCopyCountdown.masterCopy = _masterCopy;
        masterCopyCountdown.timeWhenAvailable = now + 30 days;
    }

     /// @dev executes the update process via the proxyMaster for a new address _masterCopy
    function updateMasterCopy()
        public
        onlyCreator()
    {   
        require(address(masterCopyCountdown.masterCopy) != 0);
        require(now >= masterCopyCountdown.timeWhenAvailable);

        // Update masterCopy
        masterCopy = masterCopyCountdown.masterCopy;
    }

    /// @dev Set minter. Only the creator of this contract can call this.
    /// @param newMinter The new address authorized to mint this token
    function setMinter(address newMinter)
        public
        onlyCreator()
    {
        minter = newMinter;
    }

    /// @dev Mints OWL.
    /// @param to Address to which the minted token will be given
    /// @param amount Amount of OWL to be minted
    function mintOWL(address to, uint amount)
        public
        returns (bool)
    {
        require(minter != 0 && msg.sender == minter);
        balances[to] = balances[to].add(amount);
        totalTokens = totalTokens.add(amount);
        Minted(to, amount);
        return true;
    }

    function approveToBurn(address burner, uint value)
        public
        returns (bool)
    {
        allowancesToBurn[msg.sender][burner] = value;
        ApprovalToBurn(msg.sender, burner, value);
        return true;
    }

    /// @dev Burns OWL.
    /// @param amount Amount of OWL to be burnt
    function burnOWL(address user, uint amount)
        public
        returns (bool)
    {
        allowancesToBurn[user][msg.sender].sub(amount);
        balances[user].sub(amount);
        totalTokens = totalTokens.sub(amount);
        Burnt(msg.sender, user, amount);
        return true;
    }
    
    function getMasterCopy()
        public
        returns(address)
    {
        return masterCopy;
    }

}
