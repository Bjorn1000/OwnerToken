// solium-disable linebreak-style
pragma solidity ^0.4.2;
import "./OwnerToken.sol";
contract Proposal {
    // Model a option
    struct Option {
        uint id;
        string name;
        uint voteCount;
    }

    struct Voter {
        string name;
        bool hasVoted;
    }

    struct VoterWithAddress {
        address myAddress;
        string name;
    }

    struct SelectedProposal {
        uint id;
        string kind;
    }

    struct TransferMotion {
        uint id;
        uint amount;
        address receivingAccount;
        bool completed;
    }

    struct MintMotion {
        uint id;
        uint amount;
        bool completed;
    }

    OwnerToken public tokenContract;

    // Store accounts that have voted
    //mapping(address => bool) public voters;
    mapping(address => Voter) public voters;
    mapping(uint => VoterWithAddress) public votersByIndex;
    mapping(uint => MintMotion) public mintMotions;
    mapping(uint => TransferMotion) public transferMotions;

    // Store options
    // Fetch option
    mapping(uint => Option) public options;
    // Store options Count
    uint public optionsCount;
    uint public voterCount;
    uint public transferProposalCount;
    uint public mintProposalCount;
    SelectedProposal public selectedProposal;

    // voted event
    event votedEvent (
        uint indexed _optionId
    );

    event nameAssignEvent (
        address indexed _voterAddress
    );

    constructor (OwnerToken _tokenContract) public {
        addOption("Yes");
        addOption("No");
        tokenContract = _tokenContract;
    }

    function addOption (string _name) private {
        optionsCount ++;
        options[optionsCount] = Option(optionsCount, _name, 0);
    }

    function assignProposalSelection(uint _id, string _kind) public {
        selectedProposal = SelectedProposal(_id, _kind);
    }

    function compareStrings (string a, string b) public view returns (bool){
        return keccak256(a) == keccak256(b);
    }

    function assignVoterName(string _name) public {
        if(compareStrings(_name, "bank")){
            voters[msg.sender] = Voter(_name, true);
        }
        else {
            voterCount++;
            votersByIndex[voterCount] = VoterWithAddress(msg.sender, _name);
            voters[msg.sender] = Voter(_name, false);
            emit nameAssignEvent(msg.sender);
        }
        
    }

    function createTransferProposal(uint _amount, address _receivingAccount) public {
        transferProposalCount++;
        transferMotions[transferProposalCount] = TransferMotion(transferProposalCount, _amount, _receivingAccount, false);
    }

    function createMintProposal(uint _amount) public {
        mintProposalCount++;
        mintMotions[mintProposalCount] = MintMotion(mintProposalCount, _amount, false);
    }

    function vote (uint _optionId) public {
        // require that they haven't voted before
        //require(!voters[msg.sender]);
        require(!voters[msg.sender].hasVoted);

        // require a valid option
        require(_optionId > 0 && _optionId <= optionsCount);

        // record that voter has voted
        //voters[msg.sender] = true;
        voters[msg.sender].hasVoted = true;

        // update option vote Count
        options[_optionId].voteCount ++;

        // trigger voted event
        emit votedEvent(_optionId);
    }
}
