const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');

// GitHub OAuth Routes
router.get('/oauth/authorize', githubController.initiateOAuth);
router.get('/oauth/callback', githubController.handleOAuthCallback);

// GitHub Webhook Routes
router.post('/webhook/pr', githubController.handlePullRequest);
router.post('/webhook/star', githubController.handleStar);
router.post('/webhook/merge', githubController.handleMerge);
router.post('/webhook/milestone', githubController.handleMilestone);

// Developer Reward Routes
router.post('/rewards/first-pr', githubController.rewardFirstPR);
router.post('/rewards/star-milestone', githubController.rewardStarMilestone);
router.post('/rewards/merge', githubController.rewardMerge);
router.post('/rewards/milestone', githubController.rewardMilestone);

// Employee Token Routes
router.post('/employee/issue', githubController.issueEmployeeToken);
router.get('/employee/:address/status', githubController.getEmployeeStatus);

// Education Reward Routes
router.post('/education/register-parent', githubController.registerParentalWallet);
router.post('/education/reward-project', githubController.rewardProjectCompletion);
router.post('/education/reward-achievement', githubController.rewardAchievement);
router.post('/education/unlock-scholarship', githubController.unlockScholarship);

// Token Information Routes
router.get('/token/info', githubController.getTokenInfo);
router.get('/token/balance/:address', githubController.getTokenBalance);
router.get('/token/staking/:address', githubController.getStakingInfo);

// Staking Routes
router.post('/staking/stake', githubController.stakeTokens);
router.post('/staking/unstake', githubController.unstakeTokens);
router.post('/staking/claim-reward', githubController.claimStakingReward);

// AI Merit Routes
router.post('/ai-merit/burn', githubController.burnForAIMerit);
router.get('/ai-merit/score/:address', githubController.getAIMeritScore);

module.exports = router;
