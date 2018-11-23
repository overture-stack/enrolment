import React from 'react';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const NoProjectUsers = props => {
  return (
    <div className="container">
      <div className="inner">
        <div className="row">
          <div className="col-md-12">
            <h2>Currently No Users in the Project.</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

const PTUserDetails = props => {
  const { hasProjectUsers, data } = props.projectUsers;

  if (!hasProjectUsers) return <NoProjectUsers />;

  return (
    <div className="container">
      <div className="inner">
        <div className="row">
          <div className="col-md-12">
            <h2>Manage Users</h2>
            <BootstrapTable data={data} striped={true} hover={true}>
              <TableHeaderColumn isKey={true} dataField="daco_email">
                Email
              </TableHeaderColumn>
              <TableHeaderColumn dataField="firstname">Name</TableHeaderColumn>
              <TableHeaderColumn dataField="institution_name">Institute</TableHeaderColumn>
              <TableHeaderColumn dataField="institution_email">
                Institutional Email
              </TableHeaderColumn>
              <TableHeaderColumn dataField="status">Status</TableHeaderColumn>
            </BootstrapTable>
          </div>
        </div>
      </div>
    </div>
  );
};

PTUserDetails.displayName = 'PTUserDetails';

const mapStateToProps = state => {
  return {
    projectUsers: state.projectUsers,
  };
};

export default connect(
  mapStateToProps,
  null,
)(PTUserDetails);
