import { ethers } from "hardhat";

const PROPOSALS = [
    "Alice", "Bob", "Charlie", "David", "Eve",
    "Frank", "Grace", "Hannah", "Ian", "Jack",
    "Karen", "Leo", "Mona", "Nina", "Oscar",
    "Paul", "Quincy", "Rachel", "Steve", "Tracy",
];

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying upgradeable MyVote with account:", deployer.address);

    const MyVoteUpgradeable = await ethers.getContractFactory("MyVoteUpgradeable");
    const impl = await MyVoteUpgradeable.deploy();
    await impl.waitForDeployment();
    console.log("MyVoteUpgradeable implementation at:", await impl.getAddress());

    const initData = MyVoteUpgradeable.interface.encodeFunctionData("initialize", [PROPOSALS]);
    const ERC1967Proxy = await ethers.getContractFactory("ERC1967Proxy");
    const proxy = await ERC1967Proxy.deploy(await impl.getAddress(), initData);
    await proxy.waitForDeployment();
    console.log("ERC1967Proxy (use this as MyVote address) at:", await proxy.getAddress());

    const myVote = MyVoteUpgradeable.attach(await proxy.getAddress()) as Awaited<ReturnType<typeof MyVoteUpgradeable.deploy>>;
    console.log("Chairman:", await myVote.chairman());
    console.log("Proposals length:", await myVote.getProposalsLength());
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
