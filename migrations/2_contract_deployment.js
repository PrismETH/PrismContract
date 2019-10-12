const Prism = artifacts.require("Prism");

module.exports = async function (deployer) {
    await deployer.deploy(Prism);

    let prism = await Prism.deployed();
    console.log("Prism", prism.address);
};