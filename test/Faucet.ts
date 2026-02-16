import { expect } from "chai";
import { ethers } from "hardhat";

describe("Faucet", function () {
    it("receive: 应接收 ETH 并触发 Received", async function () {
        const [sender] = await ethers.getSigners();
        const Faucet = await ethers.getContractFactory("Faucet");
        const faucet = await Faucet.deploy();
        await faucet.waitForDeployment();

        const amount = ethers.parseEther("2");
        await expect(sender.sendTransaction({ to: await faucet.getAddress(), value: amount }))
            .to.emit(faucet, "Received")
            .withArgs(sender.address, amount);
        expect(await ethers.provider.getBalance(await faucet.getAddress())).to.equal(amount);
    });

    it("withdraw: 应按金额转出并触发 Withdrawn", async function () {
        const [sender, recipient] = await ethers.getSigners();
        const Faucet = await ethers.getContractFactory("Faucet");
        const faucet = await Faucet.deploy();
        await faucet.waitForDeployment();

        await sender.sendTransaction({ to: await faucet.getAddress(), value: ethers.parseEther("5") });
        const withdrawAmount = ethers.parseEther("0.5");
        await expect(faucet.connect(recipient).withdraw(withdrawAmount))
            .to.emit(faucet, "Withdrawn")
            .withArgs(recipient.address, withdrawAmount);
        expect(await ethers.provider.getBalance(await faucet.getAddress())).to.equal(ethers.parseEther("4.5"));
    });

    it("withdraw: 超过 1 ether 应 revert", async function () {
        const Faucet = await ethers.getContractFactory("Faucet");
        const faucet = await Faucet.deploy();
        await faucet.waitForDeployment();
        const [sender] = await ethers.getSigners();
        await sender.sendTransaction({ to: await faucet.getAddress(), value: ethers.parseEther("2") });

        await expect(faucet.withdraw(ethers.parseEther("1.5")))
            .to.be.revertedWithCustomError(faucet, "WithdrawAmountTooLarge");
    });

    it("MAX_WITHDRAWAL 应为 1 ether", async function () {
        const Faucet = await ethers.getContractFactory("Faucet");
        const faucet = await Faucet.deploy();
        await faucet.waitForDeployment();
        expect(await faucet.MAX_WITHDRAWAL()).to.equal(ethers.parseEther("1"));
    });
});
