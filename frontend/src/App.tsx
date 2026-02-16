import { useCallback, useEffect, useState } from "react";
import { type Contract, ethers } from "ethers";
import MyVoteAbi from "./MyVote.json";
import "./App.css";

const RPC_URL = "http://127.0.0.1:8545";
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

interface Proposal {
    name: string;
    voteCount: number;
}

interface VoterInfo {
    weight: bigint;
    voted: boolean;
    delegateTo: string;
    voteTo: bigint;
}

interface Summary {
    chairman: string;
    proposalCount: number;
    winnerName: string;
}

function App() {
    const [contract, setContract] = useState<Contract | null>(null);
    const [currentAccount, setCurrentAccount] = useState<string>("");
    const [summary, setSummary] = useState<Summary | null>(null);
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [voterInfo, setVoterInfo] = useState<VoterInfo | null>(null);
    const [inputAddress, setInputAddress] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [txPending, setTxPending] = useState(false);

    const loadSummary = useCallback(async (c: Contract) => {
        const [chairman, proposalCount, winnerName] = await c.getSummary();
        setSummary({
            chairman,
            proposalCount: Number(proposalCount),
            winnerName,
        });
    }, []);

    const loadProposals = useCallback(async (c: Contract) => {
        const length = Number(await c.getProposalsLength());
        const list: Proposal[] = [];
        for (let i = 0; i < length; i++) {
            const p = await c.proposals(i);
            list.push({ name: p.name, voteCount: Number(p.voteCount) });
        }
        setProposals(list);
    }, []);

    const loadVoterInfo = useCallback(async (c: Contract, account: string) => {
        const v = await c.voters(account);
        setVoterInfo({
            weight: v.weight,
            voted: v.voted,
            delegateTo: v.delegateTo,
            voteTo: v.voteTo,
        });
    }, []);

    const refresh = useCallback(async () => {
        if (!contract || !currentAccount) return;
        setError(null);
        try {
            await Promise.all([
                loadSummary(contract),
                loadProposals(contract),
                loadVoterInfo(contract, currentAccount),
            ]);
        } catch (e) {
            setError(e instanceof Error ? e.message : "刷新失败");
        }
    }, [contract, currentAccount, loadSummary, loadProposals, loadVoterInfo]);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        const init = async () => {
            try {
                const provider = new ethers.JsonRpcProvider(RPC_URL);
                const signer = await provider.getSigner(0);
                const account = await signer.getAddress();
                const c = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    (MyVoteAbi as { abi: ethers.InterfaceAbi }).abi,
                    signer
                );
                if (cancelled) return;
                setContract(c);
                setCurrentAccount(account);
                await loadSummary(c);
                await loadProposals(c);
                await loadVoterInfo(c, account);
            } catch (e) {
                if (!cancelled) {
                    setError(e instanceof Error ? e.message : "连接失败");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        init();
        return () => { cancelled = true; };
    }, [loadSummary, loadProposals, loadVoterInfo]);

    const giveRight = async () => {
        if (!contract || !inputAddress) return;
        setTxPending(true);
        setError(null);
        try {
            const tx = await contract.giveRightToVote(inputAddress);
            await tx.wait();
            alert("授权成功");
            await refresh();
        } catch (e) {
            setError(e instanceof Error ? e.message : "授权失败");
        } finally {
            setTxPending(false);
        }
    };

    const delegateVote = async () => {
        if (!contract || !inputAddress) return;
        setTxPending(true);
        setError(null);
        try {
            const tx = await contract.delegate(inputAddress);
            await tx.wait();
            alert("委托成功");
            await refresh();
        } catch (e) {
            setError(e instanceof Error ? e.message : "委托失败");
        } finally {
            setTxPending(false);
        }
    };

    const vote = async (index: number) => {
        if (!contract) return;
        setTxPending(true);
        setError(null);
        try {
            const tx = await contract.doVote(index);
            await tx.wait();
            alert(`投票成功: ${proposals[index]?.name ?? index}`);
            await refresh();
        } catch (e) {
            setError(e instanceof Error ? e.message : "投票失败");
        } finally {
            setTxPending(false);
        }
    };

    const shortAddress = (addr: string) =>
        addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

    if (loading) {
        return (
            <div className="app">
                <div className="loading">正在连接节点并加载合约…</div>
            </div>
        );
    }

    return (
        <div className="app">
            <header className="app-header">
                <h1>MyVote 投票 DApp</h1>
                <p className="subtitle">本地节点演示 · 主席授权 · 委托或直接投票</p>
            </header>

            {error && (
                <div className="banner error" role="alert">
                    {error}
                </div>
            )}

            <section className="card">
                <h2>当前账户</h2>
                <p className="address">{currentAccount ? shortAddress(currentAccount) : "—"}</p>
                {voterInfo && (
                    <div className="voter-status">
                        <span className={voterInfo.weight > 0n ? "badge ok" : "badge muted"}>
                            权重: {Number(voterInfo.weight)}
                        </span>
                        {voterInfo.voted ? (
                            voterInfo.delegateTo !== ethers.ZeroAddress ? (
                                <span className="badge delegate">已委托 → {shortAddress(voterInfo.delegateTo)}</span>
                            ) : (
                                <span className="badge voted">已投票 → 提案 #{Number(voterInfo.voteTo)}</span>
                            )
                        ) : (
                            <span className="badge pending">未投票</span>
                        )}
                    </div>
                )}
                {summary && currentAccount === summary.chairman && (
                    <span className="badge chairman">主席</span>
                )}
            </section>

            <section className="card">
                <div className="section-head">
                    <h2>候选人列表</h2>
                    <button type="button" onClick={refresh} disabled={txPending}>
                        刷新
                    </button>
                </div>
                <ul className="proposal-list">
                    {proposals.map((p, i) => (
                        <li key={`${i}-${p.name}`}>
                            <span className="proposal-name">{i}. {p.name}</span>
                            <span className="proposal-votes">{p.voteCount} 票</span>
                            <button
                                type="button"
                                onClick={() => vote(i)}
                                disabled={txPending || (voterInfo?.voted ?? false)}
                            >
                                投票
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="card">
                <h2>操作</h2>
                <div className="actions">
                    <input
                        type="text"
                        placeholder="输入地址（授权/委托目标）"
                        value={inputAddress}
                        onChange={(e) => setInputAddress(e.target.value)}
                        className="input-address"
                    />
                    <button type="button" onClick={giveRight} disabled={txPending}>
                        授权投票
                    </button>
                    <button type="button" onClick={delegateVote} disabled={txPending}>
                        委托投票
                    </button>
                </div>
            </section>

            <section className="card highlight">
                <h2>当前领先者</h2>
                <p className="winner">{summary?.winnerName ?? "—"}</p>
            </section>
        </div>
    );
}

export default App;
