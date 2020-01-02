import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import moment from "moment";

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

function convert(stopEvents) {
  return stopEvents.map(x => {
    const departureTime = x.departureTimeEstimated
      ? x.departureTimeEstimated
      : x.departureTimePlanned;

    const name = x.transportation.destination.name;

    const timeUntilNow = new Date(departureTime) - new Date();
    const minutes = Math.round(timeUntilNow / 1000 / 60);
    return {
      departureTime: moment(departureTime).format("HH:mm"),
      minutes,
      name,
      lineNumber: x.transportation.number
    };
  });
}

function App() {
  const [data, setData] = useState({ stops: [] });

  useEffect(() => {
    const fetchData = async () => {
      var now = new Date();
      const year = now.getFullYear().toString();
      const monthNumber = now.getMonth() + 1;
      const month =
        monthNumber < 10 ? "0" + monthNumber : monthNumber.toString();

      const dayNumber = now.getDate();
      const day = dayNumber < 10 ? "0" + dayNumber : dayNumber.toString();

      const dateString = year + month + day;

      const hourNumber = moment(now).hours();
      const hour = hourNumber < 10 ? "0" + hourNumber : hourNumber.toString();

      const minuteNumber = moment(now).minute();
      const minute =
        minuteNumber < 10 ? "0" + minuteNumber : minuteNumber.toString();

      const timeString = hour + minute;

      const result = await axios(
        "https://yacdn.org/proxy/" +
          "https://www3.vvs.de/mngvvs/XML_DM_REQUEST?SpEncId=0&coordOutputFormat=EPSG:4326&deleteAssignedStops=1&limit=5&macroWebDep=true&mode=direct&name_dm=de:08111:2201&outputFormat=rapidJSON&serverInfo=1&type_dm=any&useRealtime=1&version=10.2.10.139" +
          "&itdDate=" +
          dateString +
          "&itdTime=" +
          timeString
      );

      var newStops = convert(result.data.stopEvents);
      setData({ stops: newStops });
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Richtung</TableCell>
            <TableCell align="right">Minuten</TableCell>
            <TableCell align="right">Uhrzeit</TableCell>
            <TableCell align="right">Linie</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.stops.map(row => (
            <TableRow key={row.departureTime + row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.minutes}</TableCell>
              <TableCell align="right">{row.departureTime}</TableCell>
              <TableCell align="right">{row.lineNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default App;
