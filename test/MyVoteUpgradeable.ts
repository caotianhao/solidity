import { expect } from "chai";
import { ethers } from "hardhat";
import type { MyVoteUpgradeable } from "../typechain-types";
import type { ERC1967Proxy } from "../typechain-types";

const PROPOSALS = ["Alice", "Bob", "Charlie"];

describe("MyVoteUpgradeable (via ERC1967Proxy)", function () {
    let myVote: MyVoteUpgradeable;
    let chairman: Awaited<ReturnType<typeof ethers.getSigners>>[0];
    let voter1: Awaited<ReturnType<typeof ethers.getSigners>>[1];

    beforeEach(async function () {
        [chairman, voter1] = await ethers.getSigners();
        const MyVoteUpgradeable = await ethers.getContractFactory("MyVoteUpgradeable");
        const impl = await MyVoteUpgradeable.deploy();
        await impl.waitForDeployment();

        const initData = MyVoteUpgradeable.interface.encodeFunctionData("initialize", [PROPOSALS]);
        const ERC1967Proxy = await ethers.getContractFactory("ERC1967Proxy");
        const proxy = (await ERC1967Proxy.deploy(await impl.getAddress(), initData)) as ERC1967Proxy;
        await proxy.waitForDeployment();

        myVote = MyVoteUpgradeable.attach(await proxy.getAddress()) as MyVoteUpgradeable;
    });

    it("部署后 chairman 正确、提案数量正确", async function () {
        expect(await myVote.chairman()).to.equal(chairman.address);
        expect(await myVote.getProposalsLength()).to.equal(3);
    });

    it("主席可授权、选民可投票", async function () {
        await myVote.giveRightToVote(voter1.address);
        await myVote.connect(voter1).doVote(1);
        expect(await myVote.winnerName()).to.equal("Bob");
    });

    it("重复 initialize 应 revert", async function () {
        await expect(myVote.initialize(PROPOSALS)).to.be.revertedWith(
            "MyVoteUpgradeable: already initialized"
        );
    });
});
