const { isCommunityResourcable } = require("@ethersproject/providers");
const { ethers, run, network } = require("hardhat");

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    );
    console.log("Deploying SimpleStorage...");
    const simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.deployed();
    console.log(`Deployed to ${simpleStorage.address}`);
    console.log(network.config);
    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.deployTransaction.wait(6);
        await verify(simpleStorage.address, []);
    }
}

async function verify(contractAddress, args) {
    console.log("Verifying contract...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (error) {
        if (error.message.includes("Contract source code already verified")) {
            console.log("Contract already verified");
        } else {
            console.log(error.message);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
