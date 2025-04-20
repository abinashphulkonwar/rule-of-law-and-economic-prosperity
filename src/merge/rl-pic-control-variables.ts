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
interface rlWithPerCapitaWithGPD_EX_IM extends rl {
  "per capita": string;
  gdp: string;
  exports: string;
  imports: string;
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

interface WDI {
  "Country Code": string;
  "Series Name": string;
  "2001 [YR2001]": string;
  "2002 [YR2002]": string;
  "2003 [YR2003]": string;
  "2004 [YR2004]": string;
  "2005 [YR2005]": string;
  "2006 [YR2006]": string;
  "2007 [YR2007]": string;
  "2008 [YR2008]": string;
  "2009 [YR2009]": string;
  "2010 [YR2010]": string;
  "2011 [YR2011]": string;
  "2012 [YR2012]": string;
  "2013 [YR2013]": string;
  "2014 [YR2014]": string;
  "2015 [YR2015]": string;
  "2016 [YR2016]": string;
  "2017 [YR2017]": string;
  "2018 [YR2018]": string;
  "2019 [YR2019]": string;
  "2020 [YR2020]": string;
  "2021 [YR2021]": string;
  "2022 [YR2022]": string;
  "2023 [YR2023]": string;
}

interface WDI_process {
  "Country Code": string;
  gdp_2001: string;
  export_2001: string;
  import_2001: string;
  gdp_2002: string;
  export_2002: string;
  import_2002: string;
  gdp_2003: string;
  export_2003: string;
  import_2003: string;
  gdp_2004: string;
  export_2004: string;
  import_2004: string;
  gdp_2005: string;
  export_2005: string;
  import_2005: string;
  gdp_2006: string;
  export_2006: string;
  import_2006: string;
  gdp_2007: string;
  export_2007: string;
  import_2007: string;
  gdp_2008: string;
  export_2008: string;
  import_2008: string;
  gdp_2009: string;
  export_2009: string;
  import_2009: string;
  gdp_2010: string;
  export_2010: string;
  import_2010: string;
  gdp_2011: string;
  export_2011: string;
  import_2011: string;
  gdp_2012: string;
  export_2012: string;
  import_2012: string;
  gdp_2013: string;
  export_2013: string;
  import_2013: string;
  gdp_2014: string;
  export_2014: string;
  import_2014: string;
  gdp_2015: string;
  export_2015: string;
  import_2015: string;
  gdp_2016: string;
  export_2016: string;
  import_2016: string;
  gdp_2017: string;
  export_2017: string;
  import_2017: string;
  gdp_2018: string;
  export_2018: string;
  import_2018: string;
  gdp_2019: string;
  export_2019: string;
  import_2019: string;
  gdp_2020: string;
  export_2020: string;
  import_2020: string;
  gdp_2021: string;
  export_2021: string;
  import_2021: string;
  gdp_2022: string;
  export_2022: string;
  import_2022: string;
  gdp_2023: string;
  export_2023: string;
  import_2023: string;
}

const wdi: WDI[] = [];

const readWDI = async () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream("./WDI_Data.csv")
      .pipe(csvParser())
      .on("data", (data: WDI) => wdi.push(data))
      .on("end", () => {
        resolve(true);
      });
  });
};
const rlWithPerCapita: rlWithPerCapita[] = [];
const dataNotFound = new Set();

const merge = () => {
  const WDI = new Map<string, WDI_process>();
  wdi
    .filter((val) => {
      if (
        [
          // "Exports of goods and services (% of GDP)",
          "GDP (current US$)",
          //  "Imports of goods and services (% of GDP)",
        ].includes(val?.["Series Name"])
      )
        return true;
    })
    .forEach((val) => {
      WDI.set(val["Country Code"], {
        "Country Code": val["Country Code"],
        gdp_2001: val["2001 [YR2001]"],
        export_2001: "",
        import_2001: "",
        gdp_2002: val["2002 [YR2002]"],
        export_2002: "",
        import_2002: "",
        gdp_2003: val["2003 [YR2003]"],
        export_2003: "",
        import_2003: "",
        gdp_2004: val["2004 [YR2004]"],
        export_2004: "",
        import_2004: "",
        gdp_2005: val["2005 [YR2005]"],
        export_2005: "",
        import_2005: "",
        gdp_2006: val["2006 [YR2006]"],
        export_2006: "",
        import_2006: "",
        gdp_2007: val["2007 [YR2007]"],
        export_2007: "",
        import_2007: "",
        gdp_2008: val["2008 [YR2008]"],
        export_2008: "",
        import_2008: "",
        gdp_2009: val["2009 [YR2009]"],
        export_2009: "",
        import_2009: "",
        gdp_2010: val["2010 [YR2010]"],
        export_2010: "",
        import_2010: "",
        gdp_2011: val["2011 [YR2011]"],
        export_2011: "",
        import_2011: "",
        gdp_2012: val["2012 [YR2012]"],
        export_2012: "",
        import_2012: "",
        gdp_2013: val["2013 [YR2013]"],
        export_2013: "",
        import_2013: "",
        gdp_2014: val["2014 [YR2014]"],
        export_2014: "",
        import_2014: "",
        gdp_2015: val["2015 [YR2015]"],
        export_2015: "",
        import_2015: "",
        gdp_2016: val["2016 [YR2016]"],
        export_2016: "",
        import_2016: "",
        gdp_2017: val["2017 [YR2017]"],
        export_2017: "",
        import_2017: "",
        gdp_2018: val["2018 [YR2018]"],
        export_2018: "",
        import_2018: "",
        gdp_2019: val["2019 [YR2019]"],
        export_2019: "",
        import_2019: "",
        gdp_2020: val["2020 [YR2020]"],
        export_2020: "",
        import_2020: "",
        gdp_2021: val["2021 [YR2021]"],
        export_2021: "",
        import_2021: "",
        gdp_2022: val["2022 [YR2022]"],
        export_2022: "",
        import_2022: "",
        gdp_2023: val["2023 [YR2023]"],
        export_2023: "",
        import_2023: "",
      });
    });

  wdi
    .filter((val) => {
      if (
        [
          "Exports of goods and services (% of GDP)",
          //  "Imports of goods and services (% of GDP)",
        ].includes(val?.["Series Name"])
      )
        return true;
    })
    .forEach((val) => {
      const data = WDI.get(val["Country Code"]);
      if (!data) return;
      for (let year = 2001; year <= 2023; year++) {
        const key = `${year} [YR${year}]`;
        const gdpKey = `gdp_${year}`;
        const exportKey = `export_${year}`;
        // @ts-ignore
        data[exportKey] = `${
          // @ts-ignore
          (parseInt(val[key]) / 100) * parseInt(data[gdpKey])
        }`;
        // @ts-ignore
        if (data[exportKey] === "NaN") {
          WDI.delete(val["Country Code"]);
        }
      }
    });
  wdi
    .filter((val) => {
      if (
        ["Imports of goods and services (% of GDP)"].includes(
          val?.["Series Name"]
        )
      )
        return true;
    })
    .forEach((val) => {
      const data = WDI.get(val["Country Code"]);
      if (!data) return;
      for (let year = 2001; year <= 2023; year++) {
        const key = `${year} [YR${year}]`;
        const gdpKey = `gdp_${year}`;
        const exportKey = `import_${year}`;
        // @ts-ignore
        data[exportKey] = `${
          // @ts-ignore
          (parseInt(val[key]) / 100) * parseInt(data[gdpKey])
        }`;
        // @ts-ignore
        if (data[exportKey] === "NaN") {
          WDI.delete(val["Country Code"]);
        }
      }
    });

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
  const processedData: rlWithPerCapitaWithGPD_EX_IM[] = [];
  rlWithPerCapita.map((val) => {
    if (parseInt(val.year) < 2001) return;
    const data = WDI.get(val.code);
    if (!data) return;
    if (
      // @ts-ignore
      data[`gdp_${val.year}`] &&
      // @ts-ignore
      data[`export_${val.year}`] &&
      // @ts-ignore
      data[`import_${val.year}`]
    ) {
      processedData.push({
        ...val,
        // @ts-ignore
        gdp: data[`gdp_${val.year}`],
        // @ts-ignore
        exports: data[`export_${val.year}`],
        // @ts-ignore
        imports: data[`export_${val.year}`],
      });
    }
  });
  fs.writeFileSync(
    resolve(__dirname, "rl-pci-control.csv"),
    json2csv(processedData)
  );
};

const main = async () => {
  await readWDI();

  await readRl();
  await readPci();
  merge();
};
main();
