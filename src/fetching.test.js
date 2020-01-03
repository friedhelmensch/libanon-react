import { getDateAndTimeString } from "./fetching";
import App from "./App";

test("getDateAndTimeString returns correct date", () => {
  const date = new Date(2020, 5, 12, 7, 9);

  const result = getDateAndTimeString(date);
  expect(result).toEqual({ date: "20200612", time: "0709" });
});
