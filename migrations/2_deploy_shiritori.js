const ShiritoriContract = artifacts.require("Shiritori");

module.exports = function (deployer) {
    deployer.deploy(ShiritoriContract);
}
