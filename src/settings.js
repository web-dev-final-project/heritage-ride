import exphbs from "express-handlebars";
import path from "path";

const db_url = process.env.DB_SERVER;
const database = process.env.DB_NAME;

export const mongoConfig = {
  serverUrl: db_url,
  database: database,
};

export const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  layoutsDir: path.join(path.resolve(), "src/views/layouts"),
  partialsDir: path.join(path.resolve(), "src/views/partials"),
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === "number")
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
      return new Handlebars.SafeString(JSON.stringify(obj));
    },
    json: function (context) {
      return JSON.stringify(context);
    },
  },
});
