const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('GitHub Actions Workflows', () => {
  let deployServerWorkflow;
  let deployWWWWorkflow;

  beforeAll(() => {
    // Load workflow files
    const serverWorkflowPath = path.join(__dirname, 'deploy-server.yml');
    const wwwWorkflowPath = path.join(__dirname, 'deploy-www.yml');

    deployServerWorkflow = yaml.load(fs.readFileSync(serverWorkflowPath, 'utf8'));
    deployWWWWorkflow = yaml.load(fs.readFileSync(wwwWorkflowPath, 'utf8'));
  });

  describe('Deploy Server Workflow', () => {
    test('triggers on push to main branch with correct paths', () => {
      expect(deployServerWorkflow.on.push).toBeDefined();
      expect(deployServerWorkflow.on.push.branches).toContain('main');
      expect(deployServerWorkflow.on.push.paths).toEqual([
        'apps/server/**',
        '.github/workflows/deploy-server.yml'
      ]);
    });

    test('triggers on pull_request to main branch with correct paths', () => {
      expect(deployServerWorkflow.on.pull_request).toBeDefined();
      expect(deployServerWorkflow.on.pull_request.branches).toContain('main');
      expect(deployServerWorkflow.on.pull_request.paths).toEqual([
        'apps/server/**'
      ]);
    });

    test('correctly sets up environment variables', () => {
      expect(deployServerWorkflow.env).toBeDefined();
      expect(deployServerWorkflow.env.VERCEL_ORG_ID).toBe('${{ secrets.VERCEL_ORG_ID }}');
      expect(deployServerWorkflow.env.VERCEL_PROJECT_ID).toBe('${{ secrets.VERCEL_SERVER_PROJECT_ID }}');
    });

    test('uses correct Node.js version and installs dependencies', () => {
      const steps = deployServerWorkflow.jobs.deploy.steps;
      
      // Check Node.js setup
      const nodeSetup = steps.find(step => step.name === 'Setup Node.js');
      expect(nodeSetup).toBeDefined();
      expect(nodeSetup.uses).toBe('actions/setup-node@v4');
      expect(nodeSetup.with['node-version']).toBe('20');
      
      // Check Vercel CLI installation
      const vercelInstall = steps.find(step => step.name === 'Install Vercel CLI');
      expect(vercelInstall).toBeDefined();
      expect(vercelInstall.run).toBe('npm install --global vercel@latest');
    });

    test('executes Vercel CLI commands in correct directory with proper tokens', () => {
      const steps = deployServerWorkflow.jobs.deploy.steps;
      
      // Check pull command
      const pullStep = steps.find(step => step.name === 'Pull Vercel Environment Information');
      expect(pullStep).toBeDefined();
      expect(pullStep['working-directory']).toBe('./apps/server');
      expect(pullStep.run).toContain('vercel pull');
      expect(pullStep.run).toContain('--yes');
      expect(pullStep.run).toContain('--environment=production');
      expect(pullStep.run).toContain('--token=${{ secrets.VERCEL_TOKEN }}');
      
      // Check build command
      const buildStep = steps.find(step => step.name === 'Build Project Artifacts');
      expect(buildStep).toBeDefined();
      expect(buildStep['working-directory']).toBe('./apps/server');
      expect(buildStep.run).toContain('vercel build');
      expect(buildStep.run).toContain('--prod');
      expect(buildStep.run).toContain('--token=${{ secrets.VERCEL_TOKEN }}');
      
      // Check deploy command
      const deployStep = steps.find(step => step.name === 'Deploy Project Artifacts to Vercel');
      expect(deployStep).toBeDefined();
      expect(deployStep['working-directory']).toBe('./apps/server');
      expect(deployStep.run).toContain('vercel deploy');
      expect(deployStep.run).toContain('--prebuilt');
      expect(deployStep.run).toContain('--prod');
      expect(deployStep.run).toContain('--token=${{ secrets.VERCEL_TOKEN }}');
    });
  });

  describe('Deploy WWW Workflow', () => {
    test('triggers on push to main branch with correct paths', () => {
      expect(deployWWWWorkflow.on.push).toBeDefined();
      expect(deployWWWWorkflow.on.push.branches).toContain('main');
      expect(deployWWWWorkflow.on.push.paths).toEqual([
        'apps/www/**',
        '.github/workflows/deploy-www.yml'
      ]);
    });

    test('triggers on pull_request to main branch with correct paths', () => {
      expect(deployWWWWorkflow.on.pull_request).toBeDefined();
      expect(deployWWWWorkflow.on.pull_request.branches).toContain('main');
      expect(deployWWWWorkflow.on.pull_request.paths).toEqual([
        'apps/www/**'
      ]);
    });

    test('correctly sets up environment variables', () => {
      expect(deployWWWWorkflow.env).toBeDefined();
      expect(deployWWWWorkflow.env.VERCEL_ORG_ID).toBe('${{ secrets.VERCEL_ORG_ID }}');
      expect(deployWWWWorkflow.env.VERCEL_PROJECT_ID).toBe('${{ secrets.VERCEL_WWW_PROJECT_ID }}');
    });

    test('uses correct Node.js version and installs dependencies', () => {
      const steps = deployWWWWorkflow.jobs.deploy.steps;
      
      // Check Node.js setup
      const nodeSetup = steps.find(step => step.name === 'Setup Node.js');
      expect(nodeSetup).toBeDefined();
      expect(nodeSetup.uses).toBe('actions/setup-node@v4');
      expect(nodeSetup.with['node-version']).toBe('20');
      
      // Check Vercel CLI installation
      const vercelInstall = steps.find(step => step.name === 'Install Vercel CLI');
      expect(vercelInstall).toBeDefined();
      expect(vercelInstall.run).toBe('npm install --global vercel@latest');
    });

    test('executes Vercel CLI commands in correct directory with proper tokens', () => {
      const steps = deployWWWWorkflow.jobs.deploy.steps;
      
      // Check pull command
      const pullStep = steps.find(step => step.name === 'Pull Vercel Environment Information');
      expect(pullStep).toBeDefined();
      expect(pullStep['working-directory']).toBe('./apps/www');
      expect(pullStep.run).toContain('vercel pull');
      expect(pullStep.run).toContain('--yes');
      expect(pullStep.run).toContain('--environment=production');
      expect(pullStep.run).toContain('--token=${{ secrets.VERCEL_TOKEN }}');
      
      // Check build command
      const buildStep = steps.find(step => step.name === 'Build Project Artifacts');
      expect(buildStep).toBeDefined();
      expect(buildStep['working-directory']).toBe('./apps/www');
      expect(buildStep.run).toContain('vercel build');
      expect(buildStep.run).toContain('--prod');
      expect(buildStep.run).toContain('--token=${{ secrets.VERCEL_TOKEN }}');
      
      // Check deploy command
      const deployStep = steps.find(step => step.name === 'Deploy Project Artifacts to Vercel');
      expect(deployStep).toBeDefined();
      expect(deployStep['working-directory']).toBe('./apps/www');
      expect(deployStep.run).toContain('vercel deploy');
      expect(deployStep.run).toContain('--prebuilt');
      expect(deployStep.run).toContain('--prod');
      expect(deployStep.run).toContain('--token=${{ secrets.VERCEL_TOKEN }}');
    });
  });
});
