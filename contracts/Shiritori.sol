// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract Shiritori is Ownable {
    string private _history = "";

    // get shiritori history
    function history() external view returns (string memory) {
        return _history;
    }

    // contract-owner can set shiritori-history only once
    function setFirstWord(string calldata word) external onlyOwner {
        bool isEmptyWord = bytes(_history).length == 0;
        if (isEmptyWord) {
            // set first word on storage
            _history = word;
        }
    }
}
