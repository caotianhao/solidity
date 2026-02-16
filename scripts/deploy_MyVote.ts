import { ethers } from "hardhat";

const PROPOSALS = [
    "Alice", "Bob", "Charlie", "David", "Eve",
    "Frank", "Grace", "Hannah", "Ian", "Jack",
    "Karen", "Leo", "Mona", "Nina", "Oscar",
    "Paul", "Quincy", "Rachel", "Steve", "Tracy",
];

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    const MyVoteFactory = await ethers.getContractFactory("MyVote");
    const myVote = await MyVoteFactory.deploy(PROPOSALS);
    await myVote.waitForDeployment();

    console.log("MyVote deployed at:", await myVote.getAddress());
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
