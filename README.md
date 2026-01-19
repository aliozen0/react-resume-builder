# Modern CV Maker

A sleek, react-based resume builder application designed to create professional, A4-printable CVs with ease. It features a real-time preview, dark/light mode, and a drag-and-drop editor.

![CV Maker Preview](./public/preview.png)
*(Note: Add a screenshot of the app here)*

## ✨ Features

- **Real-Time Preview**: See your changes instantly as you type.
- **A4 Print Optimized**: content is automatically formatted to fit standard A4 paper with professional margins (`2cm`).
- **Drag & Drop Reordering**: Easily reorder your resume sections (Education, Experience, etc.) to suit your needs.
- **Dark/Light Mode**: A comfortable editing experience with a built-in theme toggle.
- **Privacy Focused**: All data lives locally in your browser session. No database, no accounts.
- **PDF Export**: One-click download to save your CV as a high-quality PDF.

## 🛠️ Tech Stack

- **React 18**: Core UI library.
- **Vite**: Ultra-fast build tool and dev server.
- **Lucide React**: Beautiful, consistent icons.
- **@dnd-kit**: Reliable drag-and-drop interactions.
- **CSS3 Usage**: Modern CSS variables for theming and print media queries for perfect PDF output.

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

- Node.js (v16 or higher)
- npm (or yarn/pnpm)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/StartYourFork/cv-maker.git
    cd cv-maker
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open your browser:**
    Visit `http://localhost:5173` to start building your CV.

## 📦 Building for Production

To create a production-ready build:

```bash
npm run build
```

This will generate a `dist` folder containing the optimized static assets, ready for deployment on Netlify, Vercel, or GitHub Pages.

## 🎨 Customization

### Themes
You can adjust the theme colors in `src/index.css` by modifying the CSS variables under `:root` (for dark mode) and `[data-theme="light"]`.

### Fonts
The application uses **Inter** for the UI and **Merriweather** for the Resume paper. You can change these imports in `index.css`.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
