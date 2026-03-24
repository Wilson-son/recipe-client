

# 🍽️ Recipe App - Frontend

A modern recipe sharing web app built with React, Tailwind CSS, and Vite.

## 🔗 Links

- **Live Demo:** [recipe-app-wheat-kappa.vercel.app](https://recipe-app-wheat-kappa.vercel.app)
- **Backend Repo:** [github.com/Wilson-son/recipe-server](https://github.com/Wilson-son/recipe-server)

## 🛠️ Tech Stack

- **Framework:** React.js
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Icons:** Lucide React

## ✨ Features

- Browse and search recipes
- User registration and login
- Add and share your own recipes
- Upload recipe images
- Save favourite recipes
- Leave reviews and ratings
- Responsive design for all devices

## 📁 Folder Structure

```
recipe-app-frontend/
├── public/
├── src/
│   ├── components/
│   │   └── RecipeCard.jsx
│   ├── data/
│   │   └── recipes.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Browse.jsx
│   │   ├── AddRecipe.jsx
│   │   └── Profile.jsx
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Wilson-son/recipe-client.git
cd recipe-client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create a `.env` file
```
VITE_API_URL=http://localhost:5000
```

### 4. Run the app
```bash
npm run dev
```

App runs on `http://localhost:5173`

## 🌐 Deployment

Deployed on **Vercel** - [vercel.com](https://vercel.com)





# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
