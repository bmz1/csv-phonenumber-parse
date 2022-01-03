import { createReadStream, writeFileSync } from "fs";
import { join, dirname } from "path";
import csvParser from "csv-parser";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { fileURLToPath } from "url";
import chalk from "chalk";
import pkg from "google-libphonenumber";

const { PhoneNumberUtil, PhoneNumberFormat } = pkg;

const phoneUtil = PhoneNumberUtil.getInstance();

const log = console.log;
const __dirname = dirname(fileURLToPath(import.meta.url));
const argv = yargs(hideBin(process.argv)).argv;

log(chalk.green("Starting..."));

const results = [];

parseCSV();

async function parseCSV() {
  return new Promise((resolve, reject) => {
    createReadStream(join(__dirname, "..", argv.file))
      .pipe(csvParser({ separator: "," }))
      .on("data", (data) => {
        const phone = Object.keys(data).find((key) =>
          key.toLocaleLowerCase().includes("phone")
        );
        const phoneNumber = data[phone];
        if (phoneNumber) {
          const p = phoneUtil.parse(phoneNumber);
          if (phoneUtil.isValidNumber(p)) {
            results.push(phoneUtil.format(p, PhoneNumberFormat.E164));
          }
        }
      })
      .on("end", () => {
        console.log(results.length);
        writeFileSync(
          join(__dirname, "..", `${argv.file}_phone_numbers.txt`),
          JSON.stringify(results)
        );
        log(
          chalk.green("There you go Sir! OMG, very big array!", results.length)
        );
        resolve();
      })
      .on("error", (err) => {
        reject();
      });
  });
}
