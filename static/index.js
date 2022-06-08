document.addEventListener('DOMContentLoaded', function (){

    // default timer
    document.getElementById('timer-i').innerHTML = '2:30';
    document.querySelector('#levels-div').addEventListener('click',function(e){chooseGameLevel(e);});

    // Seting up images and way to access them and assign them to btns 
    imageIndexes = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11];
    backgroundImages = [
        {url:"url('../img/avocado.png')"},
        {url:"url('../img/banana.png')"},
        {url:"url('../img/blueberry.png')"},
        {url:"url('../img/eggplant.png')"},
        {url:"url('../img/grapes.png')"},
        {url:"url('../img/mango.png')"},
        {url:"url('../img/pear.png')"},
        {url:"url('../img/pepper.png')"},
        {url:"url('../img/pumpkin.png')"},
        {url:"url('../img/strawberry.png')"},
        {url:"url('../img/tomato.png')"},
        {url:"url('../img/watermelon.png')"},
    ];
    
    // map to keep track of which img belong to which btn
    let buttonsImagesMap = new Map();
    // arrays to keep track of wether a btn-img is temporarly or permenantly flipped
    let tempFlippedButtons = new Array();
    let permFlippedButtons = new Array();

    // click event handler
    document.querySelector('#buttons-div').addEventListener('click', e=>{
        const buttonId = e.target.id;
        flipBtnAndMatchImg(buttonId, imageIndexes, backgroundImages, buttonsImagesMap, tempFlippedButtons, permFlippedButtons);
        document.querySelector('#buttons-div').style.backgroundImage = 'none';
    });
});

function chooseGameLevel(e){
    // find what button the user clicked within the div
    const buttonId = e.target.id;

    // determine the timing level and display it
    if(buttonId === 'easy-btn'){
        displayTimeAndBorder('easy');
    }
    else if (buttonId === 'inter-btn'){
        displayTimeAndBorder('inter');
    }
    else {
        displayTimeAndBorder('hard');
    }
}


function displayTimeAndBorder(level){
    if(level === 'easy'){
        document.getElementById('timer-i').innerHTML = '2:30';
        document.getElementById('easy-btn').style.border = "0.2rem solid white";
        document.getElementById('inter-btn').style.border = "hidden";
        document.getElementById('hard-btn').style.border = "hidden";
    }
    else if(level === 'inter'){
        document.getElementById('timer-i').innerHTML = '1:30';
        document.getElementById('easy-btn').style.border = "hidden";
        document.getElementById('inter-btn').style.border = "0.2rem solid white";
        document.getElementById('hard-btn').style.border = "hidden";
    }
    else {
        document.getElementById('timer-i').innerHTML = '1:00';
        document.getElementById('easy-btn').style.border = "hidden";
        document.getElementById('inter-btn').style.border = "hidden";
        document.getElementById('hard-btn').style.border = "0.2rem solid white";
    }

    resetAndStartGame();
}

function resetAndStartGame(){

}


function flipBtnAndMatchImg(buttonId, imageIndexes, backgroundImages, buttonsImagesMap, tempFlippedButtons, permFlippedButtons){

    const buttonElem = document.getElementById(`${buttonId}`);
    if(buttonsImagesMap.get(buttonId)){
        buttonElem.style.backgroundImage = buttonsImagesMap.get(buttonId);
    } 
    else{
        // find a random number between 0 and numbers.length-1
        const randomIndex = Math.floor(Math.random() * imageIndexes.length);
        const imageNum = imageIndexes[randomIndex];
        buttonElem.style.backgroundImage = backgroundImages[imageNum].url;
        // store the pair in a map for matching calculation
        buttonsImagesMap.set(buttonId, backgroundImages[imageNum].url);
        // remove the number from array, so above random expression works correctly all the time
        imageIndexes.splice(randomIndex, 1);
    }
    
    // if button image flipped permenantly, it cant be flipped temporarly
    if(!permFlippedButtons.includes(buttonId)){
        tempFlippedButtons.push(buttonId);
    }     
    // try to match images only if exactly two images are flipped temporarly
    if(tempFlippedButtons.length == 2){
        matchImages(buttonsImagesMap, tempFlippedButtons, permFlippedButtons);
    }
}



function matchImages(buttonsImagesMap, tempFlippedButtons, permFlippedButtons){
    // disable all other buttons when two are flipped temporarly
    document.querySelectorAll('.btn').forEach(btn => {
        btn.disabled = true;
    });

    // get the two imgs urls and btns ids from temp array
    const buttonId1 = tempFlippedButtons[0];
    const buttonId2 = tempFlippedButtons[1];
    const imgURL1 = buttonsImagesMap.get(buttonId1);
    const imgURL2 = buttonsImagesMap.get(buttonId2);
    // if urls/images match, add them to flipped permenantly list
    if(imgURL1 === imgURL2){
        permFlippedButtons.push(buttonId1);
        permFlippedButtons.push(buttonId2);
    } else {
        // wait one second and unflipp them
        setTimeout(unflipp, 1000, buttonId1, buttonId2);
    }

    // clear the temp flipped buttons 
    tempFlippedButtons.splice(0, tempFlippedButtons.length);
    //enable buttons after matching process is complete
    if(tempFlippedButtons.length===0){
        console.log('timeout');
        setTimeout(function()
        {
            document.querySelectorAll('.btn').forEach(btn => {
            btn.disabled = false;});
        }, 1000);
    }
}


function unflipp(button1, button2) {
    const buttonId1 = document.getElementById(`${button1}`);
    const buttonId2 = document.getElementById(`${button2}`);
    buttonId1.style.background = 'linear-gradient(45deg, #cc2b5e, #753a88)';
    buttonId1.style.backgroundPosition = 'center';
    buttonId1.style.backgroundRepeat = 'no-repeat';
    buttonId1.style.backgroundSize = 'cover';
    buttonId2.style.background = 'linear-gradient(45deg, #cc2b5e, #753a88)';
    buttonId2.style.backgroundPosition = 'center';
    buttonId2.style.backgroundRepeat = 'no-repeat';
    buttonId2.style.backgroundSize = 'cover';
}