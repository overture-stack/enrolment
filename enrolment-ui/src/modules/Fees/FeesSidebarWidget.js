import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation, Trans } from 'react-i18next';

import { getFees } from './redux';

import './feesSidebarWidget.scss';

class FeesSidebarWidget extends Component {
  static displayName = 'FeesSidebarWidget';

  constructor(props) {
    super(props);

    // Get initial data
    this.fetchNewData = this.fetchNewData.bind(this);
    this.fetchNewData();
  }

  fetchNewData() {
    this.props.getFees();
  }

  onLoading() {
    return <p>Loading Fees ...</p>;
  }

  onError() {
    return <p>Fees API Unavailable ...</p>;
  }

  render() {
    const { loading, error, data } = this.props.fees;

    if (loading === true || !data) return this.onLoading();

    if (error) return this.onError(error);

    const { cpuPrice, volumePrice } = data;

    return (
      <Trans i18nKey="FeesSidebarWidget" className="feesSidebarWidget">
        <h3>Fees for using the Collaboratory Resources</h3>
        <p>
          <span>${{ cpuPrice }} CAD</span> per vCPU hour
        </p>
        <p>
          <span>${{ volumePrice }} CAD</span> per GB hour of storage (volumes, images and object
          storage)
        </p>
      </Trans>
    );
  }
}

const mapStateToProps = state => {
  return {
    fees: state.fees,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getFees: () => getFees(dispatch),
  };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(FeesSidebarWidget));
