import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import fs from 'fs-extra';
import path from 'path';

const srcDir = 'src';
const clientDir = path.join(srcDir, 'Client');
const serverDir = path.join(srcDir, 'Server');
const buildDir = 'build';

export default {
  input: path.join(clientDir, 'index.tsx'),
  output: {
    file: path.join(buildDir, 'main.js'),
    format: 'iife',
    name: 'EXAMPLE'
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    }),
    resolve({
      browser: true,
      dedupe: ['react', 'react-dom']
    }),
    commonjs({
      include: ['node_modules/**']
    }),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    postcss({
      extract: 'main.css',
      minimize: true,
      config: {
        path: './postcss.config.js'
      }
    }),
    {
      name: 'gas-build-plugin',
      async writeBundle() {
        await fs.ensureDir(buildDir);
        
        await copyAppsScriptConfig();
        await createServerCode();
        await createCompleteIndexHtml();
        await cleanupTempFiles();
      }
    }
  ],
  external: []
};

async function copyAppsScriptConfig() {
  const srcPath = path.join(srcDir, 'appsscript.json');
  const destPath = path.join(buildDir, 'appsscript.json');
  
  if (await fs.pathExists(srcPath)) {
    await fs.copy(srcPath, destPath);
  }
}

async function createServerCode() {
  const srcPath = path.join(serverDir, 'server.js');
  const destPath = path.join(buildDir, 'Code.js');
  
  if (await fs.pathExists(srcPath)) {
    await fs.copy(srcPath, destPath);
  }
}

async function createCompleteIndexHtml() {
  const htmlPath = path.join(clientDir, 'index.html');
  const cssPath = path.join(buildDir, 'main.css');
  const jsPath = path.join(buildDir, 'main.js');
  
  if (await fs.pathExists(htmlPath)) {
    let htmlContent = await fs.readFile(htmlPath, 'utf8');
    
    if (await fs.pathExists(cssPath)) {
      const cssContent = await fs.readFile(cssPath, 'utf8');
      htmlContent = htmlContent.replace(
        '<!-- CSS will be injected here during build -->',
        `<style>\n${cssContent}\n</style>`
      );
    }
    
    if (await fs.pathExists(jsPath)) {
      const jsContent = await fs.readFile(jsPath, 'utf8');
      htmlContent = htmlContent.replace(
        '<!-- JavaScript will be injected here during build -->',
        `<script>\n${jsContent}\n</script>`
      );
    }
    
    await fs.writeFile(path.join(buildDir, 'index.html'), htmlContent);
  }
}

async function cleanupTempFiles() {
  const tempFiles = ['main.css', 'main.js'];
  
  for (const file of tempFiles) {
    const filePath = path.join(buildDir, file);
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
    }
  }
}
