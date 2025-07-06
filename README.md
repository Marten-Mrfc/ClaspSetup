# Google Apps Script React Web Application

A modern Google Apps Script web application built with React, TypeScript, and TailwindCSS. This project provides a complete development setup with hot reloading for local development and automated deployment to Google Apps Script.

-# Summer of making look at the bottom of this readme!

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Google Apps Script CLI (clasp)](https://github.com/google/clasp)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ClaspSetup
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install and setup Google Apps Script CLI**
   ```bash
   npm install -g @google/clasp
   clasp login
   ```

## 🔧 Configuration

1. **Create a new Google Apps Script project** (if you don't have one)
   ```bash
   npm run clasp:create
   ```

2. **Update the script ID** in `.clasp.json` if using an existing project

## 🏃‍♂️ Development

### Local Development Server

Start the development server with hot reloading:

```bash
npm run dev
```

This will:
- Build the project
- Start a local server at `http://localhost:3000`
- Watch for file changes and automatically rebuild
- Auto-refresh the browser when changes are detected

### Build for Production

Build the project for deployment:

```bash
npm run build
```

### Preview Production Build

Build and serve the production version locally:

```bash
npm run preview
```

## 🚀 Deployment

### Quick Deploy

Deploy everything with one command:

```bash
npm run deploy
```

This will:
- Build the project
- Push files to Google Apps Script
- Create a new deployment
- Open the web app in your browser

## 📁 Project Structure

```
ClaspSetup/
├── src/
│   ├── Client/
│   │   ├── components/
│   │   │   └── HelloWorld.tsx     # Main React component
│   │   ├── index.html             # HTML template
│   │   ├── index.tsx              # React app entry point
│   │   └── styles.css             # TailwindCSS imports
│   ├── Server/
│   │   └── server.js              # Google Apps Script server functions
│   └── appsscript.json            # Apps Script configuration
├── build/                         # Built files (auto-generated)
├── .clasp.json                    # Google Apps Script project config
├── rollup.config.js               # Build configuration
├── tailwind.config.js             # TailwindCSS configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Project dependencies and scripts
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build the project for production |
| `npm run dev` | Start development server with hot reload |
| `npm run deploy` | Full deployment pipeline |
| `npm run preview` | Build and serve production version locally |
| `npm run clasp:login` | Login to Google Apps Script |
| `npm run clasp:create` | Create new Apps Script project |
| `npm run clasp:push` | Push files to Apps Script |
| `npm run clasp:deploy` | Deploy the web app |
| `npm run clasp:open` | Open the web app in browser |

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript
- **Styling**: TailwindCSS, PostCSS, Autoprefixer
- **Build System**: Rollup, Various Rollup plugins
- **Development**: Custom dev server with hot reload
- **Deployment**: Google Apps Script CLI (clasp)
- **Code Quality**: ESLint, TypeScript strict mode

## 📝 Development Notes

### Hot Reload Development

The development server (`simple-dev-server.js`) provides:
- File watching and automatic rebuilds
- Live browser refresh
- Proper content type serving
- Build status tracking

### Build Process

The build process (`rollup.config.js`):
- Bundles React app into a single JavaScript file
- Processes TailwindCSS and inlines styles
- Copies server files and configuration
- Generates a complete HTML file for Google Apps Script

### Google Apps Script Integration

- The `doGet()` function serves the main HTML file
- All assets are inlined for Google Apps Script compatibility
- No external dependencies in the final build

## 🐛 Troubleshooting

### Common Issues

1. **Build fails**: Make sure all dependencies are installed with `npm install`
2. **Clasp authentication**: Run `clasp login` to authenticate with Google
3. **Permission errors**: Ensure your Google account has access to Google Apps Script
4. **Hot reload not working**: Check if port 3000 is available

### Getting Help

- Check the build output for specific error messages
- Ensure your `.clasp.json` has the correct script ID
- Verify your Google Apps Script project permissions

## 📄 License

This project is licensed under the MIT License.

## ☀️ Summer of making

So for work I often need to setup a google app script project using html and js. I hated that. I found clasp and it is fine and easy but it didn't really have a good pre-built setup. Like you can't use external code languages and have a some what hot-reloading.
I Created a simple system that makes it possible to run a dev server and:
#### Easy deploy
With only `npm run deploy`. It will build, push, deploy and open the site for you. Instead of needing to run 3 manual commands and than manually deploy and open via the app script site.

#### AI
Most of this code is made with AI but it has been customized so that it fits what I personally wanted it to look like.(Inspiration from the docusaurus build steps)

Thank you for taking the time to read this (:
---

Built with ❤️ using React, TailwindCSS, and Google Apps Script
