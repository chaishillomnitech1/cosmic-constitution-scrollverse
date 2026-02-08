const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("ScrollVerseGitHubToken", function () {
  let sgtContract;
  let owner, developer, employee, student, parent, child;

  beforeEach(async function () {
    [owner, developer, employee, student, parent, child] = await ethers.getSigners();

    const ScrollVerseGitHubToken = await ethers.getContractFactory("ScrollVerseGitHubToken");
    sgtContract = await ScrollVerseGitHubToken.deploy(owner.address);
    await sgtContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set correct token name and symbol", async function () {
      expect(await sgtContract.name()).to.equal("ScrollVerse GitHub Token");
      expect(await sgtContract.symbol()).to.equal("SGT");
    });

    it("Should have correct max supply", async function () {
      const maxSupply = await sgtContract.MAX_SUPPLY();
      expect(maxSupply).to.equal(ethers.parseEther("144000000"));
    });

    it("Should have correct sacred frequency", async function () {
      expect(await sgtContract.FREQUENCY_963HZ()).to.equal(963);
    });

    it("Should allocate pools correctly", async function () {
      const totalSupply = await sgtContract.MAX_SUPPLY();
      const developerPool = await sgtContract.developerPoolBalance();
      const employeePool = await sgtContract.employeePoolBalance();
      const educationPool = await sgtContract.educationPoolBalance();
      const aiMeritPool = await sgtContract.aiMeritPoolBalance();
      const treasuryPool = await sgtContract.treasuryPoolBalance();

      expect(developerPool).to.equal(totalSupply * 40n / 100n); // 40%
      expect(employeePool).to.equal(totalSupply * 20n / 100n);  // 20%
      expect(educationPool).to.equal(totalSupply * 20n / 100n); // 20%
      expect(aiMeritPool).to.equal(totalSupply * 10n / 100n);   // 10%
      expect(treasuryPool).to.equal(totalSupply * 10n / 100n);  // 10%
    });

    it("Should set correct reward structures", async function () {
      const githubReward = await sgtContract.githubReward();
      expect(githubReward.firstPRReward).to.equal(ethers.parseEther("100"));
      expect(githubReward.starMilestoneReward).to.equal(ethers.parseEther("50"));
      expect(githubReward.mergeReward).to.equal(ethers.parseEther("25"));
      expect(githubReward.milestoneReward).to.equal(ethers.parseEther("200"));

      const educationReward = await sgtContract.educationReward();
      expect(educationReward.projectCompletionReward).to.equal(ethers.parseEther("50"));
      expect(educationReward.achievementReward).to.equal(ethers.parseEther("25"));
      expect(educationReward.monthlyActiveReward).to.equal(ethers.parseEther("10"));
      expect(educationReward.scholarshipUnlockAmount).to.equal(ethers.parseEther("1000"));
    });
  });

  describe("Developer Rewards", function () {
    it("Should reward first PR", async function () {
      await sgtContract.rewardFirstPR(developer.address);
      
      const balance = await sgtContract.balanceOf(developer.address);
      expect(balance).to.equal(ethers.parseEther("100"));
      
      expect(await sgtContract.hasClaimedFirstPR(developer.address)).to.equal(true);
    });

    it("Should not reward first PR twice", async function () {
      await sgtContract.rewardFirstPR(developer.address);
      
      await expect(
        sgtContract.rewardFirstPR(developer.address)
      ).to.be.revertedWith("First PR already claimed");
    });

    it("Should reward star milestone", async function () {
      await sgtContract.rewardStarMilestone(developer.address);
      
      const balance = await sgtContract.balanceOf(developer.address);
      expect(balance).to.equal(ethers.parseEther("50"));
    });

    it("Should reward merge", async function () {
      await sgtContract.rewardMerge(developer.address);
      
      const balance = await sgtContract.balanceOf(developer.address);
      expect(balance).to.equal(ethers.parseEther("25"));
    });

    it("Should reward milestone", async function () {
      await sgtContract.rewardMilestone(developer.address, 1);
      
      const balance = await sgtContract.balanceOf(developer.address);
      expect(balance).to.equal(ethers.parseEther("200"));
      
      expect(await sgtContract.developerMilestones(developer.address)).to.equal(1);
    });

    it("Should emit DeveloperRewarded event", async function () {
      await expect(sgtContract.rewardFirstPR(developer.address))
        .to.emit(sgtContract, "DeveloperRewarded")
        .withArgs(developer.address, ethers.parseEther("100"), "First PR");
    });
  });

  describe("Employee Tokens", function () {
    it("Should issue employee token", async function () {
      const amount = ethers.parseEther("5000");
      await sgtContract.issueEmployeeToken(employee.address, amount);
      
      const balance = await sgtContract.balanceOf(employee.address);
      expect(balance).to.equal(amount);
      
      expect(await sgtContract.isEmployee(employee.address)).to.equal(true);
    });

    it("Should not issue employee token twice", async function () {
      const amount = ethers.parseEther("5000");
      await sgtContract.issueEmployeeToken(employee.address, amount);
      
      await expect(
        sgtContract.issueEmployeeToken(employee.address, amount)
      ).to.be.revertedWith("Already issued");
    });

    it("Should emit EmployeeTokenIssued event", async function () {
      const amount = ethers.parseEther("5000");
      await expect(sgtContract.issueEmployeeToken(employee.address, amount))
        .to.emit(sgtContract, "EmployeeTokenIssued")
        .withArgs(employee.address, amount);
    });
  });

  describe("Education Rewards", function () {
    it("Should register parental wallet", async function () {
      await sgtContract.registerParentalWallet(parent.address, child.address);
      
      expect(await sgtContract.parentalWallets(parent.address)).to.equal(true);
      expect(await sgtContract.childToParent(child.address)).to.equal(parent.address);
    });

    it("Should reward project completion", async function () {
      await sgtContract.rewardProjectCompletion(student.address);
      
      const balance = await sgtContract.balanceOf(student.address);
      expect(balance).to.equal(ethers.parseEther("50"));
    });

    it("Should reward achievement", async function () {
      await sgtContract.rewardAchievement(student.address);
      
      const balance = await sgtContract.balanceOf(student.address);
      expect(balance).to.equal(ethers.parseEther("25"));
    });

    it("Should unlock scholarship when threshold reached", async function () {
      // Give student enough tokens
      const amount = ethers.parseEther("1000");
      await sgtContract.rewardProjectCompletion(student.address);
      
      // Transfer from contract to reach threshold
      await sgtContract.connect(owner).transfer(student.address, ethers.parseEther("950"));
      
      await expect(sgtContract.unlockScholarship(student.address))
        .to.emit(sgtContract, "ScholarshipUnlocked");
    });

    it("Should fail to unlock scholarship below threshold", async function () {
      await sgtContract.rewardProjectCompletion(student.address); // Only 50 tokens
      
      await expect(
        sgtContract.unlockScholarship(student.address)
      ).to.be.revertedWith("Insufficient tokens for scholarship");
    });
  });

  describe("Staking", function () {
    beforeEach(async function () {
      // Give developer some tokens
      await sgtContract.rewardFirstPR(developer.address);
    });

    it("Should stake tokens", async function () {
      const stakeAmount = ethers.parseEther("50");
      await sgtContract.connect(developer).stake(stakeAmount);
      
      const stakingInfo = await sgtContract.stakingInfo(developer.address);
      expect(stakingInfo.stakedAmount).to.equal(stakeAmount);
      
      expect(await sgtContract.totalStaked()).to.equal(stakeAmount);
    });

    it("Should emit TokensStaked event", async function () {
      const stakeAmount = ethers.parseEther("50");
      await expect(sgtContract.connect(developer).stake(stakeAmount))
        .to.emit(sgtContract, "TokensStaked")
        .withArgs(developer.address, stakeAmount);
    });

    it("Should unstake tokens", async function () {
      const stakeAmount = ethers.parseEther("50");
      await sgtContract.connect(developer).stake(stakeAmount);
      
      await sgtContract.connect(developer).unstake(stakeAmount);
      
      const stakingInfo = await sgtContract.stakingInfo(developer.address);
      expect(stakingInfo.stakedAmount).to.equal(0);
    });

    it("Should calculate staking reward correctly", async function () {
      const stakeAmount = ethers.parseEther("1000");
      await sgtContract.rewardMilestone(developer.address, 1); // Get more tokens
      await sgtContract.connect(developer).stake(stakeAmount);
      
      // Fast forward 365 days
      await time.increase(365 * 24 * 60 * 60);
      
      const reward = await sgtContract.calculateStakingReward(developer.address);
      
      // APY is 9.63%, so reward should be approximately 96.3 tokens
      const expectedReward = stakeAmount * 963n / 10000n;
      expect(reward).to.be.closeTo(expectedReward, ethers.parseEther("1"));
    });

    it("Should claim staking reward", async function () {
      const stakeAmount = ethers.parseEther("1000");
      await sgtContract.rewardMilestone(developer.address, 1);
      await sgtContract.connect(developer).stake(stakeAmount);
      
      // Fast forward time
      await time.increase(365 * 24 * 60 * 60);
      
      const balanceBefore = await sgtContract.balanceOf(developer.address);
      await sgtContract.connect(developer).claimStakingReward();
      const balanceAfter = await sgtContract.balanceOf(developer.address);
      
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });
  });

  describe("AI Merit Economy", function () {
    beforeEach(async function () {
      await sgtContract.rewardFirstPR(developer.address);
    });

    it("Should burn tokens for AI merit", async function () {
      const burnAmount = ethers.parseEther("50");
      const balanceBefore = await sgtContract.balanceOf(developer.address);
      
      await sgtContract.connect(developer).burnForAIMerit(burnAmount);
      
      const balanceAfter = await sgtContract.balanceOf(developer.address);
      expect(balanceAfter).to.equal(balanceBefore - burnAmount);
      
      // Merit score should be 50 (burnAmount in tokens)
      expect(await sgtContract.aiMeritScore(developer.address)).to.equal(50);
    });

    it("Should track total AI merit burned", async function () {
      const burnAmount = ethers.parseEther("50");
      await sgtContract.connect(developer).burnForAIMerit(burnAmount);
      
      expect(await sgtContract.totalAIMeritBurned()).to.equal(burnAmount);
    });

    it("Should emit AITokensBurned event", async function () {
      const burnAmount = ethers.parseEther("50");
      await expect(sgtContract.connect(developer).burnForAIMerit(burnAmount))
        .to.emit(sgtContract, "AITokensBurned")
        .withArgs(developer.address, burnAmount, 50);
    });
  });

  describe("Governance", function () {
    it("Should update GitHub rewards", async function () {
      await sgtContract.updateGitHubRewards(
        ethers.parseEther("200"),
        ethers.parseEther("100"),
        ethers.parseEther("50"),
        ethers.parseEther("400")
      );
      
      const githubReward = await sgtContract.githubReward();
      expect(githubReward.firstPRReward).to.equal(ethers.parseEther("200"));
      expect(githubReward.milestoneReward).to.equal(ethers.parseEther("400"));
    });

    it("Should update education rewards", async function () {
      await sgtContract.updateEducationRewards(
        ethers.parseEther("100"),
        ethers.parseEther("50"),
        ethers.parseEther("20"),
        ethers.parseEther("2000")
      );
      
      const educationReward = await sgtContract.educationReward();
      expect(educationReward.projectCompletionReward).to.equal(ethers.parseEther("100"));
      expect(educationReward.scholarshipUnlockAmount).to.equal(ethers.parseEther("2000"));
    });

    it("Should update staking APY", async function () {
      await sgtContract.updateStakingAPY(1000); // 10%
      expect(await sgtContract.stakingAPY()).to.equal(1000);
    });

    it("Should withdraw from treasury", async function () {
      const withdrawAmount = ethers.parseEther("1000");
      await sgtContract.withdrawTreasury(developer.address, withdrawAmount);
      
      expect(await sgtContract.balanceOf(developer.address)).to.equal(withdrawAmount);
    });
  });

  describe("Pausable", function () {
    it("Should pause and unpause", async function () {
      await sgtContract.pause();
      
      await expect(
        sgtContract.rewardFirstPR(developer.address)
      ).to.be.revertedWithCustomError(sgtContract, "EnforcedPause");
      
      await sgtContract.unpause();
      await sgtContract.rewardFirstPR(developer.address);
      expect(await sgtContract.balanceOf(developer.address)).to.equal(ethers.parseEther("100"));
    });
  });

  describe("Owner Only Functions", function () {
    it("Should allow only owner to reward", async function () {
      await expect(
        sgtContract.connect(developer).rewardFirstPR(developer.address)
      ).to.be.revertedWithCustomError(sgtContract, "OwnableUnauthorizedAccount");
    });

    it("Should allow only owner to issue employee tokens", async function () {
      await expect(
        sgtContract.connect(employee).issueEmployeeToken(employee.address, ethers.parseEther("1000"))
      ).to.be.revertedWithCustomError(sgtContract, "OwnableUnauthorizedAccount");
    });
  });

  describe("ERC20 Votes", function () {
    it("Should support delegation", async function () {
      await sgtContract.rewardFirstPR(developer.address);
      await sgtContract.connect(developer).delegate(developer.address);
      
      const votes = await sgtContract.getVotes(developer.address);
      expect(votes).to.equal(ethers.parseEther("100"));
    });
  });
});
