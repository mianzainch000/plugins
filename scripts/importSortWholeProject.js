const fs = require("fs");
const path = require("path");

// Sort imports inside a file without shifting other lines
function sortImportsInFile(filePath) {
    let code = fs.readFileSync(filePath, "utf8");
    const lines = code.split("\n");

    // Find "use client";
    const useClientIndex = lines.findIndex(line => line.trim() === '"use client";');
    const importIndices = [];

    lines.forEach((line, idx) => {
        if (/^import .+;$/.test(line.trim())) {
            importIndices.push(idx);
        }
    });

    // Extract import lines
    const importLines = importIndices.map(i => lines[i]);

    // Sort named imports inside curly braces
    const processedLines = importLines.map(line => {
        const match = line.match(/^import\s+([^\{\s]+)?\s*(,\s*)?\{([^}]+)\}/);
        if (match) {
            const defaultImport = match[1] ? match[1].trim() : null;
            const namedImports = match[3]
                .split(",")
                .map(i => i.trim())
                .sort((a, b) => a.localeCompare(b))
                .join(", ");

            if (defaultImport) {
                return line.replace(/\{[^}]+\}/, `{ ${namedImports} }`);
            } else {
                return `import { ${namedImports} } from ${line.split("from")[1].trim()}`;
            }
        }
        return line;
    });

    // Sort import lines by length
    processedLines.sort((a, b) => a.length - b.length);

    // Replace imports in original positions
    importIndices.forEach((idx, i) => {
        lines[idx] = processedLines[i];
    });

    // Move "use client"; to top if it exists
    if (useClientIndex !== -1 && useClientIndex !== 0) {
        const [useClientLine] = lines.splice(useClientIndex, 1);
        lines.unshift(useClientLine);
    }

    fs.writeFileSync(filePath, lines.join("\n"), "utf8");
}

// Recursively scan folder
function scanDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            scanDir(fullPath);
        } else if (fullPath.match(/\.(js|ts|jsx|tsx)$/)) {
            sortImportsInFile(fullPath);
        }
    });
}

// Run on src folder
scanDir("./src");

console.log("✅ Imports sorted, line numbers preserved, 'use client' on top!");
