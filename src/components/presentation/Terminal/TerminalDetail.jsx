import React from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { I18n } from "react-redux-i18n";
import { TerminalDetailStyle } from "./TerminalDetailStyle";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {
  Tabs,
  Tab,
  Box,
  Paper,
  Fab,
  Typography,
  Grid,
  ListItemText,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { TERMINALS_PATH, TERMINAL_GRAPH_COLOR_FOR_AVAILABLE, TERMINAL_GRAPH_COLOR_FOR_USED } from "../../../constants/constants";
import TerminalAccessLogs from "../../containers/Terminal/TerminalAccessLogs";
import { getAccessLogsByTerminalId } from "../../../redux/actions/Logs/GetLogsByTerminalId";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllLog,
  getAllLogReset,
} from "../../../redux/actions/Logs/GetAllLog";
import {
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Label,
} from "recharts";
import { useTheme } from "@material-ui/styles";

const useStyles = makeStyles(TerminalDetailStyle);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Grid
      role="tabpanel"
      hidden={value !== index}
      id={`terminal-details-${index}`}
      aria-labelledby={`terminal-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </Grid>
  );
}

function TerminalDetail({
  serialNumber,
  systemIdentifier,
  terminalModel,
  manufacturer,
  appVersion,
  kernelVersion,
  osVersion,
  acquirerIPAddress,
  acquiredPort,
  TLS,
  blackListVersion,
  operatorName,
  apn,
  simSerialNo,
  merchantName,
  address,
  city,
  createdAt,
  updatedAt,
  ram,
  diskSpace,
  group,
  subGroup,
  lastCallDate,
}) {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const [value, setValue] = React.useState(0);
  const [isLogs, setIsLogs] = React.useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleReturn = () => {
    let path = TERMINALS_PATH;
    history.push(path);
    dispatch(getAllLogReset());
  };

  const dataRam = [
    {
      name: I18n.t("TERMINAL.TERMINAL_DETAIL.USED_RAM"),
      value: ram,
      fill: TERMINAL_GRAPH_COLOR_FOR_USED,
    },
    {
      name: I18n.t("TERMINAL.TERMINAL_DETAIL.FREE_RAM"),
      value: 100 - ram,
      fill: TERMINAL_GRAPH_COLOR_FOR_AVAILABLE,
    },
  ];

  const dataDisk = [
    {
      name: I18n.t("TERMINAL.TERMINAL_DETAIL.DISK_SPACE"),
      value: diskSpace,
      fill: TERMINAL_GRAPH_COLOR_FOR_USED,
    },
    {
      name: I18n.t("TERMINAL.TERMINAL_DETAIL.FREE_SPACE"),
      value: 100 - diskSpace,
      fill: TERMINAL_GRAPH_COLOR_FOR_AVAILABLE,
    },
  ];

  const logsDetails = () => {
    setIsLogs(false);
    dispatch(getAccessLogsByTerminalId({ id: id }));
  };

  const getAllLogs = () => {
    dispatch(getAllLog(id));
    setIsLogs(true);
  };

  const logsByTerminalId = useSelector((state) => state.logsByTerminalId);
  const logs = useSelector((state) => state.logs);

  return (
    <Paper className={classes.root}>
      <Grid className={classes.tabRow}>
        <Fab size="small" className={classes.redirect}>
          <ArrowBackIosIcon size="large" onClick={handleReturn} className={classes.backButton} />
        </Fab>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
          className={classes.tabStyles}
          initialselectedindex={value}
        >

          <Tab label={I18n.t("TERMINAL.TERMINAL_DETAIL.TERMINAL_DETAIL")} />
          <Tab
            label={I18n.t("TERMINAL.TERMINAL_DETAIL.CALL_HISTORY")}
            onClick={logsDetails}
          />
          <Tab
            className={classes.tab}
            label={I18n.t("TERMINAL.TERMINAL_DETAIL.LOGS")}
            onClick={getAllLogs}
          />
        </Tabs>
      </Grid>
      <TabPanel value={value} index={0} className={classes.tabBox}>
        <Grid container className={classes.root2}>
          <Grid item md="auto" className={classes.card}>
            <Typography className={classes.technicalText}>
              {I18n.t("TERMINAL.TERMINAL_DETAIL.TECHNICAL_DETAIL")}
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t(
                    "TERMINAL.TERMINAL_DETAIL.SERIAL_NUMBER"
                  )}`}
                  secondary={serialNumber}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t("TERMINAL.TERMINAL_DETAIL.ID")}`}
                  secondary={systemIdentifier}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t("TERMINAL.TERMINAL_DETAIL.MODEL")}`}
                  secondary={terminalModel}
                />
              </Grid>

              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t("TERMINAL.TERMINAL_DETAIL.MANUFACTURER")}`}
                  secondary={manufacturer}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t(
                    "TERMINAL.TERMINAL_DETAIL.ANDROID_VERSION"
                  )}`}
                  secondary={osVersion}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t(
                    "TERMINAL.TERMINAL_DETAIL.KERNEL_VERSION"
                  )}`}
                  secondary={kernelVersion}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t("TERMINAL.TERMINAL_DETAIL.CIB_VERSION")}`}
                  secondary={appVersion}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t(
                    "TERMINAL.TERMINAL_DETAIL.ACQUIRER_IP_ADDRESS"
                  )}`}
                  secondary={acquirerIPAddress}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t(
                    "TERMINAL.TERMINAL_DETAIL.ACQUIRER_PORT"
                  )}`}
                  secondary={acquiredPort}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t("TERMINAL.TERMINAL_DETAIL.TLS")}`}
                  secondary={TLS}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t(
                    "TERMINAL.TERMINAL_DETAIL.BLACKLIST_VERSION"
                  )}`}
                  secondary={blackListVersion}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t(
                    "TERMINAL.TERMINAL_DETAIL.OPERATOR_NAME"
                  )}`}
                  secondary={operatorName}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t("TERMINAL.TERMINAL_DETAIL.APN")}`}
                  secondary={apn}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t(
                    "TERMINAL.TERMINAL_DETAIL.SIM_SERIAL_NUMBER"
                  )}`}
                  secondary={simSerialNo}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t(
                    "TERMINAL.TERMINAL_DETAIL.MERCHANT_NAME"
                  )}`}
                  secondary={merchantName}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t("TERMINAL.TERMINAL_DETAIL.GROUP")}`}
                  secondary={group}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t("TERMINAL.TERMINAL_DETAIL.SUB_GROUP")}`}
                  secondary={subGroup}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t("TERMINAL.TERMINAL_DETAIL.ADDRESS")}`}
                  secondary={address}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t("TERMINAL.TERMINAL_DETAIL.CITY")}`}
                  secondary={city}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t("TERMINAL.TERMINAL_DETAIL.CREATED_TIME")}`}
                  secondary={createdAt}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t(
                    "TERMINAL.TERMINAL_DETAIL.LAST_CALL_DATE"
                  )}`}
                  secondary={lastCallDate}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={6}>
                <ListItemText
                  className={classes.listTextStyle}
                  primary={`${I18n.t("TERMINAL.TERMINAL_DETAIL.UPDATED_AT")}`}
                  secondary={updatedAt}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md="auto" className={classes.card1}>
            <Typography className={classes.pieCard}>{`${I18n.t(
              "TERMINAL.TERMINAL_DETAIL.TERMINAL_MONITOR"
            )}`}</Typography>
            <Grid xs="auto" className={classes.doughnutGrid}>
              <Typography className={classes.listText}>{`${I18n.t(
                "TERMINAL.TERMINAL_DETAIL.RAM"
              )}`}</Typography>
              <Grid className={classes.root3}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataRam}
                      cx="50%"
                      cy="50%"
                      innerRadius={"60%"}
                      outerRadius={"80%"}
                      fill={theme.palette.primary}
                      dataKey="value"
                    >
                      <Label fill={dataRam[0].fill} width={30} position="center">{`${dataRam[0].value}% Used`}</Label>
                    </Pie>
                    <Legend verticalAlign="bottom" height={0} />
                  </PieChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
            <Grid xs="auto" className={classes.doughnutGrid}>
              <Typography className={classes.listText}>{`${I18n.t(
                "TERMINAL.TERMINAL_DETAIL.DISK_SPACE"
              )}`}</Typography>
              <Grid className={classes.root3}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataDisk}
                      cx="50%"
                      cy="50%"
                      innerRadius={"60%"}
                      outerRadius={"80%"}
                      fill={theme.palette.primary}
                      dataKey="value"
                    >
                      <Label fill={dataDisk[0].fill} width={30} position="center">{`${dataDisk[0].value}% Used`}</Label>
                    </Pie>
                    <Legend verticalAlign="bottom" height={0} />
                  </PieChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1} className={classes.tabBox}>
        <TerminalAccessLogs id={id} logs={logsByTerminalId} isLogs={isLogs} />
      </TabPanel>
      <TabPanel value={value} index={2} className={classes.tabBox}>
        <TerminalAccessLogs id={id} logs={logs} isLogs={isLogs} />
      </TabPanel>
    </Paper>
  );
}

export default TerminalDetail;
