import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
// Add polyfill for Node.js globals
if (typeof global === 'undefined') {
    global = window;
}

ReactDOM.createRoot(document.getElementById('root')).render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
)
