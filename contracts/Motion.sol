// solium-disable linebreak-style
pragma solidity ^0.4.24;
import "./OwnerToken.sol";


contract Motion {


    struct Option {
        uint id;
        string name;
        uint voteCount;
    }

    struct NextGenVoter {
        string name;
        bool votingPrivileges;
        uint256 tokens;
    }
    mapping(address => bool) public voters;
    mapping(uint => Option) public options;
    mapping(address => NextGenVoter) public newVoters;
    mapping(uint => NextGenVoter) public indexVoters;
    uint public optionsCount;
    uint public voteLimit;
    uint public totalVoteCount;
    uint public voterCount;
    OwnerToken public tokenContract;

    event votedEvent (
            uint indexed _optionId
    );

    constructor (OwnerToken _tokenContract) public {
        addOption("Yes");
        addOption("No");
        voteLimit = 2;
        totalVoteCount = 0;
        tokenContract = _tokenContract;
        voterCount = 0;

        addVoter(0x78DA4131D0CdAf0E9E59551A950d9CB0fce006E4, "Osbjorn Gulbranson", true);
        addVoter(0x1e209198167a73DC52FC6115eD4aaa2C23b56C32, "Nik Edmiidz", true);
        addVoter(0xd539D9c811e8dEe3ddBE792b43Bd35CcBf9F339F, "TokenFactory", false);
    }

    function addVoter (address _theirAddress, string _theirName, bool _votingRights) private {
        voterCount ++;
        newVoters[_theirAddress] = NextGenVoter(_theirName, _votingRights, 0);
        indexVoters[voterCount] = NextGenVoter(_theirName, _votingRights, 0);
    }



    function addOption (string _name) private {
        optionsCount ++;
        options[optionsCount] = Option(optionsCount, _name, 0);
    }

    function vote (uint _optionId) public {

        require(!voters[msg.sender], "Sender has voted");
        require(totalVoteCount < voteLimit, "Too many votes");
        require(_optionId > 0 && _optionId < optionsCount, "invalid option");

        voters[msg.sender] = true;
        options[_optionId].voteCount ++;

        // trigger voted event
        emit votedEvent(_optionId);
        totalVoteCount++;

    }


    
}