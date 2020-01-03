import axios from "axios";
import moment from "moment";

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

  const result = await axios(
    "https://yacdn.org/proxy/" +
      "https://www3.vvs.de/mngvvs/XML_DM_REQUEST?SpEncId=0&coordOutputFormat=EPSG:4326&deleteAssignedStops=1&limit=10&macroWebDep=true&mode=direct&name_dm=de:08111:2201&outputFormat=rapidJSON&serverInfo=1&type_dm=any&useRealtime=1&version=10.2.10.139" +
      "&itdDate=" +
      date +
      "&itdTime=" +
      time
  );
  return convert(result.data.stopEvents);
};

export { fetchStops, getDateAndTimeString };
