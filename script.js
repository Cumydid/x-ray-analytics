// ========================================
// XRadar — X Account Analytics & Bot Detector
// Complete Application Logic
// ========================================

let currentView = 'dashboard';
let currentAccount = null;
let currentChartRange = '7d';

// ========================================
// DATA SIMULATION ENGINE
// ========================================

const ACCOUNT_PROFILES = {
  elonmusk: {
    name: 'Elon Musk', handle: '@elonmusk', verified: true,
    bio: 'Mars & Cars, Chips & Dips',
    location: 'Austin, TX', joined: 'June 2009', website: 'x.com',
    followers: 196800000, following: 812, tweets: 48200,
    avatarColor: '#1a1a2e', initial: 'E'
  },
  openai: {
    name: 'OpenAI', handle: '@OpenAI', verified: true,
    bio: 'Creating safe AGI that benefits all of humanity.',
    location: 'San Francisco', joined: 'December 2015', website: 'openai.com',
    followers: 4200000, following: 48, tweets: 5640,
    avatarColor: '#10a37f', initial: 'O'
  },
  naval: {
    name: 'Naval', handle: '@naval', verified: true,
    bio: 'Angel investor.',
    location: 'Earth', joined: 'February 2009', website: 'nav.al',
    followers: 2900000, following: 1241, tweets: 12400,
    avatarColor: '#334155', initial: 'N'
  },
  github: {
    name: 'GitHub', handle: '@github', verified: true,
    bio: 'How people build software. Need help? Visit support.github.com for support articles.',
    location: 'San Francisco, CA', joined: 'February 2008', website: 'github.com',
    followers: 2600000, following: 397, tweets: 19800,
    avatarColor: '#24292f', initial: 'G'
  }
};

function generateAccountData(username) {
  const lowerUser = username.toLowerCase();
  const knownProfile = ACCOUNT_PROFILES[lowerUser];

  const seed = hashString(lowerUser);
  const rng = seededRandom(seed);

  if (knownProfile) {
    return buildAccountData(knownProfile, rng);
  }

  const followers = Math.floor(rng() * 500000) + 100;
  const following = Math.floor(rng() * 3000) + 10;
  const tweets = Math.floor(rng() * 20000) + 5;
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const joinMonth = months[Math.floor(rng() * 12)];
  const joinYear = 2008 + Math.floor(rng() * 17);

  const safeName = escapeHtml(username.charAt(0).toUpperCase() + username.slice(1));
  const safeHandle = escapeHtml('@' + username);

  const profile = {
    name: safeName,
    handle: safeHandle,
    verified: rng() > 0.7,
    bio: generateBio(rng),
    location: generateLocation(rng),
    joined: `${joinMonth} ${joinYear}`,
    website: rng() > 0.5 ? escapeHtml(`${username}.com`) : '',
    followers, following, tweets,
    avatarColor: generateColor(rng),
    initial: username.charAt(0).toUpperCase()
  };

  return buildAccountData(profile, rng);
}

function buildAccountData(profile, rng) {
  const followers = profile.followers;
  let botPct = 5 + rng() * 20;
  let suspiciousPct = 3 + rng() * 12;
  let inactivePct = 8 + rng() * 15;
  const totalNonReal = botPct + suspiciousPct + inactivePct;
  if (totalNonReal > 65) {
    const scale = 65 / totalNonReal;
    botPct *= scale;
    suspiciousPct *= scale;
    inactivePct *= scale;
  }
  const realPct = 100 - botPct - suspiciousPct - inactivePct;

  const engagementRate = (0.5 + rng() * 6).toFixed(2);
  const daysActive = Math.floor((Date.now() - new Date(profile.joined).getTime()) / 86400000) || 365;
  const tweetsPerDay = (profile.tweets / daysActive).toFixed(1);

  const origPct = 30 + Math.floor(rng() * 40);
  const rtPct = 10 + Math.floor(rng() * 25);
  const replyPct = Math.floor(rng() * (100 - origPct - rtPct));
  const mediaPct = 100 - origPct - rtPct - replyPct;

  const qualityScore = Math.floor(60 + rng() * 35);
  const authScore = Math.floor(65 + rng() * 30);
  const activityScore = Math.floor(50 + rng() * 45);
  const influenceScore = Math.floor(40 + rng() * 55);

  const avgLikes = Math.floor(followers * (parseFloat(engagementRate) / 100) * (0.4 + rng() * 0.4));
  const avgRetweets = Math.floor(avgLikes * (0.1 + rng() * 0.3));
  const avgRepliesCount = Math.floor(avgLikes * (0.05 + rng() * 0.2));
  const avgImpressions = Math.floor(followers * (0.1 + rng() * 0.5));

  const followerGrowth7d = generateTimeSeries(7, followers * 0.98, followers, rng);
  const followerGrowth30d = generateTimeSeries(30, followers * 0.92, followers, rng);
  const followerGrowth90d = generateTimeSeries(90, followers * 0.8, followers, rng);
  const engagementTimeSeries = generateTimeSeries(30, parseFloat(engagementRate) * 0.7, parseFloat(engagementRate) * 1.3, rng);

  const hours = [];
  for (let i = 0; i < 24; i++) {
    let base = 2 + rng() * 5;
    if (i >= 9 && i <= 12) base += 5 + rng() * 8;
    if (i >= 17 && i <= 21) base += 4 + rng() * 6;
    if (i >= 0 && i <= 5) base *= 0.3;
    hours.push(Math.floor(base));
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const peakHourIdx = hours.indexOf(Math.max(...hours));
  const dayActivity = days.map(() => Math.floor(rng() * 100));
  const peakDayIdx = dayActivity.indexOf(Math.max(...dayActivity));

  const heatmapData = [];
  for (let w = 0; w < 7; w++) {
    for (let d = 0; d < 7; d++) {
      heatmapData.push(Math.floor(rng() * 5));
    }
  }

  const followersList = generateFollowerList(rng, Math.min(50, Math.floor(followers / 1000) + 10), botPct, suspiciousPct, inactivePct);
  const botAccounts = followersList.filter(f => f.type === 'bot');

  const hashtags = generateHashtags(rng);
  const mentions = generateMentions(rng);
  const recentTweets = generateTweets(rng, profile, avgLikes, avgRetweets, avgRepliesCount);
  const bestTweets = [...recentTweets].sort((a, b) => b.likes - a.likes).slice(0, 3);

  const performanceData = generateTimeSeries(30, avgLikes * 0.5, avgLikes * 1.5, rng);

  const noPhotoCount = Math.floor(botPct * followers / 10000);
  const noBioCount = Math.floor((botPct + suspiciousPct * 0.5) * followers / 8000);
  const newAccountsCount = Math.floor(rng() * followers / 5000) + 1;
  const abnormalRatioCount = Math.floor(botPct * followers / 12000);
  const zeroTweetsCount = Math.floor(botPct * followers / 15000);
  const spamCount = Math.floor(rng() * followers / 20000);

  let threatLevel = 'Low';
  if (botPct > 15) threatLevel = 'Medium';
  if (botPct > 22) threatLevel = 'High';

  return {
    profile,
    metrics: {
      followers, following: profile.following, tweets: profile.tweets,
      engagementRate, tweetsPerDay,
      followersChange: (2 + rng() * 8).toFixed(1),
      ratio: (followers / (profile.following || 1)).toFixed(0)
    },
    quality: { qualityScore, authScore, activityScore, influenceScore },
    content: { origPct, rtPct, replyPct, mediaPct },
    followerBreakdown: {
      realPct: realPct.toFixed(1), botPct: botPct.toFixed(1),
      suspiciousPct: suspiciousPct.toFixed(1), inactivePct: inactivePct.toFixed(1),
      realCount: Math.floor(followers * realPct / 100),
      botCount: Math.floor(followers * botPct / 100),
      suspiciousCount: Math.floor(followers * suspiciousPct / 100),
      inactiveCount: Math.floor(followers * inactivePct / 100)
    },
    followerDemographics: {
      verifiedPct: (1 + rng() * 6).toFixed(1),
      photoPct: (75 + rng() * 20).toFixed(1),
      bioPct: (60 + rng() * 30).toFixed(1),
      activePct: (50 + rng() * 40).toFixed(1),
      highFollowersPct: (3 + rng() * 15).toFixed(1),
    },
    charts: {
      followerGrowth7d, followerGrowth30d, followerGrowth90d,
      engagementTimeSeries, hours, performanceData
    },
    activity: {
      heatmapData,
      mostActiveDay: days[peakDayIdx],
      peakHour: formatHour(peakHourIdx),
      avgDailyPosts: tweetsPerDay
    },
    followersList,
    botDetection: {
      threatLevel,
      noPhotoCount, noBioCount, newAccountsCount,
      abnormalRatioCount, zeroTweetsCount, spamCount,
      botAccounts
    },
    analytics: {
      avgLikes, avgRetweets, avgReplies: avgRepliesCount, avgImpressions,
      hashtags, mentions, recentTweets, bestTweets
    }
  };
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function formatNumber(num) {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function formatHour(h) {
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return h > 12 ? (h - 12) + ' PM' : h + ' AM';
}

function generateTimeSeries(days, min, max, rng) {
  const data = [];
  let val = min;
  const step = (max - min) / days;
  for (let i = 0; i < days; i++) {
    val += step + (rng() - 0.4) * step * 2;
    val = Math.max(min * 0.95, Math.min(max * 1.05, val));
    data.push(Math.floor(val));
  }
  return data;
}

function generateColor(rng) {
  const colors = ['#1a1a2e', '#16213e', '#0f3460', '#533483', '#2c3333', '#395B64', '#A5C9CA', '#334756', '#2C3639', '#3F4E4F'];
  return colors[Math.floor(rng() * colors.length)];
}

function generateBio(rng) {
  const bios = [
    'Building the future, one line of code at a time.',
    'Tech enthusiast | Creator | Dreamer',
    'Passionate about innovation and design.',
    'Exploring the intersection of technology and humanity.',
    'Software developer. Open source contributor.',
    'Digital nomad. Coffee addict. Code writer.',
    'Making the web a better place.',
    'Entrepreneur & advisor. Love startups.',
  ];
  return bios[Math.floor(rng() * bios.length)];
}

function generateLocation(rng) {
  const locations = ['San Francisco, CA', 'New York, NY', 'London, UK', 'Berlin, DE', 'Tokyo, JP', 'Austin, TX', 'Seattle, WA', 'Toronto, CA', 'Singapore', 'Los Angeles, CA'];
  return locations[Math.floor(rng() * locations.length)];
}

function generateHashtags(rng) {
  const tags = ['#AI', '#Tech', '#Startup', '#Innovation', '#ML', '#Web3', '#DevOps', '#Cloud', '#OpenSource', '#Design', '#UX', '#Data', '#Python', '#JavaScript', '#React', '#BuildInPublic'];
  const selected = [];
  const count = 5 + Math.floor(rng() * 4);
  for (let i = 0; i < count; i++) {
    const tag = tags[Math.floor(rng() * tags.length)];
    if (!selected.find(s => s.tag === tag)) {
      selected.push({ tag, count: Math.floor(rng() * 200) + 5 });
    }
  }
  return selected.sort((a, b) => b.count - a.count).slice(0, 6);
}

function generateMentions(rng) {
  const users = ['@elonmusk', '@OpenAI', '@github', '@vercel', '@tailaboratories', '@naval', '@ycombinator', '@awscloud', '@GoogleAI', '@Microsoft', '@stripe', '@figma'];
  const selected = [];
  const count = 5 + Math.floor(rng() * 4);
  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(rng() * users.length)];
    if (!selected.find(s => s.user === user)) {
      selected.push({ user, count: Math.floor(rng() * 80) + 2 });
    }
  }
  return selected.sort((a, b) => b.count - a.count).slice(0, 6);
}

function generateTweets(rng, profile, avgLikes, avgRetweets, avgReplies) {
  const contents = [
    'Excited to share what we\'ve been working on. More details coming soon.',
    'The future of technology is being built right now. Stay tuned.',
    'Great thread on the current state of AI and where we\'re headed.',
    'Shipped a major update today. Performance improvements across the board.',
    'Incredible team effort to bring this together. Proud of what we built.',
    'Thinking about the next big challenge to solve. Ideas welcome.',
    'Launching something new next week. Can\'t wait to show everyone.',
    'The best time to start building is now. Don\'t wait for perfect conditions.',
    'Just published a deep dive into our engineering process. Link in bio.',
    'Grateful for this amazing community. Your feedback makes us better.',
  ];

  const tweets = [];
  for (let i = 0; i < 8; i++) {
    const daysAgo = Math.floor(rng() * 14);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    tweets.push({
      content: contents[Math.floor(rng() * contents.length)],
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      likes: Math.floor(avgLikes * (0.3 + rng() * 1.4)),
      retweets: Math.floor(avgRetweets * (0.2 + rng() * 1.5)),
      replies: Math.floor(avgReplies * (0.3 + rng() * 1.6)),
      views: Math.floor(avgLikes * (5 + rng() * 15)),
    });
  }

  return tweets.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function generateFollowerList(rng, count, botPct, suspiciousPct, inactivePct) {
  const firstNames = ['Alex', 'Jordan', 'Sam', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Parker', 'Cameron', 'Drew', 'Skyler', 'Peyton', 'Hayden', 'Jamie', 'Kendall', 'Dakota', 'Reese', 'Finley'];
  const lastParts = ['dev', 'tech', 'code', 'ai', 'ml', 'data', 'ops', 'cloud', 'web', 'io', 'labs', 'hq', 'eng', 'sys', 'net'];
  const botNames = ['user', 'follow', 'like', 'boost', 'growth', 'free', 'win', 'promo', 'deal', 'click'];

  const followers = [];

  for (let i = 0; i < count; i++) {
    const roll = rng() * 100;
    let type, username, displayName, hasPhoto, hasBio, followerCount, followingCount, tweetCount, joinedDaysAgo, botScore;

    if (roll < botPct) {
      type = 'bot';
      username = botNames[Math.floor(rng() * botNames.length)] + Math.floor(rng() * 99999);
      displayName = username;
      hasPhoto = rng() > 0.7;
      hasBio = rng() > 0.8;
      followerCount = Math.floor(rng() * 20);
      followingCount = Math.floor(rng() * 5000) + 500;
      tweetCount = Math.floor(rng() * 3);
      joinedDaysAgo = Math.floor(rng() * 60) + 1;
      botScore = 75 + Math.floor(rng() * 25);
    } else if (roll < botPct + suspiciousPct) {
      type = 'suspicious';
      username = firstNames[Math.floor(rng() * firstNames.length)].toLowerCase() + Math.floor(rng() * 9999);
      displayName = firstNames[Math.floor(rng() * firstNames.length)];
      hasPhoto = rng() > 0.4;
      hasBio = rng() > 0.5;
      followerCount = Math.floor(rng() * 100) + 5;
      followingCount = Math.floor(rng() * 3000) + 200;
      tweetCount = Math.floor(rng() * 50);
      joinedDaysAgo = Math.floor(rng() * 180) + 10;
      botScore = 40 + Math.floor(rng() * 35);
    } else if (roll < botPct + suspiciousPct + inactivePct) {
      type = 'inactive';
      username = firstNames[Math.floor(rng() * firstNames.length)].toLowerCase() + '_' + lastParts[Math.floor(rng() * lastParts.length)];
      displayName = firstNames[Math.floor(rng() * firstNames.length)] + ' ' + firstNames[Math.floor(rng() * firstNames.length)].charAt(0) + '.';
      hasPhoto = rng() > 0.3;
      hasBio = rng() > 0.4;
      followerCount = Math.floor(rng() * 500) + 10;
      followingCount = Math.floor(rng() * 800) + 20;
      tweetCount = Math.floor(rng() * 200);
      joinedDaysAgo = Math.floor(rng() * 2000) + 365;
      botScore = 10 + Math.floor(rng() * 20);
    } else {
      type = 'real';
      username = firstNames[Math.floor(rng() * firstNames.length)].toLowerCase() + lastParts[Math.floor(rng() * lastParts.length)];
      displayName = firstNames[Math.floor(rng() * firstNames.length)] + ' ' + firstNames[Math.floor(rng() * firstNames.length)];
      hasPhoto = true;
      hasBio = rng() > 0.15;
      followerCount = Math.floor(rng() * 10000) + 50;
      followingCount = Math.floor(rng() * 2000) + 30;
      tweetCount = Math.floor(rng() * 5000) + 20;
      joinedDaysAgo = Math.floor(rng() * 3000) + 60;
      botScore = Math.floor(rng() * 15);
    }

    const colors = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#10b981', '#3b82f6', '#e11d48'];

    followers.push({
      type, username, displayName, hasPhoto, hasBio,
      followerCount, followingCount, tweetCount, joinedDaysAgo, botScore,
      avatarColor: colors[Math.floor(rng() * colors.length)],
      initial: displayName.charAt(0).toUpperCase(),
      flags: generateFlags(type, hasPhoto, hasBio, tweetCount, followingCount, followerCount, joinedDaysAgo)
    });
  }

  return followers;
}

function generateFlags(type, hasPhoto, hasBio, tweets, following, followers, age) {
  const flags = [];
  if (!hasPhoto) flags.push('No profile photo');
  if (!hasBio) flags.push('No bio');
  if (tweets === 0) flags.push('Zero tweets');
  if (following > 0 && followers > 0 && following / followers > 50) flags.push('Abnormal follow ratio');
  if (age < 30) flags.push('Account < 30 days old');
  if (type === 'bot') flags.push('Automated behavior pattern');
  if (type === 'suspicious') flags.push('Suspicious activity');
  if (type === 'inactive' && age > 365) flags.push('Inactive > 1 year');
  return flags;
}

// ========================================
// VIEW SWITCHING
// ========================================

function switchView(view) {
  currentView = view;

  document.querySelectorAll('.view-content').forEach(el => el.classList.add('hidden'));
  const targetView = document.getElementById('view-' + view);
  if (targetView) targetView.classList.remove('hidden');

  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active-nav'));
  document.querySelectorAll('.mnav-btn').forEach(btn => btn.classList.remove('active-mnav'));

  const navBtn = document.getElementById('nav-' + view);
  const mnavBtn = document.getElementById('mnav-' + view);
  if (navBtn) navBtn.classList.add('active-nav');
  if (mnavBtn) mnavBtn.classList.add('active-mnav');

  if (currentAccount) {
    requestAnimationFrame(() => rerenderChartsForView(view));
  }
}

function rerenderChartsForView(view) {
  if (!currentAccount) return;
  if (view === 'dashboard') {
    const chartData = currentChartRange === '7d' ? currentAccount.charts.followerGrowth7d :
                      currentChartRange === '30d' ? currentAccount.charts.followerGrowth30d :
                      currentAccount.charts.followerGrowth90d;
    renderChart('followerChart', chartData, '#0c8eeb', true);
    renderChart('engagementChart', currentAccount.charts.engagementTimeSeries, '#10b981', false);
  } else if (view === 'analytics') {
    renderBarChart('hoursChart', currentAccount.charts.hours, '#6366f1');
    renderChart('performanceChart', currentAccount.charts.performanceData, '#f59e0b', true);
  }
}

// ========================================
// MAIN ANALYSIS
// ========================================

function quickAnalyze(username) {
  document.getElementById('usernameInput').value = username;
  analyzeAccount();
}

let isAnalyzing = false;

function analyzeAccount() {
  const username = document.getElementById('usernameInput').value.trim().replace('@', '');
  if (!username || isAnalyzing) return;

  isAnalyzing = true;
  const analyzeBtn = document.getElementById('analyzeBtn');
  analyzeBtn.disabled = true;
  analyzeBtn.classList.add('opacity-50', 'cursor-not-allowed');

  document.getElementById('welcomeState').classList.add('hidden');
  document.getElementById('mainContent').classList.add('hidden');
  document.getElementById('loadingState').classList.remove('hidden');

  const loadingTexts = [
    'Fetching account data...',
    'Analyzing follower patterns...',
    'Running bot detection algorithms...',
    'Calculating engagement metrics...',
    'Generating insights...'
  ];

  let idx = 0;
  const loadingInterval = setInterval(() => {
    idx = (idx + 1) % loadingTexts.length;
    document.getElementById('loadingText').textContent = loadingTexts[idx];
  }, 600);

  setTimeout(() => {
    clearInterval(loadingInterval);
    currentAccount = generateAccountData(username);
    renderDashboard();
    renderFollowers();
    renderBotDetector();
    renderAnalytics();

    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    switchView('dashboard');

    isAnalyzing = false;
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.disabled = false;
    analyzeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }, 2500);
}

// ========================================
// RENDER DASHBOARD
// ========================================

function renderDashboard() {
  const data = currentAccount;
  const p = data.profile;

  document.getElementById('profileAvatar').textContent = p.initial;
  document.getElementById('profileAvatar').style.backgroundColor = p.avatarColor;
  document.getElementById('profileName').textContent = p.name;
  document.getElementById('profileHandle').textContent = p.handle;
  document.getElementById('profileBio').textContent = p.bio;
  document.getElementById('profileLocation').innerHTML = `<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z"/></svg> ${p.location}`;
  document.getElementById('profileJoined').innerHTML = `<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v9.75"/></svg> Joined ${p.joined}`;
  if (p.website) {
    document.getElementById('profileWebsite').innerHTML = `<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/></svg> ${p.website}`;
    document.getElementById('profileWebsite').classList.remove('hidden');
  } else {
    document.getElementById('profileWebsite').classList.add('hidden');
  }

  if (p.verified) {
    document.getElementById('verifiedBadge').classList.remove('hidden');
  } else {
    document.getElementById('verifiedBadge').classList.add('hidden');
  }

  const botPctNum = parseFloat(data.followerBreakdown.botPct);
  let healthLabel = 'Healthy';
  let healthClass = 'bg-success/10 text-success';
  if (botPctNum > 15) { healthLabel = 'Fair'; healthClass = 'bg-warning/10 text-warning'; }
  if (botPctNum > 22) { healthLabel = 'At Risk'; healthClass = 'bg-danger/10 text-danger'; }
  document.getElementById('accountHealth').textContent = healthLabel;
  document.getElementById('accountHealth').className = `px-3 py-1.5 rounded-full text-xs font-semibold ${healthClass}`;
  document.getElementById('botScore').textContent = `Bot Score: ${data.followerBreakdown.botPct}%`;

  document.getElementById('metricFollowers').textContent = formatNumber(data.metrics.followers);
  document.getElementById('metricFollowersChange').textContent = `+${data.metrics.followersChange}% this month`;
  document.getElementById('metricFollowing').textContent = formatNumber(data.metrics.following);
  document.getElementById('metricRatio').textContent = `Ratio: ${data.metrics.ratio}:1`;
  document.getElementById('metricTweets').textContent = formatNumber(data.metrics.tweets);
  document.getElementById('metricTweetsPerDay').textContent = `${data.metrics.tweetsPerDay} per day`;
  document.getElementById('metricEngagement').textContent = data.metrics.engagementRate + '%';

  renderChart('followerChart', data.charts.followerGrowth7d, '#0c8eeb', true);
  renderChart('engagementChart', data.charts.engagementTimeSeries, '#10b981', false);

  const qs = data.quality.qualityScore;
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (qs / 100) * circumference;
  const ring = document.getElementById('qualityRing');
  ring.setAttribute('stroke-dashoffset', offset);
  let ringColor = '#10b981';
  if (qs < 70) ringColor = '#f59e0b';
  if (qs < 50) ringColor = '#ef4444';
  ring.setAttribute('stroke', ringColor);
  document.getElementById('qualityScore').textContent = qs;

  animateBar('authBar', 'authScore', data.quality.authScore);
  animateBar('activityBar', 'activityScore', data.quality.activityScore);
  animateBar('influenceBar', 'influenceScore', data.quality.influenceScore);

  renderHeatmap(data.activity.heatmapData);
  document.getElementById('mostActiveDay').textContent = data.activity.mostActiveDay;
  document.getElementById('peakHour').textContent = data.activity.peakHour;
  document.getElementById('avgDailyPosts').textContent = data.activity.avgDailyPosts;

  animateBar('origBar', 'origPct', data.content.origPct);
  animateBar('rtBar', 'rtPct', data.content.rtPct);
  animateBar('replyBar', 'replyPct', data.content.replyPct);
  animateBar('mediaBar', 'mediaPct', data.content.mediaPct);

  renderRecentTweets(data.analytics.recentTweets.slice(0, 5));
}

function animateBar(barId, labelId, value) {
  setTimeout(() => {
    document.getElementById(barId).style.width = value + '%';
    document.getElementById(labelId).textContent = value + '%';
  }, 300);
}

function renderHeatmap(data) {
  const container = document.getElementById('activityHeatmap');
  container.innerHTML = '';
  const colors = ['bg-surface-100', 'bg-brand-200', 'bg-brand-300', 'bg-brand-500', 'bg-brand-700'];
  data.forEach(val => {
    const cell = document.createElement('div');
    cell.className = `w-full aspect-square rounded-sm ${colors[val]} transition-colors`;
    container.appendChild(cell);
  });
}

function renderChart(containerId, data, color, isFilled) {
  const container = document.getElementById(containerId);
  const width = container.clientWidth || 400;
  const height = container.clientHeight || 200;
  const padding = 30;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return { x, y };
  });

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cp1x = points[i - 1].x + (points[i].x - points[i - 1].x) / 3;
    const cp1y = points[i - 1].y;
    const cp2x = points[i].x - (points[i].x - points[i - 1].x) / 3;
    const cp2y = points[i].y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`;
  }

  let fillPath = '';
  if (isFilled) {
    fillPath = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  }

  const gridLines = 4;
  let gridSvg = '';
  for (let i = 0; i <= gridLines; i++) {
    const y = padding + (i / gridLines) * (height - padding * 2);
    const val = max - (i / gridLines) * range;
    gridSvg += `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>`;
    gridSvg += `<text x="${padding - 5}" y="${y + 4}" text-anchor="end" fill="#94a3b8" font-size="10" font-family="DM Sans">${formatNumber(Math.floor(val))}</text>`;
  }

  const labelInterval = Math.max(1, Math.floor(data.length / 6));
  let labelSvg = '';
  for (let i = 0; i < data.length; i += labelInterval) {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    labelSvg += `<text x="${x}" y="${height - 8}" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="DM Sans">${i + 1}</text>`;
  }

  container.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
      ${gridSvg}
      ${labelSvg}
      ${isFilled ? `<path d="${fillPath}" fill="${color}" fill-opacity="0.08"/>` : ''}
      <path d="${pathD}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${points.map((p, i) => i === points.length - 1 ? `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${color}" stroke="white" stroke-width="2"/>` : '').join('')}
    </svg>
  `;
}

function renderRecentTweets(tweets) {
  const container = document.getElementById('recentTweets');
  container.innerHTML = tweets.map(t => `
    <div class="p-4 bg-surface-50 rounded-xl border border-surface-100">
      <p class="text-sm text-surface-700 leading-relaxed mb-3">${t.content}</p>
      <div class="flex items-center gap-4 text-xs text-surface-400">
        <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/></svg> ${formatNumber(t.likes)}</span>
        <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"/></svg> ${formatNumber(t.retweets)}</span>
        <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"/></svg> ${formatNumber(t.replies)}</span>
        <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg> ${formatNumber(t.views)}</span>
        <span class="ml-auto">${t.date}</span>
      </div>
    </div>
  `).join('');
}

function setChartRange(range, btn) {
  currentChartRange = range;
  document.querySelectorAll('.chart-range-btn').forEach(b => b.classList.remove('active-range'));
  if (btn) btn.classList.add('active-range');

  if (currentAccount) {
    const chartData = range === '7d' ? currentAccount.charts.followerGrowth7d :
                      range === '30d' ? currentAccount.charts.followerGrowth30d :
                      currentAccount.charts.followerGrowth90d;
    renderChart('followerChart', chartData, '#0c8eeb', true);
  }
}

// ========================================
// RENDER FOLLOWERS
// ========================================

function renderFollowers() {
  const data = currentAccount;
  const fb = data.followerBreakdown;

  document.getElementById('realFollowers').textContent = formatNumber(fb.realCount);
  document.getElementById('realFollowersPct').textContent = fb.realPct + '%';
  document.getElementById('suspiciousFollowers').textContent = formatNumber(fb.suspiciousCount);
  document.getElementById('suspiciousFollowersPct').textContent = fb.suspiciousPct + '%';
  document.getElementById('botFollowers').textContent = formatNumber(fb.botCount);
  document.getElementById('botFollowersPct').textContent = fb.botPct + '%';
  document.getElementById('inactiveFollowers').textContent = formatNumber(fb.inactiveCount);
  document.getElementById('inactiveFollowersPct').textContent = fb.inactivePct + '%';

  const fd = data.followerDemographics;
  animateBar('verifiedBar', 'verifiedPct', parseFloat(fd.verifiedPct));
  animateBar('photoBar', 'photoPct', parseFloat(fd.photoPct));
  animateBar('bioBar', 'bioPct', parseFloat(fd.bioPct));
  animateBar('activeBar', 'activePct', parseFloat(fd.activePct));
  animateBar('highFollowersBar', 'highFollowersPct', parseFloat(fd.highFollowersPct));

  renderFollowerQualityChart(fb);
  renderFollowerList('all');
}

function renderFollowerQualityChart(fb) {
  const container = document.getElementById('followerQualityChart');
  const segments = [
    { label: 'Real', pct: parseFloat(fb.realPct), color: '#10b981' },
    { label: 'Suspicious', pct: parseFloat(fb.suspiciousPct), color: '#f59e0b' },
    { label: 'Bots', pct: parseFloat(fb.botPct), color: '#ef4444' },
    { label: 'Inactive', pct: parseFloat(fb.inactivePct), color: '#94a3b8' },
  ];

  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 72;
  const innerR = 48;

  let startAngle = -90;
  let paths = '';

  segments.forEach(seg => {
    const angle = (seg.pct / 100) * 360;
    const endAngle = startAngle + angle;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const x3 = cx + innerR * Math.cos(endRad);
    const y3 = cy + innerR * Math.sin(endRad);
    const x4 = cx + innerR * Math.cos(startRad);
    const y4 = cy + innerR * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    paths += `<path d="M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z" fill="${seg.color}" opacity="0.85"/>`;
    startAngle = endAngle;
  });

  container.innerHTML = `
    <div class="flex items-center justify-center gap-6">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        ${paths}
        <text x="${cx}" y="${cy - 6}" text-anchor="middle" fill="#0f172a" font-size="20" font-weight="700" font-family="Plus Jakarta Sans">${fb.realPct}%</text>
        <text x="${cx}" y="${cy + 12}" text-anchor="middle" fill="#64748b" font-size="11" font-family="DM Sans">Real</text>
      </svg>
      <div class="space-y-2.5">
        ${segments.map(s => `
          <div class="flex items-center gap-2 text-sm">
            <div class="w-3 h-3 rounded-full" style="background:${s.color}"></div>
            <span class="text-surface-600">${s.label}</span>
            <span class="font-medium text-surface-800 ml-auto">${s.pct.toFixed(1)}%</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderFollowerList(filter) {
  const container = document.getElementById('followerList');
  const followers = currentAccount.followersList || [];

  const filtered = filter === 'all' ? followers : followers.filter(f => f.type === filter);

  container.innerHTML = filtered.map(f => {
    const typeColors = {
      real: 'bg-emerald-50 text-emerald-700',
      suspicious: 'bg-amber-50 text-amber-700',
      bot: 'bg-red-50 text-red-700',
      inactive: 'bg-surface-100 text-surface-500'
    };
    return `
      <div class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors border border-transparent hover:border-surface-200">
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0" style="background:${f.avatarColor}">${f.initial}</div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <p class="text-sm font-medium text-surface-900 truncate">${f.displayName}</p>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${typeColors[f.type]}">${f.type.charAt(0).toUpperCase() + f.type.slice(1)}</span>
          </div>
          <p class="text-xs text-surface-400 truncate">@${f.username}</p>
        </div>
        <div class="hidden sm:flex items-center gap-4 text-xs text-surface-500">
          <span>${formatNumber(f.followerCount)} followers</span>
          <span>${formatNumber(f.tweetCount)} tweets</span>
        </div>
        <div class="text-right">
          <p class="text-xs font-semibold ${f.botScore > 60 ? 'text-danger' : f.botScore > 30 ? 'text-warning' : 'text-success'}">${f.botScore}%</p>
          <p class="text-[10px] text-surface-400">bot score</p>
        </div>
      </div>
    `;
  }).join('');

  if (filtered.length === 0) {
    container.innerHTML = '<p class="text-center text-sm text-surface-400 py-8">No followers found matching this filter.</p>';
  }
}

function filterFollowers() {
  const filter = document.getElementById('followerFilter').value;
  renderFollowerList(filter);
}

// ========================================
// RENDER BOT DETECTOR
// ========================================

function renderBotDetector() {
  const data = currentAccount;
  const bd = data.botDetection;
  const totalFollowers = data.metrics.followers;

  document.getElementById('botThreatLevel').textContent = bd.threatLevel;
  const threatEl = document.getElementById('botThreatLevel');
  threatEl.className = 'font-display font-800 text-3xl';
  if (bd.threatLevel === 'Low') threatEl.classList.add('text-success');
  else if (bd.threatLevel === 'Medium') threatEl.classList.add('text-warning');
  else threatEl.classList.add('text-danger');

  const maxCount = Math.max(bd.noPhotoCount, bd.noBioCount, bd.newAccountsCount, bd.abnormalRatioCount, bd.zeroTweetsCount, bd.spamCount) || 1;

  document.getElementById('botNoPhoto').textContent = formatNumber(bd.noPhotoCount) + ' accounts';
  document.getElementById('botNoPhotoBar').style.width = (bd.noPhotoCount / maxCount * 100) + '%';

  document.getElementById('botNoBio').textContent = formatNumber(bd.noBioCount) + ' accounts';
  document.getElementById('botNoBioBar').style.width = (bd.noBioCount / maxCount * 100) + '%';

  document.getElementById('botNewAccounts').textContent = formatNumber(bd.newAccountsCount) + ' accounts';
  document.getElementById('botNewAccountsBar').style.width = (bd.newAccountsCount / maxCount * 100) + '%';

  document.getElementById('botAbnormalRatio').textContent = formatNumber(bd.abnormalRatioCount) + ' accounts';
  document.getElementById('botAbnormalRatioBar').style.width = (bd.abnormalRatioCount / maxCount * 100) + '%';

  document.getElementById('botZeroTweets').textContent = formatNumber(bd.zeroTweetsCount) + ' accounts';
  document.getElementById('botZeroTweetsBar').style.width = (bd.zeroTweetsCount / maxCount * 100) + '%';

  document.getElementById('botSpamPatterns').textContent = formatNumber(bd.spamCount) + ' accounts';
  document.getElementById('botSpamPatternsBar').style.width = (bd.spamCount / maxCount * 100) + '%';

  document.getElementById('botCount').textContent = formatNumber(data.followerBreakdown.botCount) + ' bots';

  renderBotList(bd.botAccounts);
}

function renderBotList(bots) {
  const container = document.getElementById('botList');

  if (bots.length === 0) {
    const seed = hashString(currentAccount.profile.handle + 'bots');
    const rng = seededRandom(seed);
    const generatedBots = [];
    for (let i = 0; i < 12; i++) {
      generatedBots.push(generateSingleBot(rng, i));
    }
    bots = generatedBots;
  }

  container.innerHTML = bots.map(f => `
    <div class="flex items-start gap-3 p-4 rounded-xl bg-red-50/40 border border-red-100 hover:bg-red-50/70 transition-colors">
      <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0" style="background:${f.avatarColor}">${f.initial}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <p class="text-sm font-medium text-surface-900">${f.displayName}</p>
          <span class="px-2 py-0.5 bg-red-100 text-danger rounded-full text-[10px] font-bold">${f.botScore}% bot</span>
        </div>
        <p class="text-xs text-surface-400 mb-2">@${f.username}</p>
        <div class="flex flex-wrap gap-1.5">
          ${f.flags.map(flag => `<span class="px-2 py-0.5 bg-white border border-red-200 text-red-600 rounded text-[10px] font-medium">${flag}</span>`).join('')}
        </div>
        <div class="flex items-center gap-4 mt-2 text-[11px] text-surface-400">
          <span>${formatNumber(f.followerCount)} followers</span>
          <span>${formatNumber(f.followingCount)} following</span>
          <span>${formatNumber(f.tweetCount)} tweets</span>
          <span>${f.joinedDaysAgo}d old</span>
        </div>
      </div>
    </div>
  `).join('');
}

function generateSingleBot(rng, idx) {
  const botNames = ['user', 'follow', 'like', 'boost', 'growth', 'free', 'win', 'promo', 'deal', 'click', 'earn', 'crypto'];
  const colors = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444'];
  const username = botNames[Math.floor(rng() * botNames.length)] + Math.floor(rng() * 99999);

  return {
    type: 'bot',
    username,
    displayName: username,
    hasPhoto: rng() > 0.7,
    hasBio: rng() > 0.8,
    followerCount: Math.floor(rng() * 15),
    followingCount: Math.floor(rng() * 5000) + 500,
    tweetCount: Math.floor(rng() * 3),
    joinedDaysAgo: Math.floor(rng() * 45) + 1,
    botScore: 78 + Math.floor(rng() * 22),
    avatarColor: colors[Math.floor(rng() * colors.length)],
    initial: username.charAt(0).toUpperCase(),
    flags: ['No profile photo', 'Automated behavior', 'Abnormal follow ratio', 'Account < 30 days old'].filter(() => rng() > 0.3)
  };
}

// ========================================
// RENDER ANALYTICS
// ========================================

function renderAnalytics() {
  const data = currentAccount;
  const a = data.analytics;

  document.getElementById('avgLikes').textContent = formatNumber(a.avgLikes);
  document.getElementById('avgRetweets').textContent = formatNumber(a.avgRetweets);
  document.getElementById('avgReplies').textContent = formatNumber(a.avgReplies);
  document.getElementById('avgImpressions').textContent = formatNumber(a.avgImpressions);

  renderBarChart('hoursChart', data.charts.hours, '#6366f1');
  renderChart('performanceChart', data.charts.performanceData, '#f59e0b', true);

  renderTopList('topHashtags', a.hashtags.map(h => ({ label: h.tag, value: h.count })), '#0c8eeb');
  renderTopList('topMentions', a.mentions.map(m => ({ label: m.user, value: m.count })), '#8b5cf6');

  renderBestTweets(a.bestTweets);
}

function renderBarChart(containerId, data, color) {
  const container = document.getElementById(containerId);
  const width = container.clientWidth || 400;
  const height = container.clientHeight || 200;
  const padding = 30;

  const max = Math.max(...data);
  const barWidth = (width - padding * 2) / data.length - 2;

  let bars = '';
  let labels = '';
  data.forEach((val, i) => {
    const barHeight = (val / max) * (height - padding * 2);
    const x = padding + i * ((width - padding * 2) / data.length) + 1;
    const y = height - padding - barHeight;
    bars += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="2" fill="${color}" opacity="0.7"/>`;
    if (i % 4 === 0) {
      labels += `<text x="${x + barWidth / 2}" y="${height - 8}" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="DM Sans">${formatHour(i)}</text>`;
    }
  });

  const gridLines = 4;
  let gridSvg = '';
  for (let i = 0; i <= gridLines; i++) {
    const y = padding + (i / gridLines) * (height - padding * 2);
    gridSvg += `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>`;
  }

  container.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}">${gridSvg}${bars}${labels}</svg>`;
}

function renderTopList(containerId, items, color) {
  const container = document.getElementById(containerId);
  const max = Math.max(...items.map(i => i.value));

  container.innerHTML = items.map((item, idx) => `
    <div class="flex items-center gap-3">
      <span class="text-xs font-semibold text-surface-400 w-5 text-right">${idx + 1}</span>
      <div class="flex-1">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm font-medium text-surface-700">${item.label}</span>
          <span class="text-xs text-surface-400">${item.value} uses</span>
        </div>
        <div class="w-full h-1.5 bg-surface-100 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-700" style="width:${(item.value / max * 100)}%;background:${color}"></div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderBestTweets(tweets) {
  const container = document.getElementById('bestTweets');
  container.innerHTML = tweets.map((t, idx) => `
    <div class="p-4 bg-surface-50 rounded-xl border border-surface-100">
      <div class="flex items-center gap-2 mb-2">
        <span class="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">${idx + 1}</span>
        <span class="text-xs text-surface-400">${t.date}</span>
      </div>
      <p class="text-sm text-surface-700 leading-relaxed mb-3">${t.content}</p>
      <div class="flex items-center gap-4 text-xs text-surface-400">
        <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/></svg> ${formatNumber(t.likes)}</span>
        <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"/></svg> ${formatNumber(t.retweets)}</span>
        <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"/></svg> ${formatNumber(t.replies)}</span>
        <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg> ${formatNumber(t.views)}</span>
      </div>
    </div>
  `).join('');
}

// ========================================
// SETTINGS
// ========================================

function openSettings() {
  document.getElementById('settingsModal').classList.remove('hidden');
}

function closeSettings() {
  document.getElementById('settingsModal').classList.add('hidden');
}

// Close modal on backdrop click
document.getElementById('settingsModal').addEventListener('click', function(e) {
  if (e.target === this) closeSettings();
});

// ========================================
// WINDOW RESIZE HANDLER
// ========================================

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (currentAccount) {
      const chartData = currentChartRange === '7d' ? currentAccount.charts.followerGrowth7d :
                        currentChartRange === '30d' ? currentAccount.charts.followerGrowth30d :
                        currentAccount.charts.followerGrowth90d;
      renderChart('followerChart', chartData, '#0c8eeb', true);
      renderChart('engagementChart', currentAccount.charts.engagementTimeSeries, '#10b981', false);
      renderBarChart('hoursChart', currentAccount.charts.hours, '#6366f1');
      renderChart('performanceChart', currentAccount.charts.performanceData, '#f59e0b', true);
    }
  }, 250);
});