
// Polyfill for AWS Cognito which expects 'global' to be defined
window.global = window;
// @ts-ignore - Simplified process polyfill for AWS Cognito
window.process = { env: { DEBUG: undefined } } as any;

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
