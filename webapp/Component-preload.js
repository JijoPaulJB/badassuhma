# .cfignore for SAP UI5 CF Deployment
# Ignore files/folders not needed in Cloud Foundry buildpack deployment

# Node.js build output (UI5 Tooling, npm, etc.)
node_modules/
dist/
coverage/
.DS_Store
*.log
*.tmp
*.bak

# SAP Web IDE/Neo artifacts
neo-app.json
*.che/
*.project
*.settings/
*.idea/
*.classpath
*.factorypath
*.vscode/

# Local mock data
localService/
model/provision.json
revenue_data.json

# UI5 Preload bundles (should be generated in CF build, not committed)
Component-preload.js

# Ignore test files
/test/
/test-resources/

# Ignore source maps
*.map

# Ignore OS-specific files
Thumbs.db

# Ignore environment files
.env
.env.*

# Ignore build scripts
scripts/

# Ignore manifest from Neo
manifest.yml