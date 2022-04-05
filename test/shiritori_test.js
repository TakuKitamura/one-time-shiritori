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
        const history = await shiritori.history({
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
        history = await shiritori.history({
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
            assert(error.reason, errorMessage, "error-reason is not expected");
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
        const history = await shiritori.history({
            from: accounts[0]
        });

        assert.equal(history, "しりとり,りんご,ごりら");
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

    it("getLastHiraganaTest", async () => {
        const shiritori = await Shiritori.deployed()
        const firsthiragana = await shiritori.getLastHiraganaTest("あいう", {
            from: accounts[0]
        });
        assert.equal("う", firsthiragana);
    });
})