import { expect } from "chai";
import { ethers } from "hardhat";

describe("exe Contract", function () {
    let exe: Awaited<ReturnType<ReturnType<typeof ethers.getContractFactory>["deploy"]>>;

    beforeEach(async function () {
        const Exe = await ethers.getContractFactory("exe");
        exe = await Exe.deploy();
        await exe.waitForDeployment();
    });

    it("should set and get value correctly", async function () {
        await exe.setValue(100);
        expect(await exe.getValue()).to.equal(100n);
    });

    it("should emit ValueSet on setValue", async function () {
        await expect(exe.setValue(42))
            .to.emit(exe, "ValueSet")
            .withArgs(0n, 42n);
        await expect(exe.setValue(100))
            .to.emit(exe, "ValueSet")
            .withArgs(42n, 100n);
    });

    it("should add two numbers correctly", async function () {
        expect(await exe.add(10, 20)).to.equal(30n);
    });
});
