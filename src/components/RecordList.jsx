import React, { Component } from 'react';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import _ from 'lodash';

import Record from './Record';

const styles = {
  headers: {
    paddingLeft: '25%'
  },
}

class RecordList extends Component {
  render () {
    return (
      <Table>
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn>Nombre</TableHeaderColumn>
            <TableHeaderColumn>Fecha y hora</TableHeaderColumn>
            <TableRowColumn style={styles.headers}>Action</TableRowColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {_.map(this.props.records, (r, id) => (
              <Record
                onDelete={this.props.onDelete.bind(this)}
                key={id}
                record={r}
                user={this.props.user}
                onModify={this.props.onModify.bind(this)}
              />
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default RecordList;