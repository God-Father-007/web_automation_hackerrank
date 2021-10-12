
const pup = require("puppeteer")

let tab;
let id = "your-email-id";
let ass = "your-pssword";

let browserPromise = pup.launch({
    headless: false,
    defaultViewport: false
});

browserPromise.then(function(browser){
    let pagesPromise = browser.pages();
    return pagesPromise;
}).then(function(pages){
    tab = pages[0];
    let pagePromise = tab.goto("https://www.hackerrank.com/auth/login")
    return pagePromise;
}).then(function(){
    let idPromise = tab.type('#input-1',id);
    return idPromise;
}).then(function(){
    let passPromise = tab.type('#input-2',pass);
    return passPromise;
}).then(function(){
    let loginPromise = tab.click('.ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled');
    return loginPromise;
}).then(function(){
    let waitPromise = tab.waitForSelector('#base-card-1-link', {visible : true});
    return waitPromise;
}).then(function(){
    let ipkitPromise = tab.click('#base-card-1-link');
    return ipkitPromise;
}).then(function(){
    let waitPromise = tab.waitForSelector('a[data-attr1="warmup"]',{visible:true});
    return waitPromise;
}).then(function(){
        let wucPromise  = tab.click('a[data-attr1="warmup"]');
    return wucPromise;
}).then(function(){
    let waitPromise = tab.waitForSelector('.js-track-click', {visible:true});
    return waitPromise;
}).then(function(){
    let challengesPromise = tab.$$('.js-track-click');
    return challengesPromise;
}).then(function(taglist){
    let promises = [];
    for( let tag of taglist) {
        let urlFetchPromise = tab.evaluate(function(ele){
            return ele.getAttribute("href");
        },tag);
        promises.push(urlFetchPromise);
    }
    return Promise.all(promises);
}).then(function(urls){
    let solveQuePromise = solveQuestion('https://www.hackerrank.com' + urls[0]);
    for(let i=1;i<urls.length;i++) {
        solveQuePromise = solveQuePromise.then(function(){
            return solveQuestion('https://www.hackerrank.com' + urls[i]);
        });
    }
})

function solveQuestion(url){
    let problemURL = url;
    let editorialURL = url.replace('?', '/editorial?');
    return new Promise(function(resolve,reject){
        tab.goto(editorialURL).then(function(){
            let languagePromise = tab.$$('.hackdown-content h3')
            return languagePromise;
        }).then(function(languages){
            let allLang = [];
            for(let lang of languages) {
                let getLangPromise = tab.evaluate(function(ele){
                    return ele.textContent;
                },lang);
                allLang.push(getLangPromise);
            }
            return Promise.all(allLang);
        }).then(function(data){
            for(let i in data) {
                if(data[i] == 'C++') {
                    let answerPromise =  tab.$$('.highlight').then(function(sol){
                        let finalAnsPromise = tab.evaluate(function(ele){
                            return ele.textContent;
                        },sol[i])
                        return finalAnsPromise;
                    });
                    return answerPromise;
                }
            }
        }).then(function(data){
            return tab.goto(problemURL).then(function(){
                let checkBoxWaitPromise = tab.waitForSelector('.checkbox-input',{visible:true});
                return checkBoxWaitPromise;
            }).then(function(){
                let checkBoxClickPromise = tab.click('.checkbox-input');
                return checkBoxClickPromise;
            // }).then(function(){
            //     let textareaWaitPromise = tab.waitForSelector('.input-wrap',{visible:true});
            //     return textareaWaitPromise;
            // }).then(function(){
            //     let textareaClickPromise = tab.click('.input-wrap');
            //     return textareaClickPromise;
            }).then(function(){
                let typeAnsPromise = tab.type('.custominput',data);
                return typeAnsPromise;
            }).then(function(){
                let copyTextPromise = tab.keyboard.down('Control').then(function(){
                    return tab.keyboard.press('A').then(function(){
                        return tab.keyboard.press('X').then(function(){
                            return tab.keyboard.up('Control');
                        })
                    })
                })
                return copyTextPromise;
            }).then(function(){
                return tab.click('.monaco-scrollable-element.editor-scrollable.vs').then(function(){
                    return tab.keyboard.down('Control').then(function(){
                        return tab.keyboard.press('A').then(function(){
                            return tab.keyboard.press('V').then(function(){
                                return tab.keyboard.up('Control');
                            })
                        })
                    })
                })
            }).then(function(){
                return tab.click('.ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled');
            })
        }).then(function(){
            resolve();
        });
    });
}