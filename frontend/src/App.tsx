import {useEffect, useState} from "react";
import {ethers} from "ethers";
import MyVote from "./MyVote.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

interface Proposal {
    name: string;
    voteCount: number;
}

function App() {
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [winner, setWinner] = useState("");
    const [inputAddress, setInputAddress] = useState("");

    useEffect(() => {
        const init = async () => {
            const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
            const signer = await provider.getSigner(0);
            const cont = new ethers.Contract(CONTRACT_ADDRESS, MyVote.abi, signer);
            setContract(cont);

            await loadProposals(cont);
            await loadWinner(cont);
        };
        init();
    }, []);

    const loadProposals = async (contract: ethers.Contract) => {
        const list: Proposal[] = [];
        const length = Number(await contract.getProposalsLength());
        for (let i = 0; i < length; i++) {
            const p = await contract.proposals(i);
            list.push({ name: p.name, voteCount: Number(p.voteCount) });
        }
        setProposals(list);
    };

    const loadWinner = async (contract: ethers.Contract) => {
        const name = await contract.winnerName();
        setWinner(name);
    };

    const giveRight = async () => {
        if (!contract || !inputAddress) return;
        await contract.giveRightToVote(inputAddress);
        alert("授权成功");
    };

    const delegateVote = async () => {
        if (!contract || !inputAddress) return;
        await contract.delegate(inputAddress);
        alert("委托成功");
        await loadProposals(contract);
        await loadWinner(contract);
    };

    const vote = async (index: number) => {
        if (!contract) return;
        await contract.doVote(index);
        alert(`投票成功: ${proposals[index].name}`);
        await loadProposals(contract);
        await loadWinner(contract);
    };

    return (
        <div style={{padding: "20px"}}>
            <h1>MyVote DApp (本地节点)</h1>
            <hr/>

            <h2>候选人列表</h2>
            <ul>
                {proposals.map((p, i) => (
                    <li key={i}>
                        {i}. {p.name} - {p.voteCount} 票
                        <button onClick={() => vote(i)} style={{marginLeft: "10px"}}>投票</button>
                    </li>
                ))}
            </ul>

            <hr/>
            <h2>操作</h2>
            <input
                type="text"
                placeholder="输入地址"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                style={{width: "300px"}}
            />
            <button onClick={giveRight} style={{marginLeft: "10px"}}>授权投票</button>
            <button onClick={delegateVote} style={{marginLeft: "10px"}}>委托投票</button>

            <hr/>
            <h2>当前获胜者</h2>
            <p>{winner}</p>
        </div>
    );
}

export default App;
