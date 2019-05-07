const puppeteer = require('puppeteer');
const INPUTLIST = require('./InputList');
const mongoose = require('mongoose');
const mongoDB = require('./models/mongo');

const listOfWords = INPUTLIST.word_with_8_characters;
const Word = mongoDB.changeFirstLetterForwardDB;

let id = 279;

async function run()
{
    const browser = await puppeteer.launch({ headless: false });
  
    const page = await browser.newPage();
    
    const SEARCH_BAR_SELECTOR = '#tsf > div:nth-child(2) > div > div.RNNXgb > div > div.a4bIc > input';
    const BUTTON_SELECTOR = '#tsf > div:nth-child(2) > div > div.FPdoLc.VlcLAe > center > input[type="submit"]:nth-child(1)';

    mongoose.connect("mongodb+srv://admin-sergey:Aa123456@cluster0-9gwac.mongodb.net/GOOGLE_AUTOMATION", { useNewUrlParser: true });

    const scriptEachLetterForward = (word) => {
        return word.replace(/[a-zA-Z]/g, function (letter){
            if (letter === 'z'){
                return 'a'
            }
            else if (letter === 'Z'){
                return 'A'
            }
            return String.fromCharCode(letter.charCodeAt(0) + 1);
        });
    }

    const changeFirstLetterForward = (word) => {
        if (word[0] === 'z') {
            return  'a' + word.slice(1);
        }
        else if (word[0] === 'Z') {
            return  'A' + word.slice(1);
        }
        else {
            return  String.fromCharCode(word.charCodeAt(0) + 1) + word.slice(1);
        }
    }

    for ( let i = 0; i < listOfWords.length; i++ ) {

        await page.goto('https://www.google.com');
      
        await page.click(SEARCH_BAR_SELECTOR);

        scriptedWorld = changeFirstLetterForward(listOfWords[i]);
      
        await page.keyboard.type(scriptedWorld);

        await page.click(BUTTON_SELECTOR);
      
        await page.waitForNavigation();

        if (await page.evaluate(() => document.querySelector('#taw > div:nth-child(2) > div > p > a > b > i'))){
            //The suggestion we received
            const suggestedWord = await page.evaluate(() => document.querySelector('#taw > div:nth-child(2) > div > p > a > b > i').textContent);

            if (suggestedWord === listOfWords[i] ) {

                word = new Word({
                    ID: id,
                    originalWord: listOfWords[i],
                    encryptedWord: scriptedWorld,
                    suggestedWord: suggestedWord,
                    hasSuggestion: true,
                    hasCorrectSuggestion: true
                });
                word.save();

                await page.screenshot({ path: 'screenshots/Successful_Suggestion/' + listOfWords[i] + '_' + id + '.png'});

            } else {

                word = new Word({
                    ID: id,
                    originalWord: listOfWords[i],
                    encryptedWord: scriptedWorld,
                    suggestedWord: suggestedWord,
                    hasSuggestion: true,
                    hasCorrectSuggestion: false
                });
                word.save();

                await page.screenshot({ path: 'screenshots/Unsuccessful_Suggestion/' + listOfWords[i] + '_' + id + '.png'});
            }
        } else {

            word = new Word({
                ID: id,
                originalWord: listOfWords[i],
                encryptedWord: scriptedWorld,
                hasSuggestion: false,
                hasCorrectSuggestion: false
            });
            word.save();

            await page.screenshot({ path: 'screenshots/No_Suggestion/' + listOfWords[i] + '_' + id + '.png'});
        }
        id++;
    };
    browser.close();
}

run();