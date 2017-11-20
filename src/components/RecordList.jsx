import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from 'material-ui/Table';

import _ from 'lodash';

import Record from './Record';

class RecordList extends Component {
  render () {
    return (
      <div style={{padding: 25}}>
        <Paper zDepth={4}>
          <Table>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn><b><big>Nombre</big></b></TableHeaderColumn>
                <TableHeaderColumn><b><big>Fecha y hora</big></b></TableHeaderColumn>
                <TableHeaderColumn></TableHeaderColumn>
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
        </Paper>
      </div>
    );
  }
}

export default RecordList;