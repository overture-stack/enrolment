import { Component } from 'react';
import { renderRoutes } from 'react-router-config';

import './app.scss';

class App extends Component {
  static displayName = 'App';

  render() {
    const { route } = this.props;

    return renderRoutes(route.routes);
  }
}

export default App;
