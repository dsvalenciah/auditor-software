import React, { Component } from 'react';

import RadioButton from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';

import _ from 'lodash';

import uuidv4 from 'uuid/v4';

import FirebaseService from '../services/firebase';

import RecordSupport from './RecordSupport'

const styles = {
  block2: {
    margin: 10,
  },
  question: {
    paddingLeft: "4em"
  }
}

class DataInput extends Component {
  constructor(props) {
    super(props);
    this.firebase = new FirebaseService();
    this.staticQuestionsPerArea = null;
    this.firebase.getQuestionsPerArea(
      (qpa) => {this.staticQuestionsPerArea = qpa}
    );

    this.mode = null;

    this.state = {
      questions: null,
      name: null,
      uid: null,
      note: null,

      snackBarOpen: false,
      snackBarMessage: "",
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.record !== undefined) {
      this.setState({
        questions: this.props.record.questions,
        questionsController: _.map(this.staticQuestionsPerArea, (question, area) => (
            {
              [area]: _.map(
                question, (i, q) => ({[i]: false})
              )
            }
        )),
        name: this.props.record.name,
        uid: this.props.record.uid,
        note: this.props.record.note,
        snackBarOpen: false,
        snackBarMessage: "",
      });
      this.mode = "modifier";
    } else {
      this.setState({
        questions: _.map(this.staticQuestionsPerArea, (question, area) => (
            {
              [area]: _.map(
                question, (i, q) => ({"question": i, "response": null, "note": null})
              )
            }
        )),
        questionsController: _.map(this.staticQuestionsPerArea, (question, area) => (
            {
              [area]: _.map(
                question, (i, q) => ({[i]: false})
              )
            }
        )),
        name: "",
        uid: uuidv4(),
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
        "uid": this.state.uid,
        "date": this.getCurrentDate(),
        "note": this.state.note,
      };

      if (this.mode === "creator") {
        this.props.onAddRecord(record);
      } else {
        this.props.onModify(record);
      }
    } else {
      if (response) {
        this.setState({snackBarOpen: true, snackBarMessage: "Le faltan datos"});
      } else {
        if (this.mode === "creator") {
          this.props.onAddRecord(null);
        } else {
          this.props.onModify(null);
        }
      }
    }
  };

  hanldeCheck = (response, i, area, j) =>{
    let questionTemp = this.state.questions;
    questionTemp[i][area][j].response = response;

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

  handleQuestionSupportVisible(event, i, area, j, question) {
    let questionsControllerTemp = this.state.questionsController;
    questionsControllerTemp[i][area][j][question] = !(
      questionsControllerTemp[i][area][j][question]
    );
    this.setState({questionsController: questionsControllerTemp});
  }

  handleQuestionSupportChange(note, i, area, j) {
    let questionTemp = this.state.questions;
    questionTemp[i][area][j].note = note;
    this.setState({questions: questionTemp});
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
              _.map(this.state.questions, (area, i) => (
                <div key={i}>
                  <p>{Object.keys(area)[0]}</p>
                  {
                    _.map(area[Object.keys(area)[0]], (q, j) => (
                        <div key={j} style={styles.question}>
                          <p>{q.question}</p>
                          <div style={styles.block2}>
                            <RadioButton
                              onClick={
                                this.hanldeCheck.bind(
                                  this, "Si", i, Object.keys(area)[0], j
                                )
                              }
                              label="Si"
                              checked={q.response === "Si"}
                            />
                            <RadioButton
                              onClick={
                                this.hanldeCheck.bind(
                                  this, "No", i, Object.keys(area)[0], j
                                )
                              }
                              label="No"
                              checked={q.response === "No"}
                            />
                          </div>
                          <FlatButton
                            label="Soportes"
                            onClick={
                              () => {this.handleQuestionSupportVisible(
                                this, i, Object.keys(area)[0], j, q.question
                              )}
                            }
                          />
                          <RecordSupport
                            key={i + " " + j}
                            user={this.props.user}
                            recordUid={this.state.uid}
                            questionName={q.question}
                            defaultNote={q.note}
                            visible={
                              this.state.questionsController[i][Object.keys(area)[0]][j][q.question]
                            }
                            onChange={(note) => {this.handleQuestionSupportChange(
                              note, i, Object.keys(area)[0], j
                            )}}
                          />
                        </div>
                    ))
                  }
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

export default DataInput;
