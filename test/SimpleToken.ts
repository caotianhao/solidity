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

    it("初始化正确", async () => {
        expect(await token.name()).to.equal("SimpleToken");
        expect(await token.symbol()).to.equal("STK");
        expect(await token.totalSupply()).to.equal(1000);
        expect(await token.balanceOf(owner.address)).to.equal(1000);
    });

    it("转账成功", async () => {
        await token.transfer(addr1.address, 100);
        expect(await token.balanceOf(owner.address)).to.equal(900);
        expect(await token.balanceOf(addr1.address)).to.equal(100);
    });

    it("转账失败余额不足", async () => {
        await expect(token.transfer(addr1.address, 2000)).to.be.revertedWith(
            "Insufficient balance"
        );
    });
});