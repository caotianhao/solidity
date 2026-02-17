import {ethers} from "hardhat";

async function main() {
    const provider = ethers.provider;
    const [sender, receiver] = await ethers.getSigners();

    console.log("Sender:", sender.address);
    console.log("Receiver:", receiver.address);

    let senderBalance = await provider.getBalance(sender.address);
    let receiverBalance = await provider.getBalance(receiver.address);
    console.log("Sender balance:", ethers.formatEther(senderBalance));
    console.log("Receiver balance:", ethers.formatEther(receiverBalance));

    const tx = await sender.sendTransaction({
        to: receiver.address,
        value: ethers.parseEther("1.0"),
    });
    await tx.wait();

    console.log("Transaction hash:", tx.hash);

    senderBalance = await provider.getBalance(sender.address);
    receiverBalance = await provider.getBalance(receiver.address);
    console.log("Sender balance after:", ethers.formatEther(senderBalance));
    console.log("Receiver balance after:", ethers.formatEther(receiverBalance));
}

main().catch(console.error);
