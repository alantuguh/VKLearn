const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function search() {
  const brainDir = 'C:\\Users\\lenovo\\.gemini\\antigravity-ide\\brain';
  const convs = fs.readdirSync(brainDir);

  for (const c of convs) {
    const file = path.join(brainDir, c, '.system_generated', 'logs', 'transcript_full.jsonl');
    if (!fs.existsSync(file)) continue;

    const fileStream = fs.createReadStream(file);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    for await (const line of rl) {
      if (line.includes('style.css')) {
        try {
          const obj = JSON.parse(line);
          if (obj.tool_calls) {
            for (const tc of obj.tool_calls) {
              if (tc.name === 'write_to_file' && tc.args && tc.args.TargetFile && tc.args.TargetFile.toLowerCase().includes('style.css')) {
                console.log('Conv:', c, 'step:', obj.step_index, 'TargetFile:', tc.args.TargetFile, 'Len:', (tc.args.CodeContent || '').length);
                fs.writeFileSync('backup_' + c + '_step_' + obj.step_index + '_style.css', tc.args.CodeContent || '', 'utf8');
              }
            }
          }
        } catch(e) {}
      }
    }
  }
}
search();
