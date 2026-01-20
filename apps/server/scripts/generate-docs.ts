
import postmanToOpenApi from 'postman-to-openapi';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.resolve(__dirname, '../src/docs/postman/Betalift API.postman_collection.json');
const outputDir = path.resolve(__dirname, '../src/docs');
const outputPath = path.join(outputDir, 'swagger.yml');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateDocs() {
  try {
    console.log('Generating Swagger documentation...');
    console.log(`Input: ${inputPath}`);
    console.log(`Output: ${outputPath}`);

    await postmanToOpenApi(inputPath, outputPath, {
      defaultTag: 'General',
    });

    console.log('Successfully generated Swagger documentation!');
  } catch (error) {
    console.error('Error generating Swagger documentation:', error);
    process.exit(1);
  }
}

generateDocs();
