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

    // check shiritori history duplicate element
    function checkDuplicateHistory(string[] memory history, string memory word)
        private
        pure
        returns (bool)
    {
        for (uint256 i = 0; i < history.length; i++) {
            if (strEqual(history[i], word) == true) {
                return true;
            }
        }
        return false;
    }

    event sayNextWordEvent(string word);

    // contract-owner can set shiritori-history only once
    function setFirstWord(string calldata word)
        external
        checkGameOver
        onlyOwner
    {
        bool isEmptyHistory = _history.length == 0;
        if (isEmptyHistory) {
            emit sayNextWordEvent(word);

            // game over
            if (lastHiraganaIsNN(word) == true) {
                _isGameOver = true;
                _history.push(word);
                return;
            }
            // set first word on storage
            _history.push(word);
        }
    }

    // update shiritori history
    function sayNextWord(string calldata word) external checkGameOver {
        bool wordsAreSet = _history.length > 0;
        if (wordsAreSet) {
            emit sayNextWordEvent(word);

            // game over
            if (
                lastHiraganaIsNN(word) == true ||
                checkDuplicateHistory(_history, word) == true
            ) {
                _isGameOver = true;
                _history.push(word);
                return;
            }
            _history.push(word);
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

    // TODO: MUST comment out this function for testing purposes only when deploying
    function checkDuplicateHistoryTest(
        string[] memory history,
        string memory word
    ) external pure returns (bool) {
        return checkDuplicateHistory(history, word);
    }
}
