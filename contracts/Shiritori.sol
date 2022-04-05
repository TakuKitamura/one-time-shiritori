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

    // TODO: hiragana validation check
    // slice hiragana string with begin and end index
    function hiraganaSlice(
        string calldata hiragana,
        uint256 begin,
        uint256 end
    ) private pure returns (string calldata) {
        bytes calldata hiraganaBytes = bytes(hiragana);
        return string(hiraganaBytes[begin:end]);
    }

    function getLastHiragana(string calldata word)
        private
        pure
        returns (string memory)
    {
        return
            hiraganaSlice(word, getBytesLength(word) - 3, getBytesLength(word));
    }

    function strEqual(string memory str1, string memory str2)
        private
        pure
        returns (bool)
    {
        return keccak256(bytes(str1)) == keccak256(bytes(str2));
    }

    function lastWordIsNN(string calldata word) external pure returns (bool) {
        string memory lastHiragana = getLastHiragana(word);
        return strEqual(lastHiragana, unicode"ん");
    }

    // TODO: MUST comment out this function for testing purposes only when deploying
    function hiraganaSliceTest(
        string calldata hiragana,
        uint256 begin,
        uint256 end
    ) external pure returns (string calldata) {
        return hiraganaSlice(hiragana, begin, end);
    }

    // TODO: MUST comment out this function for testing purposes only when deploying
    function getLastHiraganaTest(string calldata word)
        external
        pure
        returns (string memory)
    {
        return getLastHiragana(word);
    }
}
