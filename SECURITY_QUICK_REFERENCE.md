# 🔒 Security Quick Reference Guide

## Overview
Quick reference for managing security in the Cosmic Constitution ScrollVerse project.

## 🚨 React2Shell Vulnerability Status
**Status**: ✅ **NOT VULNERABLE**

This project uses Create React App (react-scripts), NOT Next.js. The React2Shell vulnerabilities (CVE-2025-55184, CVE-2025-55183, CVE-2025-67779) only affect Next.js with React Server Components.

**Monitoring**: Automated security scans check for Next.js introduction weekly.

## 🔄 Automated Security Updates

### Dependabot (Active)
- **Status**: ✅ Automatically enabled
- **Schedule**: Weekly on Mondays at 9 AM UTC
- **Action**: Review and merge PRs labeled `dependencies` and `security`

### Renovate (Optional)
- **Status**: ⚠️ Ready to activate
- **Activation**: Install from https://github.com/apps/renovate
- **Benefit**: More advanced features, auto-merge patches

**Recommendation**: Use Dependabot (simpler) OR Renovate (more features).

## 🔍 Security Scans

### Automated Scans Run:
- ✅ Every push to main branch
- ✅ Every pull request
- ✅ Weekly on Mondays at 9 AM UTC
- ✅ On-demand via workflow_dispatch

### View Results:
1. Go to Actions tab in GitHub
2. Select "Security Scanning" workflow
3. Review latest run
4. Download artifacts for detailed reports

### Scan Components:
- **npm audit**: JavaScript/Node.js vulnerabilities
- **Safety**: Python dependency vulnerabilities
- **Bandit**: Python code security issues
- **React2Shell**: Monitors for Next.js introduction
- **Dependency Review**: PR-based dependency analysis

## 🔑 Secret Management

### Critical Secrets (Rotate Immediately if Exposed):
```
SECRET_KEY
VERCEL_TOKEN
OPENAI_API_KEY
REWARDS_PRIVATE_KEY
GITHUB_PAT
UAUTH_CLIENT_SECRET
```

### Rotation Procedure:
1. Generate new secret: `openssl rand -hex 32`
2. Update in Vercel Dashboard → Settings → Environment Variables
3. Update for ALL environments (Production, Preview, Development)
4. Mark as "Sensitive"
5. Redeploy project
6. Test functionality

### Schedule:
- **Regular**: Every 90 days
- **Immediate**: If exposed or suspicious activity detected

## 🛡️ Vercel Deployment Protection

### To Enable Standard Protection:
1. Log in to Vercel Dashboard
2. Select project
3. Settings → Security
4. Enable "Standard Protection" (requires Pro plan)

### Configure:
- ✅ Password protection for preview deployments
- ✅ Authentication requirements
- ✅ CORS policies
- ✅ Audit logs

### For Preview Deployments:
- Settings → Deployment Protection
- Enable Password Protection
- Share URLs only with authorized personnel

## 📋 Weekly Security Tasks

### Monday (Automated)
- Security scans run automatically
- Dependabot creates update PRs

### During Week (Manual)
1. Review security scan results
2. Check Dependabot/Renovate PRs
3. Merge safe updates (patches, minors)
4. Test major updates in development first

## 🧪 Running Security Tests

### Local Testing:
```bash
# Run security infrastructure tests
python3 test/test_security_infrastructure.py

# Run npm audit manually
cd frontend && npm audit
cd ../backend && npm audit

# Run Python security checks
pip install safety bandit
safety check
bandit -r . --exclude ./venv,./node_modules,./.git
```

### Expected Result:
All 9 tests should pass:
- ✅ Dependabot Configuration
- ✅ Renovate Configuration
- ✅ Security Scanning Workflow
- ✅ Security Documentation
- ✅ .gitignore Security
- ✅ Environment Variables Template
- ✅ Package Security
- ✅ Vercel Configuration
- ✅ React2Shell Vulnerability

## ⚠️ Known Issues

### Frontend Vulnerabilities (9 total)
**Severity**: 6 high, 3 moderate  
**Status**: Low production risk (dev dependencies)  
**Affected**: react-scripts 5.0.1 and transitive dependencies

**Packages**:
- nth-check (high) - RegEx complexity
- svgo, @svgr/webpack (high) - Transitive chain
- webpack-dev-server (moderate) - Dev-only
- postcss (moderate) - Parsing issue

**Mitigation**:
1. These affect development builds only
2. Not exploitable in production
3. Monitor Dependabot for updates
4. Long-term: Consider migrating to Vite/Next.js

## 🚀 Quick Actions

### If Security Issue Detected:
1. **Assess Severity** (Critical/High/Medium/Low)
2. **Check if Already Fixed** in latest commit
3. **Create GitHub Issue** with `security` label
4. **For Critical/High**: Notify team immediately
5. **Apply Patch** as soon as available
6. **Rotate Secrets** if potentially exposed
7. **Verify Fix** with tests

### If Vulnerability in Dependencies:
1. Check if Dependabot created PR
2. Review PR and changelogs
3. Test in development
4. Merge and deploy
5. Verify production works

### If New CVE Announced:
1. Check if project affected
2. Review SECURITY_MITIGATION.md
3. Apply recommended mitigations
4. Update documentation
5. Communicate to team

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [SECURITY_IMPLEMENTATION.md](./SECURITY_IMPLEMENTATION.md) | Implementation summary and checklist |
| [SECURITY_MITIGATION.md](./SECURITY_MITIGATION.md) | Comprehensive security procedures |
| [SECURITY.md](./SECURITY.md) | Security policy and reporting |
| [.github/workflows/security-scan.yml](./.github/workflows/security-scan.yml) | Security scanning workflow |
| [.github/dependabot.yml](./.github/dependabot.yml) | Dependabot configuration |
| [renovate.json](./renovate.json) | Renovate configuration |

## 🆘 Emergency Contacts

### For Security Issues:
1. Create GitHub issue with `security` label
2. For sensitive issues, use GitHub Security Advisory
3. Email: security@scrollverse.org (if configured)

### For Deployment Issues:
1. Check Vercel dashboard
2. Review deployment logs
3. Check environment variables

## 📊 Security Metrics

### Current Status:
- ✅ Automated scanning: ACTIVE
- ✅ Dependabot: ACTIVE
- ⚠️ Renovate: READY (needs activation)
- ⚠️ Vercel Protection: NEEDS ACTIVATION
- ✅ Documentation: COMPLETE
- ✅ Tests: PASSING (9/9)

### Vulnerability Counts:
- **Critical**: 0
- **High**: 6 (frontend dev dependencies)
- **Moderate**: 3 (frontend dev dependencies)
- **Low**: 0

### Coverage:
- ✅ npm packages (frontend, backend, root)
- ✅ Python packages
- ✅ GitHub Actions
- ✅ Smart contracts (via Hardhat)

## 🔧 Troubleshooting

### Security Scan Failing?
1. Check workflow logs in GitHub Actions
2. Look for specific failed step
3. May be false positive - review manually
4. Update scan configuration if needed

### Dependabot PRs Not Appearing?
1. Check .github/dependabot.yml exists
2. Verify schedule (Mondays 9 AM UTC)
3. Check repository settings → Code security
4. May take 24 hours after initial setup

### Test Failures?
1. Run: `python3 test/test_security_infrastructure.py`
2. Read error messages carefully
3. Verify all files exist
4. Check file permissions

## ✅ Monthly Security Checklist

- [ ] Review all open security PRs
- [ ] Update lock files
- [ ] Review major version updates
- [ ] Check for new CVEs affecting project
- [ ] Audit environment variables
- [ ] Review access logs (if available)
- [ ] Update this guide if needed

## 🎓 Learning Resources

- **npm audit**: https://docs.npmjs.com/cli/v9/commands/npm-audit
- **Dependabot**: https://docs.github.com/en/code-security/dependabot
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **Web3 Security**: https://consensys.github.io/smart-contract-best-practices/

---

**Last Updated**: December 12, 2025  
**Version**: 1.0  
**Maintained By**: Security Team

**Remember**: Security is everyone's responsibility! 🔒
