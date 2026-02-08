const contractService = require('../utils/contractService');
const logger = require('../utils/logger');
const crypto = require('crypto');

class GitHubController {
  constructor() {
    this.oauthStates = new Map(); // Store OAuth states temporarily
  }

  // GitHub OAuth - Initiate
  async initiateOAuth(req, res) {
    try {
      const state = crypto.randomBytes(32).toString('hex');
      const githubClientId = process.env.GITHUB_CLIENT_ID;
      
      if (!githubClientId) {
        return res.status(500).json({ error: 'GitHub OAuth not configured' });
      }

      // Store state temporarily (in production, use Redis or similar)
      this.oauthStates.set(state, { timestamp: Date.now() });

      const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/github/oauth/callback`;
      const scope = 'read:user,user:email,repo';
      
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
      
      res.json({
        success: true,
        data: { authUrl },
      });
    } catch (error) {
      logger.error('Error in initiateOAuth:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // GitHub OAuth - Callback Handler
  async handleOAuthCallback(req, res) {
    try {
      const { code, state } = req.query;
      
      if (!code || !state) {
        return res.status(400).json({ error: 'Missing code or state' });
      }

      // Verify state
      if (!this.oauthStates.has(state)) {
        return res.status(400).json({ error: 'Invalid state' });
      }
      
      this.oauthStates.delete(state);

      // Exchange code for access token (in production)
      // const token = await this.exchangeCodeForToken(code);
      
      res.json({
        success: true,
        message: 'OAuth authentication successful',
        // data: { token } // Return token in production
      });
    } catch (error) {
      logger.error('Error in handleOAuthCallback:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // GitHub Webhook - Pull Request
  async handlePullRequest(req, res) {
    try {
      const { action, pull_request, repository } = req.body;
      
      logger.info('Received PR webhook:', { action, pr_number: pull_request?.number });

      if (action === 'opened' && pull_request) {
        const developerAddress = await this.getAddressFromGitHub(pull_request.user.login);
        
        if (developerAddress) {
          // Check if first PR
          const hasClaimedFirstPR = await contractService.hasClaimedFirstPR(developerAddress);
          
          if (!hasClaimedFirstPR) {
            await contractService.rewardFirstPR(developerAddress);
            logger.info('Rewarded first PR:', { developer: developerAddress });
          }
        }
      }

      res.json({ success: true, message: 'Webhook processed' });
    } catch (error) {
      logger.error('Error in handlePullRequest:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // GitHub Webhook - Star
  async handleStar(req, res) {
    try {
      const { action, starred_at, sender } = req.body;
      
      logger.info('Received star webhook:', { action, sender: sender?.login });

      if (action === 'created' && sender) {
        const developerAddress = await this.getAddressFromGitHub(sender.login);
        
        if (developerAddress) {
          await contractService.rewardStarMilestone(developerAddress);
          logger.info('Rewarded star milestone:', { developer: developerAddress });
        }
      }

      res.json({ success: true, message: 'Webhook processed' });
    } catch (error) {
      logger.error('Error in handleStar:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // GitHub Webhook - Merge
  async handleMerge(req, res) {
    try {
      const { action, pull_request } = req.body;
      
      logger.info('Received merge webhook:', { action, merged: pull_request?.merged });

      if (action === 'closed' && pull_request?.merged) {
        const developerAddress = await this.getAddressFromGitHub(pull_request.user.login);
        
        if (developerAddress) {
          await contractService.rewardMerge(developerAddress);
          logger.info('Rewarded merge:', { developer: developerAddress });
        }
      }

      res.json({ success: true, message: 'Webhook processed' });
    } catch (error) {
      logger.error('Error in handleMerge:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // GitHub Webhook - Milestone
  async handleMilestone(req, res) {
    try {
      const { action, milestone, sender } = req.body;
      
      logger.info('Received milestone webhook:', { action, milestone: milestone?.title });

      if (action === 'closed' && milestone && sender) {
        const developerAddress = await this.getAddressFromGitHub(sender.login);
        
        if (developerAddress) {
          await contractService.rewardMilestone(developerAddress, milestone.number);
          logger.info('Rewarded milestone:', { developer: developerAddress, milestone: milestone.number });
        }
      }

      res.json({ success: true, message: 'Webhook processed' });
    } catch (error) {
      logger.error('Error in handleMilestone:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Reward First PR
  async rewardFirstPR(req, res) {
    try {
      const { developerAddress } = req.body;

      if (!developerAddress || !/^0x[a-fA-F0-9]{40}$/.test(developerAddress)) {
        return res.status(400).json({ error: 'Invalid developer address' });
      }

      const result = await contractService.rewardFirstPR(developerAddress);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in rewardFirstPR:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Reward Star Milestone
  async rewardStarMilestone(req, res) {
    try {
      const { developerAddress } = req.body;

      if (!developerAddress || !/^0x[a-fA-F0-9]{40}$/.test(developerAddress)) {
        return res.status(400).json({ error: 'Invalid developer address' });
      }

      const result = await contractService.rewardStarMilestone(developerAddress);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in rewardStarMilestone:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Reward Merge
  async rewardMerge(req, res) {
    try {
      const { developerAddress } = req.body;

      if (!developerAddress || !/^0x[a-fA-F0-9]{40}$/.test(developerAddress)) {
        return res.status(400).json({ error: 'Invalid developer address' });
      }

      const result = await contractService.rewardMerge(developerAddress);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in rewardMerge:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Reward Milestone
  async rewardMilestone(req, res) {
    try {
      const { developerAddress, milestoneId } = req.body;

      if (!developerAddress || !/^0x[a-fA-F0-9]{40}$/.test(developerAddress)) {
        return res.status(400).json({ error: 'Invalid developer address' });
      }

      const result = await contractService.rewardMilestone(developerAddress, milestoneId);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in rewardMilestone:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Issue Employee Token
  async issueEmployeeToken(req, res) {
    try {
      const { employeeAddress, amount } = req.body;

      if (!employeeAddress || !/^0x[a-fA-F0-9]{40}$/.test(employeeAddress)) {
        return res.status(400).json({ error: 'Invalid employee address' });
      }

      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const result = await contractService.issueEmployeeToken(employeeAddress, amount);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in issueEmployeeToken:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get Employee Status
  async getEmployeeStatus(req, res) {
    try {
      const { address } = req.params;

      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: 'Invalid address' });
      }

      const isEmployee = await contractService.isEmployee(address);
      
      res.json({
        success: true,
        data: { address, isEmployee },
      });
    } catch (error) {
      logger.error('Error in getEmployeeStatus:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Register Parental Wallet
  async registerParentalWallet(req, res) {
    try {
      const { parentAddress, childAddress } = req.body;

      if (!parentAddress || !/^0x[a-fA-F0-9]{40}$/.test(parentAddress)) {
        return res.status(400).json({ error: 'Invalid parent address' });
      }

      if (!childAddress || !/^0x[a-fA-F0-9]{40}$/.test(childAddress)) {
        return res.status(400).json({ error: 'Invalid child address' });
      }

      const result = await contractService.registerParentalWallet(parentAddress, childAddress);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in registerParentalWallet:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Reward Project Completion
  async rewardProjectCompletion(req, res) {
    try {
      const { studentAddress } = req.body;

      if (!studentAddress || !/^0x[a-fA-F0-9]{40}$/.test(studentAddress)) {
        return res.status(400).json({ error: 'Invalid student address' });
      }

      const result = await contractService.rewardProjectCompletion(studentAddress);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in rewardProjectCompletion:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Reward Achievement
  async rewardAchievement(req, res) {
    try {
      const { studentAddress } = req.body;

      if (!studentAddress || !/^0x[a-fA-F0-9]{40}$/.test(studentAddress)) {
        return res.status(400).json({ error: 'Invalid student address' });
      }

      const result = await contractService.rewardAchievement(studentAddress);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in rewardAchievement:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Unlock Scholarship
  async unlockScholarship(req, res) {
    try {
      const { studentAddress } = req.body;

      if (!studentAddress || !/^0x[a-fA-F0-9]{40}$/.test(studentAddress)) {
        return res.status(400).json({ error: 'Invalid student address' });
      }

      const result = await contractService.unlockScholarship(studentAddress);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in unlockScholarship:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get Token Info
  async getTokenInfo(req, res) {
    try {
      const info = await contractService.getTokenInfo();
      
      res.json({
        success: true,
        data: info,
      });
    } catch (error) {
      logger.error('Error in getTokenInfo:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get Token Balance
  async getTokenBalance(req, res) {
    try {
      const { address } = req.params;

      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: 'Invalid address' });
      }

      const balance = await contractService.getTokenBalance(address);
      
      res.json({
        success: true,
        data: { address, balance },
      });
    } catch (error) {
      logger.error('Error in getTokenBalance:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get Staking Info
  async getStakingInfo(req, res) {
    try {
      const { address } = req.params;

      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: 'Invalid address' });
      }

      const stakingInfo = await contractService.getStakingInfo(address);
      
      res.json({
        success: true,
        data: stakingInfo,
      });
    } catch (error) {
      logger.error('Error in getStakingInfo:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Stake Tokens
  async stakeTokens(req, res) {
    try {
      const { address, amount } = req.body;

      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: 'Invalid address' });
      }

      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const result = await contractService.stakeTokens(address, amount);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in stakeTokens:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Unstake Tokens
  async unstakeTokens(req, res) {
    try {
      const { address, amount } = req.body;

      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: 'Invalid address' });
      }

      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const result = await contractService.unstakeTokens(address, amount);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in unstakeTokens:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Claim Staking Reward
  async claimStakingReward(req, res) {
    try {
      const { address } = req.body;

      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: 'Invalid address' });
      }

      const result = await contractService.claimStakingReward(address);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in claimStakingReward:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Burn for AI Merit
  async burnForAIMerit(req, res) {
    try {
      const { address, amount } = req.body;

      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: 'Invalid address' });
      }

      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const result = await contractService.burnForAIMerit(address, amount);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in burnForAIMerit:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get AI Merit Score
  async getAIMeritScore(req, res) {
    try {
      const { address } = req.params;

      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: 'Invalid address' });
      }

      const meritScore = await contractService.getAIMeritScore(address);
      
      res.json({
        success: true,
        data: { address, meritScore },
      });
    } catch (error) {
      logger.error('Error in getAIMeritScore:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Helper: Get Ethereum address from GitHub username
  async getAddressFromGitHub(username) {
    // In production, this would query a database mapping GitHub usernames to Ethereum addresses
    // For now, return null (requires user registration)
    logger.info('Looking up address for GitHub user:', username);
    return null;
  }
}

module.exports = new GitHubController();
