import React, { Suspense } from 'react';
import './app.scss';

const App = props => (
    <Suspense fallback="Loading...">
        {props.children}
    </Suspense>
);

App.displayName = 'App';

export default App;
