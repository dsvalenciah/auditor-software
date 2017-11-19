import React, { Component } from 'react';

import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';
import { TableRow, TableRowColumn } from 'material-ui/Table';

import DataInput from './DataInput';

const styles = {
  actionButtons: {
    paddingLeft: '55%'
  },
  'actionButton': {
    marginRight: 20
  }
}

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
      <TableRow>
        <TableRowColumn>{this.props.record.name}</TableRowColumn>
        <TableRowColumn>{this.props.record.date}</TableRowColumn>
        <TableRowColumn>
          <div style={styles.actionButtons}>
            <IconButton>
              <SvgIcon>
                <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </SvgIcon>
            </IconButton>
            <IconButton
              onClick={this.changeCircleActive.bind(this)}
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
            <IconButton
              onClick={() => {this.props.onDelete(this.props.record.uid)}}
            >
              <SvgIcon>
                <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </SvgIcon>
            </IconButton>
          </div>
        </TableRowColumn>
      </TableRow>
    );
  }
}

export default Record;
