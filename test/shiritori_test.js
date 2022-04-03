const ShiritoriTest = artifacts.require("ShiritoriTest");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("ShiritoriTest", function (/* accounts */) {
  it("should assert true", async function () {
    await ShiritoriTest.deployed();
    return assert.isTrue(true);
  });
});
