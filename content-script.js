

function display(text){

    var floatWindow = document.getElementById("customFloatWindow");
    if (floatWindow) {
        var content = floatWindow.querySelector("div");
        content.textContent = text;
    
    } else {
        floatWindow = document.createElement("div");
        floatWindow.setAttribute("id", "customFloatWindow");
        floatWindow.style.position = "fixed";
        floatWindow.style.top = "20px";
        floatWindow.style.right = "20px";
        floatWindow.style.padding = "30px";
        floatWindow.style.backgroundColor = "white";
        floatWindow.style.color = "black";
        floatWindow.style.border = "1px solid #ccc";
        floatWindow.style.boxShadow = "0px 0px 5px rgba(0,0,0,0.3)";
        floatWindow.style.borderRadius = "20px";
        floatWindow.style.zIndex = "10000";

        floatWindow.style.maxWidth = "250px";
        floatWindow.style.minHeight = "100px";
        floatWindow.style.overflow = "hidden"; 
        floatWindow.style.resize = "both";

        var closeButton = document.createElement("button");
        closeButton.textContent = "X";
        closeButton.style.position = "absolute";
        closeButton.style.top = "0";
        closeButton.style.right = "0";
        closeButton.style.border = "none";
        closeButton.style.background = "red";
        closeButton.style.color = "white";
        closeButton.style.cursor = "pointer";
        closeButton.onclick = function() {
            floatWindow.remove(); 
        };
        var isDragging = false;
        var startX, startY;
        floatWindow.appendChild(closeButton);
        var content = document.createElement("div");
        
        content.style.fontSize = "16px";
        content.style.fontFamily = "SimSun, '宋体'";
        content.style.fontWeight = "bold";
        content.style.overflowWrap = "break-word"; // 允許自動換行
        content.textContent = text; 
        floatWindow.appendChild(content);

        floatWindow.addEventListener('mousedown', function(e) {
            var clickY = e.clientY - floatWindow.offsetTop;
        
            if (clickY >= 0 && clickY <= 20) {
                isDragging = true;
                startX = e.clientX - floatWindow.offsetLeft;
                startY = e.clientY - floatWindow.offsetTop;
                floatWindow.style.opacity = "0.8";
                e.preventDefault();
            }
            
        });
        floatWindow.addEventListener('mousemove', function(e) {
            if (isDragging) {
                var newX = e.clientX - startX;
                var newY = e.clientY - startY;
                floatWindow.style.left = newX + 'px';
                floatWindow.style.top = newY + 'px';
            }
        });

        floatWindow.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                floatWindow.style.opacity = "1";
            }
        });
        document.body.appendChild(floatWindow);
    }
}




chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.text) {
        chrome.storage.local.get('openAIKey', function(data) {
            fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${data.openAIKey}`
                },
                body: JSON.stringify({
                    "model": "gpt-4-turbo-preview",
                    "messages": [
                    {
                        "role": "system",
                        "content": "The user will send a piece of text. Please translate it into Traditional Chinese and return it. Keep proper nouns in their original language."
                    },
                    {
                        "role": "user",
                        "content": request.text
                    }
                    ],
                    "temperature": 1,
                    "max_tokens": 256,
                    "top_p": 1,
                    "frequency_penalty": 0,
                    "presence_penalty": 0
                }),
            })
            .then(response => {
                if(response.status==401){
                    chrome.runtime.sendMessage({ action: 'openOptionsPage' });
                }else{
                    response.json().then(data => {
        
                        const messageContent = data.choices[0].message.content;
                        display(messageContent)
                    })
                }
            })
            
            // .catch(error => console.error('Error:'+error));
        });
    }
});
