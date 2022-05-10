import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { I18n } from "react-redux-i18n";
import { Edit as EditIcon, Add as AddIcon } from "@material-ui/icons";
import DataTable from "../../presentation/DataTable/DataTable";
import { Paper, withStyles, Tooltip, Fab } from "@material-ui/core";
import { enqueueSnackbar } from "../../../redux/actions/Notifier/NotifierAction";
import { ApplicationStyles } from './ApplicationStyles';
import { loadApplication } from '../../../redux/actions/Application/ApplicationListAction';
import ApplicationDialog from './UploadEditForm';
import { isAuthorized } from '../../../lib/keycloak/Permissions';
import { PERMISSIONS } from '../../../constants/constants';

class ApplicationTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { applicationId: '', name: '', isResetDialogOpen: false, isOpenDialog: false, isAdd: false };
  }

  componentDidMount() {
    this.props.loadApplication();
  }

  handleDelete = (e, id) => {
    e.stopPropagation();
  };
  
  handleEdit = (e, id) => {
    this.setState({
      isOpenDialog: true,
      fileId: id,
      isAdd: false
    });
    e.stopPropagation();
  };

  handleUpload = () => {
    this.setState({
      isOpenDialog: true,
      isAdd: true
    });
  };
  handleClose = () => {
    this.setState({
      isOpenDialog: false,
      fileId: ''
    });
  };

  render() {
    const columns = [
      {
        name: `${I18n.t("APPLICATION.FILE_NAME")}`,
        selector: "name",
      },
      {
        name: `${I18n.t("APPLICATION.TYPE")}`,
        selector: "type",
      },

      {
        name: `${I18n.t("APPLICATION.CREATED_TIME")}`,
        type: "date",
        selector: "createdAt",
      },
      {
        name: `${I18n.t("APPLICATION.VERSION")}`,
        selector: "version",
      },
    ];
    if (isAuthorized(PERMISSIONS.UPDATE_OS_APPLICATION_KERNEL)) {
      columns.push({
        name: `${I18n.t("FORM.ACTIONS")}`,
        type: "actions",
        actions: [
          {
            name: I18n.t("MISC.EDIT"),
            handler: this.handleEdit,
            icon: <EditIcon />,
          }
        ],
      })
    }

    const { classes } = this.props;
    return (
      <>
        <Paper className={classes.paper}>
          {isAuthorized(PERMISSIONS.UPLOAD_OS_APPLICATION_KERNEL) &&
            <Fab size="small" className={classes.addIcon}>
              <Tooltip title={I18n.t("DOWNLOAD_AND_UPLOAD.ADD_TOOLTIP_TITLE")}>
                <AddIcon size="large" onClick={this.handleUpload} />
              </Tooltip>
            </Fab>
          }
          <DataTable
            columns={columns}
            data={this.props.applications ? this.props.applications : []}
            dataKey="_id"
            order="desc"
            orderBy="createdAt"
            checkbox={false}
            heightClass="data-table-area-no-toolbar-for-terminal"
            pagination={true}
            onSelectionChange={this.onSelectionChange}
            isDownload={true}
            searchBar={true}
          />

          <ApplicationDialog
            open={this.state.isOpenDialog}
            id={this.state.fileId}
            handleClose={this.handleClose}
            isAdd={this.state.isAdd}
          />

        </Paper>
      </>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      enqueueSnackbar: enqueueSnackbar,
      loadApplication: loadApplication,
    },
    dispatch
  );
}

function mapStateToProps(state) {
  return {
    i18n: state.i18n,
    applications: state.applications,
  };
}

ApplicationTable.propTypes = {
  applicationId: PropTypes.string,
  name: PropTypes.string,
  isResetDialogOpen: PropTypes.bool,
  editDialog: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(ApplicationStyles)(ApplicationTable));

