#!/bin/bash
# Root Directory Sterilization Script for Jekyll Migration

# 1. Create necessary directory structures
mkdir -p assets/images/
mkdir -p assets/css/
mkdir -p assets/js/
mkdir -p vendor/
mkdir -p _layouts
mkdir -p _includes
mkdir -p _projects
mkdir -p _art
mkdir -p _models
mkdir -p _sass

# 2. Move visual assets from root to assets/images/
mv *.jpg *.jpeg *.png *.gif *.svg assets/images/ 2>/dev/null

# 3. Move .css and .js files to assets/css/ and assets/js/
mv *.css assets/css/ 2>/dev/null
mv *.js assets/js/ 2>/dev/null

# 4. Move third-party zip files to vendor/
mv *.zip vendor/ 2>/dev/null

# 5. Move specific files that were noted as out of place
mv "Google Font info.txt" assets/ 2>/dev/null

echo "Repository sterilization complete. Assets have been relocated."
