// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

contract MyVote {
    struct Voter {
        uint weight;
        bool voted;
        address delegateTo;
        uint voteTo;
    }

    struct Proposal {
        string name;
        uint voteCount;
    }

    address public chairman;
    mapping(address => Voter) public voters;
    Proposal[] public proposals;

    constructor(string[] memory proposalNames) {
        chairman = msg.sender;
        voters[chairman].weight = 1;

        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal(proposalNames[i], 0));
        }
    }

    function getProposalsLength() external view returns (uint) {
        return proposals.length;
    }

    function giveRightToVote(address voter) external {
        require(msg.sender == chairman, "[giveRightToVote] not chairman");
        require(!voters[voter].voted, "[giveRightToVote] has voted");
        require(voters[voter].weight == 0, "[giveRightToVote] has weights");
        voters[voter].weight = 1;
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
    }

    function doVote(uint proposal) external {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "[doVote] you have no weight");
        require(!sender.voted, "[doVote] you voted");

        sender.voted = true;
        sender.voteTo = proposal;
        proposals[proposal].voteCount += sender.weight;
    }

    function winningProposal() public view returns (uint winningProposal_){
        uint winningVoteCount = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winningProposal_ = i;
            }
        }
        return winningProposal_;
    }

    function winnerName() external view returns (string memory){
        return proposals[winningProposal()].name;
    }
}