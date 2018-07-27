const Page = require('./helpers/page');

let page;

beforeEach(async ()=>{

    page = await Page.build();

    await page.goto('http://localhost:3000');

});


afterEach(async() => {
    await page.close();

});



describe('When logged in ',async()=>{

    beforeEach(async ()=>{

        await page.login();

        await page.click('a.btn-floating');
    });

    test('can see the blog form',async ()=>{


        const text = await page.getContentsof('form label');
    
        expect(text).toEqual('Blog Title');
    
    });


    describe('and using invalid inputs',async()=>{
        beforeEach(async () => {
            await page.click('form button');
        })

        test('the form shows an error message',async() => {
            const titleError = await page.getContentsof('.title .red-text');
            const contentError = await page.getContentsof('.content .red-text');

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');
        })
    })

    describe('and using valid inputs',async()=>{
        beforeEach(async()=>{
            await page.type('.title input','My Blog Automated');
            await page.type('.content input','My content Automated');
            await page.click('form button');
        })

        test('Submitting takes user to review screen',async()=>{
            const text =await page.getContentsof('h5');

            expect(text).toEqual('Please confirm your entries');
        });

        test('Submitting then saving adds blog to index page',async()=>{

            await page.click('button.green');
            await page.waitFor('.card');

            const title = await page.getContentsof('.card-title');
            const content  = await page.getContentsof('p');

            expect(title).toEqual('My Blog Automated');
            expect(content).toEqual('My content Automated');

        })
    })

});

describe('User is not logged in',async()=>{

    const actions = [
        {
            method: 'get',
            path:'/api/blogs'
        },
        {
            method : 'post',
            path : '/api/blogs',
            data : {
                title : 'POST Title',
                content : 'POST Content'
            }
        }
    ]

    test('Blog related actions are prohibited',async()=>{

        const results = await page.execRequests(actions);

        for(let result of results){
            expect(result).toEqual({ error : 'You must log in!' });
        }


    });

    // test('user cannot create a blog post',async()=>{


    //    const result = await page.post('/api/blogs',{ title: 'My Title',content : 'My Content' })

    //     expect(result).toEqual({ error : 'You must log in!' });


    // });


    // test('user cannot view a blog posts',async()=>{


    //     const result = await page.get('/api/blogs')
 
    //      expect(result).toEqual({ error : 'You must log in!' });
 
 
    //  });

})