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
    json: (context) => {
      return JSON.stringify(context);
    },
    utcToDate: (dateString) => {
      return dateString.split(" ").slice(1, 4).join(" ");
    },
    currency: (amount) => {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });
      return formatter.format(amount);
    },
    eq: (x, y) => {
      return x === y;
    },
  },
});
