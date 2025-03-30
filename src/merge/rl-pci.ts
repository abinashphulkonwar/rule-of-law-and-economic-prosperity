import csvParser from "csv-parser";
import { json2csv } from "json-2-csv";

import fs from "fs";
import { resolve } from "path";
interface rl {
  codeindyr: string;
  code: string;
  countryname: string;
  year: string;
  indicator: string;
  estimate: string;
  stddev: string;
  nsource: string;
  pctrank: string;
  pctranklower: string;
  pctrankupper: string;
}
interface rlWithPerCapita extends rl {
  "per capita": string;
}
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
const rl: rl[] = [];
const pci: pci[] = [];

const readRl = async () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream("./rl.csv")
      .pipe(csvParser())
      .on("data", (data: rl) => rl.push(data))
      .on("end", () => {
        resolve(true);
      });
  });
};

const readPci = async () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream("./pci-clean.csv")
      .pipe(csvParser())
      .on("data", (data: pci) => pci.push(data))
      .on("end", () => {
        resolve(true);
      });
  });
};

const rlWithPerCapita: rlWithPerCapita[] = [];
const dataNotFound = new Set();
const merge = () => {
  rl.forEach((rlItem) => {
    const pciItem = pci.find(
      (pciItem) => pciItem["Country Code"] === rlItem.code
    );
    if (!pciItem) {
      dataNotFound.add(`${rlItem.code} ${rlItem.countryname}`);
      return;
    }
    if (pciItem) {
      rlWithPerCapita.push({
        ...rlItem,
        // @ts-ignore
        "per capita": pciItem[rlItem.year],
      });
    }
  });
  console.log(
    "Merged data written to rl-pci.json",
    rlWithPerCapita.length,
    new Set(rlWithPerCapita.map((item) => item.code)).size
  );
  console.log("data not found for: ", dataNotFound.size);

  fs.writeFileSync(resolve(__dirname, "rl-pci.csv"), json2csv(rlWithPerCapita));
};

const main = async () => {
  await readRl();
  await readPci();
  merge();
};
main();
