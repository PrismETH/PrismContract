const HDWalletProvider = require("truffle-hdwallet-provider");

const mnemonic = "nephew apology bacon pelican country escape emerge prepare leave easily wrist wealth";

module.exports = {
    compilers: {
        solc: {
            version: "^0.5.2",
        },
    },
    networks: {
        ganache_cli: {
            mnemonic: mnemonic,
            host: "localhost",
            port: 7545,
            network_id: "*",
        },
        ganache: {
            mnemonic: mnemonic,
            host: "localhost",
            port: 7545,
            network_id: "*",
        },
        rinkeby: {
            provider: () => new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/2eb3a35620c441159d0dd749b9bdb829"),
            network_id: "*",
        },
        mainnet: {
            provider: () => new HDWalletProvider(mnemonic, "https://mainnet.infura.io/v3/2eb3a35620c441159d0dd749b9bdb829"),
            network_id: "*",
        },
    },
};
