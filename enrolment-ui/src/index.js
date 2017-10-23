import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './modules/App';
import registerServiceWorker from './registerServiceWorker';

import './services';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
