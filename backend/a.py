import os

folders = [
    "app/routers",
    "app/routers/vendor",
    "app/routers/customer",
]

for folder in folders:
    init_path = os.path.join(folder, "__init__.py")
    if not os.path.exists(init_path):
        with open(init_path, "w") as f:
            f.write("# Init file for package\n")
        print(f"✅ Created: {init_path}")
    else:
        print(f"✔️ Already exists: {init_path}")
