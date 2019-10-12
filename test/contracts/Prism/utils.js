const assert = require("assert");
const { ContractFactory, utils: { formatEther } } = require("ethers");
const Prism = require("./../../../build/contracts/Prism");
const { getProvider, getWallet } = require("../utils");
const { parseLogs } = require("../logs");
const {
    emptyLongAddress,
    ownerPrivateKey,
} = require("../config");

const EVENT = {
    TRANSFER_ACCEPTED: "TransferAccepted",
    WITHDRAW_ACCEPTED: "WithdrawAccepted",
    FEE_WITHDRAWN: "FeeWithdrawn",
};

// deploy
const deploy = async () => {
    const wallet = getWallet(ownerPrivateKey);
    const prismFactory = new ContractFactory(Prism.abi, Prism.bytecode, wallet);
    const prism = await prismFactory.deploy();
    return { prism };
};

// auto deploy
const autoDeploy = async () => {
    const { prism } = await deploy();
    return prism;
};

// check logs
const checkLogs = async (prism, events) => {
    const filter = {
        fromBlock: 0,
        address: prism.address,
        topics: []
    };
    const provider = getProvider();
    const logs = await provider.getLogs(filter);
    const eventsLogs = parseLogs(logs, Prism.abi);
    assert(events.length == eventsLogs.length, `Incorrect events length ${events.length} to ${eventsLogs.length}`);
    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const eventLog = eventsLogs[i];
        assert(event[0] == eventLog.name, `Incorrect event name: ${event[0]} and ${eventLog.name}`);
        const argsEvent = event[1] || {};
        const eventKeys = Object.keys(argsEvent);
        for (let j = 0; j < eventKeys.length; j++) {
            const eventKey = eventKeys[j];
            const argEvent = argsEvent[eventKey].toString();
            const argEventLog = eventLog.args[eventKey].toString();
            assert(argEvent == argEventLog, `Mismatch argument: ${argEvent} and ${argEventLog}`);
        }
    }
};

// debug
const debug = async (prism, accounts) => {
    console.info(`----------------------`);
    const user = await prism.signer.getAddress();
    console.info(`Debug user:`, user);
    const address = await prism.address;
    console.info(`Address:`, address);
    const balance = await prism.getBalance();
    console.info(`Balance:`, formatEther(balance));
    const fee = await prism.prismFee();
    console.info(`Fee:`, formatEther(fee));
    console.info(`Next withdraws`);
    const levels = await prism.getLevels();
    for (const level of levels) {
        const nextWithdraw = await prism.getNextWithdraw(level);
        if (nextWithdraw !== emptyLongAddress) {
            console.info(`-`, `Level`, formatEther(level.toString()), `ETH:`, nextWithdraw);
        }
    }
    if (accounts && accounts.length) {
        await _balances(accounts);
    }
    console.info(`----------------------`);
};

// debug transactions
const debugTransactions = (transactions) => {
    console.info(`----------------------`);
    console.info(`Transactions gas used`);
    for (const transaction of transactions) {
        const gasUsed = formatEther(transaction.gasUsed)
        console.info(gasUsed);
    }
    console.info(`----------------------`);
};

// logs
const logs = async (prism) => {
    const filter = {
        fromBlock: 0,
        address: prism.address,
        topics: []
    };
    const provider = getProvider();
    const logs = await provider.getLogs(filter);
    const eventsLogs = parseLogs(logs, Prism.abi);
    console.info("----------------------");
    for (let i = 0; i < eventsLogs.length; i++) {
        const eventLog = eventsLogs[i];
        console.info("Name:", eventLog.name);
        const eventKeys = Object.keys(eventLog.args);
        for (let j = 0; j < eventKeys.length; j++) {
            const eventKey = eventKeys[j];
            console.info("-", `${eventKey}:`, eventLog.args[eventKey]);
        }
        console.info("-", "blockNumber:", eventLog.source.blockNumber);
    }
    console.info("----------------------");
}

// balances
const _balances = async (accounts) => {
    const provider = getProvider();
    const balances = [];
    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        const signer = provider.getSigner(account);
        const balance = await signer.getBalance();
        balances.push({
            account: account,
            balance: formatEther(balance),
        });
    }
    console.info(`Balances`);
    balances
        .filter((b) => b.balance !== "100.0")
        .forEach(balance => {
            console.info(`-`, balance.account, balance.balance, "ETH");
        });
}

module.exports = {
    EVENT,
    autoDeploy,
    checkLogs,
    debug,
    debugTransactions,
    logs,
};