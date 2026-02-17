import {expect} from "chai";
import {ethers} from "hardhat";
import {SimpleToken} from "../typechain-types";

describe("SimpleToken", function () {
    let token: SimpleToken;
    let owner: any;
    let addr1: any;
    let addr2: any;

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();

        const SimpleTokenFactory = await ethers.getContractFactory("SimpleToken");
        token = await SimpleTokenFactory.deploy(1000);
    });

    it("initializes correctly", async () => {
        expect(await token.name()).to.equal("SimpleToken");
        expect(await token.symbol()).to.equal("STK");
        expect(await token.totalSupply()).to.equal(1000n);
        expect(await token.balanceOf(owner.address)).to.equal(1000n);
    });

    it("transfer succeeds", async () => {
        await token.transfer(addr1.address, 100);
        expect(await token.balanceOf(owner.address)).to.equal(900n);
        expect(await token.balanceOf(addr1.address)).to.equal(100n);
    });

    it("reverts transfer when insufficient balance", async () => {
        await expect(token.transfer(addr1.address, 2000))
            .to.be.revertedWithCustomError(token, "InsufficientBalance");
    });

    it("reverts transfer to zero address", async () => {
        await expect(token.transfer(ethers.ZeroAddress, 1))
            .to.be.revertedWithCustomError(token, "TransferToZeroAddress");
    });

    it("emits Transfer on transfer", async () => {
        await expect(token.transfer(addr1.address, 50))
            .to.emit(token, "Transfer")
            .withArgs(owner.address, addr1.address, 50n);
    });
});