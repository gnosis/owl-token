pragma solidity ^0.5.2;

import "@gnosis.pm/util-contracts/contracts/Math.sol";
import "@gnosis.pm/util-contracts/contracts/GnosisStandardToken.sol";
import "@gnosis.pm/util-contracts/contracts/Proxy.sol";

contract TokenOWLUpdateFixture is Proxied, GnosisStandardToken {
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

    event Minted(address indexed to, uint256 amount);
    event Burnt(address indexed from, uint256 amount);

    modifier onlyCreator() {
        // R1
        require(msg.sender == creator, "Only the creator can do the operation");
        // if (msg.sender != auctioneer) {
        //     Log('onlyAuctioneer R1');
        //     return;
        // }
        _;
    }

    /// @dev Constructor of the contract OWL, which distributes tokens
    function setupTokenOWL() public {
        // just having a changed logic here
        minter = address(0);
    }

    /// @dev trickers the update process via the proxyMaster for a new address _masterCopy
    /// updating is only possible after 30 days
    function startMasterCopyCountdown(address _masterCopy) public onlyCreator {
        require(address(_masterCopy) != address(0), "The master copy must be a valid address");

        // Update masterCopyCountdown
        masterCopyCountdown.masterCopy = _masterCopy;
        masterCopyCountdown.timeWhenAvailable = now + 30 days;
    }

    /// @dev executes the update process via the proxyMaster for a new address _masterCopy
    function updateMasterCopy() public onlyCreator {
        require(address(masterCopyCountdown.masterCopy) != address(0), "The master copy must be a valid address");
        require(
            now >= masterCopyCountdown.timeWhenAvailable,
            "The master copy cannot be updated during the waiting period"
        );

        // Update masterCopy
        masterCopy = masterCopyCountdown.masterCopy;
    }

    /// @dev Set minter. Only the creator of this contract can call this.
    /// @param newMinter The new address authorized to mint this token
    function setMinter(address newMinter) public onlyCreator {
        minter = newMinter;
    }

    /// @dev Mints OWL.
    /// @param to Address to which the minted token will be given
    /// @param amount Amount of OWL to be minted
    function mintOWL(address to, uint amount) public {
        require(minter != address(0) && msg.sender == minter, "Only te minter can mint OWL");
        balances[to] = balances[to].add(amount);
        totalTokens = totalTokens.add(amount);
        emit Minted(to, amount);
    }

    /// @dev Burns OWL.
    /// @param amount Amount of OWL to be burnt
    function burnOWL(uint amount) public {
        balances[msg.sender] = balances[msg.sender].sub(amount);
        totalTokens = totalTokens.sub(amount);
        emit Burnt(msg.sender, amount);
    }

    function getMasterCopy() public view returns (address) {
        return masterCopy;
    }
}
