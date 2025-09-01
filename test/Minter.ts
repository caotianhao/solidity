import {expect} from "chai";
import {ethers} from "hardhat";

describe("Minter Contract", function () {
    let minter: any;
    let owner: any;
    let addr1: any;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();
        const Minter = await ethers.getContractFactory("Minter");
        minter = await Minter.deploy(1500);
        await minter.waitForDeployment();
    });

    it("should init balance for owner", async function () {
        const balance = await minter.balance(owner.address);
        expect(balance).to.equal(1500n);
    });

    it("should transfer balance", async function () {
        const tx = await minter.send(addr1.address, 500);
        await tx.wait();

        const ownerBalance = await minter.balance(owner.address);
        const addr1Balance = await minter.balance(addr1.address);

        expect(ownerBalance).to.equal(1000n);
        expect(addr1Balance).to.equal(500n);
    });

    it("should revert if not enough balance", async function () {
        await expect(minter.connect(addr1).send(owner.address, 100)).to.be.reverted;
    });
});
