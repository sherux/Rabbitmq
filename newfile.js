const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", (error, connection) => {
  if (error) {
    throw error;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    const queue = "task_queue";
    const msg = process.argv.slice(2).join(" ") || "hello";
    const a = [1, 2, 5, 4, 4];

    console.log(a.slice(2));

    channel.assertQueue(queue, {
      durable: true,
    });
    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true,
    });
    console.log(`message:${msg}`);
  });
  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});

// const moment = require("moment");
// const schedule = require("node-schedule");

// const vv = schedule.scheduleJob("* 21 17 11 jan *", () => {
//   console.log("hi", moment().format("DD MMM YYYY hh:mm:ss"));
//   vv.cancel();
// });
