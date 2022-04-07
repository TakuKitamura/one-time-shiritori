const Shiritori = artifacts.require("Shiritori");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("deployment", () => {
    it("has been deployed successfully", async () => {
        const shiritori = await Shiritori.deployed();
        assert(shiritori, "contract failed to deploy");
    });
});

contract("when first word is set by the owner", (accounts) => {
    it("set first word", async () => {
        const shiritori = await Shiritori.deployed()
        const firstWord = "しりとり";
        await shiritori.setFirstWord(firstWord, {
            from: accounts[0]
        });
        const history = await shiritori.getHistory({
            from: accounts[0]
        });
        assert.equal(history, firstWord, "first word was not set");
    });
});

contract("when first word is set by the owner", (accounts) => {
    it("call setFirstWord twice", async () => {
        const shiritori = await Shiritori.deployed()
        const firstWord = "しりとり";
        await shiritori.setFirstWord(firstWord, {
            from: accounts[0],
        });
        await shiritori.setFirstWord("りんご", {
            from: accounts[0]
        });
        history = await shiritori.getHistory({
            from: accounts[0]
        });
        assert.equal(history, firstWord, "don't set to the second word");
    });
});

contract("when word is set by the not-owner", (accounts) => {
    it("set first word", async () => {
        const shiritori = await Shiritori.deployed()
        try {
            await shiritori.setFirstWord("しりとり", {
                from: accounts[1]
            });
        } catch (error) {
            const errorMessage = "Ownable: caller is not the owner"
            assert.equal(error.reason, errorMessage, "error-reason is not expected");
            return
        }
        assert.equal(false, "setFirstWord should not be called by non-owner");
    });
});

contract("say next word", (accounts) => {
    it("しりとり,りんご,ごりら", async () => {
        const shiritori = await Shiritori.deployed()
        const firstWord = "しりとり";
        await shiritori.setFirstWord(firstWord, {
            from: accounts[0]
        });
        await shiritori.sayNextWord("りんご", {
            from: accounts[1]
        });
        await shiritori.sayNextWord("ごりら", {
            from: accounts[0]
        });
        const history = await shiritori.getHistory({
            from: accounts[0]
        });

        assert.equal(history, "しりとり,りんご,ごりら");
    })
});

contract("receive event", (accounts) => {
    it("receive say next word event", async () => {
        const shiritori = await Shiritori.deployed()
        const firstWord = "しりとり";
        const setWordTx = await shiritori.setFirstWord(firstWord, {
            from: accounts[0]
        });

        assert.equal(setWordTx.logs[0].args[0], "しりとり", "event is not received");
        const sayNextTx = await shiritori.sayNextWord("りんご", {
            from: accounts[1]
        });

        assert.equal(sayNextTx.logs[0].args[0], "しりとり,りんご", "event is not received");
    })
});

contract("string manipulation", (accounts) => {

    it("getFirstHiragana with hiraganaSlice func", async () => {
        const shiritori = await Shiritori.deployed()
        const firsthiragana = await shiritori.hiraganaSliceTest("あいう", 0, 3, {
            from: accounts[0],
        });
        assert.equal("あ", firsthiragana);
    });

    it("getCenterHiragana with hiraganaSlice func", async () => {
        const shiritori = await Shiritori.deployed()
        const firsthiragana = await shiritori.hiraganaSliceTest("あいう", 3, 6, {
            from: accounts[0],
        });
        assert.equal("い", firsthiragana);
    });

    it("getLastHiragana with hiraganaSlice func", async () => {
        const shiritori = await Shiritori.deployed()
        const firsthiragana = await shiritori.hiraganaSliceTest("あいう", 6, 9, {
            from: accounts[0]
        });
        assert.equal("う", firsthiragana);
    });

    it("getFirstHiraganaTest", async () => {
        const shiritori = await Shiritori.deployed()
        const firsthiragana = await shiritori.getFirstHiraganaTest("あいう", {
            from: accounts[0]
        });
        assert.equal("あ", firsthiragana);
    });

    it("getLastHiraganaTest", async () => {
        const shiritori = await Shiritori.deployed()
        const firsthiragana = await shiritori.getLastHiraganaTest("あいう", {
            from: accounts[0]
        });
        assert.equal("う", firsthiragana);
    });

    it("checkDuplicateHistoryTest", async () => {
        const shiritori = await Shiritori.deployed()
        let isDuplicate = await shiritori.checkDuplicateHistoryTest(["しりとり", "りんご", "ごりら", "らいす", "すり"], "りんご", {
            from: accounts[0]
        });
        assert.equal(true, isDuplicate, "isDuplicate must be true");

        isDuplicate = await shiritori.checkDuplicateHistoryTest(["しりとり", "りんご", "ごりら", "らいす", "すり"], "りす", {
            from: accounts[0]
        });
        assert.equal(false, isDuplicate, "isDuplicate must be false");
    })

    it("getLastHiraganaTest", async () => {
        const shiritori = await Shiritori.deployed()
        const haveWordConnection = await shiritori.checkWordConnectionTest("あか", "かさ");
        assert.equal(true, haveWordConnection, "haveWordConnection must be true");
    });
})

contract("shiritori join test1", (accounts) => {
    it("しりとり りんご ごはん", async () => {
        const shiritori = await Shiritori.deployed()
        const firstWord = "しりとり";
        await shiritori.setFirstWord(firstWord, {
            from: accounts[0]
        });
        await shiritori.sayNextWord("りんご", {
            from: accounts[1]
        });
        await shiritori.sayNextWord("ごはん", {
            from: accounts[2]
        });

        const history = await shiritori.getHistory({
            from: accounts[0]
        });

        assert.equal("しりとり,りんご,ごはん", history);

    })
})

contract("shiritori join test2", (accounts) => {
    it("しりとり りんご ごはん んじゃめな", async () => {
        const shiritori = await Shiritori.deployed()
        const firstWord = "しりとり";
        await shiritori.setFirstWord(firstWord, {
            from: accounts[0]
        });
        await shiritori.sayNextWord("りんご", {
            from: accounts[1]
        });
        await shiritori.sayNextWord("ごはん", {
            from: accounts[2]
        });


        try {
            await shiritori.sayNextWord("んじゃめな", {
                from: accounts[3]
            });
        } catch (error) {
            assert.equal("Game Over!", error.reason, "error-reason is not expected");
            return
        }
        assert.equal(false, "this game is not game over");
    })
})

contract("shiritori join test3", (accounts) => {
    it("みかん んじゃめな", async () => {
        const shiritori = await Shiritori.deployed()
        await shiritori.setFirstWord("みかん", {
            from: accounts[0]
        });
        try {
            await shiritori.sayNextWord("んじゃめな", {
                from: accounts[1]
            });
        } catch (error) {
            assert.equal("Game Over!", error.reason, "error-reason is not expected");
            return
        }
        assert.equal(false, "this game is not game over");
    })
})

contract("shiritori join test4", (accounts) => {
    it("しりとり りんご", async () => {
        const shiritori = await Shiritori.deployed()
        await shiritori.setFirstWord("しりとり", {
            from: accounts[0]
        });
        await shiritori.sayNextWord("あり", {
            from: accounts[1]
        });

        await shiritori.sayNextWord("かさ", {
            from: accounts[2]
        });

        await shiritori.sayNextWord("りんご", {
            from: accounts[3]
        });

        const history = await shiritori.getHistory({
            from: accounts[4]
        });

        assert.equal("しりとり,りんご", history);
    })
})