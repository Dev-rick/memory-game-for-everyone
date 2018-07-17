
var isMobile = false; // initiate as false
// device detection as the full flipping animation caused problems in mobile devices so a few changes were necessary
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
  isMobile = true;
}

// all global variables
const restartButton = document.querySelector('i.restart');
restartButton.addEventListener('click', resetTheGame);
const playmodal = document.querySelector('.playmodal');
const endmodal = document.querySelector('.endmodal');
const deck = document.querySelector('div.deck');
const listOfStarsInModal = document.querySelectorAll('i.modal-star');
const playmodalFooter = document.querySelector('.playmodal-footer');
let listOfStars = document.querySelectorAll('i.score-star');
let count = 0;
let matchedCards = 0;
let starsLost = 0;
let clickedCard;
let firstCard;
let secondCard;

// first function which is called to remove the playmodal and reset the game to play
playmodalFooter.addEventListener('click', function () {
  playmodal.style.display = 'none';
  resetTheGame();
})

// reset everything
function resetTheGame () {
  stopClickEvent();
  matchedCards = 0;
  count = 0;
  counter(count);
  // reset the starsLost by adding the fa class which overrides the far class
  let listOfStarsWithoutFaClass = document.querySelectorAll('i.fa-star:not(.fa)');
  for (let i = 0; i < listOfStarsWithoutFaClass.length; i++) {
    listOfStarsWithoutFaClass.item(i).classList.add('fa');
  };
  // getting all the cards and put them in an array in order to shuffle them
  let cardsNodeList = document.querySelectorAll('div.back > i');
  let cardsArray = [];
  // converting NodeList into an array
  for (let i = 0; i < cardsNodeList.length; i++) {
    let card = String(cardsNodeList.item(i).outerHTML);
    cardsArray.push(card);
    // if mobile device remove already here the classes in order to have a proper flip
    if (isMobile === true) {
      cardsNodeList.item(i).parentElement.classList.remove('match', 'open', 'show');
    }
    // remove flip event so they flip back
    cardsNodeList.item(i).parentElement.parentElement.parentElement.classList.remove('flip');
  };
  // shuffle the deck
  cardsArray = shuffle(cardsArray);
  // replace the shuffled HTML code
  setTimeout(replaceOldHTML, 800, cardsNodeList, cardsArray);
  // add removed click event
  setTimeout(addRemovedClickEvent, 1000);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle (array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// replace old HTML with the shuffled HTML
function replaceOldHTML (cardsNodeList, cardsArray) {
  for (let i = 0; i < cardsArray.length; i++) {
    cardsNodeList.item(i).parentElement.parentElement.innerHTML = `<div class="front"></div><div class="back">${cardsArray[i]}</div>`
  }
}

// function which adds the right classes to the back if the a card was clicked
function showTheCard (event) {
  // get all the cards that are already shown
  let ListOfTwoCardsToBeCompared = document.querySelectorAll('.show');
  // check if event.target is on a card and if not enough cards has been already shown
  if (event.target != null && event.target.classList.contains('deck') === false && ListOfTwoCardsToBeCompared.length < 2) {
    // if clicked on the front of the card
    if (event.target.classList.contains('front') === true) {
      clickedCard = event.target.nextElementSibling;
      // if clicked on the back of the card
    } else if (event.target.classList.contains('back') === true) {
      clickedCard = event.target;
      // if clicked on the symbol
    } else if (event.target.nodeName.toLowerCase() === 'i') {
      clickedCard = event.target.parentElement;
    }
    // check if the card has not already been matched or is currently shown
    if (clickedCard.classList.contains('show') === false && clickedCard.classList.contains('match') === false) {
      // if mobile device the front has to be removed and the adding of the 'open'
      // class delayed in order to have a proper flipping function
      if (isMobile === true) {
        removeFront(clickedCard)
        setTimeout(addOpenEvent, 370, clickedCard);
      } else if (isMobile === false) {
        clickedCard.classList.add('open');
      }
      // flipp the card
      clickedCard.parentElement.parentElement.classList.add('flip');
      // remove the pointer
      clickedCard.parentElement.style.cursor = 'default';
      // add the showed class in order to know if the card has been clicked
      clickedCard.classList.add('show');
      // signal that a move happened
      count += 1;
      counter(count);
      // check how many cards are shown if 2 cards are shown check if they match
      ListOfTwoCardsToBeCompared = document.querySelectorAll('.show');
      if (ListOfTwoCardsToBeCompared.length === 2) {
        stopClickEvent();
        // delay matching function to make the game more realistic
        setTimeout(matchCheck, 370, ListOfTwoCardsToBeCompared);
      }
    }
  }
}

// remove the front of the card when showed or matched function (necessary for mobile devices)
function removeFront (clickedCard) {
  clickedCard.parentElement.removeChild(clickedCard.previousElementSibling);
}

// cards are checked if they match
function matchCheck (ListOfTwoCardsToBeCompared) {
  firstCard = ListOfTwoCardsToBeCompared.item(0);
  secondCard = ListOfTwoCardsToBeCompared.item(1);
  // checked if their symbols match
  if (String(firstCard.firstElementChild.classList) === String(secondCard.firstElementChild.classList)) {
    firstCard.classList.remove('show', 'open');
    secondCard.classList.remove('show');
    firstCard.classList.add('match');
    secondCard.classList.add('match');
    matchedCards += 2;
    // if 16 cards are matched the user win
    if (matchedCards === 16) {
      setTimeout(win(), 300);
    }
    // add the removed click event
    addRemovedClickEvent()
  } else {
    // if cards do not match add the class noMatch and give time to look at the not matching cards before reseting the,
    firstCard.classList.add('noMatch');
    secondCard.classList.add('noMatch');
    setTimeout(resetBothCards, 1500, firstCard, secondCard);
  }
}

// if cards do not match remove all classes and if mobile add the removed front and make the cursor reappear as a pointer
function resetBothCards (firstCard, secondCard) {
  if (isMobile === true) {
    addRemovedFront(firstCard, secondCard);
    // let the flipping back effect happen after the classes were removed --> necessary for mobile
    setTimeout(removeFlipEvent, 10, firstCard, secondCard);
    firstCard.classList.remove('noMatch', 'show', 'open');
    secondCard.classList.remove('noMatch', 'show', 'open');
  } else if (isMobile === false) {
    firstCard.parentElement.parentElement.classList.remove('flip');
    secondCard.parentElement.parentElement.classList.remove('flip');
    setTimeout(removeNoMatchShowOpenClasses, 300, firstCard, secondCard);
  }
  deck.addEventListener('click', showTheCard);
  firstCard.parentElement.style.cursor = 'pointer';
  secondCard.parentElement.style.cursor = 'pointer';
}

// if the user have 16 matchedCards a modal will display with its total moves and stars
function win () {
// remove the lost stars from the stars inModal by removing the fa class
  for (let i = 0; i < starsLost; i++) {
    listOfStarsInModal.item(2 - i).classList.remove('fa');
  }
  // display modal with a click event at the end and call the reset function
  endmodal.style.display = 'flex';
  const endmodalFooter = document.querySelector('.endmodal-footer');
  endmodalFooter.addEventListener('click', function () {
    endmodal.style.display = 'none';
    resetTheGame();
  });
}

// function which changes the number in the html moves and registers how many stars are lost
function counter (count) {
  let moves = document.querySelectorAll('.moves');
  // as one move counter is in the score-panel and one in score-panel-modal a for loop is necessary
  for (i = 0; i < moves.length; i++) {
    moves.item(i).textContent = count;
  }
  // checks if the user loses a star
  switch (count) {
    case 30:
      starsLost += 1;
      listOfStars.item(2).classList.remove('fa');
      break;
    case 45:
      starsLost += 1;
      listOfStars.item(1).classList.remove('fa');
      break;
    case 60:
      starsLost += 1;
      listOfStars.item(0).classList.remove('fa');
      break;
  }
}

// add removed front (necessary for mobile devices) for resetting or if show, open is removed
function addRemovedFront (firstCard, secondCard) {
  firstCard.parentElement.insertAdjacentHTML('afterbegin', `<div class="front"></div>`);
  secondCard.parentElement.insertAdjacentHTML('afterbegin', `<div class="front"></div>`);
}

function addOpenEvent (clickedCard) {
  clickedCard.classList.add('open');
}

function removeFlipEvent (firstCard, secondCard) {
  firstCard.parentElement.parentElement.classList.remove('flip');
  secondCard.parentElement.parentElement.classList.remove('flip');
}

function removeNoMatchShowOpenClasses (firstCard, secondCard) {
  firstCard.classList.remove('noMatch', 'show', 'open');
  secondCard.classList.remove('noMatch', 'show', 'open');
}

// remove the click events
function stopClickEvent () {
  deck.removeEventListener('click', showTheCard);
}

// add removed click events
function addRemovedClickEvent () {
  deck.addEventListener('click', showTheCard);
}
