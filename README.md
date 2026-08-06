# CheddarButlerChef
An app to get suggestions of recipes based on user defined ingredients. Powered by OpenAI.

## Features
- Enter ingredients to get recipe suggestions with ingredients and steps
- Hover over suggested recipes to see details
- Save recipes to your library
- Expand saved recipes to view full details
- Add custom tags to organize your recipes

## Quick Start

### Backend
```bash
cd backend
npm install
node index.js  # Runs on port 3005
```

### Frontend
```bash
cd frontend
npm install
npm start  # Runs on port 3006
```

Note: If you encounter OpenSSL errors with Node.js 22+, the build script includes `--openssl-legacy-provider` automatically.

![App Screenshot](/multimedia/screenshot.PNG)