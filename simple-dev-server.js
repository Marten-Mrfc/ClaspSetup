import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DevServer {
  constructor() {
    this.port = 3000;
    this.buildDir = path.join(__dirname, 'build');
    this.srcDir = path.join(__dirname, 'src');
    this.isBuilding = false;
    this.lastBuild = 0;
    this.lastBuildTime = 0;
    this.debounceMs = 1000;
    
    this.setupServer();
    this.watchFiles();
    this.initialBuild();
  }

  setupServer() {
    this.server = http.createServer((req, res) => {
      if (req.url.startsWith('/dev-status')) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(this.lastBuildTime.toString());
        return;
      }
      
      this.handleRequest(req, res);
    });

    this.server.listen(this.port, () => {
      console.log(`🚀 Development server running at http://localhost:${this.port}`);
      console.log('');
    });
  }

  async handleRequest(req, res) {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    const fullPath = path.join(this.buildDir, filePath);
    
    try {
      if (!fs.existsSync(fullPath)) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
          <h1>File not found</h1>
          <p>Requested: ${filePath}</p>
          <p><a href="/">← Back to home</a></p>
          <p>Try running <code>npm run build</code> first</p>
        `);
        return;
      }

      const ext = path.extname(filePath);
      const contentType = this.getContentType(ext);
      
      let content = fs.readFileSync(fullPath, 'utf8');
      
      if (ext === '.html') {
        content = this.injectAutoRefresh(content);
      }
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
      
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  }

  getContentType(ext) {
    const types = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };
    return types[ext] || 'text/plain';
  }

  injectAutoRefresh(html) {
    const refreshScript = `
      <script>
        (function() {
          let lastBuildTime = 0;
          let isChecking = false;
          
          function checkForUpdates() {
            if (isChecking) return;
            isChecking = true;
            
            fetch('/dev-status?' + Date.now())
              .then(r => r.text())
              .then(buildTime => {
                const currentBuildTime = parseInt(buildTime);
                if (lastBuildTime && currentBuildTime > lastBuildTime) {
                  window.location.reload();
                }
                lastBuildTime = currentBuildTime;
                isChecking = false;
              })
              .catch(() => {
                isChecking = false;
              });
          }
          
          setInterval(checkForUpdates, 2000);
        })();
      </script>
    `;
    
    return html.replace('</body>', refreshScript + '\n</body>');
  }

  watchFiles() {
    const watchedFiles = new Map();
    
    const checkFiles = () => {
      try {
        this.walkDirectory(this.srcDir, (filePath) => {
          const stats = fs.statSync(filePath);
          const lastModified = stats.mtime.getTime();
          
          if (!watchedFiles.has(filePath)) {
            watchedFiles.set(filePath, lastModified);
          } else if (watchedFiles.get(filePath) !== lastModified) {
            watchedFiles.set(filePath, lastModified);
            this.triggerBuild();
          }
        });
      } catch (error) {
        // Source directory might not exist yet
      }
    };
    
    setInterval(checkFiles, 1000);
  }

  walkDirectory(dir, callback) {
    try {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          if (file !== 'node_modules' && file !== '.git') {
            this.walkDirectory(filePath, callback);
          }
        } else {
          callback(filePath);
        }
      }
    } catch (error) {
      // Directory might not exist
    }
  }

  triggerBuild() {
    const now = Date.now();
    
    if (now - this.lastBuild < this.debounceMs) {
      return;
    }
    
    if (this.isBuilding) {
      return;
    }
    
    this.lastBuild = now;
    this.runBuild();
  }

  async runBuild() {
    if (this.isBuilding) return;
    
    this.isBuilding = true;
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      const buildProcess = spawn('npm', ['run', 'build'], {
        cwd: __dirname,
        shell: true,
        stdio: 'pipe'
      });

      let output = '';
      
      buildProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      buildProcess.stderr.on('data', (data) => {
        output += data.toString();
      });

      buildProcess.on('close', (code) => {
        const duration = Date.now() - startTime;
        
        if (code === 0) {
          this.lastBuildTime = Date.now();
        }
        
        this.isBuilding = false;
        resolve();
      });
    });
  }

  async initialBuild() {
    const buildExists = fs.existsSync(this.buildDir);
    const buildFiles = buildExists ? fs.readdirSync(this.buildDir) : [];
    
    if (!buildExists || buildFiles.length === 0) {
      await this.runBuild();
    }
  }
}

new DevServer();

process.on('SIGINT', () => {
  process.exit(0);
});
