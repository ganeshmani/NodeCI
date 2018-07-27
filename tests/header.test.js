//const puppeteer = require('puppeteer');
const Page = require('./helpers/page');

let page;

beforeEach(async() =>{

    page = await Page.build();

    //  browser = await puppeteer.launch({
    //     headless : false
    // });

    
    //  page = await browser.newPage();

    await page.goto('http://localhost:3000');

});

afterEach( async () => {

    await page.close();

});

test('Checking Header text',async ()=>{
   
    //const text = await page.$eval('a.brand-logo',el => el.innerHTML);
    const text = await page.getContentsof('a.brand-logo');

    expect(text).toEqual('Blogster');
})

test('header oauth',async () => {
    await page.click('.right a');

    const url = await page.url();

    console.log(url);
   
})

test('when signed in,show logout button',async () => {
    //const id = '5b4c91e969ee75064dcafcfc';
      await page.login();  


      const text = await page.$eval('a[href="/auth/logout"]',el => el.innerHTML);

      expect(text).toEqual("Logout")

})