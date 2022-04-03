const Shiritori = artifacts.require("Shiritori");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("ShiritoriTest", function (accounts) {
    const ownerAddress = accounts[0];
    const notOwnerAddress = accounts[1];
    describe("deployment", () => {
        it("has been deployed successfully", async () => {
            const shiritori = await Shiritori.deployed();
            assert(shiritori, "contract failed to deploy");
        });
    });

    describe("when word is set by the owner", () => {
        it("set first word", async () => {
            const shiritori = await Shiritori.deployed()
            const firstWord = "しりとり";
            await shiritori.setFirstWord(firstWord, {
                from: ownerAddress
            });
            const history = await shiritori.history({
                from: ownerAddress
            });

            assert.equal(history, firstWord, "first word was not set");
        });

        it("call setFirstWord twice", async () => {
            const shiritori = await Shiritori.deployed()
            const firstWord = "しりとり";
            await shiritori.setFirstWord(firstWord, {
                from: ownerAddress,
            });

            await shiritori.setFirstWord("りんご", {
                from: ownerAddress
            });
            history = await shiritori.history({
                from: ownerAddress
            });

            assert.equal(history, firstWord, "don't set to the second word");

        });
    });

    describe("when word is set by the not-owner", () => {
        it("set first word", async () => {
            const shiritori = await Shiritori.deployed()
            try {
                await shiritori.setFirstWord("しりとり", {
                    from: notOwnerAddress
                });
            } catch (error) {
                const errorMessage = "Ownable: caller is not the owner"
                assert(error.reason, errorMessage, "error-reason is not expected");
                return
            }

            assert.equal(false, "setFirstWord should not be called by non-owner");
        });
    });

    describe("get shiritori history", () => {
        const firstWord = "しりとり";
        it("get first word by owner", async () => {
            const shiritori = await Shiritori.deployed()
            await shiritori.setFirstWord(firstWord, {
                from: ownerAddress
            });
            await shiritori.history({
                from: ownerAddress
            });
        })
        it("get first word by not-owner", async () => {
            const shiritori = await Shiritori.deployed()
            await shiritori.setFirstWord(firstWord, {
                from: ownerAddress
            });
            await shiritori.history({
                from: notOwnerAddress
            });
        })

    });
});