const fs = require("fs");
const path = require("path");

const scriptName = path.basename(process.argv[1]);

// Add paths to ignore here (relative to the root directory)
const ignorePaths = [
  "node_modules",
  "dist",
  ".git",
  "android",
  "ios",
  "scripts",
  "assets",
  ".expo",
  // Add more paths to ignore as needed
];

async function replaceQuotesInFile(filePath) {
  try {
    let content = await fs.readFileSync(filePath, "utf8");
    const originalContent = content;
    content = content.replace(/'\"/g, "'");
    content = content.replace(/\"'/g, "'");

    if (content !== originalContent) {
      await fs.writeFileSync(filePath, content, "utf8");
      console.log(`Updated: ${filePath}`);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

async function processDirectory(directoryPath) {
  let filesProcessed = 0;
  let filesUpdated = 0;

  async function traverse(currentPath) {
    const entries = await fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relativePath = path.relative(directoryPath, fullPath);

      if (
        ignorePaths.some((ignorePath) => relativePath.startsWith(ignorePath))
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        const [processedInSubDir, updatedInSubDir] = await traverse(fullPath);
        filesProcessed += processedInSubDir;
        filesUpdated += updatedInSubDir;
      } else if (entry.isFile() && entry.name !== scriptName) {
        filesProcessed++;
        if (await replaceQuotesInFile(fullPath)) {
          filesUpdated++;
        }
      }
    }

    return [filesProcessed, filesUpdated];
  }

  try {
    [filesProcessed, filesUpdated] = await traverse(directoryPath);
    console.log(`\nProcessing completed.`);
    console.log(`Total files processed: ${filesProcessed}`);
    console.log(`Files updated: ${filesUpdated}`);
  } catch (error) {
    console.error(`Error processing directory ${directoryPath}:`, error);
  }
}

// Get the current directory
const rootDirectory = process.cwd();
console.log(`Starting to process files in: ${rootDirectory}`);
console.log(`Ignoring paths: ${ignorePaths.join(", ")}`);

//move to correct folder

const componentsFolder = `${rootDirectory}/src/components`;

const screensFolder = `${rootDirectory}/src/screens`;

const screenFunctionRegex = /function\s+(\w+Screen)\s*\(/;

const screenRegex = /function\s+(\w+Screen)\s*\(/;

function extractScreenName(content) {
  const match = content.match(screenRegex);

  if (match) {
    return match[1];
  } else {
    return null;
  }
}

async function readFilesFromList(listFilePath) {
  try {
    // Read the list of files
    const entries = await fs.readdirSync(listFilePath, { withFileTypes: true });

    // Read each file in the list
    for (const entry of entries) {
      try {
        const fullPath = path.join(listFilePath, entry.name);
        if (entry.isFile()) {
          const content = await fs.readFileSync(fullPath, "utf8");
          const isScreen = screenFunctionRegex.test(content || "");
          const screenName = extractScreenName(content);
          if (isScreen && screenName) {
            const rootScreenPath = `${screensFolder}/${screenName}.tsx`;
            await fs.writeFileSync(rootScreenPath, content, "utf8");
            await fs.unlinkSync(fullPath);
          }
        }
      } catch (err) {
        console.error(`Error reading file ${entry.name}`, err);
      }
    }
  } catch (err) {
    console.error(`Error reading file list: ${err.message}`);
  }
}

const run = async () => {
  try {
    await processDirectory(rootDirectory);
    await readFilesFromList(componentsFolder);
  } catch (e) {}
};

run();
