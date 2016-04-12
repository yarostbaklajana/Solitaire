//creating the Card Deck

// create constructor Card with properties
function Card(suit, seniority, colour, isOpened) { // prop. Colour means black or red colour
	this.seniority = seniority;
	this.suit = suit;
	this.colour = colour;
	this.isOpened = isOpened;
}

var cardSeniority = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 1, 'J', 'Q', 'K'];

var cardSuit = ['spades', 'hearts', 'diamonds', 'clubs'];


function Game() {
	var deck;
	this.createDeck = function(){
		deck = []; // now Card Deck is empty
		var nodeDeck = [];
		var i = 0;
		cardSuit.forEach(function(suit) {
			cardSeniority.forEach(function(seniority) {	
				if(suit == 'spades' || suit == 'hearts') {
					deck[i] = new Card(suit, seniority, 'red', false);
				} else {
					deck[i] = new Card(suit, seniority, 'black', false);
				}

				var countCard = document.createElement('DIV');
				countCard.classList.add('unordered');
				countCard.classList.add('card');
				countCard.classList.add(deck[i].suit + '_' + deck[i].seniority);
				countCard.classList.add(deck[i].colour);
				countCard.setAttribute('data-seniority', deck[i].seniority);				
				if(!deck[i].isOpened) {
				countCard.classList.add('closed');				
				} 
				nodeDeck.push(countCard);
				i++;
			});

		});
	deck = nodeDeck;
	return deck; 
	}

	this.mixDeck = function() {
		var countDeck = deck;
		var mixedDeck = [];
		var length = deck.length;	
		for(var j=0; j < length; j++) {
			var randomCard = Math.floor(Math.random() * (countDeck.length - 1));
			mixedDeck[j] = countDeck[randomCard];			
			countDeck.splice(randomCard, 1);
		}
	deck = mixedDeck;
	return deck;
	}

	
	this.setUnorderedColumns = function() {
		var columns = document.getElementsByClassName('column');
		var m = 0;
		for(var j = (columns.length - 1); j >= 0; j--) {			
			for(var t = (j+1); t > 0; t--) {					
				if(t == 1) {
					deck[m].classList.remove('closed');
				}
				columns[j].appendChild(deck[m]);							
				m++;											
			}

		}
		deck.splice(0, m);				
		return deck;
	}	

	this.setDeck = function() {
	 	var placeForDeck = document.getElementsByClassName('deck-cell');
	 	for(var i = 0; i < deck.length; i++) {
	 		deck[i].classList.remove('unordered');
	 		deck[i].classList.add('unordered-deck');
	 		placeForDeck[0].appendChild(deck[i]);
	 	}
	}	 


	var checked;
	var previousCard;
	this.checkCardFromColumn = function() {
	 	var container = document.getElementsByClassName('container');
	 	container[0].addEventListener('click', function(event) {
	 		var checkedCard = event.target;	 	

	 		if(!isActiveZone(event.target)) {
	 			return;
	 		}	

	 		if(isDeck(event.target)){
	 			placeIntoCheckBox(event.target);
	 		}

	 		if(checkedCard.classList.contains('closed') && !checkedCard.parentNode.
	 			classList.contains('deck-cell')) {
	 			return;
	 		} 

	 		if(checkedCard.classList.contains('checked')) {	 			
	 			var next;
		 			while(checkedCard != null) {
		 			next = checkedCard.nextSibling;
		 			checkedCard.classList.remove('checked');
		 			checked = false;
		 			checkedCard = next;
		 			}
	 			return;
	 		} 

	 		if(checked) {		
	 			putCardOn(previousCard, checkedCard);
	 			return;
	 		} 

	 		if(event.target.classList.contains('empty-valid-sell')) {
	 			return;
	 		}

	 		checkAllBunch(checkedCard);
	 		previousCard = checkedCard;	 		
	 		return;
	 	});
	}

	var putCardOn = function(delivery, receiving) {
	 	var previous;
	 	while(delivery.previousSibling !== null && !delivery.previousSibling.classList.contains('closed')  && delivery.previousSibling.classList.contains('checked')) {	 			 	
		 	previous = delivery.previousSibling;
		 	delivery = previous;	 		
	 	}
	 	
	 	var deliveryColumn = delivery.parentNode;	 	

	 	if(receiving.classList.contains('column')) {
	 		var receivingColumn  = receiving;
	 	} else {
	 		var receivingColumn = receiving.parentNode;
	 	}
	 	
	 	if((receiving.getAttribute('data-capacity') == 'empty') && (delivery.getAttribute('data-seniority') == 'K')) {
	 		receiving.classList.add('lightning');
	 		var next;
		 	while(delivery != null) {
		 	next = delivery.nextSibling;
		 	receivingColumn.classList.remove('empty-valid-sell');
		 	receivingColumn.appendChild(delivery);
		 	delivery.classList.remove('checked');
		 	checked = false;
		 	receiving = delivery;
		 	delivery = next;
		 	}	 			
	 		openCard(deliveryColumn);
	 		return;

	 	}

	 	if(isAppropriate(delivery, receiving)) {
	 		var next;
		 	while(delivery != null) {
		 	next = delivery.nextSibling;
		 	receivingColumn.appendChild(delivery);
		 	delivery.classList.remove('checked');
		 	checked = false;
		 	receiving = delivery;
		 	delivery = next;
		 	}	 			
	 		openCard(deliveryColumn);
	 	}	 	
	 	return;	 	
	}

	var openCard = function(column) {
	 	var length = column.childNodes.length;
	 	if(length == 0)  { 
	 		column.setAttribute('data-capacity', 'empty');
	 		column.classList.add('empty-valid-sell');
	 		return;
	 	}
	 	column.childNodes[length-1].classList.remove('closed');
	}

	var isAppropriate = function(deliveryCard, receivingCard) {
	 	var previous;
	 	while(deliveryCard.previousSibling != null  && deliveryCard.previousSibling.classList.contains('checked')) {
	 		previous = deliveryCard.previousSibling;
	 		deliveryCard = previous;
	 	}

	 	if((deliveryCard.classList.contains('red') && receivingCard.classList.contains('black')) || (deliveryCard.classList.contains('black') && receivingCard.classList.contains('red'))) {
		 	var deliverSeniority = deliveryCard.getAttribute('data-seniority');
		 	var receivingSeniority = receivingCard.getAttribute('data-seniority');
		 	var seniorString = cardSeniority.join('');
		 	var index = seniorString.search(deliverSeniority);		 	
		 	return receivingSeniority == cardSeniority[index+1];		 	
		} 	 	
		return false;
	}	

	var isActiveZone = function(target) {	
	 	return (target.classList.contains('card')) || (target.getAttribute('data-capacity') == 'empty') || (target.classList.contains('deck-cell'));  
	}

	var isDeck = function(target) {
	 	return target.parentNode.classList.contains('deck-cell') || target.classList.contains('deck-cell');
	}

	var placeIntoCheckBox = function(target) {
		var checkBox = document.getElementsByClassName('card-check-box');
		if(target.classList.contains('deck-cell')) {
			placeDeck(checkBox[0].childNodes);
		} else {		
			target.classList.remove('closed');
			checkBox[0].appendChild(target);
			
		}		
	}

	var placeDeck = function(cardBunch) {
		var deckCell = document.getElementsByClassName('deck-cell');
		for(var i =	0; i < cardBunch.length; i++) {
			cardBunch[i].classList.add('closed');
			deckCell[0].appendChild(cardBunch[i]);
		}
	}

	var checkAllBunch = function(target) {	 	 	
	 	var next;
	 	while(target != null && target.classList.contains('card')) {
	 		next = target.nextSibling;
	 		target.classList.add('checked');
	 		checked = true;
	 		target = next;
	 	}
	}
}

var game = new Game();

game.createDeck();

game.mixDeck();

game.setUnorderedColumns();
game.setDeck();
var checkColCard = game.checkCardFromColumn;
checkColCard();





