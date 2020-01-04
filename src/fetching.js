import axios from "axios";
import moment from "moment";

function convert(stopEvents) {
  return stopEvents
    .filter(x => x.transportation.number === "42")
    .map(x => {
      const departureTime = x.departureTimeEstimated
        ? x.departureTimeEstimated
        : x.departureTimePlanned;

      const name = convertDestinationName(x.transportation.destination.name);
      const emoji = convertToEmoji(x.transportation.destination.name);
      const timeUntilNow = new Date(departureTime) - new Date();
      const minutes = Math.round(timeUntilNow / 1000 / 60);
      return {
        departureTime: moment(departureTime).format("HH:mm"),
        minutes,
        name,
        lineNumber: x.transportation.number,
        emoji
      };
    });
}

function convertDestinationName(destinationName) {
  switch (destinationName) {
    case "Erwin-Schoettle-Platz":
      return "Hauptbahnhof";
    case "Schlossplatz":
      return "Schlossplatz";
    default:
      return "";
  }
}

function convertToEmoji(destinationName) {
  switch (destinationName) {
    case "Erwin-Schoettle-Platz":
      return ":steam_locomotive:";
    case "Schlossplatz":
      return ":cityscape:";
    default:
      return "";
  }
}

const getDateAndTimeString = date => {
  const year = date.getFullYear().toString();
  const monthNumber = date.getMonth() + 1;
  const month = monthNumber < 10 ? "0" + monthNumber : monthNumber.toString();

  const dayNumber = date.getDate();
  const day = dayNumber < 10 ? "0" + dayNumber : dayNumber.toString();

  const dateString = year + month + day;

  const hourNumber = moment(date).hours();
  const hour = hourNumber < 10 ? "0" + hourNumber : hourNumber.toString();

  const minuteNumber = moment(date).minute();
  const minute =
    minuteNumber < 10 ? "0" + minuteNumber : minuteNumber.toString();

  const timeString = hour + minute;

  return { date: dateString, time: timeString };
};

const fetchStops = async () => {
  const { date, time } = getDateAndTimeString(new Date());
  const limit = 15;

  const corsAnywhereProxy = "https://cors-anywhere.herokuapp.com/";
  const allOriginsProxy = "https://api.allorigins.win/raw?url=";

  //works only for a maximum of limit=10 (limit = 11 does not return)
  //const yacdnProxy = "https://yacdn.org/proxy/";

  const baseRequest = `https://www3.vvs.de/mngvvs/XML_DM_REQUEST\
?&limit=${limit}\
&itdDate=${date}\
&itdTime=${time}\
&SpEncId=0\
&coordOutputFormat=EPSG:4326\
&deleteAssignedStops=1\
&macroWebDep=true\
&mode=direct\
&name_dm=de:08111:2201\
&outputFormat=rapidJSON&serverInfo=1\
&type_dm=any\
&useRealtime=1\
&version=10.2.10.139`;

  try {
    const request = `${allOriginsProxy}${encodeURIComponent(baseRequest)}`;
    const result = await axios(request);
    return convert(result.data.stopEvents);
  } catch {
    const fallbackRequest = `${corsAnywhereProxy}${baseRequest}`;
    const result = await axios(fallbackRequest);
    return convert(result.data.stopEvents);
  }
};

export { fetchStops, getDateAndTimeString };
