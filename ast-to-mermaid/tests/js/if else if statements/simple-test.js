let temperature = 25;
let isRaining = false;

if (temperature > 20 && !isRaining) {
  console.log("It's a great day for outdoor activities!");
} else if (temperature > 20 && isRaining) {
  console.log("It's warm but raining, bring an umbrella.");
} else if (temperature <= 20 && !isRaining) {
  console.log("It's cool but not raining, a light jacket is recommended.");
} else {
  console.log("It's cold and raining, stay indoors.");
}

return 0;