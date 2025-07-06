import React from 'react';

interface HelloWorldProps {
  title?: string;
}

const HelloWorld: React.FC<HelloWorldProps> = ({ title = "App Script Build Script" }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center text-white mb-12">
          <h1 className="text-6xl font-bold mb-4 drop-shadow-lg">
            {title}
          </h1>
          <p className="text-xl opacity-90">
            A simple website having any easy deploy script for Google Apps Script
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
              <h2 className="text-4xl font-bold mb-4">Hello World! 👋</h2>
              <p className="text-lg opacity-90">
                This is a modern, responsive web application built with React and styled with TailwindCSS.
              </p>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-xl">⚛️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">React</h3>
                  <p className="text-gray-600">
                    Modern JavaScript library for building user interfaces with components.
                  </p>
                </div>

                <div className="bg-cyan-50 p-6 rounded-xl border border-cyan-100">
                  <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🎨</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">TailwindCSS</h3>
                  <p className="text-gray-600">
                    Utility-first CSS framework for rapidly building custom user interfaces.
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🚀</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Google Apps Script</h3>
                  <p className="text-gray-600">
                    Cloud-based JavaScript platform for integrating with Google Workspace.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Interactive Demo</h3>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-md">
                    Click Me! 🎯
                  </button>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-md">
                    Try This! ✨
                  </button>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-md">
                    And This! 🌟
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="text-center text-white mt-12 opacity-75">
          <p>Built with ❤️ using React, TailwindCSS, and Google Apps Script</p>
        </footer>
      </div>
    </div>
  );
};

export default HelloWorld;
