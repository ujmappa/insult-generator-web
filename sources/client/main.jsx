import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Only the weights actually used, and only the latin(+ext) subsets needed for Hungarian accents.
import '@fontsource/alegreya/latin-800.css';
import '@fontsource/alegreya/latin-ext-800.css';
import '@fontsource/alegreya/latin-500-italic.css';
import '@fontsource/alegreya/latin-ext-500-italic.css';
import '@fontsource/alegreya-sans/latin-400.css';
import '@fontsource/alegreya-sans/latin-ext-400.css';
import '@fontsource/alegreya-sans/latin-500.css';
import '@fontsource/alegreya-sans/latin-ext-500.css';
import '@fontsource/alegreya-sans/latin-700.css';
import '@fontsource/alegreya-sans/latin-ext-700.css';
import './index.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<App />
	</StrictMode>
);
