const fs = require("fs");
const path = require("path");

const structure = {
  app: {
    api: {
      v1: {
        endpoints: {
          "auth.py": "",
          "users.py": "",
          "restaurants.py": "",
          "orders.py": "",
          "menu.py": ""
        },
        "__init__.py": ""
      },
      "__init__.py": ""
    },
    core: {
      "config.py": "",
      "security.py": "",
      "__init__.py": ""
    },
    models: {
      "user.py": "",
      "order.py": "",
      "restaurant.py": "",
      "menu_item.py": "",
      "__init__.py": ""
    },
    schemas: {
      "user.py": "",
      "order.py": "",
      "restaurant.py": "",
      "menu_item.py": "",
      "__init__.py": ""
    },
    services: {
      "order_service.py": ""
    },
    db: {
      "session.py": "",
      "init_db.py": ""
    },
    "main.py": "",
    "__init__.py": ""
  },
  tests: {
    "test_users.py": "",
    "test_orders.py": "",
    "README.md": "# Add your test descriptions here"
  },
  "requirements.txt": "",
  alembic: {}
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

// Start from current directory (backend)
createRecursive(process.cwd(), structure);

console.log("✅ Backend folder structure created successfully.");
