const { deploy, open, eth, transfer, assertPromiseReverts } = require("../utils");
const { EVENT, checkLogs, debug, logs } = require("./utils");
const Prism = require("./../../../build/contracts/Prism");
const {
    ownerPrivateKey, owner,
    user1PrivateKey, user1,
    user2PrivateKey, user2,
    user3PrivateKey, user3,
} = require("../config");

// start test
contract("Prism", (accounts) => {

    it("Complete flow", async () => {
        let prism = await deploy(ownerPrivateKey, Prism);

        // transactions
        await transfer(user1PrivateKey, prism.address, 1); // withdraw
        await transfer(user2PrivateKey, prism.address, 1); // withdraw
        await transfer(user3PrivateKey, prism.address, 1); // withdraw
        await transfer(user3PrivateKey, prism.address, 1);
        await transfer(user3PrivateKey, prism.address, 1);

        // debug
        await debug(prism, accounts);

        // withdraw fee
        await prism.withdrawPrismFee();
    });
});
