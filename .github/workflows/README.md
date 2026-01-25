# Workflow Tests

Unit tests for GitHub Actions workflows in this repository.

## Test Coverage

The test suite validates the following aspects of the deployment workflows:

### Deploy Server Workflow (`deploy-server.yml`)
1. ✅ Triggers on push to main branch with correct paths
2. ✅ Triggers on pull_request to main branch with correct paths
3. ✅ Correctly sets up environment variables (`VERCEL_ORG_ID`, `VERCEL_SERVER_PROJECT_ID`)
4. ✅ Uses correct Node.js version (20) and installs Vercel CLI
5. ✅ Executes Vercel CLI commands in `./apps/server` directory with proper tokens

### Deploy WWW Workflow (`deploy-www.yml`)
1. ✅ Triggers on push to main branch with correct paths
2. ✅ Triggers on pull_request to main branch with correct paths
3. ✅ Correctly sets up environment variables (`VERCEL_ORG_ID`, `VERCEL_WWW_PROJECT_ID`)
4. ✅ Uses correct Node.js version (20) and installs Vercel CLI
5. ✅ Executes Vercel CLI commands in `./apps/www` directory with proper tokens

## Running Tests

### Install Dependencies
```bash
cd .github/workflows
npm install
```

### Run Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

## Test Structure

The tests use Jest to parse the YAML workflow files and validate their configuration:
- **Triggers**: Validates that workflows trigger on the correct events, branches, and file paths
- **Environment Variables**: Ensures proper secret references are configured
- **Steps**: Verifies each step in the workflow executes with correct parameters
- **Working Directories**: Confirms Vercel commands run in the appropriate project directories
- **Tokens**: Validates that all Vercel CLI commands use the proper authentication token

## Requirements

- Node.js 18+
- npm or yarn
