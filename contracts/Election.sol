// solium-disable linebreak-style
pragma solidity ^0.4.2;
import "./OwnerToken.sol";

contract Election {

    mapping(address => bool) public voters;
    mapping(uint => address) public votersByIndex;
    mapping(address => bool) public votersByAddress;
    mapping(address => mapping(uint => bool)) public voters2;
    //mapping(uint => Candidate) public candidates;
    uint public votersCount;
    uint public motionCount;

    mapping(uint => Motion) public motions;

    OwnerToken public tokenContract;

    // motionName - important because it's number after a space is used
    // voteFor - used in conjunction with voteAgainst to generate totalVotes
    // voteAgainst - votes registered against, shuts does votes
    // amount - used in both kinds of transfers, amount of tokens moving between accounts
    // addressTo - this is only used in transferance
    // motionId - used for selecting which motion you are voting on, identifer
    
    struct Motion {
        string motionName;
        uint amount;
        address addressTo;
        uint motionId;
        string motionState;
        uint voteFor;
        uint voteAgainst;
    }

    event votedEvent (
        uint indexed _motionId
    );
    event registrationEvent (
        address indexed _registeredAddress
    );

    event motionEvent (
        uint indexed _motionCount
    );



    function addMotion (string _motionName, uint _amount, address _addressTo, string _motionState, uint _voteFor, uint _voteAgainst) public {
        motionCount ++;
        motions[motionCount] = Motion(_motionName, _amount, _addressTo, motionCount, _motionState, 0, 0);

        emit motionEvent(motionCount);
    }

    function addVoter () public {
        votersCount ++;
        votersByIndex[votersCount] = msg.sender;
        votersByAddress[msg.sender] = true;

        emit registrationEvent(msg.sender);
    }

    function Election (OwnerToken _tokenContract) public {
        /*
        addMotion("Motion 1", 100, 0x0, "doing", 99, 98);
        addMotion("Motion 2", 200, 0x0, "done", 0, 99);
        addMotion("Motion 3", 300, 0x0, "todo", 0, 1);
        */
        tokenContract = _tokenContract;
    }



    function vote (uint _motionId, uint _option) public {
        if(_option == 0) {
            motions[_motionId].voteAgainst ++;
        }
        else {
            motions[_motionId].voteFor ++;
        }

        // record that voter has voted
        voters[msg.sender] = true;

        voters2[msg.sender][_motionId] = true;

        if(votersCount == motions[_motionId].voteFor + motions[_motionId].voteAgainst) {
            motions[_motionId].motionState = "doing";
        }

        emit votedEvent(_motionId);
        
    }



    function executeMotion(uint _motionId) public {
        // needs operations from previous versions



        // update motionStaate
        motions[_motionId].motionState = "done";
    }
}
