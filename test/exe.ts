import {expect} from "chai";
import {ethers} from "hardhat";

describe("exe Contract", function () {
    let exe: any;

    beforeEach(async function () {
        const Exe = await ethers.getContractFactory("exe");
        exe = await Exe.deploy();
        await exe.waitForDeployment();
    });

    it("should set and get value correctly", async function () {
        await exe.setValue(100);
        expect(await exe.getValue()).to.equal(100n);
    });

    it("should add two numbers correctly", async function () {
        const sum = await exe.add(10, 20);
        expect(sum).to.equal(30n);
    });
});
