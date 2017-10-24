import { Component } from 'react';
import { object } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

import routes from './routes';

class RouteLoader extends Component {
  static displayName = 'RouteLoader';

  static contextTypes = {
    store: object,
  };

  static propTypes = {
    location: object.isRequired,
  };

  render() {
    return renderRoutes(routes);
  }
}

export default withRouter(RouteLoader);
