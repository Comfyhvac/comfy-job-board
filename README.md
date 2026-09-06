# Comfy HVAC - Job Board

A password-protected web app for managing HVAC job scheduling with automatic Slack integration.

## Features

✅ **Web-Based Calendar** - View jobs in a clean, professional calendar interface
✅ **Role-Based Access** - Comfort Advisors (add/view only) & Admins (full control)
✅ **Password Protected** - Single password authentication
✅ **4 Jobs Per Day** - Each day has 4 install slots
✅ **iPhone Responsive** - Works perfectly on mobile devices
✅ **GitHub Pages Hosted** - Free, fast hosting
✅ **Slack Integration** - Automatic calendar posts at 7 AM & 1 PM
✅ **Data Persistence** - Jobs saved automatically in browser

## Quick Setup

### Step 1: Create Slack Webhook (5 minutes)

1. Go to your Slack workspace
2. Create a new channel called `#install-calendar` (or use existing channel)
3. Go to https://api.slack.com/apps
4. Click "Create New App" → "From scratch"
5. Name: "Comfy Calendar Bot"
6. Select your workspace
7. In left menu, click "Incoming Webhooks"
8. Click "Add New Webhook to Workspace"
9. Select the `#install-calendar` channel
10. Copy the Webhook URL (looks like: `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`)

### Step 2: Add Secret to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `SLACK_WEBHOOK_URL`
5. Value: Paste the Webhook URL you copied above
6. Click "Add secret"

### Step 3: Change Password (Recommended)

Open `index.html` and find this line (around line 400):
```javascript
const PASSWORD = 'comfy2024';
```

Change `'comfy2024'` to your desired password.

### Step 4: Deploy to GitHub Pages

1. Push all files to your GitHub repository
2. Go to repository **Settings** → **Pages**
3. Set Source to "Deploy from a branch"
4. Select branch: `main` (or your default)
5. Select folder: `/ (root)`
6. Click "Save"
7. Wait 1-2 minutes, then visit: `https://yourusername.github.io/comfy-job-board`

### Step 5: Set Your Timezone for Slack Posts

Open `.github/workflows/slack-calendar.yml` and find the cron schedule:

```yaml
schedule:
  - cron: '0 7 * * *'  # 7 AM
  - cron: '0 13 * * *' # 1 PM
```

**These times are in UTC.** To convert to your timezone:

- **Pacific (PST/PDT)**: 7 AM = `14` / 1 PM = `20` 
- **Mountain (MST/MDT)**: 7 AM = `13` / 1 PM = `19`
- **Central (CST/CDT)**: 7 AM = `12` / 1 PM = `18`
- **Eastern (EST/EDT)**: 7 AM = `11` / 1 PM = `17`

Example for Pacific Time (7 AM = 2 PM UTC, 1 PM = 8 PM UTC):
```yaml
schedule:
  - cron: '0 14 * * *'  # 7 AM PT
  - cron: '0 20 * * *'  # 1 PM PT
```

## File Structure

```
comfy-job-board/
├── index.html                    # Main job board application
├── README.md                     # This file
├── .github/
│   └── workflows/
│       └── slack-calendar.yml    # GitHub Actions automation
└── scripts/
    └── screenshot.js             # Calendar screenshot script
```

## Usage

### For Comfort Advisors:
1. Login with password (default: `comfy2024`)
2. Select "Comfort Advisor" role
3. Click empty slots to add jobs
4. Fill in: Customer Name, City, Job Details
5. Click "Save Job"
6. ✅ You can VIEW existing jobs but cannot EDIT them

### For Admins:
1. Login with password
2. Select "Admin" role
3. Add, edit, or delete any job
4. Full control over the calendar

### Slack Calendar Posts:
- Automatically posts at 7 AM and 1 PM
- Shows current month calendar with all jobs
- Includes customer names and job cities
- No passwords or details shown in Slack (just visual overview)

## Troubleshooting

### Calendar not showing on GitHub Pages?
- Wait 1-2 minutes after enabling Pages
- Check the branch is set to `main` (or your default branch)
- Verify all files are committed and pushed

### Slack posts not appearing?
- Check that Webhook URL is correct in GitHub Secrets
- Verify GitHub Actions is enabled (Settings → Actions)
- Check Actions tab to see if workflow ran successfully
- Confirm Slack bot has permission to post in channel

### Can't login?
- Make sure you're using the correct password (default: `comfy2024`)
- Clear browser cache and try again
- Try a different browser

### Data not saving?
- Make sure you clicked "Save Job" button
- Check that browser allows localStorage
- Try disabling browser extensions

## Security Notes

⚠️ **Change the default password immediately** before team use
⚠️ Slack Webhook URL is private - don't share it
⚠️ Data is stored in browser localStorage (not sent to server)
⚠️ Keep GitHub repository private if using passwords

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review GitHub Actions logs (Settings → Actions)
3. Verify Slack Webhook URL is valid and secret is set

## Updates & Maintenance

To update the job board:
1. Make changes to `index.html`
2. Commit and push to GitHub
3. Changes appear on GitHub Pages within 1-2 minutes

No installation or build process needed!

---

**Created for Comfy HVAC**
Last Updated: September 2026
