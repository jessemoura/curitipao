const { execSync } = require('child_process');
const path = require('path');

const distDir = path.resolve('dist');

console.log('--- EXECUTING AUTOMATED PRODUCTION BRANCH PUSH ---');

try {
  console.log('Staging files in dist...');
  execSync('git add -A', { cwd: distDir, stdio: 'inherit' });

  // Check if there are changes to commit
  const status = execSync('git status --porcelain', { cwd: distDir, encoding: 'utf8' }).trim();
  if (status) {
    const commitMsg = process.env.COMMIT_MSG || 'deploy: publicacao do artigo 15 padarias em curitiba por bairro (Ledinara)';
    console.log(`Committing changes in dist with message: "${commitMsg}"...`);
    execSync(`git commit -m "${commitMsg}"`, { cwd: distDir, stdio: 'inherit' });
  } else {
    console.log('No new changes to commit in dist.');
  }

  console.log('Pushing to portal/main (curitipao-portal)...');
  execSync('git push portal main', { cwd: distDir, stdio: 'inherit' });

  console.log('Pushing to origin/production (curitipao backup)...');
  try {
    execSync('git push origin main:production', { cwd: distDir, stdio: 'inherit' });
  } catch (err) {
    console.warn('Note: origin backup push skipped or failed.');
  }

  console.log('\nSUCCESS: production files updated in jessemoura/curitipao-portal (main)!');
} catch (err) {
  console.error('Error during production push:', err);
  process.exit(1);
}
