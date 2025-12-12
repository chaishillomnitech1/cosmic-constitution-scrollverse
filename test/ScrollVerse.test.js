const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ScrollVerse Smart Contracts", function () {
  let nftContract, multiTokenContract, daoContract;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contracts
    const ScrollVerseNFT = await ethers.getContractFactory("ScrollVerseNFT");
    nftContract = await ScrollVerseNFT.deploy();
    await nftContract.waitForDeployment();

    const ScrollVerseMultiToken = await ethers.getContractFactory("ScrollVerseMultiToken");
    multiTokenContract = await ScrollVerseMultiToken.deploy("https://ipfs.io/ipfs/");
    await multiTokenContract.waitForDeployment();

    const ScrollVerseDAO = await ethers.getContractFactory("ScrollVerseDAO");
    daoContract = await ScrollVerseDAO.deploy(await nftContract.getAddress());
    await daoContract.waitForDeployment();
  });

  describe("ScrollVerseNFT (ERC-721)", function () {
    it("Should mint NFT with correct metadata", async function () {
      const tokenId = await nftContract.mintNFT(
        addr1.address,
        "Test NFT",
        "Test Description",
        "ipfs://test",
        0, // Rarity: COMMON
        0, // Category: LUXURY_ITEM
        528 // Resonance frequency
      );

      const metadata = await nftContract.getNFTMetadata(0);
      expect(metadata.name).to.equal("Test NFT");
      expect(metadata.resonanceFrequency).to.equal(528);
      expect(metadata.contributor).to.equal(addr1.address);
    });

    it("Should track NFTs by contributor", async function () {
      await nftContract.mintNFT(
        addr1.address,
        "NFT 1",
        "Description 1",
        "ipfs://test1",
        0,
        0,
        528
      );

      await nftContract.mintNFT(
        addr1.address,
        "NFT 2",
        "Description 2",
        "ipfs://test2",
        1,
        1,
        963
      );

      const contributorNFTs = await nftContract.getNFTsByContributor(addr1.address);
      expect(contributorNFTs.length).to.equal(2);
    });

    it("Should filter NFTs by rarity", async function () {
      await nftContract.mintNFT(addr1.address, "NFT 1", "Desc", "ipfs://1", 0, 0, 528);
      await nftContract.mintNFT(addr2.address, "NFT 2", "Desc", "ipfs://2", 2, 0, 528); // RARE

      const rareNFTs = await nftContract.getNFTsByRarity(2); // RARE
      expect(rareNFTs.length).to.equal(1);
    });

    it("Should batch mint multiple NFTs", async function () {
      const contributors = [addr1.address, addr2.address];
      const names = ["NFT 1", "NFT 2"];
      const descriptions = ["Desc 1", "Desc 2"];
      const uris = ["ipfs://1", "ipfs://2"];
      const rarities = [0, 1];
      const categories = [0, 1];
      const frequencies = [528, 963];

      await nftContract.batchMint(
        contributors,
        names,
        descriptions,
        uris,
        rarities,
        categories,
        frequencies
      );

      const totalSupply = await nftContract.getTotalSupply();
      expect(totalSupply).to.equal(2);
    });
  });

  describe("ScrollVerseMultiToken (ERC-1155)", function () {
    it("Should create token type", async function () {
      await multiTokenContract.createToken(
        "Cosmic Scroll",
        "A cosmic scroll token",
        1000, // max supply
        528,  // resonance frequency
        "ipfs://scroll"
      );

      const metadata = await multiTokenContract.getTokenMetadata(0);
      expect(metadata.name).to.equal("Cosmic Scroll");
      expect(metadata.maxSupply).to.equal(1000);
      expect(metadata.resonanceFrequency).to.equal(528);
    });

    it("Should mint tokens to recipient", async function () {
      await multiTokenContract.createToken(
        "Token",
        "Description",
        1000,
        528,
        "ipfs://token"
      );

      await multiTokenContract.mint(addr1.address, 0, 10);

      const balance = await multiTokenContract.balanceOf(addr1.address, 0);
      expect(balance).to.equal(10);
    });

    it("Should enforce max supply", async function () {
      await multiTokenContract.createToken(
        "Limited Token",
        "Limited supply",
        100, // max supply
        528,
        "ipfs://limited"
      );

      await multiTokenContract.mint(addr1.address, 0, 50);
      await multiTokenContract.mint(addr2.address, 0, 50);

      await expect(
        multiTokenContract.mint(addr1.address, 0, 1)
      ).to.be.revertedWith("Exceeds max supply");
    });

    it("Should batch mint multiple token types", async function () {
      await multiTokenContract.createToken("Token 1", "Desc", 1000, 528, "ipfs://1");
      await multiTokenContract.createToken("Token 2", "Desc", 1000, 963, "ipfs://2");

      await multiTokenContract.mintBatch(addr1.address, [0, 1], [10, 20]);

      const balance0 = await multiTokenContract.balanceOf(addr1.address, 0);
      const balance1 = await multiTokenContract.balanceOf(addr1.address, 1);

      expect(balance0).to.equal(10);
      expect(balance1).to.equal(20);
    });

    it("Should reward multiple contributors", async function () {
      await multiTokenContract.createToken("Reward Token", "Desc", 1000, 528, "ipfs://reward");

      const contributors = [addr1.address, addr2.address];
      const amounts = [5, 10];

      await multiTokenContract.rewardContributors(contributors, 0, amounts);

      const balance1 = await multiTokenContract.balanceOf(addr1.address, 0);
      const balance2 = await multiTokenContract.balanceOf(addr2.address, 0);

      expect(balance1).to.equal(5);
      expect(balance2).to.equal(10);
    });
  });

  describe("ScrollVerseDAO", function () {
    beforeEach(async function () {
      // Mint NFTs to give voting power
      await nftContract.mintNFT(addr1.address, "NFT 1", "Desc", "ipfs://1", 0, 0, 528);
      await nftContract.mintNFT(addr2.address, "NFT 2", "Desc", "ipfs://2", 0, 0, 963);
    });

    it("Should create proposal", async function () {
      await daoContract.connect(addr1).createProposal(
        "Test Proposal",
        "Test Description",
        0, // NFT_CLEANUP
        "0x"
      );

      const proposal = await daoContract.getProposal(0);
      expect(proposal.title).to.equal("Test Proposal");
      expect(proposal.proposer).to.equal(addr1.address);
    });

    it("Should allow voting on proposal", async function () {
      await daoContract.connect(addr1).createProposal(
        "Test Proposal",
        "Description",
        0,
        "0x"
      );

      await daoContract.connect(addr1).castVote(0, true);

      const [voted, support, weight] = await daoContract.getVotingStatus(0, addr1.address);
      expect(voted).to.be.true;
      expect(support).to.be.true;
    });

    it("Should prevent double voting", async function () {
      await daoContract.connect(addr1).createProposal(
        "Test Proposal",
        "Description",
        0,
        "0x"
      );

      await daoContract.connect(addr1).castVote(0, true);

      await expect(
        daoContract.connect(addr1).castVote(0, true)
      ).to.be.revertedWith("Already voted");
    });

    it("Should require NFT ownership to create proposal", async function () {
      const [, , addr3] = await ethers.getSigners();

      await expect(
        daoContract.connect(addr3).createProposal(
          "Test Proposal",
          "Description",
          0,
          "0x"
        )
      ).to.be.revertedWith("Insufficient NFTs to create proposal");
    });

    it("Should update governance parameters", async function () {
      await daoContract.setVotingPeriod(14 * 24 * 60 * 60); // 14 days
      await daoContract.setQuorumPercentage(30);

      expect(await daoContract.votingPeriod()).to.equal(14 * 24 * 60 * 60);
      expect(await daoContract.quorumPercentage()).to.equal(30);
    });
  });
});
