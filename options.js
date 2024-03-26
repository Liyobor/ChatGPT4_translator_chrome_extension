document.getElementById('saveButton').addEventListener('click', function() {
    var apiKey = document.getElementById('apiKeyInput').value;
    chrome.storage.local.set({'openAIKey': apiKey}, function() {
        window.close();
    });
});
