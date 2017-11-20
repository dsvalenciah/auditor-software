import React, { Component } from 'react';

import {grey900, grey500, blueGrey500, blueGrey700, blueGrey300} from 'material-ui/styles/colors';

import Reorder from 'material-ui/svg-icons/action/reorder';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';

import DataInput from './components/DataInput';
import RecordList from './components/RecordList';

import _ from 'lodash';

import FirebaseService from './services/firebase';

class Logged extends Component {
  render() {
    return (
      <IconMenu
        iconButtonElement={
          <IconButton><Reorder /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem
          primaryText="Sign out"
          onClick={this.props.onSesionChange.bind(this)}
        />
        <MenuItem
          primaryText="Añadir reporte"
          onClick={this.props.onReportClick.bind(this)}
        />
      </IconMenu>
    );
  }
}

class Login extends Component {
  render() {
    return (
      <IconMenu
        iconButtonElement={
          <IconButton><Reorder /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem primaryText="Log In" onClick={this.props.onSesionChange.bind(this)}/>
      </IconMenu>
    )
  };
}

const muiTheme = getMuiTheme({
  raisedButton: {
    color: grey900,
    textColor: blueGrey300,
    primaryColor: grey900,
    primaryTextColor: grey900,
    secondaryColor: grey900,
    secondaryTextColor: grey900,
  },
  radioButton: {
    checkedColor: grey900,
  },
  palette: {
    textColor: grey900,
  },
  appBar: {
    height: 50,
    color: blueGrey500
  },
  tableHeader: {
    borderColor: grey900,
  },
  table: {
    backgroundColor: blueGrey300,
  },
  tableHeaderColumn: {
    textColor: grey900,
  },
  iconMenu: {
    color: grey500,
    backgroundColor: grey500,
  },
  textField: {
    textColor: grey900,
    hintColor: grey900,
    floatingLabelColor: grey900,
    focusColor: blueGrey500,
  }
});

class App extends Component {
  constructor() {
    super();
    this.firebaseService = new FirebaseService();
    this.state = {
      records: [],
      dataInputOpen: false,
      name: 'Mauro',
      user: null,
      refreshed: false
    };
  }

  getUserRecords() {
    if (this.state.user) {
      this.firebaseService.getUserRecords(
          this.state.user.uid,
          (records) => {
          this.setState({
            records: _.filter(records, value => { return value; })
          }, this.setState({refreshed: true}))
        }
      );
    }
  }

  componentWillMount(){
    this.firebaseService.getUser((user) => this.setState({user}, () => {this.getUserRecords()}));
  }

  addRecord(record) {
    if (record) {
      let recordsTemp = this.state.records;
      recordsTemp.push(record);
      this.setState({ records: recordsTemp});
      /* firebase call */
      this.firebaseService.setUserRecord(this.state.user.uid, record.uid, record);
    }
    this.setState({dataInputOpen: false});
  }

  deleteRecord(uid) {
    let recordsTemp = this.state.records;
    recordsTemp = recordsTemp.filter(u => u.uid !== uid);
    this.setState({records: recordsTemp});
    /* firebase call */
    this.firebaseService.deleteUserRecord(this.state.user.uid, uid);
  }

  modifyRecord(newRecord) {
    if (newRecord) {
      let recordsTemp = this.state.records;
      let recordIndex = recordsTemp.findIndex(d => d.uid === newRecord.uid);
      recordsTemp[recordIndex] = newRecord;
      this.setState({records: recordsTemp});
      /* firebase call */
      this.firebaseService.setUserRecord(this.state.user.uid, newRecord.uid, newRecord);
    }
    this.setState({dataInputOpen: false});
  }


  loginButton(){
    return (
      <div>
        <AppBar
          title={this.state.user?this.state.user.displayName:<p></p>}
          iconElementLeft={
            this.state.user?(
              <Avatar src={this.state.user.photoURL} />
            ) : (
              <p>Auditor Software</p>
            )
          }
          iconElementRight={
            this.state.user?(
              <Logged
                onSesionChange={this.firebaseService.handleLogout}
                onReportClick={() => {this.setState({dataInputOpen: true});}}
              />
            ) : (
              <Login onSesionChange={this.firebaseService.handleAuth}/>
            )
          }
        />
      </div>
    );
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
        <div>
          {this.loginButton()}
          {this.state.user?(
            <div>
              <DataInput
                onAddRecord={this.addRecord.bind(this)}
                visible={this.state.dataInputOpen}
                user={this.state.user}
              />
              {this.state.refreshed?(
                <RecordList
                  records={this.state.records}
                  onDelete={this.deleteRecord.bind(this)}
                  onModify={this.modifyRecord.bind(this)}
                  user={this.state.user}
                />
              ) : (
              <div><center>
                <CircularProgress size={50} thickness={5} color={blueGrey700}/>
              </center></div>
              )}
            </div>
          ) : (
           ""
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
