const fs = require('fs');
let src = fs.readFileSync('src/core/equation.js', 'utf8');

// Find the formatEquation factored case (second occurrence of "case 'factored':")
const first = src.indexOf("case 'factored':");
const second = src.indexOf("case 'factored':", first + 1);

if (second < 0) { console.log('NOT FOUND'); process.exit(1); }

// Find the block: from "case 'factored': {" to the next "    case '" or default
const blockStart = second;
const blockEnd = src.indexOf('\n    case ', second + 1);

const oldBlock = src.substring(blockStart, blockEnd);

const newBlock = `    case 'factored': {
      const r1s = params.r1 >= 0 ? \`− \${params.r1.toFixed(2)}\` : \`+ \${Math.abs(params.r1).toFixed(2)}\`;
      const r2s = params.r2 >= 0 ? \`− \${params.r2.toFixed(2)}\` : \`+ \${Math.abs(params.r2).toFixed(2)}\`;
      const kVal = params.k ?? 0;
      const ks = kVal >= 0 ? \`+ \${kVal.toFixed(2)}\` : \`− \${Math.abs(kVal).toFixed(2)}\`;
      return kVal !== 0
        ? \`y = \${c('a')}(x \${r1s})(x \${r2s}) \${ks}\`
        : \`y = \${c('a')}(x \${r1s})(x \${r2s})\`;
    }
`;

src = src.substring(0, blockStart) + newBlock + src.substring(blockEnd);

fs.writeFileSync('src/core/equation.js', src, 'utf8');
console.log('Updated factored formatEquation to include k');
