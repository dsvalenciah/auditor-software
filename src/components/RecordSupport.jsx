import React, { Component } from 'react';

import {blueGrey300} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import _ from 'lodash';

import FirebaseService from '../services/firebase';

const styles = {
  uploadInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
}

class RecordSupport extends Component {
  constructor(props) {
    super(props);
    this.firebase = new FirebaseService();
    this.state = {
      urls: []
    }
  }

  handleNoteFieldChange(event) {
    this.props.onChange(event.target.value);
  }

  upload(userUid, recordUid, question, file) {
    this.props.onFileUpload({userUid, recordUid, question, file});
  }

  addUrl(url, fileName){
    let tempUrls = this.state.urls;
    tempUrls.push({[fileName]: url});
    this.setState({urls: tempUrls});
  }

  componentWillMount(){
    _.forEach(this.props.question.files, (fileName, id) => {
      this.firebase.getUserRecordFiles(
        this.props.user.uid,
        this.props.recordUid,
        this.props.question.question,
        fileName,
        (url) => {this.addUrl(url, fileName)}
      );
    })
  }

  showFiles() {
    return(
      <div>
        {_.map(this.state.urls, (url, id) => (
          <div>
            <a key={id} href={Object.values(url)[0]} download={Object.keys(url)[0]}>
              {Object.keys(url)[0]}
            </a>
            <br />
          </div>
        ))}
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.props.visible && (
          <div style={{padding: 10, background: blueGrey300}}>
            {this.showFiles()}
            <TextField
              hintText="Escriba aquí una nota si desea"
              floatingLabelText="Notas"
              defaultValue={this.props.question.note}
              onChange={this.handleNoteFieldChange.bind(this)}
              fullWidth={true}
              multiLine={true}
            />
            <RaisedButton
              containerElement='label'
              fullWidth={true}
              label='Subir soporte'>
              <input
                style={styles.uploadInput}
                type="file"
                onChange={e => this.upload(
                  this.props.user.uid,
                  this.props.recordUid,
                  this.props.question.question,
                  e.target.files[0]
                )}
              />
            </RaisedButton>
          </div>
          )}
      </div>
    );
  }
}

export default RecordSupport;