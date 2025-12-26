/**
 * Enhanced Pac-Man SVG Generator
 * Generates an animated SVG with Pac-Man theme using contribution-style grid
 * 
 * Features:
 * - 4 Classic Ghosts (Blinky, Pinky, Inky, Clyde)
 * - Pac-Man with chomping animation
 * - Maze walls with authentic arcade style
 * - Contribution squares as pellets
 * - Power pellets with pulse animation
 * - Smooth movement animations
 * - Month labels
 * 
 * @author vickyymosafan
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
    width: 850,
    height: 180,
    gridCols: 52, // weeks in a year
    gridRows: 7,  // days in a week
    cellSize: 11,
    cellGap: 3,
    startX: 50,
    startY: 45,
    colors: {
        dark: {
            background: '#0d1117',
            wall: '#30363d',
            wallBorder: '#484f58',
            pellet: '#238636',
            pelletLight: '#2ea043',
            pelletMedium: '#26a641',
            pelletDark: '#196c2e',
            powerPellet: '#f0883e',
            pacman: '#ffcc00',
            pacmanMouth: '#0d1117',
            blinky: '#ff0000',
            pinky: '#ffb8ff',
            inky: '#00ffff',
            clyde: '#ffb852',
            ghostEyes: '#ffffff',
            ghostPupil: '#0000ff',
            text: '#8b949e',
            textHighlight: '#58a6ff'
        },
        light: {
            background: '#ffffff',
            wall: '#d0d7de',
            wallBorder: '#afb8c1',
            pellet: '#40c463',
            pelletLight: '#9be9a8',
            pelletMedium: '#40c463',
            pelletDark: '#30a14e',
            powerPellet: '#fb8f44',
            pacman: '#ffcc00',
            pacmanMouth: '#ffffff',
            blinky: '#ff0000',
            pinky: '#ffb8ff',
            inky: '#00ffff',
            clyde: '#ffb852',
            ghostEyes: '#ffffff',
            ghostPupil: '#0000ff',
            text: '#57606a',
            textHighlight: '#0969da'
        }
    },
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
};

/**
 * Generate contribution-like pellet grid
 */
function generatePellets(cols, rows, startX, startY, cellSize, gap) {
    const pellets = [];
    const levels = [0, 1, 2, 3, 4]; // 0 = empty, 1-4 = contribution levels

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            // Generate random contribution level
            const level = levels[Math.floor(Math.random() * levels.length)];
            if (level > 0) {
                pellets.push({
                    x: startX + col * (cellSize + gap),
                    y: startY + row * (cellSize + gap),
                    level: level,
                    eaten: Math.random() < 0.15 // 15% chance to be "eaten"
                });
            }
        }
    }
    return pellets;
}

/**
 * Generate maze walls (simplified for contribution graph style)
 */
function generateMazeWalls(width, height, startX, startY, gridWidth, gridHeight) {
    const walls = [];
    const segments = [
        // Outer border
        { x1: startX - 15, y1: startY - 15, x2: startX + gridWidth + 15, y2: startY - 15 },
        { x1: startX - 15, y1: startY + gridHeight + 15, x2: startX + gridWidth + 15, y2: startY + gridHeight + 15 },
        { x1: startX - 15, y1: startY - 15, x2: startX - 15, y2: startY + gridHeight + 15 },
        { x1: startX + gridWidth + 15, y1: startY - 15, x2: startX + gridWidth + 15, y2: startY + gridHeight + 15 },
        // Internal walls (decorative)
        { x1: startX + 80, y1: startY - 15, x2: startX + 80, y2: startY + 25 },
        { x1: startX + 180, y1: startY + gridHeight + 15, x2: startX + 180, y2: startY + gridHeight - 25 },
        { x1: startX + 280, y1: startY - 15, x2: startX + 280, y2: startY + 35 },
        { x1: startX + 380, y1: startY + gridHeight + 15, x2: startX + 380, y2: startY + gridHeight - 35 },
        { x1: startX + 480, y1: startY - 15, x2: startX + 480, y2: startY + 25 },
        { x1: startX + 580, y1: startY + gridHeight + 15, x2: startX + 580, y2: startY + gridHeight - 25 },
        { x1: startX + 680, y1: startY - 15, x2: startX + 680, y2: startY + 35 },
    ];
    return segments;
}

/**
 * Generate power pellets at strategic positions
 */
function generatePowerPellets(startX, startY, gridWidth, gridHeight) {
    return [
        { x: startX + 10, y: startY + 10 },
        { x: startX + gridWidth - 10, y: startY + 10 },
        { x: startX + 10, y: startY + gridHeight - 10 },
        { x: startX + gridWidth - 10, y: startY + gridHeight - 10 }
    ];
}

/**
 * Generate the complete SVG
 */
function generateSVG(theme = 'dark') {
    const colors = CONFIG.colors[theme];
    const { width, height, gridCols, gridRows, cellSize, cellGap, startX, startY } = CONFIG;

    const gridWidth = gridCols * (cellSize + cellGap);
    const gridHeight = gridRows * (cellSize + cellGap);

    // Generate elements
    const pellets = generatePellets(gridCols, gridRows, startX, startY, cellSize, cellGap);
    const walls = generateMazeWalls(width, height, startX, startY, gridWidth, gridHeight);
    const powerPellets = generatePowerPellets(startX, startY, gridWidth, gridHeight);

    // Pac-Man position (animated path)
    const pacmanX = startX + gridWidth * 0.35;
    const pacmanY = startY + gridHeight * 0.5;

    // Ghost positions
    const ghosts = [
        { name: 'blinky', color: colors.blinky, x: startX + gridWidth * 0.55, y: startY + 15 },
        { name: 'pinky', color: colors.pinky, x: startX + gridWidth * 0.75, y: startY + gridHeight - 15 },
        { name: 'inky', color: colors.inky, x: startX + gridWidth * 0.25, y: startY + gridHeight * 0.7 },
        { name: 'clyde', color: colors.clyde, x: startX + gridWidth * 0.85, y: startY + gridHeight * 0.4 }
    ];

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      /* Pac-Man chomp animation */
      @keyframes chomp {
        0%, 100% { d: path('M 0,-12 A 12,12 0 1,1 0,12 A 12,12 0 1,1 0,-12'); }
        50% { d: path('M 12,0 L 0,-12 A 12,12 0 1,1 0,12 Z'); }
      }
      @keyframes chompSimple {
        0%, 100% { transform: scaleX(1); }
        50% { transform: scaleX(0.9); }
      }
      
      /* Pac-Man movement */
      @keyframes pacmanMove {
        0% { transform: translateX(0); }
        25% { transform: translateX(40px); }
        50% { transform: translateX(80px); }
        75% { transform: translateX(40px); }
        100% { transform: translateX(0); }
      }
      
      /* Ghost floating */
      @keyframes ghostFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      
      /* Ghost movement patterns */
      @keyframes blinkyMove {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(-30px); }
      }
      @keyframes pinkyMove {
        0%, 100% { transform: translateX(0); }
        33% { transform: translateX(25px); }
        66% { transform: translateX(-15px); }
      }
      @keyframes inkyMove {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      @keyframes clydeMove {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(-20px, 10px); }
      }
      
      /* Power pellet pulse */
      @keyframes powerPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.3); opacity: 0.7; }
      }
      
      /* Pellet glow */
      @keyframes pelletGlow {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
      }
      
      /* Eye movement */
      @keyframes eyeMove {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(2px); }
        75% { transform: translateX(-2px); }
      }
      
      .pacman-group { animation: pacmanMove 4s ease-in-out infinite; }
      .pacman-body { animation: chompSimple 0.3s ease-in-out infinite; }
      .ghost { animation: ghostFloat 1s ease-in-out infinite; }
      .ghost-blinky { animation: ghostFloat 1s ease-in-out infinite, blinkyMove 3s ease-in-out infinite; }
      .ghost-pinky { animation: ghostFloat 1.2s ease-in-out infinite, pinkyMove 4s ease-in-out infinite; }
      .ghost-inky { animation: ghostFloat 0.8s ease-in-out infinite, inkyMove 2.5s ease-in-out infinite; }
      .ghost-clyde { animation: ghostFloat 1.1s ease-in-out infinite, clydeMove 3.5s ease-in-out infinite; }
      .power-pellet { animation: powerPulse 1s ease-in-out infinite; }
      .ghost-eyes { animation: eyeMove 2s ease-in-out infinite; }
    </style>
    
    <!-- Glow filters -->
    <filter id="pacmanGlow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <filter id="ghostGlow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <filter id="powerGlow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${colors.background}" rx="6"/>
  
  <!-- Month Labels -->
  <g class="month-labels" fill="${colors.text}" font-family="monospace" font-size="10">
    ${CONFIG.months.map((month, i) =>
        `<text x="${startX + (i * gridWidth / 12) + 20}" y="22">${month}</text>`
    ).join('\n    ')}
  </g>
  
  <!-- Maze Walls -->
  <g class="maze-walls" stroke="${colors.wallBorder}" stroke-width="3" stroke-linecap="round">
    ${walls.map(wall =>
        `<line x1="${wall.x1}" y1="${wall.y1}" x2="${wall.x2}" y2="${wall.y2}"/>`
    ).join('\n    ')}
  </g>
  
  <!-- Pellets (Contribution Squares) -->
  <g class="pellets">
    ${pellets.filter(p => !p.eaten).map(pellet => {
        const levelColors = [colors.pellet, colors.pelletLight, colors.pelletMedium, colors.pelletDark, colors.pellet];
        return `<rect x="${pellet.x}" y="${pellet.y}" width="${cellSize}" height="${cellSize}" rx="2" 
            fill="${levelColors[pellet.level]}" opacity="${0.6 + pellet.level * 0.1}"/>`;
    }).join('\n    ')}
  </g>
  
  <!-- Power Pellets -->
  <g class="power-pellets" filter="url(#powerGlow)">
    ${powerPellets.map((pp, i) =>
        `<circle class="power-pellet" cx="${pp.x}" cy="${pp.y}" r="6" fill="${colors.powerPellet}" 
              style="animation-delay: ${i * 0.25}s" transform-origin="${pp.x}px ${pp.y}px"/>`
    ).join('\n    ')}
  </g>
  
  <!-- Pac-Man -->
  <g class="pacman-group" filter="url(#pacmanGlow)" transform="translate(${pacmanX}, ${pacmanY})">
    <g class="pacman-body" transform-origin="0 0">
      <!-- Pac-Man body with mouth -->
      <circle r="14" fill="${colors.pacman}"/>
      <polygon points="0,0 15,-8 15,8" fill="${colors.background}"/>
      <!-- Eye -->
      <circle cx="-2" cy="-6" r="2.5" fill="#000"/>
    </g>
  </g>
  
  <!-- Ghosts -->
  ${ghosts.map((ghost, i) => `
  <g class="ghost-${ghost.name}" filter="url(#ghostGlow)" transform="translate(${ghost.x}, ${ghost.y})" transform-origin="${ghost.x}px ${ghost.y}px">
    <!-- Ghost body -->
    <path d="M -10,5 L -10,-5 Q -10,-12 0,-12 Q 10,-12 10,-5 L 10,5 
             L 7,2 L 4,5 L 1,2 L -2,5 L -5,2 L -8,5 Z" 
          fill="${ghost.color}"/>
    <!-- Eyes -->
    <g class="ghost-eyes">
      <ellipse cx="-4" cy="-4" rx="3.5" ry="4" fill="${colors.ghostEyes}"/>
      <ellipse cx="4" cy="-4" rx="3.5" ry="4" fill="${colors.ghostEyes}"/>
      <circle cx="-3" cy="-3" r="2" fill="${colors.ghostPupil}"/>
      <circle cx="5" cy="-3" r="2" fill="${colors.ghostPupil}"/>
    </g>
  </g>`).join('\n  ')}
  
  <!-- Title -->
  <text x="${width / 2}" y="${height - 8}" text-anchor="middle" fill="${colors.textHighlight}" 
        font-family="monospace" font-size="11" font-weight="bold">
    🕹️ PAC-MAN ・ CONTRIBUTION CHASE 👻
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
    fs.writeFileSync(path.join(distDir, 'pacman.svg'), lightSVG);
    console.log('✅ Generated: pacman.svg');

    // Generate dark theme
    const darkSVG = generateSVG('dark');
    fs.writeFileSync(path.join(distDir, 'pacman-dark.svg'), darkSVG);
    console.log('✅ Generated: pacman-dark.svg');

    console.log('\n🕹️ Pac-Man SVG generation complete!');
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { generateSVG };
