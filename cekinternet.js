const puppeteer = require('puppeteer');
const cron = require('node-cron');
const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');

async function main() {
   const cr = await puppeteer.launch({
      headless: false
   });

   const page = await cr.newPage();

   try {

      await page.goto("http://www.msftconnecttest.com/redirect", { timeout: 100000 });


      await page.waitForSelector("#wifiidLogin");
      
      await page.waitForSelector("#wifiidLogin > div.content-main.form > button");
      let btn = await page.$("#wifiidLogin > div.content-main.form > button");
      await btn.click();
      console.log("Logged In");

   } catch (err) {
      console.log(err);
   }

   await cr.close();
}

cron.schedule('* * * * *', () => {
   main();
});