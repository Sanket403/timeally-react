import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Info from './Info';
import New from './New';
import View from './View/View';
import PETId from './View/PETId/PETId';
import Deposit from './View/Deposit/Deposit';

// import './PET.css';

class PET extends Component {
  render() {
    return (
      <>
        <Route path ="/pet" exact component={Info} />

        <Route path ="/pet/new" exact component={New} />

        <Route path ="/pet/view" exact component={View} />

        <Route path ="/pet/view/:id" exact component={PETId} />

        <Route path ="/pet/view/:id/deposit/" exact component={Deposit} />
      </>
    );
  }
};

export default PET;
