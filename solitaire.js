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
	this.start = function() {
		this.createDeck();
		this.mixDeck();
		this.setUnorderedColumns();
		this.setDeck();
		this.checkCardFromColumn();
	}

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
				countCard.classList.add('exposed-deck');
				countCard.classList.add('card');
				countCard.classList.add(deck[i].suit + '_' + deck[i].seniority);
				countCard.classList.add(deck[i].colour);
				countCard.setAttribute('data-seniority', deck[i].seniority);	
				countCard.setAttribute('data-suit', deck[i].suit);			
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
	 	var placeForDeck = document.getElementById('deck');
	 	for(var i = 0; i < deck.length; i++) {
	 		deck[i].classList.remove('exposed-deck');
	 		deck[i].classList.add('compressed-deck');
	 		placeForDeck.appendChild(deck[i]);
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

	 		if(isNotValidForChecking(checkedCard)) {
	 			return;
	 		} 

	 		if(needToBeUnchecked(previousCard, checkedCard)) {
	 			if(previousCard.parentNode.id == 'checkbox' && checkedCard.parentNode.id == 'deck') {
	 				uncheck(previousCard);
	 			} else {	 			
	 				uncheck(checkedCard);
	 				return;
	 			}

	 		} 

	 		if(isDeck(event.target)){
	 			placeIntoCheckBox(event.target);
	 			return;
	 		}	

	 		if(checked) {	
	 			if(isOrderCell(checkedCard)){
	 				putCardInOrder(previousCard, checkedCard);
	 			} else {
	 				putCardOn(previousCard, checkedCard);
	 			}		 			
	 			return;
	 		} 

	 		if(checkedCard.classList.contains('empty-valid-sell')) {
	 			return;
	 		}

	 		checkAllBunch(checkedCard);
	 		previousCard = checkedCard;	 		
	 		return;
	 	});
	}

	var putCardOn = function(delivery, receiving) {
	 	var previous;
	 	while(delivery.previousSibling !== null && !delivery.previousSibling.classList.contains('closed')  && delivery.previousSibling.classList.contains('checked') && !receiving.classList.contains('ordered-deck')) {	 			 	
		 	previous = delivery.previousSibling;
		 	delivery = previous;	 		
	 	}	 	

	 	var deliveryColumn = delivery.parentNode;
	 	var receivingColumn = detectReceivingColumn(receiving);
	 	
	 	if(isKingValidOnly(delivery, receiving)) {	 		
	 		passThrougEachCardInSelectedBunchAndUncheckEveryCard(delivery, receiving, receivingColumn);	 			
	 		openCard(deliveryColumn);
	 		return;
	 	}

	 	if(isValidCollectionOrder(delivery, receiving)) {
	 		if(deliveryColumn.classList.contains('card-check-box')){
	 			delivery.classList.remove('compressed-deck');
	 			delivery.classList.add('exposed-deck');
	 		}
	 		passThrougEachCardInSelectedBunchAndUncheckEveryCard(delivery, receiving, receivingColumn);	 			
	 		openCard(deliveryColumn);
	 		return;
	 	}
	 	uncheck(delivery);
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

	var isValidCollectionOrder = function(deliveryCard, receivingCard) {
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
	 	return (target.classList.contains('card')) || (target.getAttribute('data-capacity') == 'empty') || (target.classList.contains('deck-cell') || (target.classList.contains('ordered-deck')));  
	}

	var isNotValidForChecking = function(target) {
		return target.classList.contains('closed') && target.parentNode.id != 'deck';	 			
	}

	var isDeck = function(target) {
	 	return target.parentNode.id == 'deck' || target.id == 'deck';
	}

	var isKingValidOnly = function(delivery, receiving) {
		return (receiving.getAttribute('data-capacity') == 'empty') && (delivery.getAttribute('data-seniority') == 'K');
	}

	var isOrderCell = function(target){
		return target.classList.contains('ordered-deck') || target.parentNode.classList.contains('ordered-deck');
	}

	var detectReceivingColumn = function(target) {
		if(target.classList.contains('column')) {
	 		return target;	 	
	 	}  else {
	 		return target.parentNode;
	 	} 
	}

	var placeIntoCheckBox = function(target) {
		var checkBox = document.getElementsByClassName('card-check-box');
		if(target.classList.contains('deck-cell')) {
			backDeck(checkBox[0].childNodes);
		} else {		
			target.classList.remove('closed');
			checkBox[0].appendChild(target);			
		}		
	}

	var backDeck = function(cardBunch) {
		var deckCell = document.getElementsByClassName('deck-cell');
		for(var i = cardBunch.length - 1; i >= 0; i--) {
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

	var passThrougEachCardInSelectedBunchAndUncheckEveryCard = function(delivery, receiving, receivingColumn) {
		var next;
		while(delivery != null) {
		next = delivery.nextSibling;
	 	receivingColumn.appendChild(delivery);
	 	delivery.classList.remove('checked');
	 	checked = false;
	 	receiving = delivery;
	 	delivery = next;
	 	}
	}

	
	var putCardInOrder = function(card, cell) {
		var delivery = card.parentNode;
		if(isCorrectOrderCardDeck(card, cell)) {
			if(card.classList.contains('exposed-deck')) {
				card.classList.remove('exposed-deck');
				card.classList.add('compressed-deck');
			}
			if(cell.classList.contains('ordered-deck')){				
				cell.appendChild(card);	
			} else {
				cell.parentNode.appendChild(card);	
			}	

		}
		uncheck(card);
		openCard(delivery);
		return;
	}
	
	var isCorrectOrderCardDeck = function(card, receiving){		
			var index;
			if(receiving.classList.contains('ordered-deck')) {
				index = receiving.childNodes.length;
				return card.getAttribute('data-seniority') == cardSeniority[index];
			} else {
				index = receiving.parentNode.childNodes.length;
				var itsCardSeniority = card.getAttribute('data-seniority');
				var needSeniority = cardSeniority[index];
				var itsCardSuit = card.getAttribute('data-suit');
				var needCardSuit = receiving.getAttribute('data-suit');				
				return ((itsCardSeniority == needSeniority) && (itsCardSuit == needCardSuit));
			}				
	}

	var uncheck = function(target) {
		var next;
		while(target != null) {
		next = target.nextSibling;
		target.classList.remove('checked');
		checked = false;
		target = next;
		}
	}

	var needToBeUnchecked = function(previousTarget, currentTarget){
		if(previousTarget == null) {
			return;
		} else if (previousTarget.parentNode.id == 'checkbox') {
			return currentTarget.parentNode.id == 'deck';
		} else {
			return currentTarget.classList.contains('checked');
		}
	}


}

var game = new Game();
game.start();






