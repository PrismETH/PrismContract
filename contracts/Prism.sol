pragma solidity >=0.4.21 <0.6.0;

import '../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol';

/**
 * Error codes
 *
 * ERR_0 - Contract is not running
 * ERR_1 - Incorrect level
 * ERR_2 - Sender is not an owner
*/

contract Prism {
    using SafeMath for uint256;

    /**
     * Available events
    */
    event TransferAccepted(address indexed sender, bytes32 indexed id, uint256 amount);
    event WithdrawAccepted(address indexed sender, bytes32 indexed id, uint256 amount);
    event FeeWithdrawn(address indexed sender, uint256 amount);

    struct Data {
        bytes32 id;
        address payable sender;
    }

    uint256[7] private _levels = [
        2 * 10**16,
        5 * 10**16,
        10 * 10**16,
        50 * 10**16,
        100 * 10**16,
        200 * 10**16,
        1000 * 10**16
    ];

    uint256 public income = 130;
    uint256 public prismFee = 0;
    address payable public owner;

    uint256 private _index = 0;
    mapping(uint256 => Data[]) private _data;
    mapping(uint256 => uint256) private _paid;
    mapping(uint256 => uint256) private _balances;
    mapping(uint256 => mapping(address => uint[])) private _dataMap;

    /**
     * Checks if sender is owner
    */
    modifier onlyOwner() {
        require(msg.sender == owner, "ERR_2");
        _;
    }

    /**
     * Checks if level is correct
    */
    modifier isInLevels(uint256 value) {
        bool isCorrect = false;
        for (uint256 i = 0; i < _levels.length; i++) {
            if (_levels[i] == value) {
                isCorrect = true;
                break;
            }
        }
        require(isCorrect, "ERR_1");
        _;
    }

    /**
     * Sets owner
    */
    constructor() public {
        owner = msg.sender;
    }

    /**
     * Deposit eth
    */
    function() external payable
        isInLevels(msg.value)
    {
        uint256 level = msg.value;
        Data memory data;
        data.id = _getId(_index);
        data.sender = msg.sender;

        // save
        uint256 fee = msg.value * 5 / 100;
        prismFee = prismFee.add(fee);
        _data[level].push(data);
        _balances[level] = _balances[level].add(msg.value - fee);
        _dataMap[level][msg.sender].push(_index);
        _index = _index.add(1);

        // transfer accepted
        emit TransferAccepted(msg.sender, data.id, msg.value);

        // withdraw accepted
        checkNextWithdraw(level);
    }

    /**
     * Gets levels
    */
    function getLevels() public view returns (uint256[7] memory) {
        return _levels;
    }

    /**
     * Gets next withdraw
    */
    function getNextWithdraw(uint256 level) public view returns (bytes32) {
        if (_data[level].length > 0) {
            return _data[level][_paid[level]].id;
        } else {
            return 0;
        }
    }

    /**
     * Gets balance
    */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * Checks next transfer
    */
    function checkNextWithdraw(uint256 level) public payable {
        uint256 amount = _getAmount(level);
        uint256 balance = _balances[level];
        if (balance >= amount) {
            Data memory data = _data[level][_paid[level]];
            _balances[level] = _balances[level].sub(amount);
            _paid[level] = _paid[level].add(1);

            // transfer
            data.sender.transfer(amount);

            // accept
            emit WithdrawAccepted(data.sender, data.id, amount);
        }
    }

    /**
    * Withdraws collected fee
    */
    function withdrawPrismFee() public payable onlyOwner() {
        uint256 amount = prismFee;
        prismFee = 0;
        owner.transfer(amount);
        emit FeeWithdrawn(owner, amount);
    }

    /**
     * Gets id
     */
    function _getId(uint256 index) private pure returns (bytes32) {
        return keccak256(abi.encode(index));
    }

    /**
     * Gets amount
    */
     function _getAmount(uint256 level) private view returns (uint256) {
        return level * income / 100;
    }
}