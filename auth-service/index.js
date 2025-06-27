const express = require("express");
const app = express();
const authRouter = require("./controller/userController.js");

app.use(express.json());
app.use("/", authRouter);

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
console.log({ auth_service_server: "auth service started on port : 3001" });

// import http from "http";

// http
//   .createServer((req, res) => {
//     res.writeHead(200, { "Content-Type": "application/json" });

//     res.end(
//       JSON.stringify({
//         message: "hello api-gateway auth-service",
//         url: req.url,
//         headers: req.headers,
//       })
//     );
//   })
//   .listen(3001);

// console.log({ auth_service_server: "auth service started on port : 3001" });
