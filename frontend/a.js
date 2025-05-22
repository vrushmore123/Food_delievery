import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const structure = {
  public: {},
  src: {
    assets: {},
    components: {
      "Header.jsx": "",
      "Footer.jsx": "",
      "RestaurantCard.jsx": ""
    },
    pages: {
      "Home.jsx": "",
      "Login.jsx": "",
      "Register.jsx": "",
      "RestaurantMenu.jsx": "",
      "Cart.jsx": "",
      "OrderStatus.jsx": ""
    },
    services: {
      "authService.js": "",
      "orderService.js": "",
      "restaurantService.js": ""
    },
    context: {},
    "App.jsx": "",
    "main.jsx": "",
    "routes.jsx": ""
  },
  ".env": "VITE_API_URL=http://localhost:8000/api",
  "package.json": `{
  "name": "food-delivery-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}`,
  "vite.config.js": `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
});`
};

function createRecursive(basePath, obj) {
  for (const key in obj) {
    const fullPath = path.join(basePath, key);
    if (typeof obj[key] === "object") {
      fs.mkdirSync(fullPath, { recursive: true });
      createRecursive(fullPath, obj[key]);
    } else {
      fs.writeFileSync(fullPath, obj[key]);
    }
  }
}

createRecursive(__dirname, structure);

console.log("✅ Frontend folder structure created successfully.");
