/**
 * Custom GitHub Streak Stats Generator
 * Fetches contribution data from GitHub GraphQL API and generates SVG
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const USERNAME = process.env.GITHUB_USER || 'vickyymosafan';
const TOKEN = process.env.GITHUB_TOKEN;
const OUTPUT_DIR = process.env.OUTPUT_DIR || 'dist';

// Tokyo Night Theme Colors
const THEME = {
    background: '#1a1b27',
    border: '#414868',
    title: '#c0caf5',
    text: '#a9b1d6',
    accent: '#9ece6a',
    ring: '#9ece6a',
    ringBg: '#414868',
    fire: '#ff9e64'
};

/**
 * Fetch contribution data from GitHub GraphQL API
 */
async function fetchContributions(username, token) {
    const query = `
    query($username: String!) {
      user(login: $username) {
        createdAt
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

    const response = await new Promise((resolve, reject) => {
        const data = JSON.stringify({
            query,
            variables: { username }
        });

        const options = {
            hostname: 'api.github.com',
            path: '/graphql',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'GitHub-Streak-Stats-Generator'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    reject(new Error('Failed to parse response'));
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });

    if (response.errors) {
        throw new Error(response.errors[0].message);
    }

    return response.data.user;
}

/**
 * Calculate streak statistics from contribution data
 */
function calculateStreaks(userData) {
    const calendar = userData.contributionsCollection.contributionCalendar;
    const totalContributions = calendar.totalContributions;

    // Flatten all contribution days
    const allDays = calendar.weeks
        .flatMap(week => week.contributionDays)
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Calculate current streak
    let currentStreak = 0;
    let currentStreakStart = null;
    let currentStreakEnd = null;
    let startIndex = 0;

    // Check if today has contributions, if not start from yesterday
    if (allDays[0]?.date === today && allDays[0]?.contributionCount === 0) {
        startIndex = 1;
    }

    for (let i = startIndex; i < allDays.length; i++) {
        const day = allDays[i];
        if (day.contributionCount > 0) {
            if (currentStreak === 0) {
                currentStreakEnd = day.date;
            }
            currentStreak++;
            currentStreakStart = day.date;
        } else {
            break;
        }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let longestStreakStart = null;
    let longestStreakEnd = null;
    let tempStreak = 0;
    let tempStart = null;
    let tempEnd = null;

    // Process from oldest to newest
    const sortedDays = [...allDays].reverse();

    for (const day of sortedDays) {
        if (day.contributionCount > 0) {
            if (tempStreak === 0) {
                tempStart = day.date;
            }
            tempStreak++;
            tempEnd = day.date;
        } else {
            if (tempStreak > longestStreak) {
                longestStreak = tempStreak;
                longestStreakStart = tempStart;
                longestStreakEnd = tempEnd;
            }
            tempStreak = 0;
        }
    }

    // Check final streak
    if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
        longestStreakStart = tempStart;
        longestStreakEnd = tempEnd;
    }

    // Get account creation date
    const createdAt = new Date(userData.createdAt);
    const createdAtStr = formatDate(createdAt);

    return {
        totalContributions,
        totalRange: `${createdAtStr} - Present`,
        currentStreak,
        currentStreakStart: currentStreakStart ? formatDate(new Date(currentStreakStart)) : 'N/A',
        currentStreakEnd: currentStreakEnd ? formatDate(new Date(currentStreakEnd)) : 'N/A',
        longestStreak,
        longestStreakStart: longestStreakStart ? formatDate(new Date(longestStreakStart)) : 'N/A',
        longestStreakEnd: longestStreakEnd ? formatDate(new Date(longestStreakEnd)) : 'N/A'
    };
}

/**
 * Format date as "Mon DD, YYYY"
 */
function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Generate SVG string
 */
function generateSVG(stats) {
    const width = 495;
    const height = 195;
    const ringRadius = 40;
    const ringStroke = 6;
    const circumference = 2 * Math.PI * ringRadius;
    const maxStreak = 365; // For progress calculation
    const progress = Math.min(stats.currentStreak / maxStreak, 1);
    const dashOffset = circumference * (1 - progress);

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <style>
    .title { font: 600 18px 'Segoe UI', Ubuntu, sans-serif; fill: ${THEME.title}; }
    .stat { font: 700 28px 'Segoe UI', Ubuntu, sans-serif; fill: ${THEME.text}; }
    .label { font: 400 12px 'Segoe UI', Ubuntu, sans-serif; fill: ${THEME.text}; opacity: 0.8; }
    .date { font: 400 10px 'Segoe UI', Ubuntu, sans-serif; fill: ${THEME.text}; opacity: 0.6; }
    .fire { font: 24px sans-serif; }
  </style>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" rx="6" fill="${THEME.background}"/>
  
  <!-- Border -->
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="6" fill="none" stroke="${THEME.border}" stroke-width="1"/>
  
  <!-- Title -->
  <text x="${width / 2}" y="30" class="title" text-anchor="middle">GitHub Streak Stats</text>
  
  <!-- Left Column: Total Contributions -->
  <g transform="translate(82.5, 100)">
    <text x="0" y="-15" class="stat" text-anchor="middle">${stats.totalContributions}</text>
    <text x="0" y="10" class="label" text-anchor="middle">Total Contributions</text>
    <text x="0" y="30" class="date" text-anchor="middle">${stats.totalRange}</text>
  </g>
  
  <!-- Center Column: Current Streak with Ring -->
  <g transform="translate(247.5, 100)">
    <!-- Background Ring -->
    <circle cx="0" cy="-5" r="${ringRadius}" fill="none" stroke="${THEME.ringBg}" stroke-width="${ringStroke}"/>
    
    <!-- Progress Ring -->
    <circle cx="0" cy="-5" r="${ringRadius}" fill="none" stroke="${THEME.ring}" stroke-width="${ringStroke}"
      stroke-dasharray="${circumference}" stroke-dashoffset="${dashOffset}"
      stroke-linecap="round" transform="rotate(-90 0 -5)"/>
    
    <!-- Streak Number -->
    <text x="0" y="3" class="stat" text-anchor="middle">${stats.currentStreak}</text>
    
    <!-- Fire Emoji (only if streak > 0) -->
    ${stats.currentStreak > 0 ? `<text x="0" y="-35" class="fire" text-anchor="middle">🔥</text>` : ''}
    
    <!-- Label -->
    <text x="0" y="55" class="label" text-anchor="middle">Current Streak</text>
    <text x="0" y="75" class="date" text-anchor="middle">${stats.currentStreakStart} - ${stats.currentStreakEnd}</text>
  </g>
  
  <!-- Right Column: Longest Streak -->
  <g transform="translate(412.5, 100)">
    <text x="0" y="-15" class="stat" text-anchor="middle">${stats.longestStreak}</text>
    <text x="0" y="10" class="label" text-anchor="middle">Longest Streak</text>
    <text x="0" y="30" class="date" text-anchor="middle">${stats.longestStreakStart} - ${stats.longestStreakEnd}</text>
  </g>
</svg>`;
}

/**
 * Main execution
 */
async function main() {
    console.log(`🔄 Generating streak stats for ${USERNAME}...`);

    if (!TOKEN) {
        throw new Error('GITHUB_TOKEN is required');
    }

    // Fetch data
    console.log('📡 Fetching contribution data...');
    const userData = await fetchContributions(USERNAME, TOKEN);

    // Calculate streaks
    console.log('🔢 Calculating streaks...');
    const stats = calculateStreaks(userData);
    console.log('Stats:', stats);

    // Generate SVG
    console.log('🎨 Generating SVG...');
    const svg = generateSVG(stats);

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Write SVG
    const outputPath = path.join(OUTPUT_DIR, 'github-streak.svg');
    fs.writeFileSync(outputPath, svg);
    console.log(`✅ SVG saved to ${outputPath}`);
}

main().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
