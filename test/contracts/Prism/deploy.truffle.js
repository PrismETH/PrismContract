const { deploy, assertPromiseNotEqual } = require("../utils");
const { debug } = require("./utils");
const Prism = require("./../../../build/contracts/Prism");
const {
    emptyShortAddress,
    ownerPrivateKey,
} = require("../config");

// start test
contract("Prism (Deploy)", (accounts) => {

    it("Deploy", async () => {
        let prism = await deploy(ownerPrivateKey, Prism);

        // deploy
        await assertPromiseNotEqual(prism.address, emptyShortAddress, "Incorrect contract address");

        // debug
        await debug(prism, accounts);
    });
});
