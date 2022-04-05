// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract Shiritori is Ownable {
    string[] private _history;
    bool private _isGameOver = false;

    modifier checkGameOver() {
        require(_isGameOver == false, "Game Over!");
        _;
    }

    // get string bytes length
    function getBytesLength(string memory str) private pure returns (uint256) {
        return bytes(str).length;
    }

    // get shiritori history
    function getHistory() external view returns (string[] memory) {
        return _history;
    }

    // contract-owner can set shiritori-history only once
    function setFirstWord(string calldata word) external checkGameOver onlyOwner {
        bool isEmptyHistory = _history.length == 0;
        if (isEmptyHistory) {
            // set first word on storage
            _history.push(word);
        }
    }

    event sayNextWordEvent(string word);

    // update shiritori history
    function sayNextWord(string calldata word) external checkGameOver {
        bool wordsAreSet = _history.length > 0;
        if (wordsAreSet) {
            _history.push(word);
            emit sayNextWordEvent(word);
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

    // check last hiragana is "ん"
    function lastHiraganaIsNN(string calldata word)
        private
        pure
        returns (bool)
    {
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
