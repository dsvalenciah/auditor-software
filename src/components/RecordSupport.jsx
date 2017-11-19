import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import FirebaseService from '../services/firebase';

const styles = {
  uploadButton: {
    verticalAlign: 'middle',
  },
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
  }

  handleNoteFieldChange(event) {
    this.props.onChange(event.target.value);
  }

  upload(userUid, recordUid, question, file) {
    this.firebase.setUserRecordFile(userUid, recordUid, question, file);
  }

  render() {
    return (
      <div>
        {this.props.visible?(
          <div>
            <RaisedButton
              style={styles.uploadButton}
              containerElement='label'
              label='Subir soporte'>
              <input
                style={styles.uploadInput}
                type="file"
                onChange={e => this.upload(
                  this.props.user.uid,
                  this.props.recordUid,
                  this.props.questionName,
                  e.target.files[0]
                )}
              />
            </RaisedButton>
            <TextField
              hintText="Escriba aquí una nota si desea"
              floatingLabelText="Notas"
              defaultValue={this.props.defaultNote}
              onChange={this.handleNoteFieldChange.bind(this)}
              fullWidth={true}
              multiLine={true}
            />
          </div>
          ) : (
            ""
          )}
      </div>
    );
  }
}

export default RecordSupport;