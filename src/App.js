import React, { useState, useEffect } from "react";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { fetchStops } from "./fetching";
import { emojify } from "react-emojione";

const useStyles = makeStyles({
  tablecell: {
    fontSize: "16pt",
    backgroundColor: "black",
    color: "orange"
  }
});

function App() {
  const [data, setData] = useState({ stops: [] });

  console.log("Version 3");

  useEffect(() => {
    const fetchAndUpdate = async () => {
      const stops = await fetchStops();
      setData({ stops });
    };
    fetchAndUpdate();

    const interval = setInterval(() => {
      fetchAndUpdate();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const classes = useStyles();

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Richtung</TableCell>
              <TableCell align="right">Symbol</TableCell>
              <TableCell align="right">Minuten</TableCell>
              <TableCell align="right">Abfahrt</TableCell>
              <TableCell align="right">Linie</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.stops.map(row => (
              <TableRow key={row.departureTime + row.name}>
                <TableCell
                  className={classes.tablecell}
                  component="th"
                  scope="row"
                >
                  {row.name}
                </TableCell>
                <TableCell className={classes.tablecell} align="right">
                  {emojify(row.emoji)}
                </TableCell>
                <TableCell className={classes.tablecell} align="right">
                  {row.minutes}
                </TableCell>
                <TableCell className={classes.tablecell} align="right">
                  {row.departureTime}
                </TableCell>
                <TableCell className={classes.tablecell} align="right">
                  {row.lineNumber}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
