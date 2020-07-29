import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
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
  }

  frequencyChange = (e) => {
    this.setState({ refreshFrequency: e.target.value });
  };

  createRows = (data, query = this.state.query) => {
    if (query) {
      let filteredData = data.filter((el) => {
        return el.from === query;
      });

      const filteredRows = filteredData.map((el, idx) => {
        return (
          <TableRow key={idx.toString()}>
            <TableCell component="th" scope="row">
              {el.from}
            </TableCell>
            <TableCell align="right">{el.to}</TableCell>
            <TableCell align="right">{el.rate}</TableCell>
          </TableRow>
        );
      });

      this.setState({ rows: filteredRows });
    } else {
      const newRows = data.map((el, idx) => {
        return (
          <TableRow key={idx.toString()}>
            <TableCell component="th" scope="row">
              {el.from}
            </TableCell>
            <TableCell align="right">{el.to}</TableCell>
            <TableCell align="right">{el.rate}</TableCell>
          </TableRow>
        );
      });

      this.setState({ rows: newRows });
    }
  };

  handleSelect = (event) => {
    this.createRows(this.state.data, event.target.value);
    this.setState({ query: event.target.value });
  };

  fetchData = async () => {
    // uncomment the line below to check that polling is working with the intervals
    //  console.log('fetching...')
    const rawData = await axios.get(
      "https://liquality.io/swap/agent/api/swap/marketinfo"
    );

    let results = rawData.data;

    this.createRows(results);

    this.setState({ data: results });
  };

  componentDidMount() {
    this.fetchData();
    this.interval = setInterval(this.fetchData, this.state.refreshFrequency);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.refreshFrequency !== this.state.refreshFrequency) {
      clearInterval(this.interval);
      this.interval = setInterval(this.fetchData, this.state.refreshFrequency);
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
            <InputLabel id="select-label">
              Filter by Coin
            </InputLabel>
            <Select
              labelId="select-label"
              id="select"
              value={this.state.query}
              onChange={this.handleSelect}
            >
              <MenuItem value={""}>All</MenuItem>
              <MenuItem value={"BTC"}>BTC</MenuItem>
              <MenuItem value={"ETH"}>ETH</MenuItem>
              <MenuItem value={"DAI"}>DAI</MenuItem>
              <MenuItem value={"USDC"}>USDC</MenuItem>
              <MenuItem value={"WBTC"}>WBTC</MenuItem>
              <MenuItem value={"USDT"}>USDT</MenuItem>
            </Select>
          </FormControl>

          <TableContainer className={classes.tableContainer} component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>From:</TableCell>
                  <TableCell align="right">To:</TableCell>
                  <TableCell align="right">Exchange Rate</TableCell>
                  {/* <TableCell align="right">Carbs&nbsp;(g)</TableCell> */}
                  {/* <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>{this.state.rows}</TableBody>
            </Table>
          </TableContainer>
        </div>
        <RefreshRadioButton frequencyChange={this.frequencyChange} />
      </Box>
    );
  }
}

RatesTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(RatesTable);
