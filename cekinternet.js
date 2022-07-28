const puppeteer = require('puppeteer');

async function main() {
   const cr = await puppeteer.launch({
      headless: false
   });

   const page = await cr.newPage();

   await page.goto("http://www.msftconnecttest.com/redirect");

   let isLogin = await page.$("#wifiidLogin");

   if(isLogin === null) {
      console.log("Koneksi Reset");
      let btn = await page.$("#wifiidLogin > div.content-main.form > button");
      await btn.click();
      await cr.close();
      return;
   } 

   console.log("Logged In");
   await cr.close();
   return;
}

module.exports = main;