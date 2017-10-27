import React from 'react';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import Header from './components/Header';

const Main = props => {
  const { route } = props;
  return (
    <div>
      <Header />
      <div className="container">{renderRoutes(route.routes)}</div>
    </div>
  );
};

Main.displayName = 'Main';

export default withRouter(Main);
