 //Open new city

 document.querySelectorAll('#locations li').forEach(clickedCity => {
   clickedCity.addEventListener('click', event => {
  


    document.querySelectorAll("iframe").forEach(item=>{
      item.remove();
    })

     const newIframes = [`https://www.google.com/search?igu=1&ei=&q=esperal+${event.target.innerHTML}`,`https://www.google.com/search?igu=1&ei=&q=detoks+alkoholowy+${event.target.innerHTML}`,`https://www.google.com/search?igu=1&ei=&q=wszywka+alkoholowa+${event.target.innerHTML}`,`https://www.google.com/search?igu=1&ei=&q=odtrucie+alkoholowe+${event.target.innerHTML}`,`https://www.google.com/search?igu=1&ei=&q=leczenie+alkoholizmu+${event.target.innerHTML}`, `https://www.google.com/search?igu=1&ei=&q=leczenie+uzależnień+${event.target.innerHTML}`]


     for (let i = 0; i < newIframes.length; i++) {

       let iframe = document.createElement('iframe');
       iframe.src = newIframes[i];
       document.querySelector("#searchResults").appendChild(iframe);

     }


     


     


     // showCurrentTab();


   })
 })