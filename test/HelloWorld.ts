import { expect } from "chai";
import { ethers } from "hardhat";

describe("HelloWorld", function () {
    it("should return initial message", async function () {
        const HelloWorld = await ethers.getContractFactory("HelloWorld");
        const hello = await HelloWorld.deploy("Hello, Hardhat!");
        expect(await hello.message()).to.equal("Hello, Hardhat!");
    });

    it("should update message", async function () {
        const HelloWorld = await ethers.getContractFactory("HelloWorld");
        const hello = await HelloWorld.deploy("Hello, Hardhat!");
        await hello.setMessage("New Message");
        expect(await hello.message()).to.equal("New Message");
    });
});
