import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const weatherAPI = "";

app.use(express.static("public"));

// TODO:Change the IP to actual IP
async function getCity(ip) {
  let test_ip = "45.251.234.48";
  const result = await axios.get("http://ip-api.com/json/" + test_ip);
  let city = result.data.city;
  return city;
}

async function getTemperature(city) {
  let url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    weatherAPI;

  const result = await axios.get(url);
  console.log(result.data);
  let currentTemperature = result.data.main.temp;
  currentTemperature = Math.round(currentTemperature - 273.15);
  let weather = [];
  weather.push(currentTemperature);
  weather.push(result.data.main.humidity);
  return weather;
}

function calBathTimes(currentTemperature) {
  if (currentTemperature < 16) {
    return 1;
  } else if (currentTemperature > 15 && currentTemperature < 31) {
    return 2;
  } else {
    return 3;
  }
}

function getNextWeek() {
  //4,5,6,0,1,2,3
  let weekNumber = [];
  let weekName = [];
  let date = new Date();
  let day = date.getDay();
  for (let i = day; i < day + 7; i++) {
    let dayNumber;
    if (i < 7) {
      dayNumber = i;
    } else {
      dayNumber = i - 7;
    }
    weekNumber.push(dayNumber);
  }

  for (let j = 0; j < 7; j++) {
    switch (weekNumber[j]) {
      case 0:
        weekName.push("Sunday");
        break;
      case 1:
        weekName.push("Monday");
        break;
      case 2:
        weekName.push("Tuesday");
        break;
      case 3:
        weekName.push("Wednesday");
        break;
      case 4:
        weekName.push("Thurday");
        break;
      case 5:
        weekName.push("Friday");
        break;
      case 6:
        weekName.push("Saturday");
        break;
      default:
        break;
    }
  }

  return weekName;
}

function calBathDays(nextDays, bathTimes) {
  let bathWeek = [];
  if (bathTimes == 1) {
    bathWeek = [false, true, false, false, false, false, false];
  } else if (bathTimes == 2) {
    bathWeek = [false, true, false, false, true, false, false];
  } else {
    bathWeek = [false, true, false, true, false, true, false];
  }

  return bathWeek;
}

app.get("/", async (req, res) => {
  // let city = await getCity(req.ip);
  // let weather = await getTemperature(city);
  // let bathTimes = calBathTimes(weather[0]);
  // let humidity = weather[1];
  // let currentTemperature = weather[0];
  let currentTemperature = 27;
  let bathTimes = 3;
  let humidity = 1;
  let city = "Kolkata";
  let nextDays = getNextWeek();
  let bathDays = calBathDays(nextDays, bathTimes);

  res.render("index.ejs", {
    currentTemperature,
    nextDays,
    bathDays,
    humidity,
    city,
  });
});

app.listen(port, () => {
  console.log("Listening on port: " + port);
});
