// solium-disable linebreak-style
pragma solidity ^0.4.24;

contract Motion {

    struct Option {
        uint id;
        string name;
        uint voteCount;
    }
    mapping(address => bool) public voters;

    mapping(uint => Option) public options;

    uint public optionsCount;

    event votedEvent (
            uint indexed _optionId
    );

    constructor () public {
        addOption("Yes");
        addOption("No");
    }

    function addOption (string _name) private {
        optionsCount ++;
        options[optionsCount] = Option(optionsCount, _name, 0);
    }

    function vote (uint _optionId) public {

        require(!voters[msg.sender], "Sender has voted");

        require(_optionId > 0 && _optionId < optionsCount, "invalid option");
        voters[msg.sender] = true;
        options[_optionId].voteCount ++;

        // trigger voted event
        votedEvent(_optionId);

    }
    
}