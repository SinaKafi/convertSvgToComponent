
const path = require("path");
const fs = require("fs-extra");
const prettier = require("prettier");

/**
 * Ensures that the specified directory exists.
 * @param {string} dirPath - The path to the directory.
 */
const ensureDirectoryExists = (dirPath) => {
  fs.ensureDirSync(dirPath);
};

/**
 * @param {string} fileName - The base name of the file.
 * @returns {string} - The Pascal Case component name.
 */
const generateComponentName = (fileName) => {
  const generatedName = fileName
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toUpperCase() : match.trim().toUpperCase()
    );

  return generatedName.startsWith("SVG")
    ? generatedName
    : `SVG${generatedName}`;
};

/**
 * @param {string} componentName - The name of the React component.
 * @param {string} svgContent - The content of the SVG file.
 * @returns {Promise<string>} - The formatted TypeScript component content.
 */
const createTsComponentContent = async (componentName, svgContent) => {
  const tsContent = `
    import React from 'react';

    const ${componentName} = ({ width = 24, height = 24 }) => (
      ${svgContent
        .replace(/width="(\d+)"/g, "width={width}")
        .replace(/height="(\d+)"/g, "height={height}")
        .trim()}
    );

    export default ${componentName};
  `;

  return prettier.format(tsContent, { parser: "typescript" });
};

/**
 * @param {string} svgFilePath - The path of the SVG file.
 * @param {string} tsFilePath - The output path for the TypeScript file.
 */
const convertSvgToTs = async (svgFilePath, tsFilePath) => {
  try {
    const svgContent = await fs.readFile(svgFilePath, "utf8");
    const componentName = generateComponentName(
      path.basename(tsFilePath, ".tsx")
    );
    const tsContent = await createTsComponentContent(componentName, svgContent);

    await fs.writeFile(tsFilePath, tsContent);
  } catch (error) {
    console.error(`Error converting ${svgFilePath} to TypeScript:`, error);
  }
};

/**
 * @param {string} svgDir - The directory containing SVG files.
 * @param {string} tsDir - The directory to output the TypeScript files.
 */
const convertAllSvgFiles = async (svgDir, tsDir) => {
  try {
    const svgFiles = fs
      .readdirSync(svgDir)
      .filter((file) => path.extname(file) === ".svg");

    for (const file of svgFiles) {
      const svgFilePath = path.join(svgDir, file);
      const tsFileName = `${generateComponentName(path.basename(file, ".svg"))}.tsx`;
      const tsFilePath = path.join(tsDir, tsFileName);

      await convertSvgToTs(svgFilePath, tsFilePath);
    }

    console.log("SVG to TypeScript conversion completed successfully!");
  } catch (error) {
    console.error("Error during SVG to TypeScript conversion:", error);
  }
};

/**
 * The main function to run the SVG to TypeScript conversion process.
 */
const main = async () => {
  const svgDir = path.resolve(process.argv[2]);
  const tsDir = path.resolve(process.argv[3]);

  ensureDirectoryExists(tsDir);
  await convertAllSvgFiles(svgDir, tsDir);
};

main();
