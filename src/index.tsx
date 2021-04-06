import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';

import * as tauri from 'tauri/api/tauri'

(window as any).receiveVectors = console.log;

window.addEventListener("click", () => {
	tauri.promisified({
		cmd: "transferVectors",
		callback: 'receiveVectors',
		error: 'receiveVectors'
	}).then(() => {});
});

ReactDOM.render(
	<React.StrictMode>
		{/*<App />*/}
	</React.StrictMode>,
	document.getElementById('root')
);

reportWebVitals();
