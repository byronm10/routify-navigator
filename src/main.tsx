
// Polyfill for AWS Cognito which expects 'global' to be defined
window.global = window;
window.process = { env: { DEBUG: undefined } };

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
