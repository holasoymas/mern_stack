const mongoose = require("mongoose");

const DB = process.env.DB;

const isConnected = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      // ureCreateIndex: true,
      // useUnifiedTropology: true,
      // useFindAndModify: false,
    });
    console.log("Database Connected .......");
  } catch (error) {
    console.log(error);
  }
};
isConnected();
