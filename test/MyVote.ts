import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import type { MyVote } from "../typechain-types";

const PROPOSALS = [
        "Alice", "Bob", "Charlie", "David", "Eve",
        "Frank", "Grace", "Hannah", "Ian", "Jack",
        "Karen", "Leo", "Mona", "Nina", "Oscar",
    "Paul", "Quincy", "Rachel", "Steve", "Tracy",
];

describe("MyVote", function () {
    let myVote: MyVote;
    let chairman: SignerWithAddress;
    let voter1: SignerWithAddress;
    let voter2: SignerWithAddress;
    let voter3: SignerWithAddress;

    beforeEach(async () => {
        [chairman, voter1, voter2, voter3] = await ethers.getSigners();
        const MyVoteFactory = await ethers.getContractFactory("MyVote");
        myVote = (await MyVoteFactory.deploy(PROPOSALS)) as MyVote;
        await myVote.waitForDeployment();
    });

    it("deploys with chair weight 1", async () => {
        const weight = (await myVote.voters(chairman.address)).weight;
        expect(weight).to.equal(1);
    });

    it("giveRightToVote works", async () => {
        await myVote.giveRightToVote(voter1.address);
        const voterInfo = await myVote.voters(voter1.address);
        expect(voterInfo.weight).to.equal(1);
        expect(voterInfo.voted).to.be.false;
    });

    it("reverts when non-chair calls giveRightToVote", async () => {
        await expect(
            myVote.connect(voter1).giveRightToVote(voter2.address)
        ).to.be.revertedWith("[giveRightToVote] not chairman");
    });

    it("delegate vote", async () => {
        await myVote.giveRightToVote(voter1.address);
        await myVote.giveRightToVote(voter2.address);

        await myVote.connect(voter1).delegate(voter2.address);

        const voter1Info = await myVote.voters(voter1.address);

        expect(voter1Info.voted).to.be.true;
        expect(voter1Info.delegateTo).to.equal(voter2.address);
    });

    it("direct vote", async () => {
        await myVote.giveRightToVote(voter1.address);
        await myVote.connect(voter1).doVote(3);

        const voter1Info = await myVote.voters(voter1.address);
        const proposal = await myVote.proposals(3);

        expect(voter1Info.voted).to.be.true;
        expect(voter1Info.voteTo).to.equal(3);
        expect(proposal.voteCount).to.equal(1);
    });

    it("computes winner", async () => {
        await myVote.giveRightToVote(voter1.address);
        await myVote.giveRightToVote(voter2.address);

        await myVote.connect(chairman).doVote(0);
        await myVote.connect(voter1).doVote(1);
        await myVote.connect(voter2).doVote(1);

        const winnerIndex = await myVote.winningProposal();
        const winnerName = await myVote.winnerName();

        expect(winnerIndex).to.equal(1);
        expect(winnerName).to.equal("Bob");
    });

    it("reverts when doVote out of bounds", async () => {
        await myVote.giveRightToVote(voter1.address);
        await expect(myVote.connect(voter1).doVote(100)).to.be.revertedWith(
            "[doVote] invalid proposal index"
        );
    });

    it("reverts when doVote after already voted", async () => {
        await myVote.giveRightToVote(voter1.address);
        await myVote.connect(voter1).doVote(0);
        await expect(myVote.connect(voter1).doVote(1)).to.be.revertedWith(
            "[doVote] you voted"
        );
    });

    it("emits RightToVoteGranted on grant", async () => {
        await expect(myVote.giveRightToVote(voter1.address))
            .to.emit(myVote, "RightToVoteGranted")
            .withArgs(voter1.address);
    });

    it("emits Delegated on delegate", async () => {
        await myVote.giveRightToVote(voter1.address);
        await myVote.giveRightToVote(voter2.address);
        await expect(myVote.connect(voter1).delegate(voter2.address))
            .to.emit(myVote, "Delegated")
            .withArgs(voter1.address, voter2.address);
    });

    it("emits VoteCast on vote", async () => {
        await myVote.giveRightToVote(voter1.address);
        await expect(myVote.connect(voter1).doVote(2))
            .to.emit(myVote, "VoteCast")
            .withArgs(voter1.address, 2, 1);
    });

    it("getSummary returns correct data", async () => {
        await myVote.giveRightToVote(voter1.address);
        await myVote.connect(chairman).doVote(1);
        const [chairman_, count, winner] = await myVote.getSummary();
        expect(chairman_).to.equal(chairman.address);
        expect(count).to.equal(PROPOSALS.length);
        expect(winner).to.equal("Bob");
    });
});
