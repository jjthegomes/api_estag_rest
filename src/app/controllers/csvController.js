import express from "express";
import fs from "fs";
import csvWriter from "csv-write-stream";
const router = express.Router();

router.post("/", async (req, res) => {
  const { data, csvFilename } = req.body;

  let writer = csvWriter({ sendHeaders: false }); //Instantiate const

  try {
    // If CSV file does not exist, create it and add the headers
    if (!fs.existsSync(csvFilename)) {
      writer = csvWriter({
        sendHeaders: false
      });
      writer.pipe(fs.createWriteStream(csvFilename));
      writer.write({
        Time_Rest: "Time Rest",
        Time_Graphql: "Time Graphql",
        Package_Size_Rest: "Package Size Rest",
        Package_Size_Graphql: "Package Size Graphql"
      });
      writer.end();
    }
  } catch (error) {
    console.log(error);
    res.send({ ERRO: "Could not create CSV file" });
  }

  try {
    // Append some data to CSV the file
    writer = csvWriter({
      sendHeaders: false
    });

    writer.pipe(
      fs.createWriteStream(csvFilename, {
        flags: "a"
      })
    );

    data.map(item => {
      writer.write({
        Time_Rest: item.timeR,
        Time_Graphql: item.timeG,
        Package_Size_Rest: item.sizeR,
        Package_Size_Graphql: item.sizeG
      });
    });

    writer.end();
    res.status(200).send({ msg: "OK" });
  } catch (error) {
    console.log(error);
    res.send({ ERRO: "Could not write on CSV file" });
  }
});

module.exports = app => app.use("/api/csv", router);
