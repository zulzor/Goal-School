const webpack = require('webpack');
const path = require('path');
const config = require('./webpack.prod.config.js');

console.log('Building production web app...');

const compiler = webpack(config);

compiler.run((err, stats) => {
  if (err) {
    console.error('Compiler error:', err);
    process.exit(1);
  }

  if (stats.hasErrors()) {
    console.error('Build errors:');
    console.error(stats.toString('errors-only'));
    process.exit(1);
  }

  console.log('Build completed successfully!');
  console.log(stats.toString({
    chunks: false,
    colors: true
  }));

  // Copy necessary assets
  const fs = require('fs-extra');
  const sourceDir = path.resolve(__dirname, 'web-export');
  const destDir = path.resolve(__dirname, 'dist');

  // Copy assets that aren't handled by webpack
  const assetsToCopy = [
    'favicon.png',
    'icon.png',
    'splash-icon.png',
    'adaptive-icon.png',
    'manifest.json',
    'robots.txt',
    'sitemap.xml'
  ];

  assetsToCopy.forEach(asset => {
    const sourcePath = path.join(sourceDir, asset);
    const destPath = path.join(destDir, asset);
    
    if (fs.existsSync(sourcePath)) {
      fs.copySync(sourcePath, destPath);
      console.log(`Copied ${asset} to dist folder`);
    }
  });

  console.log('Production build is ready in the "dist" folder');
  console.log('To serve it, run: node serve-dist.js');
});