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
const appStruct = require("../app.struct");

async function moveFiles() {
  let total = 0;
  let success = 0;
  try {
    // Đọc danh sách các file trong thư mục component-shadcn
    const files = await fs.readdirSync(
      `${rootDirectory}/src/components-shadcn`
    );

    total = files.length;

    for (const newFile of files) {
      const sourcePath = path.join(
        `${rootDirectory}/src/components-shadcn`,
        newFile
      );
      const content = await fs.readFileSync(sourcePath, "utf8");
      const pathToRealFile = content.match(
        /(?<=APP_STRUCT\s=\s[\"\'])([A-Z]+(\_)*)+/g
      )?.[0];
      console.log("[Di chuyển] đang kiểm tra file ", pathToRealFile);
      if (appStruct[pathToRealFile]) {
        const destPath = appStruct[pathToRealFile];
        const actualPath = path.join(rootDirectory, destPath);

        // Tạo thư mục đích nếu nó chưa tồn tại
        await fs.mkdirSync(path.dirname(actualPath), { recursive: true });

        // Di chuyển file
        await fs.renameSync(sourcePath, actualPath);
        console.log(`[Di chuyển] Đã di chuyển ${sourcePath} đến ${actualPath}`);
        success++;
      } else {
        console.log("[Di chuyển] chưa định nghĩa trong app.struct.js");
      }
    }
    console.log("Hoàn thành việc di chuyển các file.");
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
  }
  console.log(`[Di chuyển] tệp trong thư mục: ${total}`);
  console.log(`[Di chuyển] di chuyển thành công: ${success}`);
}

async function manualMoveTypeFile() {
  try {
    const wrongPath = path.join(rootDirectory, "src/src/types");
    const wrongFiles = await fs.readdirSync(wrongPath);
    for (const file of wrongFiles) {
      const filePath = path.join(wrongPath, file);
      const actualPath = path.join(rootDirectory, "src/types", file);
      await fs.mkdirSync(path.dirname(actualPath), { recursive: true });
      await fs.renameSync(filePath, actualPath);
    }
    // await fs.unlinkSync(wrongPath);
  } catch (e) {
    console.error("Đã xảy ra lỗi:", error);
  }
}

const run = async () => {
  try {
    // await processDirectory(rootDirectory);
    // await readFilesFromList(componentsFolder);
    await moveFiles();
    // await manualMoveTypeFile();
  } catch (e) {}
};

run();
