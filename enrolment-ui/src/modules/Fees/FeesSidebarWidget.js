import React from 'react';
import { translate, Trans } from 'react-i18next';

import './feesSidebarWidget.scss';

const FeesSidebarWidget = props => {
  const { vCPU = '0.03', gbHour = '0.000067' } = props;

  return (
    <Trans i18nKey="FeesSidebarWidget" className="feesSidebarWidget">
      <h3>Fees for using the Collaboratory Resources</h3>
      <p>
        <span>${vCPU} CAD</span> per vCPU hour
      </p>
      <p>
        <span>${gbHour} CAD</span> per GB hour of storage (volumes, images and object storage)
      </p>
    </Trans>
  );
};

FeesSidebarWidget.displayName = 'FeesSidebarWidget';

export default translate()(FeesSidebarWidget);
