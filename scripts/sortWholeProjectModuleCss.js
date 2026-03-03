const fs = require("fs");
const glob = require("glob");

const files = glob.sync("src/**/*.module.css");

files.forEach((file) => {
    let content = fs.readFileSync(file, "utf-8");
    const lines = content.split("\n");

    function sortBlock(lines, startIndex = 0, depth = 0) {
        let sortedContent = [];
        let blockLines = [];
        let i = startIndex;

        while (i < lines.length) {
            const line = lines[i];
            const trimmedLine = line.trim();

            if (trimmedLine.includes("{")) {
                // Write previous blockLines sorted
                if (blockLines.length > 0 && depth > 0) {
                    blockLines.sort((a, b) => a.trim().length - b.trim().length);
                    sortedContent.push(...blockLines);
                    blockLines = [];
                }

                sortedContent.push(line);

                // Recursively sort inner block
                const inner = sortBlock(lines, i + 1, depth + 1);
                sortedContent.push(...inner.sortedLines);
                i = inner.nextIndex;
            } else if (trimmedLine.includes("}")) {
                // Sort blockLines before closing
                if (blockLines.length > 0) {
                    blockLines.sort((a, b) => a.trim().length - b.trim().length);
                    sortedContent.push(...blockLines);
                    blockLines = [];
                }

                sortedContent.push(line);
                return { sortedLines: sortedContent, nextIndex: i };
            } else {
                // Property line
                if (trimmedLine.includes(":") && trimmedLine.endsWith(";")) {
                    blockLines.push(line);
                } else {
                    sortedContent.push(line);
                }
            }

            i++;
        }

        // For top-level file content
        if (blockLines.length > 0) {
            blockLines.sort((a, b) => a.trim().length - b.trim().length);
            sortedContent.push(...blockLines);
        }

        return { sortedLines: sortedContent, nextIndex: i };
    }

    const finalContent = sortBlock(lines).sortedLines.join("\n");
    fs.writeFileSync(file, finalContent, "utf-8");
    console.log(`Sorted CSS properties by line length in ${file}`);
});
