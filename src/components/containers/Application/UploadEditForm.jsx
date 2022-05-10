import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import { Grid, Paper, withStyles, Box } from "@material-ui/core";
import { I18n } from "react-redux-i18n";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { uploadApplicationFile } from '../../../redux/actions/Application/UploadApplicationAction'
import { ApplicationStyles, MenuProps } from './ApplicationStyles';
import { enqueueSnackbar } from '../../../redux/actions/Notifier/NotifierAction';
import ProgressBar from '../../presentation/ProgressBar/ProgressBar';
import { getApplicationById, resetApplication } from '../../../redux/actions/Application/GetApplicationAction';
import { updateApplication } from '../../../redux/actions/Application/UpdateApplication';

class UploadEditForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      fileName: '',
      type: '',
      uploadPercentage: 0,
      isAdd: false,
      isSaveButtonDisabled: false
    };
  }

  resetState = () => {
    this.setState({
      file: null,
      fileName: '',
      type: '',
      uploadPercentage: 0,
      validationMessage: '',
      messageType: ''
    })
  }
  onHandleCancel = () => {
    this.props.handleClose();
    this.resetState();
    this.props.resetApplication();
    this.setState({
      isSaveButtonDisabled: false
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.id && prevProps.id !== this.props.id) {
      this.props.getApplicationById(this.props.id);
    }

    if (!this.state.isAdd && this.props.applicationDetails && JSON.stringify(prevProps.applicationDetails) !== JSON.stringify(this.props.applicationDetails)) {
      this.setState({
        fileName: this.props.applicationDetails.name ? this.props.applicationDetails.name : null,
        type: this.props.applicationDetails.type ? this.props.applicationDetails.type : null
      });
    }
  }
  onSaveClick = () => {
    this.setState({
      isSaveButtonDisabled: true
    });
    const progress = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total)
        if (percent <= 100) {
          this.setState({ uploadPercentage: percent })
        }
        if (percent === 100) {
          setTimeout(() => {
            this.onHandleCancel();
          }, 1000)
        }
      }
    };
    if (!this.state.type) {
      this.setState({ validationMessage: I18n.t('FILE_UPLOAD.TYPE'), messageType: 'error' });
      return;
    }

    if (!this.state.isAdd) {
      if (!this.state.file) {
        this.setState({ validationMessage: I18n.t('FILE_UPLOAD.FILE'), messageType: 'error' });
        return;
      }
      const file = new FormData();
      file.append("file", this.state.file);
      file.append("type", this.state.type);
      this.props.updateApplication(this.props.id, file, progress);
    } else {
      const file = new FormData();
      file.append("file", this.state.file);
      file.append("type", this.state.type);

      this.props.uploadApplicationFile(file, progress);
    }

  };

  handleFileChosen(file) {

    if (file) {
      const fileExtension = file.name.split('.').pop();
      if (fileExtension === 'apk' || fileExtension === 'json' || fileExtension === 'zip') {
        this.setState({ fileName: file.name, file: file });
      }
      else {
        this.setState({ fileName: '' });
        this.props.enqueueSnackbar({
          message: I18n.t('APPLICATION.EXCEPT_ONLY'),
          options: {
            variant: 'warning'
          }
        });
      }
    } else {
      this.setState({ fileName: null });
    }
  }


  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value, validationMessage: '', messageType: '' });
  }

  onEntering = () => {
    this.setState({
      isAdd: this.props.isAdd
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div >
        <Dialog
          open={this.props.open}
          aria-labelledby="uploadApplication-dialog"
          maxWidth="md"
          TransitionProps={{
            onEntering: this.onEntering
          }}
        >
          {this.state.isAdd === true ?
            <DialogTitle id="uploadApplication-dialog">
              {I18n.t('FILE_UPLOAD.UPLOAD_HEADING')}
            </DialogTitle> :
            <DialogTitle id="uploadFile-dialog">
              {I18n.t('FILE_UPLOAD.EDIT_HEADING')}
            </DialogTitle>
          }
          <DialogContent className={classes.diaContent}>

            <Grid container spacing={3} className={classes.grid}>
              <Grid item xs={4} className={classes.type}>
                <InputLabel
                  id="file-upload-heading"> {I18n.t('FILE_UPLOAD.TYPE_HEADING')}</InputLabel>
                <Select
                  labelId="file-upload-heading"
                  id="file-type-select"
                  name="type"
                  fullWidth
                  MenuProps={MenuProps}
                  value={this.state.type}
                  onChange={(e) => this.handleChange(e)}
                >
                  <MenuItem key='Application' value='Application'>{I18n.t('FILE_TYPE.APPLICATION')}</MenuItem>
                  <MenuItem key='Kernel' value='Kernel'>{I18n.t('FILE_TYPE.KERNEL')}</MenuItem>
                  <MenuItem key='OS' value='OS'>{I18n.t('FILE_TYPE.OS')}</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={8}>
                <Paper >
                  <div  >
                    <Button className={classes.btnStyle} tooltip={I18n.t('UPLOAD.BROWSE')} variant="contained" color="primary" type="button" >
                      <label  >{I18n.t('UPLOAD.CHOOSE_FILE')}
                        <input hidden style={ApplicationStyles.uploadInput} type="file" accept=".apk,.json,.zip" name='file' id="exampleInputFile" onChange={e => this.handleFileChosen(e.target.files[0])} />
                      </label>
                    </Button>
                    <span className={classes.span}>
                      <label className={classes.label}>{this.state.fileName}</label></span>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          {this.state.uploadPercentage > 0 ? <Box className={classes.box}><ProgressBar value={this.state.uploadPercentage} /></Box> : null}
          <DialogActions>
            <Typography>
              {this.state.validationMessage}
            </Typography>
            <Button onClick={this.onHandleCancel} color="secondary" variant='contained'>
              {I18n.t('ACTIONS.CANCEL')}
            </Button>
            <Button disabled={this.state.isSaveButtonDisabled} onClick={this.onSaveClick} color="primary" variant='contained' >
              {I18n.t('ACTIONS.SAVE')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    uploadApplicationFile: uploadApplicationFile,
    enqueueSnackbar: enqueueSnackbar,
    getApplicationById: getApplicationById,
    updateApplication: updateApplication,
    resetApplication: resetApplication

  }, dispatch);
}

function mapStateToProps(state) {
  return {
    i18n: state.i18n,
    application: state.uploadApplication,
    applicationDetails: state.application,
    updateApplication: state.updateApplication,

  };
}

UploadEditForm.propTypes = {
  fileName: PropTypes.string,
  type: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(ApplicationStyles)(UploadEditForm));
