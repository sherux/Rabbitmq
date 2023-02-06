const amqp = require("amqplib/callback_api");
const MongoClient = require("mongodb").MongoClient;
const moment = require("moment");
const pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");

var database;
// -----------databse connected----------------------
MongoClient.connect("mongodb://localhost:27017", (err, result) => {
  if (err) throw err;
  database = result.db("USERINFORMATION");
  console.log("database is connected");
});
// --------------------getfirst day and last day-----------------------------------------------------------------
function getFirstDayPreviousMonth() {
  const date = new Date();

  return moment(new Date(date.getFullYear(), date.getMonth() - 1, 1)).format(
    "YYYY-MM-DDT00:00:00"
  );
}
const getFirstDay = getFirstDayPreviousMonth();
console.log("getFirstDay", getFirstDay); //  Tue 1st December

function getLastDayPreviousMonth() {
  const date = new Date();

  return moment(new Date(date.getFullYear(), date.getMonth(), 0)).format(
    "YYYY-MM-DDT23:59:59"
  );
}
const getLastDay = getLastDayPreviousMonth();
console.log("getLastDay ", getLastDay); // sun 31 december

// -------------------connect channel use rabbitmq-------------------------------------------------------------------
amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(async function (error1, channel) {
    if (error1) {
      throw error1;
    }

    const queue = "Data";

    channel.assertQueue(queue, {
      durable: false,
    });

    channel.consume(queue, async function (msg) {
      console.log(" [x] Received %s", msg.content.toString());

      const payloaddata = JSON.parse(msg.content.toString());
      const data3 = payloaddata.reportType;
      console.log("=====> data3", data3);
      // --------------------------get a weekly data-------------------------------------------------------------------
      if (data3 == "weekly") {
        const currentdate = new Date(); // current date
        console.log(currentdate);
        const previousdate = new Date(
          currentdate.setDate(currentdate.getDate() - 1)
        );
        console.log(previousdate);
        const pastDate = currentdate.getDate() - 7;
        console.log("===============>", pastDate);

        const getdate = new Date(currentdate.setDate(pastDate));
        console.log(getdate);
        //

        const order = await database.collection("orders").aggregate([
          // Join with resturant table

          {
            $lookup: {
              from: "restaurants", // other table name
              localField: "restaurantID", // name of resturant table field
              foreignField: "_id", // name of order table field
              as: "resturant_info", // alias for resturant_info  table
            },
          },
          { $unwind: "$resturant_info" }, // $unwind used for getting data in object or for one record only

          // Join with user table
          {
            $lookup: {
              from: "users",
              localField: "userID",
              foreignField: "_id",
              as: "user_info",
            },
          },
          { $unwind: "$user_info" },
          // Join with item table

          {
            $lookup: {
              from: "items",
              localField: "ObjectId(item)",
              foreignField: "ObjectId(_id)",
              as: "item_info",
            },
          },
          { $unwind: "$item_info" },

          {
            $match: {
              createdAt: {
                $gte: new Date(getdate),
                $lt: new Date(previousdate),
              },
            },
          },
        ]);

        const data = await order.toArray();
        console.log("object data", data);
        const msg23 = JSON.stringify(data);
        // console.log("=>=>=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", msg23);

        channel.sendToQueue(queue, Buffer.from(msg23));
        console.log(" [x] Sent %s", msg23);
        var pdfdata2 = "";
        for (i = 0; i < data.length; i++) {
          pdfdata2 =
            pdfdata2 +
            `     
            <tr>  
            
            <td >${data[i]._id}</td>
            <td>${data[i].user_info.user_name}</td>
            <td>${data[i].resturant_info.restaurant_name}</td>
            <td>${data[i].item_info.items_name}</td>
            <td>${data[i].item[0].quantity}</td>
            <td>${data[i].isDelivered ? "YES" : "NO"}</td>
            <td>${data[i].status}</td>
            <td>${data[i].amount}</td>
            <td>${data[i].place}</td>
            <td>${data[i].landmark}</td>
            <td>${data[i].city}</td>
            <td>${data[i].pincode}</td>
            <td>${new Date(data[i].createdAt).toString().split("G")[0]}</td>
          
            </tr>`;
        }

        var pdfdata = `<html>
          <head>
          <style>
          table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
          }
        
          th {
            margin:5px;
            padding : 5px;
            border: 1px solid #ddd;
            text-align: center;
            font-size :13px 
          }
           
          td {
            padding:2px;
            border: 1px solid #ddd;
            text-align: left;
            font-size :13px
          }
 
          tr {
            padding:2px;
            font-size : 10px
          }

           
          </style>
          </head>
          <body>
          <div style="width:100%; height:100%; ">
          <div style="background-color:white;  text-align:center; margin-top:5px ;margin-bottom:5px ">
          <h2>Weekly Order Data</h2>
          <h4>
          ${moment(new Date(getdate)).format("DD MMMM YYYY")} - ${moment(
          new Date(previousdate)
        ).format("DD MMMM YYYY")}</h4>
          </div>

          <div style="margin: 20px ; ">
          <table ">
          <tr >
          <th style=" text-overflow:ellipsis" scope="col">Order ID</th>
          <th scope="col">Username</th>
          <th scope="col">Restaurant Name</th>
          <th scope="col">Items</th>
          <th scope="col">Quantity</th>
          <th scope="col">Delivered</th>
          <th scope="col">Status</th>
          <th scope="col">Amount</th>
          <th scope="col">Place</th>
          <th scope="col">Landmark</th>
          <th scope="col">City</th>
          <th scope="col">Pincode</th>
          <th scope="col">Created At</th>
          </tr>
          ${pdfdata2}
          
          </table>
          </div>
          </div>

        
          </body>
          </html>`;

        const test = fs.writeFileSync("data.html", pdfdata, "utf8", (err) => {
          if (err) console.log(err);
          else {
            console.log("File written successfully\n");
          }
        });

        const html = fs.readFileSync("data.html").toString();
        let options = {
          format: "A2",
          orientation: "portrait",
        };

        pdf
          .create(html, options)
          .toFile("./weekly_order_data.pdf", (err, req, res) => {
            if (err) return console.log(err);
            console.log("pdf succesfully created");
            console.log(" [x] Received %s", msg.content.toString());
          });

        return channel.close();
      }

      // --------------------------------------get a monthly data------------------------------------------------------
      else if (data3 === "monthly") {
        const getdata = await database.collection("orders").aggregate([
          {
            $lookup: {
              from: "restaurants", // other table name
              localField: "restaurantID", // name of users table field
              foreignField: "_id", // name of userinfo table field
              as: "resturant_info", // alias for userinfo table
            },
          },
          { $unwind: "$resturant_info" }, // $unwind used for getting data in object or for one record only

          // Join with user_role table
          {
            $lookup: {
              from: "users",
              localField: "userID",
              foreignField: "_id",
              as: "user_info",
            },
          },
          { $unwind: "$user_info" },
          {
            $lookup: {
              from: "items",
              localField: "(item[0].itemId)",
              foreignField: "(_id)",
              as: "item_info",
            },
          },
          { $unwind: "$item_info" },

          {
            $match: {
              createdAt: {
                $gte: new Date(getFirstDay),
                $lt: new Date(getLastDay),
              },
            },
          },
        ]);

        const data = await getdata.toArray();
        const msg2 = JSON.stringify(data);
        for (i = 0; i < data.length; i++) {
          console.log("monthly", data.length);
        }

        channel.sendToQueue(queue, Buffer.from(msg2));
        console.log(" [x] Sent %s", msg2);
        var pdfdata2 = "";
        for (i = 0; i < data.length; i++) {
          pdfdata2 =
            pdfdata2 +
            `   
            <tr>

                      
            <td>${data[i]._id}</td></br>
            <td>${data[i].user_info.user_name}</td>
            <td>${data[i].resturant_info.restaurant_name}</td>
            <td>${data[i].item_info.items_name}</td>
            <td>${data[i].item[0].quantity}</td>
            <td>${data[i].isDelivered ? "YES" : "NO"}</td>
            <td>${data[i].status}</td>
            <td>${data[i].amount}</td>
            <td>${data[i].place}</td>
            <td>${data[i].landmark}</td>
            <td>${data[i].city}</td>
            <td>${data[i].pincode}</td>
            <td>${
              new Date(data[i].createdAt).toString().split("G")[0]
            }</td></br>
                      </tr>`;
        }

        var pdfdata = `<html>
        <head>
        <style>
        table {
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }
      
        th {
          margin:5px;
          padding : 5px;
          border: 1px solid #ddd;
          text-align: center;
          font-size :13px
        }
         
        td {
          padding:2px;
          border: 1px solid #ddd;
          text-align: left;
          font-size :13px
        }

        tr {
          padding:2px;
          font-size : 10px
        }

         
        </style>
        </head>
        <body>
        <div style="width:100%; hight:100%">
        <div style="background-color:white;  text-align:center; margin-top:5px ;margin-bottom:5px ">
        <h2>Monthly Order Data</h2>
        <h4> ${moment(new Date(getFirstDay)).format("DD MMMM YYYY")} - ${moment(
          new Date(getLastDay)
        ).format("DD MMMM YYYY")}</h4>
        </div>

       
        ${pdfdata2}
        
        
        </div>

      
        </body>
        </html>`;

        const test = fs.writeFileSync("data2.html", pdfdata, "utf-8", (err) => {
          if (err) console.log(err);
          else {
            console.log("File written successfully\n");
          }
        });

        const html = fs.readFileSync("data2.html").toString();
        let options = {
          format: "A2",
          orientation: "portrait",
        };

        pdf
          .create(html, options)
          .toFile("./montly_order_data.pdf", (err, req, res) => {
            if (err) return console.log(err);
            console.log("pdf succesfully created");
            console.log(" [x] Received %s", msg.content.toString());
          });

        return channel.close();
      }
    });
  });
});

// {"reportType":"weekly"

// }
