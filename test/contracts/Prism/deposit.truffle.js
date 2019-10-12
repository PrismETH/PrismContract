const { deploy, open, eth, transfer, assertPromiseReverts } = require("../utils");
const { EVENT, checkLogs, debug, debugTransactions, logs } = require("./utils");
const Prism = require("./../../../build/contracts/Prism");
const {
    ownerPrivateKey, owner,
    user1PrivateKey, user1,
    user2PrivateKey, user2,
    user3PrivateKey, user3,
} = require("../config");

// start test
contract("Prism (Deposit)", (accounts) => {

    it("Deposit", async () => {
        let prism = await deploy(ownerPrivateKey, Prism);

        // send transaction
        await transfer(user1PrivateKey, prism.address, 0.02);

        // debug
        await debug(prism, accounts);
    });

    it("Deposit (incorrect)", async () => {
        let prism = await deploy(ownerPrivateKey, Prism);
        let user1 = await open(prism, user1PrivateKey, Prism);

        // send transactions
        const tx1 = transfer(user1PrivateKey, prism.address, 0.01);
        await assertPromiseReverts(tx1);
        const tx2 = transfer(user2PrivateKey, prism.address, 0.03);
        await assertPromiseReverts(tx2);
        const tx3 = transfer(user3PrivateKey, prism.address, 90);
        await assertPromiseReverts(tx3);

        // withdraw
        const w1 = user1.withdrawPrismFee();
        await assertPromiseReverts(w1);

        // debug
        await debug(prism, accounts);
    });

    it("Deposit (many users)", async () => {
        let prism = await deploy(ownerPrivateKey, Prism);

        // transactions
        const tx1 = await transfer(user1PrivateKey, prism.address, 0.02); // 0.019
        const tx2 = await transfer(user2PrivateKey, prism.address, 0.02); // 0.038 - 0.026 = 0.012
        const tx3 = await transfer(user3PrivateKey, prism.address, 0.02); // 0.031 - 0.026 = 0.005
        const tx4 = await transfer(user3PrivateKey, prism.address, 0.02); // 0.024
        const tx5 = await transfer(user3PrivateKey, prism.address, 0.02); // 0.043 - 0.026 = 0.017
        await prism.withdrawPrismFee();

        logs(prism);

        // check logs
        checkLogs(prism, [
            [EVENT.TRANSFER_ACCEPTED, { sender: user1, amount: eth(0.02) }],    // T - 1 
            [EVENT.TRANSFER_ACCEPTED, { sender: user2, amount: eth(0.02) }],    // T - 2
            [EVENT.WITHDRAW_ACCEPTED, { sender: user1, amount: eth(0.026) }],   // W - 2
            [EVENT.TRANSFER_ACCEPTED, { sender: user3, amount: eth(0.02) }],    // T - 3
            [EVENT.WITHDRAW_ACCEPTED, { sender: user2, amount: eth(0.026) }],   // W - 3
            [EVENT.TRANSFER_ACCEPTED, { sender: user3, amount: eth(0.02) }],    // T - 4
            [EVENT.TRANSFER_ACCEPTED, { sender: user3, amount: eth(0.02) }],    // T - 5
            [EVENT.WITHDRAW_ACCEPTED, { sender: user3, amount: eth(0.026) }],   // W - 5
            [EVENT.FEE_WITHDRAWN, { sender: owner, amount: eth(0.005) }],
        ]);

        // debug
        await debug(prism, accounts);
        debugTransactions([tx1, tx2, tx3, tx4, tx5]);
    });
});
