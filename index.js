/**
 * This thing can cause your twitter account to be deactivated...
 * I'm still testing it in a new account
 *
 * البتاع ده ممكن يقفلك اكونت تويتر بتاعك.. جربه على اكونت جديد مش اكونتك الاصلي
 * انا لسه بختبره على اكونت جديد اما نشوف هيحصله ايه
 */

const EMAIL_ADDRESS = "email@gmail.com"; // حط ايميل تويتر هنا

const puppeteer = require("puppeteer");

const twitterBot = {
  browser: null,
  page: null,

  run: async () => {
    browser = await puppeteer.launch({
      // headless: false,
      // defaultViewport: null,
    });

    page = await browser.newPage();
  },

  login: async () => {
    await page.goto("https://twitter.com/login", { waitUntil: "networkidle2" });

    await page.type('input[name="session[username_or_email]"]', EMAIL_ADDRESS, {
      delay: 25,
    });
    await page.type('input[name="session[password]"]', process.argv[2], {
      delay: 25,
    });

    await page.click('div[data-testid="LoginForm_Login_Button"]');
  },

  writePost: async (text) => {
    await page.waitForSelector(".DraftEditor-editorContainer");
    await page.click(".DraftEditor-editorContainer");

    await page.keyboard.type(text, { delay: 25 });

    await page.waitFor(3000);

    await page.click('div[data-testid="tweetButtonInline"]');
  },

  getContent: async () => {
    await page.goto("https://xn--sgb8bg.net/", { waitUntil: "networkidle2" });

    const content = await page.$$eval("blockquote p", (results) => {
      return results.map((quote) => quote.innerText);
    });

    return content;
  },
};

(async function () {
  await twitterBot.run();
  console.log("RUN BOT ✔");

  const content = await twitterBot.getContent();
  console.log("GET CONTENT ✔");

  await twitterBot.login();
  console.log("LOGIN ✔");

  // i = 12 to start from the 12th post (you should change it to 0 to start from the begining)
  for (let i = 12; i < content.length; i++) {
    await twitterBot.writePost(content[i]);
    console.log(`POST ${i} ✔`);

    await page.waitFor(60000);
  }
})();
