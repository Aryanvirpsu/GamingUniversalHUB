# 🎮 Universal Gaming Hub

A **cross-platform desktop launcher** that unifies all your PC games and launchers — built using
**[Tauri v2 RC18](https://tauri.app/)**, **[Vite](https://vitejs.dev/)**, and **React**.

---

## 🚀 Tech Stack

| Layer            | Tool                           | Purpose                               |
| :--------------- | :----------------------------- | :------------------------------------ |
| Frontend         | **Vite + React**         | Lightning-fast UI development         |
| Backend (Native) | **Tauri v2 RC18 (Rust)** | Lightweight, secure desktop container |
| Language         | **JavaScript / Rust**    | Hybrid development                    |
| Package Manager  | **npm**                  | Dependency management                 |
| Platform         | **Windows 10 / 11**      | Primary development OS                |

---

## 🛠️ Setup & Installation

### Prerequisites

Make sure you have the following installed:

- **Node.js 22.12+**
- **Rust toolchain** (install via [rustup.rs](https://rustup.rs/))
- **Tauri CLI**
  ```bash
  npm install -g @tauri-apps/cli
  ```

````

### Clone the repository

```bash
git clone https://github.com/Aryanvirpsu/GamingUniversalHUB.git
cd GamingUniversalHUB
npm install
```

---
Database password
B1GB00B$LovER69

## 💻 Run the App (Development Mode)

Start both the Vite dev server and the Tauri window:

```bash
npx tauri dev
```

This opens a **native desktop window** running your React frontend inside the Tauri shell.

---

## 🏗️ Build for Production

Generate a distributable `.exe` for Windows:

```bash
npx tauri build
```

The output will appear in:

```
src-tauri/target/release/bundle/
```

---

## 📁 Project Structure

```
universal-gaming-hub/
├── src/                # React source
├── src-tauri/          # Tauri (Rust) backend
│   ├── tauri.conf.json
│   ├── Cargo.toml
│   └── icons/
├── dist/               # Production build output
├── package.json
├── vite.config.js
└── README.md
```

------

## 🧩 Roadmap

* 🎮 Integrate Steam / Epic / GOG launcher detection
* 💰 Unified wallet management
* ☁️ Cloud-based settings sync
* 🧠 Intelligent game recommendations
* 🎨 Customizable themes & dashboard

---

## 🧑‍💻 Author

**Aryan Vir**
Student @ *The Pennsylvania State University*

> *Building secure, aesthetic, cross-platform tools.*

---

## 🪶 License

This project is released under the **MIT License**.
See the [LICENSE](LICENSE) file for more information.

````

---

✅ Just copy all of the above into your local `README.md` file.
Then run:

```bash
git add README.md
git commit -m "Add full project README"
git push
```
