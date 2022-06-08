document.addEventListener('DOMContentLoaded', function (){

    let buttonsImagesMap = new Map();
    // default timer
    document.getElementById('timer-i').innerHTML = '2:30';
    // disable all card buttons
    document.querySelectorAll('.btn').forEach(btn => {btn.disabled = true;});
    // at level btn click do the following
    document.querySelector('#levels-div').addEventListener('click', e=>{
        const buttonId = e.target.id;
        selectGameLevel(buttonId);
        buttonsImagesMap = assignImagesToButtons();
        flipAllImages(buttonsImagesMap);
        // resetTimeAndStart();
    });
    
    // arrays to keep track of wether a btn-img is temporarly or permenantly flipped
    let tempFlippedButtons = new Array();
    let permFlippedButtons = new Array();

    // click event handler
    document.querySelector('#buttons-div').addEventListener('click', e=>{
        const buttonId = e.target.id;
        flipAndMatch(buttonId, buttonsImagesMap, tempFlippedButtons, permFlippedButtons);
        document.querySelector('#buttons-div').style.backgroundImage = 'none';
    });

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
}

function assignImagesToButtons(){
    // map to store the mapping between btns and images
    let buttonsImagesMap = new Map();

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

    document.querySelectorAll('.btn').forEach(btn=>{
        const btnId = btn.id;
        // find a random number between 0 and numbers.length-1
        const randomIndex = Math.floor(Math.random() * imageIndexes.length);
        const imageIndex = imageIndexes[randomIndex];
        // store the pair in a map for matching calculation later
        buttonsImagesMap.set(btnId, backgroundImages[imageIndex].url);
        // remove the number from array, so above random expression works correctly at all time
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
}

function resetAndStartGame(){

}

function flipAndMatch(buttonId, buttonsImagesMap, tempFlippedButtons, permFlippedButtons){

    const buttonElem = document.getElementById(`${buttonId}`);
    buttonElem.style.backgroundImage = buttonsImagesMap.get(buttonId);

    // if button image flipped permenantly, it cant be flipped temporarly
    if(!permFlippedButtons.includes(buttonId)){
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
        permFlippedButtons.push(buttonId1);
        permFlippedButtons.push(buttonId2);
        // enable all btns after the two imgs unflipped
        document.querySelectorAll('.btn').forEach(btn => {
        btn.disabled = false;});
        tempFlippedButtons.splice(0, tempFlippedButtons.length);
    } else {
        // wait one second and unflipp them
        setTimeout(unflipp, 1000, buttonId1, buttonId2);
        setTimeout(function()
        {
            // enable all btns after the two imgs unflipped
            document.querySelectorAll('.btn').forEach(btn => {
            btn.disabled = false;});
            tempFlippedButtons.splice(0, tempFlippedButtons.length);
        }, 1000);
    }

    // clear the temp flipped buttons 
    // tempFlippedButtons.splice(0, tempFlippedButtons.length);
    //enable buttons after matching process is complete
    // if(tempFlippedButtons.length===0){
    //     console.log('timeout');
    //     setTimeout(function()
    //     {
    //         // enable all btns after the two imgs unflipped
    //         document.querySelectorAll('.btn').forEach(btn => {
    //         btn.disabled = false;});
    //     }, 1000);
    // }
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