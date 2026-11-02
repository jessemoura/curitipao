const fs = require('fs');
const readline = require('readline');

const logFile = 'C:\\Users\\Jesse\\.gemini\\antigravity-ide\\brain\\855f1d43-f7bb-44c0-ba7b-aac4d5c3837f\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logFile)
});

rl.on('line', line => {
  if (line.includes('Hostinger') || line.includes('Git') || line.includes('Avançado')) {
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'USER_INPUT') {
        console.log('\n--- USER INPUT ---');
        console.log(obj.content);
      } else if (obj.type === 'PLANNER_RESPONSE' && obj.content && (obj.content.includes('Hostinger') || obj.content.includes('Git'))) {
        console.log('\n--- PLANNER RESPONSE (excerpt) ---');
        console.log(obj.content.substring(0, 500));
      }
    } catch(e) {}
  }
});
