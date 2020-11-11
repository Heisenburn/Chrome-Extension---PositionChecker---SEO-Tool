// Your web app's Firebase configuration
var firebaseConfig = {
//    PRIVATE
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


var db = firebase.firestore();

const todayDate = new Date().toLocaleDateString();



const addPhrase = (city, phrase, passedDate, array) => {



    db.collection(`${city.toLowerCase()}`).doc(`${phrase.toLowerCase()}`).set({
            date: {
                [passedDate]: array
            }
        }, {
            merge: true //<- add elements to doc instead of overwritting it
        })
        .then(function () {
            console.log("Document successfully written!");
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });

}




//GET DATA FROM FIREBASE

document.querySelector("#getDataButton").addEventListener("click", () => {


    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            function: "getCityAndPhrase"
        }, function (response) {


            console.log(`${response.city.toLowerCase()} and ${response.phrase.toLowerCase()}`);

            var docRef = db.collection(`${response.city.toLowerCase()}`).doc(`${response.phrase.toLowerCase()}`)


            docRef.get().then(function (doc) {
                if (doc.exists) {

                    console.log(`udało się! oto dane:`);
                    console.log(doc.data());
                } else {
                    console.log("taki dokument nie istnieje");
                }
            }).catch(function (error) {
                console.log(`inny błąd: ${error}`);
            });


        });
    });

});


//SEND DATA TO FIREBASE

document.querySelector("#sendDataButton").addEventListener("click", () => {


    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            function: "getCityPhraseAndCurrentPositions"
        }, function (response) {


            console.log(`wysyłam fraze: " ${response.phrase} ${response.city} " na serwer`)
            alert("wysłano")
            addPhrase(
                response.city,
                response.phrase,
                todayDate,
                response.array)

        });
    });

})



//get position for specific location + phrase + date

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {

        var docRef = db.collection(`${message.city.toLowerCase()}`).doc(`${message.phrase.toLowerCase()}`)


        if (message.function == "sendCurrentPositionsIfNotExists") {


            docRef.get().then(function (doc) {
                if (doc.exists) {


                    const dates = Object.keys(doc.data().date);



                    if (dates.indexOf(todayDate) == -1) {

                        addPhrase(
                            message.city,
                            message.phrase,
                            todayDate,
                            message.array)

                    }

                } else {
                    console.log("taki dokument nie istnieje");
                }
            }).catch(function (error) {
                console.log(`inny błąd: ${error}`);
            });

        }
        if (message.function == "getPossibleDates") {



            docRef.get().then(function (doc) {
                if (doc.exists) {


                    sendResponse({
                        dates: Object.keys(doc.data().date)

                    })

                } else {
                    console.log("taki dokument nie istnieje");
                }
            }).catch(function (error) {
                console.log(`inny błąd: ${error}`);
            });


        }


        if (message.function == "getPositions") {



            var docRef = db.collection(`${message.city.toLowerCase()}`).doc(`${message.phrase.toLowerCase()}`)

            docRef.get().then(function (doc) {
                if (doc.exists) {



                    sendResponse({
                        array: doc.data().date[`${message.givenDate}`]

                    })

                } else {

                    sendResponse({
                        error: "taki dokument nie istnieje"

                    })


                }
            }).catch(function (error) {
                console.log(`inny błąd: ${error}`);
            });

        }

        return true; //asynchrounously 
    });

//compare globally all iframes with specific date
document.querySelector("#compareWithAnotherDateGlobally").addEventListener('click', () => {





    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            function: "getCityAndPhrase"
        }, function (response) {



            var docRef = db.collection(`${response.city.toLowerCase()}`).doc(`${response.phrase.toLowerCase()}`)



            docRef.get().then(function (doc) {
                if (doc.exists) {




                    const dates = Object.keys(doc.data().date);

                    const select = document.createElement("select")

                    dates.forEach(item => {

                        let option = document.createElement("option")
                        option.setAttribute("value", item)
                        option.innerText = item

                        select.appendChild(option)


                    })

                    const sendSelect = document.createElement("button")
                    sendSelect.innerText = "Sprawdź"

                    const selectDateBox = document.querySelector("#selectDate")

                    selectDateBox.appendChild(select)
                    selectDateBox.appendChild(sendSelect)

                    sendSelect.addEventListener("click", () => {
                        const selectedDate = document.querySelector("select").value;


                    chrome.tabs.query({ //tell contescript to compare with selected date in each iframe
                        active: true,
                        currentWindow: true
                    }, function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            function: "changeCompareDateGlobally",
                            dateToCompare: selectedDate
                        }, function (response) {


                        });
                        });
                    });

                } else {
                    console.log("taki dokument nie istnieje");
                }
            }).catch(function (error) {
                console.log(`inny błąd: ${error}`);
            });

       
        })
    
    
    

        });
    });

 