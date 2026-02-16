import { expect } from "chai";
import { ethers } from "hardhat";
import type { Minter } from "../typechain-types";

describe("Minter Contract", function () {
    let minter: Minter;
    let owner: Awaited<ReturnType<typeof ethers.getSigners>>[0];
    let addr1: Awaited<ReturnType<typeof ethers.getSigners>>[1];

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();
        const MinterFactory = await ethers.getContractFactory("Minter");
        minter = (await MinterFactory.deploy(1500)) as Minter;
        await minter.waitForDeployment();
    });

    it("should init balance for owner", async function () {
        expect(await minter.balance(owner.address)).to.equal(1500n);
    });

    it("should transfer balance", async function () {
        await minter.send(addr1.address, 500);
        expect(await minter.balance(owner.address)).to.equal(1000n);
        expect(await minter.balance(addr1.address)).to.equal(500n);
    });

    it("should emit Transfer on send", async function () {
        await expect(minter.send(addr1.address, 100))
            .to.emit(minter, "Transfer")
            .withArgs(owner.address, addr1.address, 100n);
    });

    it("should revert if not enough balance", async function () {
        await expect(minter.connect(addr1).send(owner.address, 100))
            .to.be.revertedWithCustomError(minter, "ExceedsBalance");
    });

    it("should revert when sending to zero address", async function () {
        await expect(minter.send(ethers.ZeroAddress, 1))
            .to.be.revertedWithCustomError(minter, "TransferToZeroAddress");
    });
});
