const fs = require('fs');
const path = require('path');

// Create upload directories
const uploadDirs = [
  'uploads',
  'uploads/profile-pictures',
  'uploads/reports',
];

uploadDirs.forEach((dir) => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
});

console.log('Setup complete!');

