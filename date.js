exports.getDate = () => {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  //  previously coded for test purpose
  // let cDay = today.getDay();
  // const weekDay = [
  //   "Sunday",
  //   "Monday",
  //   "Tuesday",
  //   "Wednesday",
  //   "Thursday",
  //   "Friday",
  //   "Saturday",
  // ];
  // const day = weekDay[cDay];
  return today.toLocaleDateString("hi-IN", options);
};

exports.getDay = () => {
  let today = new Date();
  let options = {
    weekday: "long",
  };
  //  previously coded for test purpose
  // let cDay = today.getDay();
  // const weekDay = [
  //   "Sunday",
  //   "Monday",
  //   "Tuesday",
  //   "Wednesday",
  //   "Thursday",
  //   "Friday",
  //   "Saturday",
  // ];
  // const day = weekDay[cDay];
  return today.toLocaleDateString("hi-IN", options);
};
