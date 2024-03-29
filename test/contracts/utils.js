const { Contract, ContractFactory, Wallet, providers: { JsonRpcProvider }, utils: { BigNumber, formatEther, parseEther, parseUnits } } = require("ethers");
const assert = require("assert");
const ganache = require("./../../truffle");

// get provider
const getProvider = () => {
    const config = ganache.networks.ganache;
    return new JsonRpcProvider({ url: `http://${config.host}:${config.port}` });
};

// get wallet
const getWallet = (privateKey) => {
    const provider = getProvider();
    return new Wallet(privateKey, provider);
}

// deploy
const deploy = (owner, contract) => {
    const wallet = getWallet(owner);
    const factory = new ContractFactory(contract.abi, contract.bytecode, wallet);
    return factory.deploy();
};

// open
const open = (base, privateKey, contract) => {
    const wallet = getWallet(privateKey);
    return new Contract(base.address, contract.abi, wallet);
};

// eth
const eth = (amount) => {
    return parseUnits(amount.toString(), 18);
};

// transfer
const transfer = async (user, address, amount) => {
    let wallet = getWallet(user);

    // prepare transaction
    const transaction = {
        to: address,
        value: eth(amount),
    }

    // send transaction
    const tx = await wallet.sendTransaction(transaction);
    return tx.wait(1);
}

// assert promise equal
const assertPromiseEqual = async (promise, expected, message) => {
    const result = await promise;
    assert.equal(result, expected, `${message} ${expected} -> ${result}`);
};

// assert promises equal
const assertPromisesEqual = async (promise, expectedPromise, message) => {
    const result1 = await promise;
    const result2 = await expectedPromise;
    assert.equal(result1, result2, `${message} ${expected} -> ${result1}`);
};

// assert promises not equal
const assertPromiseNotEqual = async (promise, expected, message) => {
    const result = await promise;
    assert.notEqual(result, expected, `${message} ${expected} -> ${result}`);
};

// assert revert
const assertPromiseReverts = async (promise, expected, details) => {
    try {
        await promise;
        assert.fail("Transaction did not revert.");
    } catch (error) {
        const _details = details && ` -> ${details}`;
        if (expected) {
            assert.equal(error.message.includes(expected), true, `${error.message}${_details}`);
        } else {
            assert.equal(error.message.includes("VM Exception while processing transaction: revert"), true, `${error.message}${_details}`);
        }
    }
}

// balances
const balances = async (token, accounts) => {
    const balances = [];
    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        const balance = await token.balanceOf(account);
        balances.push({
            name: (i > 0 && i <= 3) && `user${i}`,
            account: account,
            balance: formatEther(balance),
        });
    }
    return balances.filter((b) => b.balance > 0);
}

module.exports = {
    getProvider,
    getWallet,
    deploy,
    open,
    eth,
    transfer,
    assertPromiseEqual,
    assertPromisesEqual,
    assertPromiseNotEqual,
    assertPromiseReverts,
    balances,
};