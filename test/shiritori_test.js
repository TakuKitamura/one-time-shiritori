const Shiritori = artifacts.require("Shiritori");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("ShiritoriTest", function ( /* accounts */ ) {
    describe("deployment", () => {
        it("has been deployed successfully", async () => {
            const shiritori = await Shiritori.deployed();
            assert(shiritori, "contract failed to deploy");
        });
    });
});