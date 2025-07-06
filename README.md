# Google Apps Script React Web Application

A modern Google Apps Script web application built with React, TypeScript, and TailwindCSS. This project provides a complete development setup with hot reloading for local development and automated deployment to Google Apps Script.

## 🚀 Features

- **React + TypeScript**: Modern frontend development with full type safety
- **TailwindCSS**: Utility-first CSS framework for rapid UI development
- **Hot Reload Development**: Local development server with automatic rebuilding
- **Automated Build Process**: Rollup-based build system optimized for Google Apps Script
- **One-Command Deployment**: Deploy to Google Apps Script with a single command
- **Google Apps Script Integration**: Seamless integration with Google Workspace

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

### Manual Deployment Steps

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Push to Google Apps Script**
   ```bash
   npm run clasp:push
   ```

3. **Deploy the web app**
   ```bash
   npm run clasp:deploy
   ```

4. **Open the web app**
   ```bash
   npm run clasp:open
   ```

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

## 🎨 Customization

### Styling

The project uses TailwindCSS for styling. You can:
- Modify `tailwind.config.js` to customize the design system
- Edit component styles in the React components
- Add custom CSS in `src/Client/styles.css`

### React Components

- Main component: `src/Client/components/HelloWorld.tsx`
- Add new components in the `src/Client/components/` directory
- Update the main app in `src/Client/index.tsx`

### Google Apps Script Functions

- Server-side functions: `src/Server/server.js`
- Apps Script configuration: `src/appsscript.json`

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Built with ❤️ using React, TailwindCSS, and Google Apps Script