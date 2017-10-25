import React from 'react';
import Header from './components/Header';

const Main = props => {
  return (
    <div>
      <Header />
      <div className="container">{props.children}</div>
    </div>
  );
};

Main.displayName = 'Main';

export default Main;
