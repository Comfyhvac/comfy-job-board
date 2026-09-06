const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * Generate a visual calendar for Slack
 * This creates a formatted text/image representation of the current month
 */

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getFirstDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

function generateCalendarText() {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const daysInMonth = getDaysInMonth(today);
  const firstDay = getFirstDayOfMonth(today);

  let calendar = `📅 *${monthNames[month]} ${year} - Install Calendar*\n\n`;
  calendar += `\`\`\`\n`;

  // Add day headers
  dayNames.forEach(day => {
    calendar += day.padEnd(8);
  });
  calendar += '\n';

  // Add separator
  calendar += '─────────────────────────────────────────────\n';

  // Add empty cells before first day
  let dayCounter = 0;
  for (let i = 0; i < firstDay; i++) {
    calendar += '       ';
    dayCounter++;
  }

  // Add days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = String(day).padEnd(7);
    calendar += dayStr;
    dayCounter++;

    if (dayCounter % 7 === 0) {
      calendar += '\n';
    }
  }

  calendar += '\n\`\`\`\n';

  // Add instructions
  calendar += `📋 *View Full Calendar:*\nVisit your job board to see job details\n`;
  calendar += `🔐 *Login Required* - Use your password to access\n`;
  calendar += `✅ *Slots Status:* Open slots available - Click to add jobs\n`;

  return calendar;
}

function generateCalendarBlocks() {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const daysInMonth = getDaysInMonth(today);
  const firstDay = getFirstDayOfMonth(today);

  // Create a calendar grid for visual representation
  let calendarGrid = [];

  // Day headers
  calendarGrid.push(dayNames.map(day => ({
    text: day,
    emoji: '📅'
  })));

  // Build calendar grid
  let weekRow = [];
  for (let i = 0; i < firstDay; i++) {
    weekRow.push({ text: ' ', emoji: '' });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    weekRow.push({ text: String(day), emoji: '📌' });

    if (weekRow.length === 7) {
      calendarGrid.push(weekRow);
      weekRow = [];
    }
  }

  if (weekRow.length > 0) {
    while (weekRow.length < 7) {
      weekRow.push({ text: ' ', emoji: '' });
    }
    calendarGrid.push(weekRow);
  }

  // Build Slack blocks
  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `📅 ${monthNames[month]} ${year} - Install Calendar`,
        emoji: true
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Current Month Overview*\n_All jobs scheduled for ${monthNames[month]}_`
      }
    },
    {
      type: 'divider'
    }
  ];

  // Add calendar grid as text (since Slack doesn't natively support calendar grids)
  let calendarMarkdown = '```\n';
  calendarMarkdown += dayNames.map(d => d.padEnd(8)).join('');
  calendarMarkdown += '\n─────────────────────────────────────────────\n';

  for (let week of calendarGrid) {
    calendarMarkdown += week.map(day => day.text.padEnd(8)).join('');
    calendarMarkdown += '\n';
  }
  calendarMarkdown += '```\n';

  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: calendarMarkdown
    }
  });

  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `📋 *Status*\n• Login to view full job details\n• Click any slot to add or edit jobs\n• Admins can modify any job\n• Comfort Advisors can only view existing jobs`
    }
  });

  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `Last updated: <!date^${Math.floor(Date.now() / 1000)}^{date_num} {time_secs}|${new Date().toLocaleString()}>`
      }
    ]
  });

  return blocks;
}

function postToSlack(message) {
  return new Promise((resolve, reject) => {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error('❌ Error: SLACK_WEBHOOK_URL environment variable not set');
      reject(new Error('Missing SLACK_WEBHOOK_URL'));
      return;
    }

    const payload = {
      text: message.text || 'Comfy HVAC Calendar Update',
      blocks: message.blocks
    };

    const data = JSON.stringify(payload);

    const url = new URL(webhookUrl);

    const options = {
      hostname: url.hostname,
      pathname: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Successfully posted calendar to Slack');
          resolve(body);
        } else {
          console.error(`❌ Slack API error: ${res.statusCode}`);
          console.error('Response:', body);
          reject(new Error(`Slack API returned ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Error posting to Slack:', error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  try {
    console.log('🔄 Generating calendar for Slack...');

    const message = {
      text: `Comfy HVAC - ${new Date().toLocaleDateString()} Calendar Update`,
      blocks: generateCalendarBlocks()
    };

    console.log('📤 Posting to Slack...');
    await postToSlack(message);

    console.log('✅ Calendar successfully posted to Slack!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to post calendar:', error.message);
    process.exit(1);
  }
}

main();
