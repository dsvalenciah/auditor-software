import React, { Component } from 'react';

import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import {brown300, blueGrey300} from 'material-ui/styles/colors';

import DataInput from './DataInput';

class Record extends Component {
  constructor() {
    super();
    this.state = {
      circleActive: false
    };
  }

  changeCircleActive(event) {
    let circleActiveTemp = this.state.circleActive;
    this.setState({circleActive: !circleActiveTemp});
  }

  recordModify(record) {
    this.props.onModify(record);
    this.changeCircleActive();
  }

  render () {
    return (
      <TableRow style={{background: this.props.record.complete?blueGrey300:brown300}}>
        <TableRowColumn>{this.props.record.name}</TableRowColumn>
        <TableRowColumn>{this.props.record.date}</TableRowColumn>
        <TableRowColumn>
          <div>
            <IconButton
              onClick={() => {this.props.onDelete(this.props.record.uid)}}
              style={{float: 'right'}}
            >
              <SvgIcon>
                <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </SvgIcon>
            </IconButton>
            <IconButton
              onClick={this.changeCircleActive.bind(this)}
              style={{float: 'right'}}
            >
              <SvgIcon>
                <path d="M17.75 7L14 3.25l-10 10V17h3.75l10-10zm2.96-2.96c.39-.39.39-1.02 0-1.41L18.37.29c-.39-.39-1.02-.39-1.41 0L15 2.25 18.75 6l1.96-1.96z" /><path fillOpacity=".36" d="M0 20h24v4H0z" />
              </SvgIcon>
              <DataInput
                record={this.props.record}
                visible={this.state.circleActive}
                onModify={(record) => {this.recordModify(record)}}
                user={this.props.user}
              />
            </IconButton>
          </div>
        </TableRowColumn>
      </TableRow>
    );
  }
}

export default Record;
