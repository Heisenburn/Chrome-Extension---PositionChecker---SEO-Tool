export const showCurrentTab = () =>{

 

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {function: "getCityAndPhrase"}, function(response) {
          
            console.log(response.city);
            console.log(response.phrase);

            document.querySelectorAll("#locations ul li").forEach(item =>{

                if(item.innerText.toLowerCase() == response.city){
                    item.classList.add("clickedButton")
                }
            })
    
        });
      });



 
}