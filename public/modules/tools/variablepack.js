var date = new Date();

module.exports.time = {
  full: date,
  year: date.getFullYear(),
  month: date.getMonth(),
  day: date.getDate(),
  hour: date.getHours(),
  minute: date.getMinutes(),
  second: date.getSeconds(),
  milisecond: date.getMiliseconds
};