import csvParser from "csv-parser";
import fs from "fs";

interface pci {
  "1990": string;
  "1991": string;
  "1992": string;
  "1993": string;
  "1994": string;
  "1995": string;
  "1996": string;
  "1997": string;
  "1998": string;
  "1999": string;
  "2000": string;
  "2001": string;
  "2002": string;
  "2003": string;
  "2004": string;
  "2005": string;
  "2006": string;
  "2007": string;
  "2008": string;
  "2009": string;
  "2010": string;
  "2011": string;
  "2012": string;
  "2013": string;
  "2014": string;
  "2015": string;
  "2016": string;
  "2017": string;
  "2018": string;
  "2019": string;
  "2020": string;
  "2021": string;
  "2022": string;
  "2023": string;
  "Country Name": string;
  "Country Code": string;
  "Indicator Name": string;
  "Indicator Code": string;
}

const readRl = async () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream("./rl.csv")
      .pipe(csvParser())
      .on("data", (data: pci) => {})
      .on("end", () => {
        resolve(true);
      });
  });
};

const main = async () => {
  await readRl();
};
main();
