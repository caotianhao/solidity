// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/// @title MyVoteUpgradeable
/// @notice 可升级版投票合约：逻辑与 MyVote 一致，通过 initializer 初始化，供 ERC1967Proxy 使用。
contract MyVoteUpgradeable {
    event RightToVoteGranted(address indexed voter);
    event Delegated(address indexed from, address indexed to);
    event VoteCast(address indexed voter, uint256 indexed proposalIndex, uint256 weight);

    struct Voter {
        uint256 weight;
        bool voted;
        address delegateTo;
        uint256 voteTo;
    }

    struct Proposal {
        string name;
        uint256 voteCount;
    }

    address public chairman;
    mapping(address => Voter) public voters;
    Proposal[] public proposals;

    bool private _initialized;

    modifier onlyInitializing() {
        require(!_initialized, "MyVoteUpgradeable: already initialized");
        _;
        _initialized = true;
    }

    /// @param proposalNames 提案名称列表
    function initialize(string[] memory proposalNames) external onlyInitializing {
        chairman = msg.sender;
        voters[chairman].weight = 1;

        uint256 len = proposalNames.length;
        for (uint256 i; i < len;) {
            proposals.push(Proposal(proposalNames[i], 0));
            unchecked { ++i; }
        }
    }

    function getProposalsLength() external view returns (uint256) {
        return proposals.length;
    }

    function giveRightToVote(address voter) external {
        require(msg.sender == chairman, "[giveRightToVote] not chairman");
        require(!voters[voter].voted, "[giveRightToVote] has voted");
        require(voters[voter].weight == 0, "[giveRightToVote] already has weight");
        voters[voter].weight = 1;
        emit RightToVoteGranted(voter);
    }

    function delegate(address to) external {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "[delegate] you have no weight");
        require(!sender.voted, "[delegate] you already voted");
        require(to != msg.sender, "[delegate] 403 to give to self");

        while (voters[to].delegateTo != address(0)) {
            to = voters[to].delegateTo;
            require(to != msg.sender, "[delegate] loop delegate");
        }

        Voter storage delegatee = voters[to];
        require(delegatee.weight >= 1, "[delegate] after delegate, receiver have no weight");
        sender.voted = true;
        sender.delegateTo = to;

        if (delegatee.voted) {
            proposals[delegatee.voteTo].voteCount += sender.weight;
        } else {
            delegatee.weight += sender.weight;
        }
        emit Delegated(msg.sender, to);
    }

    function doVote(uint256 proposal) external {
        require(proposal < proposals.length, "[doVote] invalid proposal index");
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "[doVote] you have no weight");
        require(!sender.voted, "[doVote] you voted");

        sender.voted = true;
        sender.voteTo = proposal;
        proposals[proposal].voteCount += sender.weight;
        emit VoteCast(msg.sender, proposal, sender.weight);
    }

    function winningProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount;
        uint256 len = proposals.length;
        for (uint256 i; i < len;) {
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winningProposal_ = i;
            }
            unchecked { ++i; }
        }
    }

    function winnerName() external view returns (string memory) {
        return proposals[winningProposal()].name;
    }

    function getSummary() external view returns (
        address chairman_,
        uint256 proposalCount_,
        string memory winnerName_
    ) {
        return (chairman, proposals.length, this.winnerName());
    }
}
