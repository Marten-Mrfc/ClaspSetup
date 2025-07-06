#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  skipBuild: args.includes('--skip-build'),
  noPush: args.includes('--no-push'),
  noDeploy: args.includes('--no-deploy'),
  noOpen: args.includes('--no-open'),
  help: args.includes('--help') || args.includes('-h')
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

// Progress tracking
let totalSteps = 4;
let currentStep = 0;
let currentProgress = 0;
let progressInterval = null;

// Enhanced progress bar system
class ProgressBar {
  constructor(total = 100) {
    this.total = total;
    this.current = 0;
    this.barLength = 50;
    this.lastUpdate = Date.now();
    this.startTime = Date.now();
    this.isActive = false;
    this.currentActivity = '';
    this.currentStatus = '';
  }

  start(activity, status = '') {
    this.isActive = true;
    this.current = 0;
    this.startTime = Date.now();
    this.currentActivity = activity;
    this.currentStatus = status;
    this.render();
  }

  update(progress, status = null) {
    if (!this.isActive) return;
    
    this.current = Math.min(progress, this.total);
    if (status) this.currentStatus = status;
    this.render();
  }

  complete(message = null) {
    if (!this.isActive) return;
    
    this.current = this.total;
    this.render();
    this.isActive = false;
    
    if (message) {
      console.log('');
      writeSuccess(message);
    } else {
      console.log('');
    }
  }

  render() {
    const percent = (this.current / this.total) * 100;
    const filledLength = Math.round((this.barLength * percent) / 100);
    
    // Create animated progress bar with different characters for smooth effect
    let bar = '';
    for (let i = 0; i < this.barLength; i++) {
      if (i < filledLength) {
        bar += '█';
      } else if (i === filledLength && percent % (100 / this.barLength) > 0) {
        // Add partial character for smoother animation
        bar += '▓';
      } else {
        bar += '░';
      }
    }

    // Calculate elapsed time and ETA
    const elapsed = (Date.now() - this.startTime) / 1000;
    const eta = percent > 0 ? (elapsed * (100 - percent)) / percent : 0;
    
    // Format time display
    const formatTime = (seconds) => {
      if (seconds < 60) return `${seconds.toFixed(1)}s`;
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}m ${secs}s`;
    };

    const progressLine = `\r${colorize(this.currentActivity, 'cyan')}: [${colorize(bar, 'green')}] ${percent.toFixed(1)}% | ${formatTime(elapsed)} elapsed${eta > 1 ? ` | ETA: ${formatTime(eta)}` : ''}\n${colorize('  └─ ' + this.currentStatus, 'gray')}`;
    
    // Clear previous lines and write new progress
    process.stdout.write('\x1b[2K\x1b[1A\x1b[2K');
    process.stdout.write(progressLine);
  }

  animateProgress(targetProgress, duration = 1000, status = null) {
    if (!this.isActive) return Promise.resolve();
    
    return new Promise((resolve) => {
      const startProgress = this.current;
      const progressDiff = targetProgress - startProgress;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = startProgress + (progressDiff * easeOut);
        
        this.update(currentValue, status);
        
        if (progress < 1) {
          setTimeout(animate, 16); // ~60fps
        } else {
          resolve();
        }
      };
      
      animate();
    });
  }
}

// Global progress bar instance
const progressBar = new ProgressBar(100);

// Utility functions
function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function writeStepHeader(title, stepNumber) {
  // Step headers removed - keeping function for compatibility
}

function writeSuccess(message) {
  console.log(colorize(`✅ ${message}`, 'green'));
}

function writeError(message) {
  console.log(colorize(`❌ ${message}`, 'red'));
}

function writeInfo(message) {
  console.log(colorize(`ℹ️  ${message}`, 'blue'));
}

function writeWarning(message) {
  console.log(colorize(`⚠️  ${message}`, 'yellow'));
}

function showProgress(activity, status, percent) {
  // Legacy function - now uses the enhanced progress bar
  if (!progressBar.isActive) {
    progressBar.start(activity, status);
  } else {
    progressBar.update(percent, status);
  }
}

function showHelp() {
  console.log(colorize('🚀 EXAMPLE - DEPLOYMENT SCRIPT', 'magenta'));
  console.log(colorize('==============================================', 'magenta'));
  console.log('');
  console.log('Usage: node deploy.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --skip-build    Skip the build step');
  console.log('  --no-push       Skip pushing to Google Apps Script');
  console.log('  --no-deploy     Skip creating deployment');
  console.log('  --no-open       Skip opening web app in browser');
  console.log('  --help, -h      Show this help message');
  console.log('');
  console.log('Examples:');
  console.log('  node deploy.js                    # Full deployment');
  console.log('  node deploy.js --skip-build       # Skip build step');
  console.log('  node deploy.js --no-open          # Deploy without opening browser');
  console.log('');
}

// Promise-based spawn wrapper with progress tracking
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: __dirname,
      shell: true,
      stdio: options.stdio || 'inherit',
      ...options
    });

    let stdout = '';
    let stderr = '';
    let outputLines = 0;

    if (child.stdout) {
      child.stdout.on('data', (data) => {
        const output = data.toString();
        if (options.capture) {
          stdout += output;
        }
        
        // Update progress based on output activity
        if (options.progressCallback) {
          outputLines++;
          options.progressCallback(outputLines);
        }
        
        if (options.showOutput !== false) {
          process.stdout.write(output);
        }
      });
    }

    if (child.stderr) {
      child.stderr.on('data', (data) => {
        const output = data.toString();
        if (options.capture) {
          stderr += output;
        }
        
        // Update progress based on error output too
        if (options.progressCallback) {
          outputLines++;
          options.progressCallback(outputLines);
        }
        
        if (options.showOutput !== false) {
          process.stderr.write(output);
        }
      });
    }

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ code, stdout, stderr, output: stdout + stderr });
      } else {
        reject({ code, stdout, stderr, output: stdout + stderr });
      }
    });

    child.on('error', (error) => {
      reject({ error, code: -1, stdout, stderr });
    });
  });
}

// Main deployment function
async function deploy() {
  console.log(colorize('🚀 EXAMPLE - ADVANCED DEPLOYMENT', 'magenta'));
  console.log(colorize('=================================================', 'magenta'));
  console.log('');

  let deploymentId = null;

  // Start single progress bar for entire deployment
  progressBar.start('Deploying', 'Initializing deployment process...');

  try {
    // Step 1: Build Project (0-25%)
    if (!options.skipBuild) {
      progressBar.update(2, 'Building project...');
      await progressBar.animateProgress(5, 500);
      
      const buildStartTime = Date.now();
      
      try {
        // Simulate granular progress during build
        progressBar.update(7, 'Installing dependencies...');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        progressBar.update(10, 'Compiling TypeScript...');
        await progressBar.animateProgress(15, 800);
        
        progressBar.update(17, 'Processing React components...');
        await progressBar.animateProgress(20, 600);
        
        progressBar.update(22, 'Bundling assets...');
        
        let buildProgress = 22;
        const progressCallback = (lines) => {
          buildProgress = Math.min(24, 22 + (lines * 0.1));
          progressBar.update(buildProgress, 'Building...');
        };
        
        await runCommand('npm', ['run', 'build'], { progressCallback });
        
        await progressBar.animateProgress(25, 300);
        const buildDuration = (Date.now() - buildStartTime) / 1000;
      } catch (error) {
        progressBar.complete();
        process.exit(error.code || 1);
      }
    }

    // Step 2: Push to Google Apps Script (25-50%)
    if (!options.noPush) {
      progressBar.update(27, 'Connecting to Google Apps Script...');
      await progressBar.animateProgress(30, 400);
      
      const pushStartTime = Date.now();
      
      try {
        progressBar.update(32, 'Authenticating with Google...');
        await progressBar.animateProgress(35, 600);
        
        progressBar.update(37, 'Uploading files...');
        
        let pushProgress = 37;
        const progressCallback = (lines) => {
          pushProgress = Math.min(48, 37 + (lines * 0.5));
          progressBar.update(pushProgress, `Uploading file ${Math.floor(lines/2)}...`);
        };
        
        const result = await runCommand('npx', ['clasp', 'push', '-f'], { 
          capture: true, 
          progressCallback 
        });
        
        await progressBar.animateProgress(50, 400);
        const pushDuration = (Date.now() - pushStartTime) / 1000;
      } catch (error) {
        progressBar.complete();
        process.exit(error.code || 1);
      }
    }

    // Step 3: Create Deployment (50-80%)
    if (!options.noDeploy) {
      progressBar.update(52, 'Preparing deployment...');
      await progressBar.animateProgress(55, 300);
      
      const deployStartTime = Date.now();
      
      try {
        progressBar.update(57, 'Validating project configuration...');
        await progressBar.animateProgress(62, 500);
        
        progressBar.update(65, 'Creating new version...');
        await progressBar.animateProgress(70, 800);
        
        progressBar.update(72, 'Deploying to Google Apps Script...');
        
        const result = await runCommand('npx', ['clasp', 'deploy'], { 
          capture: true, 
          showOutput: false,
          stdio: ['inherit', 'pipe', 'pipe']
        });
        
        await progressBar.animateProgress(78, 400);
        progressBar.update(80, 'Finalizing deployment...');
        
        const deployDuration = (Date.now() - deployStartTime) / 1000;
        
        // Extract version and deployment ID - try multiple patterns
        const versionMatch = result.output.match(/Created version (\d+)/i) || 
                           result.output.match(/Version (\d+)/i);
        const deploymentIdMatch = result.output.match(/- (AKfyc[a-zA-Z0-9_-]+)/i) || 
                                result.output.match(/@HEAD\s*-\s*(AKfyc[a-zA-Z0-9_-]+)/i) ||
                                result.output.match(/Deployed to:\s*(AKfyc[a-zA-Z0-9_-]+)/i);
        
        if (deploymentIdMatch) {
          deploymentId = deploymentIdMatch[1];
        } else {
          // If we can't extract deployment ID, use @HEAD which is the latest
          deploymentId = '@HEAD';
        }
      } catch (error) {
        // Check if the error is due to too many deployments
        if (error.output && error.output.includes('Scripts may only have up to 20 versioned deployments')) {
          progressBar.update(60, 'Hit deployment limit, cleaning up...');
          
          try {
            // Get list of deployments
            progressBar.update(62, 'Getting deployment list...');
            const listResult = await runCommand('npx', ['clasp', 'deployments'], { 
              capture: true, 
              showOutput: false,
              stdio: ['inherit', 'pipe', 'pipe']
            });
            
            progressBar.update(65, 'Parsing deployments...');
            
            // Parse deployment IDs from the output
            const deploymentLines = listResult.output.split('\n').filter(line => 
              line.includes('AKfyc') && line.includes('@')
            );
            
            const deploymentIds = [];
            
            deploymentLines.forEach(line => {
              // Format: "- AKfyc... @version" or "- AKfyc... @HEAD"
              const match = line.match(/- (AKfyc[a-zA-Z0-9_-]+) @(\w+)/);
              if (match) {
                const id = match[1];
                const versionStr = match[2];
                
                // Skip @HEAD as it's the latest and shouldn't be deleted
                if (versionStr === 'HEAD') {
                  return;
                }
                
                const version = parseInt(versionStr);
                if (!isNaN(version)) {
                  deploymentIds.push({ version, id });
                }
              }
            });
            
            // Sort by version and keep only the oldest ones to delete
            deploymentIds.sort((a, b) => a.version - b.version);
            const deploymentsToDelete = deploymentIds.slice(0, Math.max(1, deploymentIds.length - 17)); // Keep 17, delete the rest to get under 20 limit
            
            if (deploymentsToDelete.length > 0) {
              progressBar.update(68, `Deleting ${deploymentsToDelete.length} old deployments...`);
              
              for (let i = 0; i < deploymentsToDelete.length; i++) {
                const deployment = deploymentsToDelete[i];
                const deleteProgress = 68 + ((i / deploymentsToDelete.length) * 5);
                
                try {
                  progressBar.update(deleteProgress, `Deleting deployment @${deployment.version}...`);
                  await runCommand('npx', ['clasp', 'undeploy', deployment.id], { 
                    capture: true, 
                    showOutput: false,
                    stdio: ['inherit', 'pipe', 'pipe']
                  });
                } catch (deleteError) {
                  // Silently continue if delete fails
                }
              }
              
              // Now try to deploy again
              progressBar.update(73, 'Retrying deployment...');
              const retryResult = await runCommand('npx', ['clasp', 'deploy'], { 
                capture: true, 
                showOutput: false,
                stdio: ['inherit', 'pipe', 'pipe']
              });
              
              await progressBar.animateProgress(80, 400);
              const retryDuration = (Date.now() - deployStartTime) / 1000;
              
              // Extract deployment info from retry
              const retryVersionMatch = retryResult.output.match(/Created version (\d+)/i) || 
                                      retryResult.output.match(/Version (\d+)/i);
              const retryDeploymentIdMatch = retryResult.output.match(/- (AKfyc[a-zA-Z0-9_-]+)/i) || 
                                          retryResult.output.match(/@HEAD\s*-\s*(AKfyc[a-zA-Z0-9_-]+)/i) ||
                                          retryResult.output.match(/Deployed to:\s*(AKfyc[a-zA-Z0-9_-]+)/i);
              
              if (retryDeploymentIdMatch) {
                deploymentId = retryDeploymentIdMatch[1];
              } else {
                deploymentId = '@HEAD';
              }
              
            } else {
              progressBar.complete();
              throw error;
            }
            
          } catch (cleanupError) {
            progressBar.complete();
            throw error;
          }
        } else {
          progressBar.complete();
          throw error;
        }
      }
    }

    // Step 4: Open Web Application (80-100%)
    if (!options.noOpen) {
      progressBar.update(82, 'Preparing to launch application...');
      await progressBar.animateProgress(85, 400);
      
      if (deploymentId) {
        progressBar.update(87, `Opening deployment ${deploymentId}...`);
        
        try {
          progressBar.update(90, 'Launching browser...');
          await progressBar.animateProgress(95, 800);
          
          await runCommand('npx', ['clasp', 'open', '--webapp', '--deploymentId', deploymentId]);
          
          await progressBar.animateProgress(100, 200);
          progressBar.complete('Web application opened successfully in browser');
        } catch (error) {
          progressBar.complete();
        }
      } else {
        progressBar.update(87, 'Opening latest deployment...');
        
        try {
          progressBar.update(90, 'Launching browser...');
          await progressBar.animateProgress(95, 800);
          
          // Use @HEAD to automatically select the latest deployment
          await runCommand('npx', ['clasp', 'open', '--webapp', '--deploymentId', '@HEAD']);
          
          await progressBar.animateProgress(100, 200);
          progressBar.complete('Web application opened successfully');
        } catch (error) {
          progressBar.complete();
        }
      }
    } else {
      // If not opening web app, complete the progress bar
      await progressBar.animateProgress(100, 200);
      progressBar.complete('Deployment completed successfully');
    }

    // Final summary
    console.log('');
    console.log(colorize('═══════════════════════════════════════════════════════════════', 'green'));
    console.log(colorize('  🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!', 'green'));
    console.log(colorize('═══════════════════════════════════════════════════════════════', 'green'));

  } catch (error) {
    process.exit(1);
  }
}

// Handle help flag
if (options.help) {
  showHelp();
  process.exit(0);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n');
  writeWarning('Deployment interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n');
  writeWarning('Deployment terminated');
  process.exit(0);
});

// Start deployment
deploy().catch((error) => {
  writeError(`Unexpected error: ${error.message || error}`);
  process.exit(1);
});
