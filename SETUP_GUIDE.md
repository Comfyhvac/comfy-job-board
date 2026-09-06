# Complete Setup Guide - Comfy HVAC Job Board

This guide walks you through setting up your job board on GitHub Pages with automatic Slack integration.

**⏱️ Estimated Time: 15-20 minutes**

---

## Part 1: Create Slack Webhook (5 minutes)

### 1.1 Create Slack Channel

1. Open your Slack workspace
2. Click **+** next to "Channels"
3. Click **Create a channel**
4. Name: `install-calendar`
5. Description: "Daily calendar of scheduled HVAC installations"
6. Click **Create**

### 1.2 Create Slack App & Webhook

1. Go to https://api.slack.com/apps
2. Click **"Create New App"**
3. Select **"From scratch"**
4. App name: `Comfy Calendar Bot`
5. Workspace: Select your Comfy workspace
6. Click **Create App**

### 1.3 Enable Incoming Webhooks

1. In the left sidebar, click **"Incoming Webhooks"**
2. Toggle **"Incoming Webhooks"** to **On**
3. Click **"Add New Webhook to Workspace"**
4. Select channel: `#install-calendar`
5. Click **"Allow"**

### 1.4 Copy Your Webhook URL

1. You'll see a new webhook listed
2. Click **Copy** to copy the full URL
3. It looks like: `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`
4. **Keep this URL safe** - don't share it publicly!

⚠️ **Save this URL - you'll need it in the next step!**

---

## Part 2: Set Up GitHub Repository (5 minutes)

### 2.1 Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `comfy-job-board`
3. Description: "Job scheduling calendar with Slack integration"
4. Select **Private** (if you want to keep it private)
5. Do NOT initialize with README (we have our own)
6. Click **Create repository**

### 2.2 Upload Files

**Option A: Using Git Command Line (recommended)**

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/comfy-job-board.git
cd comfy-job-board

# Copy all files from this guide into the folder

# Push to GitHub
git add .
git commit -m "Initial commit: Job board with Slack integration"
git push origin main
```

**Option B: Upload via GitHub Web Interface**

1. Go to your repository on GitHub
2. Click **Add file** → **Upload files**
3. Select all files from this setup (index.html, README.md, etc.)
4. Click **Commit changes**

### 2.3 Add Repository Files

Your repository should have this structure:

```
comfy-job-board/
├── index.html                    # Job board app
├── README.md                     # Documentation
├── package.json                  # Node dependencies
├── .github/
│   └── workflows/
│       └── slack-calendar.yml    # GitHub Actions automation
└── scripts/
    └── screenshot.js             # Slack posting script
```

If you don't have the `.github/workflows/` folder, create it:
1. In GitHub, click **Create new file**
2. Enter path: `.github/workflows/slack-calendar.yml`
3. Paste the workflow content
4. Click **Commit new file**

---

## Part 3: Add Secret to GitHub (3 minutes)

### 3.1 Go to Repository Settings

1. Open your repository: https://github.com/YOUR_USERNAME/comfy-job-board
2. Click **Settings** (top right)
3. In left sidebar, click **Secrets and variables** → **Actions**

### 3.2 Create Secret

1. Click **New repository secret**
2. Name: `SLACK_WEBHOOK_URL`
3. Secret: Paste the Webhook URL from Step 1.4
4. Click **Add secret**

✅ The secret is now secure and only accessible to GitHub Actions

---

## Part 4: Enable GitHub Pages (3 minutes)

### 4.1 Enable Pages

1. In repository **Settings**, click **Pages** (in left sidebar)
2. Under "Source", select **Deploy from a branch**
3. Branch: `main`
4. Folder: `/ (root)`
5. Click **Save**

### 4.2 Wait for Deployment

1. You'll see a blue message: "Your site is live at..."
2. The URL will be: `https://YOUR_USERNAME.github.io/comfy-job-board`
3. Wait 1-2 minutes for the site to deploy
4. Visit the URL to see your job board!

---

## Part 5: Verify Slack Integration (2 minutes)

### 5.1 Manually Trigger Workflow

1. Go to your repository
2. Click **Actions** (top navigation)
3. Click **Post Calendar to Slack** (left sidebar)
4. Click **Run workflow** → **Run workflow**
5. Wait 30 seconds...
6. Check your `#install-calendar` Slack channel
7. You should see the calendar posted! ✅

### 5.2 If It Doesn't Work

**Check the workflow log:**
1. Click on the workflow run
2. Click **post-calendar** job
3. Read the output to see what went wrong
4. Common issues:
   - Wrong Webhook URL in secrets
   - Channel doesn't exist
   - Bot doesn't have permission

**Troubleshooting:**
- Verify Webhook URL is copied correctly (no extra spaces)
- Make sure #install-calendar channel exists
- Re-create the Slack app if issues persist

---

## Part 6: Set Your Timezone (2 minutes)

The calendar posts at 7 AM and 1 PM UTC by default. 

**If you're not in UTC, update the schedule:**

### Find Your UTC Offset

- **Pacific (PT)**: UTC-7 (summer) or UTC-8 (winter)
- **Mountain (MT)**: UTC-6 (summer) or UTC-7 (winter)
- **Central (CT)**: UTC-5 (summer) or UTC-6 (winter)
- **Eastern (ET)**: UTC-4 (summer) or UTC-5 (winter)

### Edit Workflow File

1. Open `.github/workflows/slack-calendar.yml`
2. Find the `schedule` section:
```yaml
schedule:
  - cron: '0 7 * * *'   # First time
  - cron: '0 13 * * *'  # Second time
```

3. The numbers are in 24-hour UTC format
4. To convert: 
   - Subtract your UTC offset from your desired time
   - Example: 7 AM Pacific = 2 PM UTC = hour 14

**Common Times (UTC):**
- 7 AM PT = 14 UTC
- 7 AM MT = 13 UTC
- 7 AM CT = 12 UTC
- 7 AM ET = 11 UTC

4. Update both cron lines
5. Click **Commit changes**

---

## Part 7: Change Password (Recommended)

### 7.1 Edit index.html

1. Open your repository
2. Click `index.html`
3. Click the **✏️ edit icon**
4. Find this line (around line 390):
```javascript
const PASSWORD = 'comfy2024';
```

5. Change `'comfy2024'` to your password
6. Click **Commit changes**

---

## Part 8: Verify Everything Works! ✅

### 8.1 Test the Job Board

1. Visit: `https://YOUR_USERNAME.github.io/comfy-job-board`
2. You should see the login screen with Comfy colors
3. Login with your password
4. Try adding a job:
   - Select "Comfort Advisor" role
   - Click an empty slot
   - Add Customer, City, Job Details
   - Click Save
   - See it appear on calendar
5. Logout and login as "Admin"
   - Try editing/deleting jobs
   - Only admins can do this ✅

### 8.2 Test Slack Posts

1. Go to GitHub → **Actions**
2. Click **Post Calendar to Slack**
3. Click **Run workflow**
4. Check **#install-calendar** after 30 seconds
5. You should see the calendar posted ✅

### 8.3 Verify Automatic Scheduling

1. Go to **Actions** → **Post Calendar to Slack**
2. You should see workflow runs at your scheduled times (7 AM & 1 PM)
3. Each day, 2 calendar images post to Slack automatically ✅

---

## Part 9: Share with Your Team

### 9.1 Share Access

1. **For the job board:** Share the URL `https://YOUR_USERNAME.github.io/comfy-job-board`
2. **For Slack:** They already have access to `#install-calendar`
3. **Password:** Share password through secure means (not Slack!)

### 9.2 Team Training

**For Comfort Advisors:**
- Login with shared password
- Select "Comfort Advisor"
- Click any empty slot to add a job
- Fill in: Customer Name, City, Job Details
- Click Save Job
- ✅ You can view but not edit existing jobs

**For Admins:**
- Login with shared password
- Select "Admin"
- Full access to add, edit, delete any job

---

## Troubleshooting

### Job Board Not Loading?

**Problem:** Page shows blank or error
**Solution:**
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Check GitHub Pages is enabled in Settings
3. Wait a few minutes for GitHub Pages to deploy

### Can't Login?

**Problem:** Password doesn't work
**Solution:**
1. Clear browser cookies
2. Make sure Caps Lock is off
3. Check that password was changed correctly in code

### Slack Posts Not Appearing?

**Problem:** Calendar doesn't post to #install-calendar
**Solution:**
1. Check Actions log for errors
2. Verify Webhook URL in Secrets (Settings → Secrets and variables)
3. Confirm #install-calendar channel exists
4. Test manually: Actions → Post Calendar to Slack → Run workflow

### Jobs Not Saving?

**Problem:** Job doesn't appear after clicking Save
**Solution:**
1. Make sure you filled all required fields (*, Customer, City, Details)
2. Check browser allows localStorage (no private browsing)
3. Try different browser
4. Disable browser extensions

---

## Summary

You now have:

✅ A password-protected job board on GitHub Pages
✅ Role-based access (Advisor vs Admin)
✅ Automatic Slack posts at 7 AM & 1 PM
✅ Calendar with 4 job slots per day
✅ iPhone responsive design
✅ Data saved in browser

## Next Steps

1. Share the job board URL with your team
2. Have them create accounts with their role
3. Monitor Slack posts each day
4. Update password periodically
5. Back up important jobs (export calendar data)

---

**Questions?** Check the README.md for more details or GitHub Actions logs for technical issues.

**Enjoy your new job board!** 🎉

---

Created for Comfy HVAC  
Last Updated: September 2026
