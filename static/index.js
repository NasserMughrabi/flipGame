let buttonsImagesMap = new Map();
let tempFlippedButtons = new Array();
let permFlippedButtons = new Array();

// disable all buttons until level chosen
document.querySelectorAll('.btn').forEach(btn => {btn.disabled = true;});

let time = 0;
let matches = 0;
let timerId = -1;
document.querySelector('#levels-div').addEventListener('click', e=>{
    disableLevelBtns();

    // level click = new round
    const buttonId = e.target.id;
    time = 0;
    matches = 0;
    document.querySelector('#result-h1').style.display = 'none';
    if(timerId !== -1){
        clearInterval(timerId);
        timerId = -1;
    }

    // clean these lists up every round
    buttonsImagesMap = new Map()
    tempFlippedButtons = new Array();
    permFlippedButtons = new Array();

    selectGameLevel(buttonId);
    buttonsImagesMap = assignImagesToButtons();
    flipAllImages(buttonsImagesMap);
});

// click event handler for cards btns
document.querySelector('#buttons-div').addEventListener('click', e=>{
    const buttonId = e.target.id;
    flipAndMatch(buttonId, buttonsImagesMap, tempFlippedButtons, permFlippedButtons);
    // disable div containing all btns from changing background at click
    document.querySelector('#buttons-div').style.backgroundImage = 'none';
});

function selectGameLevel(buttonId){
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
    const btnStyle = "0.2rem solid white";
    if(level === 'easy'){
        const startingMins = 2;
        time = startingMins * 60;
        document.getElementById('timer-i').innerHTML = '2:00';
        document.getElementById('easy-btn').style.border = btnStyle;
        document.getElementById('inter-btn').style.border = "hidden";
        document.getElementById('hard-btn').style.border = "hidden";
    }
    else if(level === 'inter'){
        const startingMins = 1;
        time = startingMins * 60;
        document.getElementById('timer-i').innerHTML = '1:00';
        document.getElementById('easy-btn').style.border = "hidden";
        document.getElementById('inter-btn').style.border = btnStyle;
        document.getElementById('hard-btn').style.border = "hidden";
    }
    else {
        const startingMins = 0.5;
        time = startingMins * 60;
        document.getElementById('timer-i').innerHTML = '0:30';
        document.getElementById('easy-btn').style.border = "hidden";
        document.getElementById('inter-btn').style.border = "hidden";
        document.getElementById('hard-btn').style.border = btnStyle;
    }
}

function assignImagesToButtons(){
    // map to store the mappings between btns and images
    let buttonsImagesMap = new Map();

    // array to limit using each image to exactly two times 
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

    // assiging images to btns 
    document.querySelectorAll('.btn').forEach(btn=>{
        const btnId = btn.id;
        const randomIndex = Math.floor(Math.random() * imageIndexes.length);
        const imageIndex = imageIndexes[randomIndex];
        buttonsImagesMap.set(btnId, backgroundImages[imageIndex].url);
        // remove the number from array, so above random expression works correctly at all times
        imageIndexes.splice(randomIndex, 1);
        
    });
    return buttonsImagesMap;
    
}

function flipAllImages(buttonsImagesMap){
    document.querySelectorAll('.btn').forEach(btn => {
        const btnId = btn.id;
        btn.style.backgroundImage = buttonsImagesMap.get(btnId);
    });
    
    setTimeout(unflippAllImages, 3500);
}

function unflippAllImages(){
    document.querySelectorAll('.btn').forEach(btn => {
        const btnId = btn.id;
        btn.style.background = 'linear-gradient(45deg, #cc2b5e, #753a88)';
        btn.style.backgroundPosition = 'center';
        btn.style.backgroundRepeat = 'no-repeat';
        btn.style.backgroundSize = 'cover';
    });

    // enable buttons
    document.querySelectorAll('.btn').forEach(btn => {btn.disabled = false;});
    
    // start timer and game
    StartGameTimer();
}

function StartGameTimer(){
    const timerElem = document.getElementById('timer-i');
    timerId = setInterval(()=>{
        // enable level btns after timer starts
        enableLevelBtns();
        const minutes = Math.floor(time/60);
        let seconds = time % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        timerElem.innerHTML = `${minutes}:${seconds}`;
        time--;
        if(time < 0 || matches === 12){
            clearInterval(timerId);
            if(matches === 12){
                displayGameResult('Win', '#5df35d');
            }else{
                displayGameResult('Lose', '#f14242');
            }
        }
    }, 1000);
}


function displayGameResult(result, color){
    const resultElem = document.querySelector('#result-h1');
    resultElem.innerHTML = `You ${result}`;
    resultElem.style.color = color;
    resultElem.style.display = 'block';
    document.querySelectorAll('.btn').forEach(btn => {
        btn.disabled = true;
    });
}

function flipAndMatch(buttonId, buttonsImagesMap, tempFlippedButtons, permFlippedButtons){

    const buttonElem = document.getElementById(`${buttonId}`);
    buttonElem.style.backgroundImage = buttonsImagesMap.get(buttonId);

    // if button image flipped permenantly, it cant be flipped temporarly
    if(!permFlippedButtons.includes(buttonId) && tempFlippedButtons[0] !== buttonId){
        tempFlippedButtons.push(buttonId);
    }     
    // try to match images only if exactly two images are flipped temporarly
    if(tempFlippedButtons.length >= 2){
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
        matches++;
        permFlippedButtons.push(buttonId1);
        permFlippedButtons.push(buttonId2);
        // enable all btns after the two imgs unflipped
        document.querySelectorAll('.btn').forEach(btn => {
        btn.disabled = false;});
    } else {
        // wait one second and unflipp them
        setTimeout(unflipp, 1000, buttonId1, buttonId2);
        setTimeout(function()
        {
            // enable all btns after the two imgs unflipped
            document.querySelectorAll('.btn').forEach(btn => {
            btn.disabled = false;});
        }, 1000);
    }
    tempFlippedButtons.splice(0, tempFlippedButtons.length);
}

function enableLevelBtns (){
    document.querySelector('#easy-btn').disabled = false;
    document.querySelector('#inter-btn').disabled = false;
    document.querySelector('#hard-btn').disabled = false;
}

function disableLevelBtns (){
    document.querySelector('#easy-btn').disabled = true;
    document.querySelector('#inter-btn').disabled = true;
    document.querySelector('#hard-btn').disabled = true;
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