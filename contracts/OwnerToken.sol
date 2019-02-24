// solium-disable linebreak-style
<<<<<<< HEAD
pragma solidity ^0.4.2;
=======
pragma solidity >=0.4.2;
import "./SafeMath.sol";
>>>>>>> 0.03

contract OwnerToken {

    string public name = "OwnerToken";
    string public symbol = "OTN";
    string public version = "v0.01";
    uint256 public totalSupply;
<<<<<<< HEAD
=======
    address public bank;

    using SafeMath for uint256;
    modifier bankFunc {
        require(bank == msg.sender,"only the bank can mint");
        _;
    }  
>>>>>>> 0.03

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );
    
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
<<<<<<< HEAD
    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to,  uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "you can't send more tokens than you possess");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }
=======
    constructor() public {
        totalSupply = 0;
        balanceOf[msg.sender] = 0;
        bank = msg.sender;
    }

    function mint(uint x, address _addressTo) public bankFunc {
        totalSupply = totalSupply.add(x);
        balanceOf[_addressTo] = balanceOf[_addressTo].add(x);


    }

    function transfer(address _receiver,  uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "you can't send more tokens than you possess");

        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
        balanceOf[_receiver] = balanceOf[_receiver].add(_value);

        emit Transfer(msg.sender, _receiver, _value);
        return true;
    }

    /*
    function altTransfer(address _sender, address _receiver, uint256 _value) public returns (bool success) {
        require(balanceOf[_sender] >= _value, "you can't send more tokens than you possess");
        balanceOf[_sender] = balanceOf[_sender].sub(_value);
        balanceOf[_receiver] = balanceOf[_receiver].add(_value);

        emit Transfer(_sender,  _receiver, _value);
        return true;
    }
    */

>>>>>>> 0.03
    function approve(address _spender, uint256 _value) public returns (bool success) {

        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {

        require(_value <= balanceOf[_from], "sending address does not have enough tokens");
        require(_value <= allowance[_from][msg.sender], "sending address is not authorized to send that many tokens");
        

<<<<<<< HEAD
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
=======
        balanceOf[_from].sub(_value);
        balanceOf[_to].add(_value);
>>>>>>> 0.03
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;

    }

}
