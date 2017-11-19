import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

import DataInput from './components/DataInput';
import RecordList from './components/RecordList';

import _ from 'lodash';

import FirebaseService from './services/firebase';

class App extends Component {
  constructor() {
    super();
    this.firebaseService = new FirebaseService();
    this.state = {
      records: [],
      dataInputOpen: false,
      name: 'Mauro',
      user: null
    };
  }

  componentWillMount(){
    if (this.user) {
      this.firebaseService.getUserRecords(
        (records) => {
          this.setState({
            records: _.filter(records, value => { return value; })
          })
        }
      );
    }

    this.firebaseService.getUser((user) => this.setState({user}));
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
    if (this.state.user) {
      return (
        <div>
        <img width="100" src={this.state.user.photoURL} alt={this.state.user.displayName} />
        <p>Hola {this.state.user.uid}!</p>
        <button
          onClick={this.firebaseService.handleLogout}
        >Salir</button>
        </div>
      );
    } else {
      return (
        <div>
        <RaisedButton
          label="Login"
          onClick={this.firebaseService.handleAuth}
          fullWidth={true}
        />
        </div>
      )
    }
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          {this.state.user?(
            <div>
            <RecordList
              records={this.state.records}
              onDelete={this.deleteRecord.bind(this)}
              onModify={this.modifyRecord.bind(this)}
              user={this.state.user}
            />
            <center>
              <RaisedButton
                label="Añadir nuevo reporte"
                onClick={() => {this.setState({dataInputOpen: true});}}
                fullWidth={true}
              />
            </center>
            <DataInput
              onAddRecord={this.addRecord.bind(this)}
              visible={this.state.dataInputOpen}
              user={this.state.user}
            />
            </div>
          ) : (
           ""
          )}
          {this.loginButton()}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
