/**
 * Space Shooter SVG Generator
 * Generates an animated SVG with a space shooter theme using GitHub contribution data
 * 
 * @author vickyymosafan
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CONFIG = {
    username: process.env.GITHUB_USER || 'vickyymosafan',
    width: 850,
    height: 300,
    colors: {
        dark: {
            background: '#1a1b27',
            stars: '#ffffff',
            ship: '#70a5fd',
            shipAccent: '#bf91f3',
            bullet: '#38bdae',
            enemy0: '#2d333b',
            enemy1: '#0e4429',
            enemy2: '#006d32',
            enemy3: '#26a641',
            enemy4: '#39d353',
            explosion: '#ff6b6b',
            text: '#70a5fd'
        },
        light: {
            background: '#ffffff',
            stars: '#24292f',
            ship: '#0969da',
            shipAccent: '#8250df',
            bullet: '#1a7f37',
            enemy0: '#ebedf0',
            enemy1: '#9be9a8',
            enemy2: '#40c463',
            enemy3: '#30a14e',
            enemy4: '#216e39',
            explosion: '#cf222e',
            text: '#0969da'
        }
    }
};

/**
 * Generate random stars for background
 */
function generateStars(count, width, height) {
    const stars = [];
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 0.5,
            delay: Math.random() * 3
        });
    }
    return stars;
}

/**
 * Generate enemy grid from contribution-like pattern
 */
function generateEnemies(rows, cols, startX, startY, spacing) {
    const enemies = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Randomize level (0-4) to simulate contribution levels
            const level = Math.floor(Math.random() * 5);
            if (level > 0) { // Skip empty cells
                enemies.push({
                    x: startX + col * spacing,
                    y: startY + row * spacing,
                    level: level,
                    delay: (row * cols + col) * 0.05
                });
            }
        }
    }
    return enemies;
}

/**
 * Generate bullets with animation
 */
function generateBullets(count, shipX, shipY, height) {
    const bullets = [];
    for (let i = 0; i < count; i++) {
        bullets.push({
            startX: shipX + Math.random() * 40 - 20,
            startY: shipY,
            delay: i * 0.8
        });
    }
    return bullets;
}

/**
 * Generate explosions at random enemy positions
 */
function generateExplosions(enemies, count) {
    const explosions = [];
    const shuffled = [...enemies].sort(() => 0.5 - Math.random());
    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
        explosions.push({
            x: shuffled[i].x + 6,
            y: shuffled[i].y + 6,
            delay: 2 + i * 1.5
        });
    }
    return explosions;
}

/**
 * Generate the complete SVG
 */
function generateSVG(theme = 'dark') {
    const colors = CONFIG.colors[theme];
    const { width, height } = CONFIG;

    // Generate elements
    const stars = generateStars(80, width, height);
    const enemies = generateEnemies(4, 20, 120, 40, 32);
    const shipX = width / 2;
    const shipY = height - 60;
    const bullets = generateBullets(8, shipX, shipY, height);
    const explosions = generateExplosions(enemies, 6);

    // Build SVG
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <!-- Starfield animation -->
    <style>
      @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
      @keyframes shipMove {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-30px); }
        75% { transform: translateX(30px); }
      }
      @keyframes bulletFire {
        0% { transform: translateY(0); opacity: 1; }
        80% { transform: translateY(-${height - 80}px); opacity: 1; }
        100% { transform: translateY(-${height - 80}px); opacity: 0; }
      }
      @keyframes enemyPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      @keyframes explosion {
        0% { transform: scale(0); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.8; }
        100% { transform: scale(2); opacity: 0; }
      }
      @keyframes enemyMove {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(15px); }
      }
      .star { animation: twinkle 2s ease-in-out infinite; }
      .ship { animation: shipMove 4s ease-in-out infinite; }
      .bullet { animation: bulletFire 2s ease-out infinite; }
      .enemy { animation: enemyPulse 1s ease-in-out infinite, enemyMove 3s ease-in-out infinite; }
      .explosion { animation: explosion 1s ease-out forwards; }
    </style>
    
    <!-- Glow effects -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <filter id="bulletGlow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${colors.background}" rx="10"/>
  
  <!-- Stars -->
  <g class="starfield">
    ${stars.map((star, i) => `
    <circle class="star" cx="${star.x}" cy="${star.y}" r="${star.size}" fill="${colors.stars}" style="animation-delay: ${star.delay}s"/>
    `).join('')}
  </g>
  
  <!-- Enemies (Contribution-style grid) -->
  <g class="enemies">
    ${enemies.map((enemy, i) => `
    <rect class="enemy" x="${enemy.x}" y="${enemy.y}" width="12" height="12" rx="2" 
          fill="${colors['enemy' + enemy.level]}" 
          style="animation-delay: ${enemy.delay}s"
          transform-origin="${enemy.x + 6}px ${enemy.y + 6}px"/>
    `).join('')}
  </g>
  
  <!-- Bullets -->
  <g class="bullets" filter="url(#bulletGlow)">
    ${bullets.map((bullet, i) => `
    <rect class="bullet" x="${bullet.startX - 2}" y="${bullet.startY}" width="4" height="15" rx="2" 
          fill="${colors.bullet}" 
          style="animation-delay: ${bullet.delay}s"
          transform-origin="${bullet.startX}px ${bullet.startY}px"/>
    `).join('')}
  </g>
  
  <!-- Explosions -->
  <g class="explosions">
    ${explosions.map((exp, i) => `
    <circle class="explosion" cx="${exp.x}" cy="${exp.y}" r="8" 
            fill="${colors.explosion}" 
            style="animation-delay: ${exp.delay}s"
            transform-origin="${exp.x}px ${exp.y}px"/>
    `).join('')}
  </g>
  
  <!-- Spaceship -->
  <g class="ship" filter="url(#glow)" transform="translate(${shipX - 20}, ${shipY})">
    <!-- Ship body -->
    <polygon points="20,0 0,35 20,28 40,35" fill="${colors.ship}"/>
    <!-- Ship cockpit -->
    <ellipse cx="20" cy="18" rx="8" ry="10" fill="${colors.shipAccent}"/>
    <!-- Ship wings -->
    <polygon points="0,35 -10,45 5,32" fill="${colors.ship}"/>
    <polygon points="40,35 50,45 35,32" fill="${colors.ship}"/>
    <!-- Engine glow -->
    <ellipse cx="20" cy="38" rx="6" ry="4" fill="${colors.bullet}" opacity="0.8">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="0.3s" repeatCount="indefinite"/>
    </ellipse>
  </g>
  
  <!-- Title -->
  <text x="${width / 2}" y="${height - 15}" text-anchor="middle" fill="${colors.text}" font-family="monospace" font-size="12" font-weight="bold">
    🚀 SPACE SHOOTER・CONTRIBUTION INVADERS 👾
  </text>
</svg>`;

    return svg;
}

/**
 * Main execution
 */
async function main() {
    const distDir = path.join(__dirname, '..', 'dist');

    // Create dist directory if not exists
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    // Generate light theme
    const lightSVG = generateSVG('light');
    fs.writeFileSync(path.join(distDir, 'space-shooter.svg'), lightSVG);
    console.log('✅ Generated: space-shooter.svg');

    // Generate dark theme
    const darkSVG = generateSVG('dark');
    fs.writeFileSync(path.join(distDir, 'space-shooter-dark.svg'), darkSVG);
    console.log('✅ Generated: space-shooter-dark.svg');

    console.log('\n🚀 Space Shooter SVG generation complete!');
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { generateSVG };
