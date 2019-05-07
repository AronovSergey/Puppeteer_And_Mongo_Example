const mongoose = require('mongoose');

let WordScheme = new mongoose.Schema({
    ID: Number,
    originalWord: String,
    encryptedWord: String,
    suggestedWord: String,
    hasSuggestion: Boolean,
    hasCorrectSuggestion: Boolean
});

let scriptEachLetterForwardDB = mongoose.model('scriptEachLetterForwardDB', WordScheme);
exports.scriptEachLetterForwardDB = scriptEachLetterForwardDB;

let changeFirstLetterForwardDB = mongoose.model('changeFirstLetterForwardDB', WordScheme);
exports.changeFirstLetterForwardDB = changeFirstLetterForwardDB;


