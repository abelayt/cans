import React, { Component, Fragment } from 'react';
import PageHeader from '@cwds/components/lib/PageHeader';
import Header from './components/Header';
import { Page } from './components/Layout';
import { BrowserRouter } from 'react-router-dom'

import './style.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <Header />
          <PageHeader title="CANS Assessment Application" />
          <Page />
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
