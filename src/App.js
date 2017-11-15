import React, { Component } from 'react';

import _ from 'lodash';

import uuidv4 from 'uuid/v4';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import RadioButton from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import SvgIcon from 'material-ui/SvgIcon';
import Dialog from 'material-ui/Dialog';
import * as firebase from 'firebase'

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const config = {
  apiKey: "AIzaSyDc6Gy0dfk1EYIroZDut19LqQtA1J3fUM8",
  authDomain: "auditoria-e8b99.firebaseapp.com",
  databaseURL: "https://auditoria-e8b99.firebaseio.com",
  projectId: "auditoria-e8b99",
  storageBucket: "auditoria-e8b99.appspot.com",
  messagingSenderId: "555225710531"
};
firebase.initializeApp(config);

const styles = {
  actionButtons: {
    paddingLeft: '55%'
  },
  headers: {
    paddingLeft: '25%'
  },
  block2: {
    margin: 10,
  },
  'actionButton': {
    marginRight: 20
  }
}

const staticQuestions = [
  "¿Los sitemas operativos tienen licencia vigente?",
  "¿hojas de vida de personal?",
  "¿Extintores de socaflan?",
  "¿Cuentan con mapa de salidad de emergencia?",
  "¿Politicas de manejo de información?",
  "¿Acceso de personal al centro de computo?",
  "¿Cada cuanto se realiza backups?",
];


class App extends Component {
  constructor() {
    super();
    this.state = {
      records: [],
      dataInputOpen: false,
      name: 'Mauro'
    };
  }

  addRecord (record) {
    if (record) {
      let recordsTemp = this.state.records;
      recordsTemp.push(record);

      this.setState({ records: recordsTemp});
    }
    this.setState({dataInputOpen: false});
  }

  deleteRecord(uuid) {
    let recordsTemp = this.state.records;
    recordsTemp = recordsTemp.filter(u => u.uuid !== uuid);
    this.setState({records: recordsTemp});
  }

  modifyRecord(newRecord) {
    if (newRecord) {
      let recordsTemp = this.state.records;

      let recordIndex = recordsTemp.findIndex(d => d.uuid === newRecord.uuid);

      recordsTemp[recordIndex] = newRecord;

      this.setState({records: recordsTemp});
    }
    this.setState({dataInputOpen: false});
  }

  componentWillMount() {
   const nameRef = firebase.database().ref().child('object').child('name')
   console.log(nameRef);
   nameRef.on('value', (snapshot) => {
    this.setState({
     name: snapshot.val()
    })
   })
  }

  writeUserData(name) {
    firebase.database().ref('amixes/' + name + '/').update({
      age: 15,
    });
  }

  writeUserData_2() {
   firebase.database().ref('amixes/').set({
      Dandiv: {
         number: 1,
         age: 21
      },
      Carlos: {
         number: 2,
         age: 21
      },
      Juliana: {
         number: 3,
         age: 27
      }
   });
  }

// firebase.database().ref().child("object").child("name").set("Es un gay")}

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <RecordList
            records={this.state.records}
            onDelete={this.deleteRecord.bind(this)}
            onModidy={this.modifyRecord.bind(this)}
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
          />
          <RaisedButton
            label="Escribir en la base de datos"
            onClick={this.writeUserData('Dandiv')}
            fullWidth={true}
          />
          <p>{this.state.name}</p>
        </div>
      </MuiThemeProvider>
    );
  }
}

class DataInput extends Component {
  constructor(props) {
    super(props);

    this.mode = null;

    this.state = {
      questions: null,
      name: null,
      uuid: null,
      note: null,

      snackBarOpen: false,
      snackBarMessage: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.record !== undefined) {
      this.setState({
        questions: this.props.record.questions,
        name: this.props.record.name,
        uuid: this.props.record.uuid,
        note: this.props.record.note,
        snackBarOpen: false,
        snackBarMessage: "",
      });
      this.mode = "modifier";
    } else {
      this.setState({
        questions: _.map(
          staticQuestions, sq => ( {"question": sq, "response": null} )
        ),
        name: "",
        uuid: uuidv4(),
        note: "",
        snackBarOpen: false,
        snackBarMessage: "",
      });
      this.mode = "creator";
    }
  }

  getCurrentDate() {
    let today = new Date();
    let d = today.getDate();
    let m = today.getMonth()+1;
    let y = today.getFullYear();
    let h = today.getHours();
    let mi = today.getMinutes();
    let s = today.getSeconds();

    d = d<10?'0'+d:d;
    m = m<10?'0'+m:m;
    h = h<10?'0'+h:h;
    mi = mi<10?'0'+mi:mi;
    s = s<10?'0'+s:s;

    return d+'/'+m+'/'+y+' - '+h+':'+mi+':'+s;
  }

  handleClose = (response) => {
    let conditions = _.map(this.state.questions, q => (q.response !== null));
    conditions.push(this.state.name.length > 0);

    if (response && conditions.indexOf(false) === -1) {
      // Save other input

      const record = {
        "questions": this.state.questions.slice(),
        "name": this.state.name,
        "uuid": this.state.uuid,
        "date": this.getCurrentDate(),
        "note": this.state.note,
      };

      if (this.mode === "creator") {
        this.props.onAddRecord(record);
      } else {
        this.props.onModidy(record);
      }
    } else {
      if (response) {
        this.setState({snackBarOpen: true, snackBarMessage: "Le faltan datos"});
      } else {
        if (this.mode === "creator") {
          this.props.onAddRecord(null);
        } else {
          this.props.onModidy(null);
        }
      }
    }
  };

  hanldeCheck = (response, index) =>{
    let questionTemp = this.state.questions;
    questionTemp[index].response = response;

    this.setState({questions: questionTemp});
  }

  handleNameFieldChange(event) {
    this.setState(
      {name: event.target.value,},
      () => {this.setState(
        {nameFieldError: this.state.name.length === 0?"Este campo es requerido":""}
      )}
    );
  }

  handleNoteFieldChange(event) {
    this.setState({note: event.target.value})
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        onClick={this.handleClose.bind(this, false)}
      />,
      <FlatButton
        label="Ok"
        onClick={this.handleClose.bind(this, true)}
      />,
    ];

    return (
      <div>
        <Dialog
          title="Reporte de no conformidad"
          actions={actions}
          modal={false}
          open={this.props.visible}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          <div>
            <TextField
              hintText="Escriba aquí el nombre del reporte"
              floatingLabelText="Nombre"
              fullWidth={true}
              onChange={this.handleNameFieldChange.bind(this)}
              defaultValue={this.state.name}
              errorText={this.state.nameFieldError}
            />
            {
              _.map(this.state.questions, (q, index) => (
                <div key={index}>
                  <p>{q.question}</p>
                  <div style={styles.block2}>
                    <RadioButton
                      onClick={this.hanldeCheck.bind(this, "Yes", index)}
                      label="Yes"
                      checked={q.response === "Yes"}
                    />
                    <RadioButton
                      onClick={this.hanldeCheck.bind(this, "No", index)}
                      label="No"
                      checked={q.response === "No"}
                    />
                  </div>
                </div>
              ))
            }
            <TextField
              hintText="Escriba aquí una nota si desea"
              floatingLabelText="Notas"
              defaultValue={this.state.note}
              onChange={this.handleNoteFieldChange.bind(this)}
              fullWidth={true}
              multiLine={true}
            />
            <Snackbar
              open={this.state.snackBarOpen}
              message={this.state.snackBarMessage}
              autoHideDuration={2000}
            />
          </div>
        </Dialog>
      </div>
    );
  }
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
                onModidy={this.props.onModidy.bind(this)}
              />
          ))}
        </TableBody>
      </Table>
    );
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
    this.props.onModidy(record);
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
                onModidy={(record) => {this.recordModify(record)}}
              />
            </IconButton>
            <IconButton
              onClick={() => {this.props.onDelete(this.props.record.uuid)}}
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

export default App;
