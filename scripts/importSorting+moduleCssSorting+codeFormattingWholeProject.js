// 1)npm install --save-dev prettier

// 2)npm install glob --save-dev








const fs = require("fs");
const glob = require("glob");
const { execSync } = require("child_process");

/**
 * Enhanced Sort imports: Handles single-line and multi-line { } blocks
 */
function sortImports(content) {
    const lines = content.split("\n");

    let useClient = [];
    let imports = [];
    let others = [];

    let currentImportBlock = "";
    let isCollectingImport = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // 1. Check for "use client"
        if (
            trimmed.startsWith('"use client"') ||
            trimmed.startsWith("'use client'")
        ) {
            useClient.push(line);
            continue;
        }

        // 2. Start or Continue an Import Block
        if (trimmed.startsWith("import") || isCollectingImport) {
            currentImportBlock += line + "\n";

            // Check if the import is multi-line (contains { but not yet })
            if (trimmed.includes("{") && !trimmed.includes("}")) {
                isCollectingImport = true;
            }

            // Check if the import block ends (has } or ends with ;)
            // This handles: import { ... } from 'x'; OR import x from 'y';
            if (
                trimmed.includes("}") ||
                (trimmed.endsWith(";") && !isCollectingImport) ||
                trimmed === ""
            ) {
                // If it was a multi-line, we wait for the "from" part
                if (isCollectingImport && !trimmed.includes("}")) {
                    continue;
                }

                imports.push(currentImportBlock.trimEnd());
                currentImportBlock = "";
                isCollectingImport = false;
            }
        } else {
            // 3. Regular code/logic
            others.push(line);
        }
    }

    // Sort imports by total block length (Shortest → Longest)
    imports.sort((a, b) => a.length - b.length);

    // Combine everything
    return [...useClient, ...imports, ...others].join("\n");
}

/**
 * Sort CSS properties inside blocks (shortest property first)
 */
function sortCssContent(content) {
    const lines = content.split("\n");
    let sortedContent = [];
    let stack = [];

    function flushBlock(block) {
        if (block.lines.length > 0) {
            // Sort CSS properties by line length
            block.lines.sort((a, b) => a.trim().length - b.trim().length);
            block.sortedResult.push(...block.lines);
            block.lines = [];
        }
    }

    lines.forEach((line) => {
        const trimmed = line.trim();

        if (trimmed.endsWith("{")) {
            // Enter a new CSS rule/block
            stack.push({ sortedResult: [line], lines: [] });
        } else if (trimmed === "}") {
            // Closing a block
            const finishedBlock = stack.pop();
            flushBlock(finishedBlock);
            finishedBlock.sortedResult.push(line);

            if (stack.length > 0) {
                stack[stack.length - 1].sortedResult.push(
                    ...finishedBlock.sortedResult,
                );
            } else {
                sortedContent.push(...finishedBlock.sortedResult);
            }
        } else {
            if (stack.length > 0) {
                // If it looks like a property (color: red;), collect for sorting
                if (
                    trimmed.includes(":") &&
                    (trimmed.endsWith(";") || trimmed.endsWith("!important"))
                ) {
                    stack[stack.length - 1].lines.push(line);
                } else {
                    stack[stack.length - 1].sortedResult.push(line);
                }
            } else {
                sortedContent.push(line);
            }
        }
    });

    return sortedContent.join("\n");
}

/**
 * Main function to process the project
 */
function sortProject() {
    console.log("🚀 Starting script...");

    // 1. Process CSS Files
    const cssFiles = glob.sync("src/**/*.module.css");
    cssFiles.forEach((file) => {
        const content = fs.readFileSync(file, "utf-8");
        const finalContent = sortCssContent(content);
        fs.writeFileSync(file, finalContent, "utf-8");
        console.log(`✅ Sorted CSS in: ${file}`);
    });

    // 2. Process JS/TS/JSX/TSX Files
    const codeFiles = glob.sync("src/**/*.{js,jsx,ts,tsx}");
    codeFiles.forEach((file) => {
        const content = fs.readFileSync(file, "utf-8");
        const finalContent = sortImports(content);
        fs.writeFileSync(file, finalContent, "utf-8");
        console.log(`✅ Sorted Imports in: ${file}`);
    });

    // 3. Final Prettier cleanup (Fixes any indentation issues from sorting)
    try {
        console.log("✨ Running Prettier for final touch...");
        execSync("npx prettier --write .", { stdio: "inherit" });
        console.log("🎉 All done! Project is clean and sorted.");
    } catch (err) {
        console.error(
            "⚠️ Prettier failed. Make sure it is installed (npm install --save-dev prettier)",
        );
    }
}

// Execution
if (require.main === module) {
    sortProject();
}

module.exports = { sortProject };
