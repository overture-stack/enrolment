import React, { Component } from 'react';
import { renderRoutes } from 'react-router-config';

import '../../assets/style/style.scss';

class App extends Component {
  static displayName = 'App';

  render() {
    const { route } = this.props;

    return <div className="app">{renderRoutes(route.routes)}</div>;
  }
}

export default App;
