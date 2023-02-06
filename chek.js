// amqp.connect("amqp://localhost", (error, connection) => {
//   if (error) {
//     throw error;
//   }
//   connection.createChannel(async (error1, channel) => {
//     if (error1) {
//       throw error1;
//     }
//     const currentdate = new Date(); // current date
//     console.log(currentdate);
//     const pastDate = currentdate.getDate() - 30;
//     console.log(pastDate);
//     const getdate = new Date(currentdate.setDate(pastDate));
//     console.log(getdate);

//     const result2 = await database.collection("orders").find({
//       createdAt: {
//         $gte: getdate,
//       },
//     });
//     const data2 = await result2.toArray();

//     const msg2 = JSON.stringify(data2);
//     const queue = "getdata";
//     const msg = process.argv.slice(2).join(" ") || msg2;

//     channel.assertQueue(queue, {
//       durable: true,
//     });
//     channel.sendToQueue(queue, Buffer.from(msg), {
//       persistent: true,
//     });
//     console.log(`message:${msg}`);
//   });
//   setTimeout(function () {
//     connection.close();
//     process.exit(0);
//   }, 500);
// });

// // const data2 = await result2.toArray();
// //   const exchange = "direct_logs";
// //   var severity = "info";
// //   const msg = "hi";
// //   // const msg = JSON.stringify(data2);
// //   channel.assertExchange(exchange, "direct", {
// //     durable: false,
// //   });
// //   channel.publish(exchange, severity, Buffer.from(msg));
// //   console.log(" [x] Sent %s: '%s'", severity, msg);
// // });
// amqp.connect("amqp://localhost", function (error0, connection) {
//   if (error0) {
//     throw error0;
//   }
//   connection.createChannel(function (error1, channel) {
//     if (error1) {
//       throw error1;
//     }
//     var exchange = "direct_logs22";
//     var msg = "Hello World!";
//     var severity = "info";

//     channel.assertExchange(exchange, "direct", {
//       durable: false,
//     });
//     channel.publish(exchange, severity, Buffer.from(msg));
//     console.log(" [x] Sent %s: '%s'", severity, msg);
//   });

//   setTimeout(function () {
//     connection.close();
//     process.exit(0);
//   }, 500);
// });
// const readline=require('readline')
// const readline = require("readline");
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// rl.question("Who are you?", (name) => {
//   console.log(`Hey there ${name}!`);
//   rl.close();
// });

// const n = msg.content.toString();
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });
// let n = "";
// rl.question("enter a number", async (number) => {
// const currentdate = new Date(); // current date
// console.log(currentdate);
// const pastDate = currentdate.getDate() - 7;
// console.log(pastDate);
// // console.log(`Hey there ${number}!`);
// const getdate = new Date(currentdate.setDate(pastDate));
// console.log(getdate);

// const result2 = await database.collection("orders").find({
//   createdAt: {
//     $gte: getdate,
//   },
// });
// const data2 = await result2.toArray();
// var msg2 = JSON.stringify(data2);
function getFirstDayPreviousMonth() {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() - 6, 2);
}
const mon = getFirstDayPreviousMonth();
console.log(mon); // 👉️ Tue 1st December

// ------------------------------------------------

// ✅ Get the last day of the previous month

function getLastDayPreviousMonth() {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() - 5, 1);
}
const mon2 = getLastDayPreviousMonth();
console.log(mon2);
const hh = { hhf: "hioi", jj: "kjbub" }.toString();
// const vv = v.toString();
// const v = msg.content.toString();
const test = fs.writeFileSync("foo.pdf", hh, "utf-8", (err) => {
  if (err) console.log(err);
  else {
    console.log("File written successfully\n");
    console.log("The written has the following contents:");
    // console.log(fs.readFileSync("user5.pdf", "utf8"));
  }
});
// const html = fs.readFileSync("user6.js").toString();
let options = {
  format: "A3",
};

pdf.create(test, options).toFile("./user6.pdf", (err, req, res) => {
  if (err) return console.log(err);
  console.log("ikn8rgu");
  console.log(" [x] Received %s", msg.content.toString());
});
const PDFDocument = new pdfkit();
PDFDocument.pipe(fs.createWriteStream("output2.pdf"));
PDFDocument.moveTo(300, 75);
PDFDocument.lineCap("butt").moveTo(270, 90).lineTo(270, 230).stroke();

row(PDFDocument, 90);
row(PDFDocument, 110);
row(PDFDocument, 130);
row(PDFDocument, 150);
row(PDFDocument, 170);
row(PDFDocument, 190);
row(PDFDocument, 210);

textInRowFirst(PDFDocument, "Nombre o razón social", 100);
textInRowFirst(PDFDocument, "RUT", 120);
textInRowFirst(PDFDocument, "Dirección", 140);
textInRowFirst(PDFDocument, "Comuna", 160);
textInRowFirst(PDFDocument, "Ciudad", 180);
textInRowFirst(PDFDocument, "Telefono", 200);
textInRowFirst(PDFDocument, "e-mail", 220);

// .lineTo(373, 301)
// .lineTo(181, 161)
// .lineTo(419, 161)
// .lineTo(227, 301)
// .fill("red", "even-odd");

// var loremIpsum =
//   "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in...";

// PDFDocument.y = 320;
// PDFDocument.fillColor("black");
// PDFDocument.text(loremIpsum, {
//   paragraphGap: 10,
//   indent: 20,
//   align: "justify",
//   columns: 2,
// });
PDFDocument.end();
function textInRowFirst(PDFDocument, text, heigth) {
  PDFDocument.y = heigth;
  PDFDocument.x = 30;
  PDFDocument.fillColor("black");
  PDFDocument.text(text, {
    paragraphGap: 5,
    indent: 5,
    align: "justify",
    columns: 1,
  });
  return PDFDocument;
}

function row(PDFDocument, heigth) {
  PDFDocument.lineJoin("miter").rect(30, heigth, 500, 20).stroke();
  return PDFDocument;
}

// <html>
//{" "}
<body>
  //{" "}
  <table>
    //{" "}
    <tr>
      // <th>_id</th>
      // <th>restaurantID</th>
      // <th>item</th>
      // <th>isPurchased</th>
      // <th>isDelivered</th>
      // <th>status</th>
      // <th>place</th>
      // <th>city</th>
      // <th>pincode</th>
      // <th>landmark</th>
      // <th>amount</th>
      // <th>createdAt</th>
      // <th>updatedAt</th>
      // <th>userID</th>
      //{" "}
    </tr>
    //{" "}
    <tr>
      // <td>${element._id}</td>
      // <td>${element.restaurantID}</td>
      // <td>${element.item}</td>
      // <td>${element.isPurchased}</td>
      // <td>${element.isDelivered}</td>
      // <td>${element.status}</td>
      // <td>${element.place}</td>
      // <td>${element.city}</td>
      // <td>${element.pincode}</td>
      // <td>${element.landmark}</td>
      // <td>${element.amount}</td>
      // <td>${element.createdAt}</td>
      // <td>${element.updatedAt}</td>
      // <td>${element.userID}</td>
      //{" "}
    </tr>
    //{" "}
  </table>
  //{" "}
</body>;
// </html>;
//         `;

`<td>${element.restaurantID}</td>
<td>${element.item}</td>
 <td>${element.isPurchased}</td>
<td>${element.isDelivered}</td>
<td>${element.status}</td>
<td>${element.place}</td>
 <td>${element.city}</td>
<td>${element.pincode}</td>
 <td>${element.landmark}</td>
 <td>${element.amount}</td>
 <td>${element.createdAt}</td>
 <td>${element.updatedAt}</td>
 <td>${element.userID}</td>`;

`<th scope="col">isDelivered</th>
 <th scope="col">status</th>
 <th scope="col">place</th>
 <th scope="col">city</th>
 <th scope="col">pincode</th>
 <th scope="col">landmark</th>
 <th scope="col">amount</th>
 <th scope="col">createdAt</th>
 <th scope="col">updatedAt</th>
 <th scope="col">userID</th>`;
