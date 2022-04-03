// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract Shiritori is Ownable {
    string private _history = "";

    // get string bytes length
    function getBytesLength(string memory str) private pure returns (uint256) {
        return bytes(str).length;
    }

    // get shiritori history
    function history() external view returns (string memory) {
        return _history;
    }

    // contract-owner can set shiritori-history only once
    function setFirstWord(string calldata word) external onlyOwner {
        bool isEmptyHistory = getBytesLength(_history) == 0;
        if (isEmptyHistory) {
            // set first word on storage
            _history = word;
        }
    }

    function sayNextWord(string calldata word) external {
        bool wordsAreSet = getBytesLength(_history) > 0;
        if (wordsAreSet) {
            _history = string(bytes.concat(bytes(_history), ",", bytes(word)));
        }
    }
}
