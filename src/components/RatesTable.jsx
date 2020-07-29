import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import constants from "../constants/constants.js";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Box from "@material-ui/core/Box";
import RefreshRadioButton from "./RefreshRadioButton.jsx";
import "../App.scss";
import axios from "axios";
import throttle from "lodash.throttle"

const useStyles = () => ({
  table: {
    maxWidth: 550,
  },
  tableContainer: {
    width: 550,
  },
  formControl: {
    minWidth: 170,
    marginBottom: 20,
  },
});

class RatesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      rows: [],
      query: "",
      refreshFrequency: 5000, //default frequency to start in ms
    };
    this.throttledFetchData = throttle(this.fetchData, 2500)
  }

  frequencyChange = (e) => {
    this.setState({ refreshFrequency: e.target.value });
  };

  createRows = (data, query = this.state.query) => {
    let newData = query ? data.filter((el) => el.from === query) : data;

    const newRows = newData.map((el, idx) => {
      return this.renderRow(el, idx);
    });

    return newRows;
  };

  renderRow = (dataPoint, index) => {
    return (
      <TableRow key={index.toString()}>
        <TableCell component="th" scope="row">
          {dataPoint.from}
        </TableCell>
        <TableCell align="right">{dataPoint.to}</TableCell>
        <TableCell align="right">{dataPoint.rate}</TableCell>
      </TableRow>
    );
  };

  renderMenuItems = (list) => {
    let newItems = list.map((el) => {
      return (
        <MenuItem key={el} value={el}>
          {el}
        </MenuItem>
      );
    });

    return newItems;
  };

  handleSelect = (event) => {
    this.setState({ query: event.target.value });
  };




  fetchData = async () => {
    // uncomment the line below to check that polling is working with the intervals
      console.log('fetching...')
    const rawData = await axios.get(constants.RatesAPI);

    let results = rawData.data;

    this.setState({ data: results });
  };

  componentDidMount() {
    this.fetchData();
    this.interval = setInterval(this.throttledFetchData, this.state.refreshFrequency);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.refreshFrequency !== this.state.refreshFrequency) {
      clearInterval(this.interval);
      this.interval = setInterval(this.throttledFetchData, this.state.refreshFrequency);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { classes } = this.props;

    return (
      <Box display="flex" flex-direction="row" justifyContent="center">
        <div className="main-content-wrapper">
          <FormControl className={classes.formControl}>
            <InputLabel id="select-label">Filter by Coin</InputLabel>
            <Select
              labelId="select-label"
              id="select"
              value={this.state.query}
              onChange={this.handleSelect}
            >
              <MenuItem value={""}>All</MenuItem>
              {this.renderMenuItems(constants.CoinCodes)}
            </Select>
          </FormControl>

          <TableContainer className={classes.tableContainer} component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell><b>From:</b></TableCell>
                  <TableCell align="right"><b>To:</b></TableCell>
                  <TableCell align="right"><b>Exchange Rate</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{this.createRows(this.state.data)}</TableBody>
            </Table>
          </TableContainer>
        </div>
        <RefreshRadioButton frequencyChange={this.frequencyChange}/>
      </Box>
    );
  }
}

RatesTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(RatesTable);
