///fired only in iframe



 

const links = []; //actuall links from google result //sending it to firebase.js
var linkBoxes = document.querySelectorAll(".rc");

for (let k = 0; k < linkBoxes.length; k++) {

    links.push(document.querySelectorAll(".rc")[k].children[0].children[0].href) //make array of actuall links
}


//adds

var adsBoxes = document.querySelectorAll(".d5oMvf a");
var linkFromadsBoxes = []
for (let k = 0; k < adsBoxes.length; k++) {

    linkFromadsBoxes.push(adsBoxes[k].href)
}

for (let i = 0; i < linkFromadsBoxes.length; i++) {
    for (let j = 0; j < ourLinks.length; j++) {

        if (linkFromadsBoxes[i].includes(ourLinks[j])) {
            adsBoxes[i].style.background = 'rgba(0, 8, 255, 0.68)';



            break;

        } else {
            adsBoxes[i].style.background = 'rgba(255, 0, 0, 0.72)';
        }
    }
}



//organic
for (let i = 0; i < links.length; i++) {
    for (let j = 0; j < ourLinks.length; j++) {
        if (links[i].includes(ourLinks[j])) {
            linkBoxes[i].style.background = 'rgba(0, 8, 255, 0.68)';



            break;
        } else {
            linkBoxes[i].style.background = 'rgba(255, 0, 0, 0.72)';
        }
    }

    let number = document.createElement("BUTTON");
    number.innerText = i + 1;
    number.style.position = "relative";
    number.style.left = "0";
    number.style.top = "0";
    number.style.padding = "15px";
    number.style.fontSize = "15px";
    number.setAttribute("id", "numberButton");

    linkBoxes[i].insertBefore(number, linkBoxes[i].firstChild)

}

//articles

for (let i = 0; i < links.length; i++) {

    for (let j = 0; j < articles.length; j++) {
        if (links[i].includes(articles[j])) {
            linkBoxes[i].style.background = 'rgba(39, 206, 106, 0.96)';

            break;
        }
    }
}



const todayDate = new Date().toLocaleDateString();
 



const getCity = str => (str.split(" ").pop())
const getPhrase = str => (str.replace(getCity(str), ""))
const wholePhraseFromGoogle = document.querySelector(".gLFyf").value;

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {


        if (request.function == "getCityPhraseAndCurrentPositions")

            sendResponse({
                array: links,
                city: getCity(wholePhraseFromGoogle),
                phrase: getPhrase(wholePhraseFromGoogle)
            });

        if (request.function == "getCityAndPhrase")
            sendResponse({
                city: getCity(wholePhraseFromGoogle),
                phrase: getPhrase(wholePhraseFromGoogle)
            })

        if (request.function == "changeCompareDateGlobally"){

            document.querySelector("#boxWithInfo").innerHTML = ""; 
            showDifferenceInPositions(request.dateToCompare);
            
        }
    });




const compareDate = document.createElement("div")
compareDate.setAttribute("id", "compareDate")
compareDate.setAttribute("class", "wrapWords")
document.querySelector("#taw").appendChild(compareDate) //TODO: dołączane do DOMu w innym miejscu - selektor niebezpieczny :P

const boxWithInfo = document.createElement("div")
boxWithInfo.setAttribute("id", "boxWithInfo")
boxWithInfo.setAttribute("class", "wrapWords")
document.querySelector("#search").appendChild(boxWithInfo) 



//compare arrays


const compare = (oldArray, currentArray) => {

    removeDynamicallyCreatedElements();

    const differences = document.querySelectorAll(".differencePresentation");

    if (differences) { //if elements are in DOM remove them before displaying new differences (used when date to compare with is changed)

        differences.forEach(item => {
            item.remove();
        })

    }

    if (oldArray.toString() == currentArray.toString()) {


        boxWithInfo.innerHTML += "<h2 id='noDifferenceText'>brak różnic</h2>"

    }


    //Wrócił do top 10


    for (let i = 0; i < currentArray.length; i++) {


        if (oldArray.indexOf(currentArray[i]) == -1) {



            let differencePresentation = document.createElement("DIV");
            differencePresentation.setAttribute("class", "differencePresentation differenceBackToTop");

            differencePresentation.innerHTML += `Wrócił`;


            linkBoxes[i].children[0].after(differencePresentation)

        }

    }



    let i = 0;
    let j = 0;

    while (i < oldArray.length) {



        while (j < currentArray.length) {

            if (oldArray[i] == currentArray[j]) { //if elements are identical add 1 to both iterators

                i += 1;
                j += 1;
                break;

            } else {



                //   \/ fired when element is in list but on different position

                const newPositionOfElement = currentArray.indexOf(oldArray[
                    i]); //check position of element in currentArray

                if (newPositionOfElement == -1) { //spadek poniżej top 10


                    let ourPageFall = `<p>nasza strona <span style="color: blue">${oldArray[i]}</span> spadła z top 10 <br> była na pozycji: ${i+1}</p>`

                    let enemyFall = `<p>strona konkurencji <span style="color: red">${oldArray[i]}</span>  spadła z top 10 <br> była na pozycji ${i+1}</p>`

                    if (boxWithInfo.innerHTML != enemyFall || ourPageFall) { //check if already exists

                        let isOurLink = false;

                        ourLinks.forEach(item => {

                            if (oldArray[i].includes(item)) {

                                boxWithInfo.innerHTML += ourPageFall;
                                isOurLink = true;

                            }
                        })


                        if (isOurLink != true) {
                            boxWithInfo.innerHTML += enemyFall;
                        }


                    }



                } else {


                    const difference = newPositionOfElement - i;

                    if (newPositionOfElement > i) { //spadek


                        let differencePresentation = document.createElement("DIV");
                        differencePresentation.setAttribute("class", "differencePresentation differenceNegative");

                        differencePresentation.innerHTML = `<span>&#8595;</span> <p>${difference}</p>`;


                        let indexOfOldElementInNewArray = currentArray.indexOf(oldArray[
                            i])


                        linkBoxes[indexOfOldElementInNewArray].children[0].after(differencePresentation)

                        const previousPosition = document.createElement("h3")
                        previousPosition.classList.add("previousPosition");


                        previousPosition.innerHTML = `Wcześniejsza pozycja: ${i+1}`;
                        linkBoxes[indexOfOldElementInNewArray].parentElement.after(previousPosition)
                      

                    } else { //wzrost




                        let differencePresentation = document.createElement("DIV");
                        differencePresentation.setAttribute("class", "differencePresentation differencePositive");
                        differencePresentation.innerHTML = `<span>&#8593;</span> <p>${Math.abs(difference)}</p>`;


                        let indexOfOldElementInNewArray = currentArray.indexOf(oldArray[
                            i])

                        linkBoxes[indexOfOldElementInNewArray].children[0].after(differencePresentation)

                        const previousPosition = document.createElement("h3")
                        previousPosition.classList.add("previousPosition");
                        previousPosition.innerHTML = `Wcześniejsza pozycja: ${i+1}`;
                        linkBoxes[indexOfOldElementInNewArray].parentElement.after(previousPosition)
                       
                       
                    }



                }
                i += 1;
                j += 1;

            }
        }


    }



}



 
//immedietely at the startup show difference between current and last week positions


const showDifferenceInPositions = (givenDate = "12.10.2020") => { //default value

 
    compareDate.innerHTML = `<h2>Porównuje obecne pozycje z dniem: ${givenDate}<h2>`


    chrome.runtime.sendMessage({

        function: "getPositions",
        city: getCity(wholePhraseFromGoogle),
        phrase: getPhrase(wholePhraseFromGoogle),
        givenDate: givenDate

    }, (response) => {

        if (response.error) {
            boxWithInfo.innerHTML = `<h2>Brak frazy w bazie danych<h2>`

        } else {
            compare(response.array, links)
            
            
        }




    })
}


showDifferenceInPositions();






// zerowa pozycja = .hgKElc -> usuń xpdopen tylko w sytuacji gdy jest zerowa pozycja - zerowa pozycja jest dzieckiem xpdopen

if (document.querySelector(".hgKElc") == null || undefined) {
    if (document.querySelector(".xpdopen") != null || undefined) {

        document.querySelector(".xpdopen").style.display = "none";
        document.querySelector(".g-blk").style.display = "none";
    }

}

 const removeDynamicallyCreatedElements = ()=>{


    

    const previousPositionDynamicallyCreated = document.querySelectorAll(".previousPosition");

    if (previousPositionDynamicallyCreated) { //if elements are in DOM remove them before displaying new differences

        previousPositionDynamicallyCreated.forEach(item => {
            item.remove();

        })

    }

 }
 