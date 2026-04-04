import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelScriptPath = path.resolve(__dirname, '../../ML Services/Heart&diabeties/predict.py');

const runPythonPrediction = (payload) => {
  return new Promise((resolve, reject) => {
    const pythonCommand = process.env.PYTHON_BIN || 'python3';
    const pyProcess = spawn(pythonCommand, [modelScriptPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    pyProcess.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    pyProcess.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    pyProcess.on('error', (err) => {
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });

    pyProcess.on('close', (code) => {
      if (code !== 0) {
        const msg = stderr || stdout || 'Unknown Python execution error';
        return reject(new Error(msg.trim()));
      }

      try {
        const parsed = JSON.parse(stdout.trim());
        if (parsed.error) {
          return reject(new Error(parsed.error));
        }
        resolve(parsed);
      } catch (parseError) {
        reject(new Error(`Invalid prediction output: ${parseError.message}`));
      }
    });

    pyProcess.stdin.write(JSON.stringify(payload));
    pyProcess.stdin.end();
  });
};

export default runPythonPrediction;
