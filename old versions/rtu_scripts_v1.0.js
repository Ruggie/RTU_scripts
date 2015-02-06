// Original Creator: Celarix (https://gist.github.com/Celarix/cd009edde135c196f6a8)
// Notes:
// ALWAYS EXPORT YOUR SAVE FILE BEFORE USING THIS
// THERE IS NO GUARANTEE THAT THIS WILL NOT MANGLE YOUR SAVE/DO OTHER TERRIBLE THINGS
// Feel free to use and reuse this code without restriction.

var seenUnit = 0;

function init(autobuyOn) {
	if (autobuyOn) {
		createMessageBar();
		setInterval(update, 100);
	}
	setInterval(function() {
		seeUnit(seenUnit);
	}, 1000);
}

function update() {
	var text = autobuy();
	setMessageBarText(text);
}

// HTML editing and display
function createMessageBar() {
	$('.navig').after($('<div class="clxmessagebar" style="color:white; font-size:200%; text-align:center">Hello, world!</div>'));
}

function setMessageBarText(text) {
	$('.clxmessagebar').text(text);
}

function seeUnit(that) {
	// yes, most of this is Genesis's code, but I have to override to show the cool data
    if (arUnit[that][16] || arUnit[that][8] == "quantum foam") {
        var stringName = arUnit[that][8].replace(/\s+/g, '-').toLowerCase();
        if (!(doc.getElementById("idImage").innerHTML.indexOf(stringName) > -1)) {
            if (stringName.toString().search('cat') == 0) stringName = 'cats-eye-nebula';
            doc.getElementById("idImage").innerHTML = "<img class='img-responsive' src='imagesFull/" + stringName.toString() + ".jpg'/>";
            doc.getElementById("idInfos").childNodes[0].innerHTML = arUnit[that][8];
            doc.getElementById('idInfos').childNodes[1].childNodes[0].innerHTML = description[that]; // Ã  changer
            doc.getElementById('idInfos').childNodes[2].innerHTML = (arUnit[that][19] != '') ? '10<SUP>' + arUnit[that][19] + '</SUP>' + ' ' + arUnit[that][0] : arUnit[that][1] + ' ' + arUnit[that][0];
            doc.getElementById('idInfos').childNodes[3].onclick = function() {
                tox10(that);
            };
            doc.getElementById('idInfos').childNodes[4].onclick = function() {
                tomax(that);
            };
        }
        allprogress(that);
		showUnitInfo(that);
		seenUnit = that;
    }
}

function showUnitInfo(unit) {
	doc.getElementById("idInfos").childNodes[1].childNodes[0].innerHTML = '<span style="font-size: 50%">' + getUnitInfo(unit) + '</span><br>' + description[unit];
}

function getUnitInfo(unit) {
	var nextAps = getNextUnitAPS(unit);
	var cost = getUnitCost(unit);
	var costx10 = getMultiUnitCost(unit, 10);
	var costx100 = getMultiUnitCost(unit, 100);
	var costnext = getMultiUnitCost(unit, Find_ToNext(unit)); // thanks spacemonster
	var bci = getNextUnitBCI(unit);
	var max = getMaxUnits(unit);
	var timeUntilx1 = (totalAtome < cost) ? beautifySeconds(getTimeUntilAtomAmount(cost)) : "Done";
	var timeUntilx10 = (totalAtome < costx10) ? beautifySeconds(getTimeUntilAtomAmount(costx10)) : "Done";
	var timeUntilx100 = (totalAtome < costx100) ? beautifySeconds(getTimeUntilAtomAmount(costx100)) : "Done";
	var timeUntilNext = (totalAtome < costnext) ? beautifySeconds(getTimeUntilAtomAmount(costnext)) : "Done";

	return "APS of next unit: " + beautifyNumber(nextAps) + ". Cost of 10: " + beautifyNumber(costx10) + ". Cost of 100: " + beautifyNumber(costx100) + ". Cost of next tier: " + beautifyNumber(costnext) +". Time until x1: " + timeUntilx1 + ". Time until x10: " + timeUntilx10 + ". Time until 100: " + timeUntilx100 + ". Time until next tier: " + timeUntilNext + ". Base cost per income: " + beautifyNumber(bci) + ". Max units: " + max + ".";
}

// Time functions
function getTimeUntilAtomAmount(amount) {
	if (totalAtome >= amount) { return 0; }
	return (amount - totalAtome) / (atomepersecond * prestige);
}

// Beautifiers
function beautifyNumber(n) {
	return rounding(n, false, 0);
}

function beautifySeconds(s) {
	// Credit to http://stackoverflow.com/a/6313008/2709212
	var hours   = Math.floor(s / 3600);
    var minutes = Math.floor((s - (hours * 3600)) / 60);
    var seconds = Math.floor(s - (hours * 3600) - (minutes * 60));

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time = hours+':'+minutes+':'+seconds;
    return time;
}

function indexOfSmallest(a) {
	// Credit to Raymond Chen (http://blogs.msdn.com/b/oldnewthing/archive/2014/05/26/10528351.aspx)
	var lowest = 0;
	for (var i = 1; i < a.length; i++) {
		if (a[i] < a[lowest]) lowest = i;
	}
	return lowest;
}

// Unit cost functions
function isStepBoundary(unitsOwned) {
	// Calculates if the next unit is the 5th, 25th, 50th, 75th, 100th, etc.
	return (unitsOwned === 4) || (unitsOwned == 24) ||
		   (unitsOwned == 49) || (unitsOwned == 74) ||
		   (unitsOwned == 99) || (unitsOwned == 149) ||
		   (unitsOwned == 199) || (unitsOwned == 249) ||
		   (unitsOwned == 299) || (unitsOwned == 349) ||
		   (unitsOwned == 399) || (unitsOwned == 449) ||
		   (unitsOwned == 499) || (unitsOwned == 599) ||
		   (unitsOwned == 699) || (unitsOwned == 799) ||
		   (unitsOwned == 899) || (unitsOwned == 999);
}

function getUnitCost(unit) {
	return arUnit[unit][2];
}

function getMultiUnitCost(unit, amount) {
	// Calculates the total cost of buying an amount of units
	var cost = getUnitCost(unit);
	var total = cost;

	for (var i = 0; i < amount - 1; i++) {
		cost += ((cost * arUnit[unit][3]) / 100);
		total += cost;
	}

	return total;
}

function getMaxUnits(unit) {
	// Calculates the total number of units you can buy with your current atoms
	var cost = getUnitCost(unit);
	var amount = 0;
	var totalAtoms = totalAtome;
	if (totalAtoms < cost) { return 0; }

	while (totalAtoms >= cost) {
		amount++;
		totalAtoms -= cost;
		cost += ((cost * arUnit[unit][3]) / 100);
	}

	return amount;
}

function getNextUnitBCI(unit) {
	return getUnitCost(unit) / getNextUnitAPS(unit);
}

function getMultiUnitBCI(unit, amount) {
	return getMultiUnitCost(unit, amount) / getMultiUnitAPS(unit, amount);
}

function getUnitsOwned(unit){
	return Number(arUnit[unit][4]);
}

// Unit APS functions
function getUnitAPS(unit) {
	return arUnit[unit][5] * prestige;
}

function getUnitTotalAPS(unit) {
	return calcDiff(unit);
}

function getNextUnitAPS(unit) {
	if (isStepBoundary(arUnit[unit][4])) {
		return getUnitAPS(unit) * 2;
	}
	return getUnitAPS(unit);
}

function getMultiUnitAPS(unit, amount) {
	var aps = 0;
	var owned = getUnitsOwned(unit);
	var multiplier = 1;

	for (var i = owned; i < amount + owned; i++) {
		if (isStepBoundary(i - 1)) {
			multiplier *= 2;
		}
		aps += (getUnitAPS(unit) * multiplier);
	}

	return aps;
}

// Bonus functions
function getBonusCost(unit, upgrade) {
	return bonusCost[unit][upgrade];
}

function getBonusMultiplier(upgrade) {
	return (upgrade + 1) / 100;
}

function getNumberOfBonusesPurchased(unit) {
	var result = 0;
	for (var i = 1; i <= 20; i++) {
		if (upgradeAll[unit][i] == 2) { result++; }
	}
	return result;
}

function getCurrentUnitAPSMultiplier(unit) {
	var bonusesPurchased = getNumberOfBonusesPurchased(unit);
	var result = 1;

	while (bonusesPurchased > 0) {
		result += (bonusesPurchased / 100);
		bonusesPurchased--;
	}

	return result;
}

function getNextBonusCost(unit) {
	var purchased = getNumberOfBonusesPurchased(unit);
	if (purchased === 20) { return 1/0; }
	return getBonusCost(unit, purchased);
}

function getNewAPSFromBonus(unit) {
	var unitTotalAPS = getUnitTotalAPS(unit);
	var unitCurrentMultiplier = getCurrentUnitAPSMultiplier(unit);
	var unitBaseAPS = unitTotalAPS / unitCurrentMultiplier;

	var newMultiplier = unitCurrentMultiplier + getBonusMultiplier(getNumberOfBonusesPurchased(unit)); // ah, 1-based and 0-based stuff in the same code
	return (unitBaseAPS * newMultiplier) - unitTotalAPS;
}

function getNextBonusBCI(unit) {
	return getNextBonusCost(unit) / getNewAPSFromBonus(unit);
}

// Specials functions
function getNextSpecialIndex() {
	for (var i = 0; i < allspec.length; i++) {
		if (allspec[i].done === false) {
			return i;
		}
	}
	return -1;
}

function getNextSpecialCost() {
	for (var i = 0; i < allspec.length; i++) {
		if (allspec[i].done === false) {
			return allspec[i].cost;
		}
	}
	return 1/0;
}

function getNextSpecialAPS() {
	var index = getNextSpecialIndex();
	if (index === -1) { return -1; }

	return getUnitTotalAPS(index) * 99; // multiplying APS by 100 is essentially adding aps*99 to it
}

function getNextSpecialBCI() {
	return getNextSpecialCost() / getNextSpecialAPS();
}

// Buying functions
function buyUnit(unit) {
	if (totalAtome >= getUnitCost(unit)) {
		calculsclick(unit);
	}
}

function buyUpgrade(unit) {
	var bonusNumber = getNumberOfBonusesPurchased(unit) + 1;
	upgrade(unit, bonusNumber);
}

function buySpecial() {
	specialclick(getNextSpecialIndex());
}

function autobuy() {
	// Automatically buy the best item based on BCI

	// create an array of unit BCIs
	var unitBCIs = new Array(75);
	for (var i = 0; i < 75; i++) {
		unitBCIs[i] = getNextUnitBCI(i);
	}

	// create an array of next bonus BCIs
	var bonusBCIs = new Array(75);
	for (var i = 0; i < 75; i++) {
		bonusBCIs[i] = getNextBonusBCI(i);
	}

	var nextSpecialBCI = getNextSpecialBCI();

	var bestUnitIndex = indexOfSmallest(unitBCIs);
	var bestBonusIndex = indexOfSmallest(bonusBCIs);

	var bestUnitBCI = unitBCIs[bestUnitIndex];
	var bestBonusBCI = bonusBCIs[bestBonusIndex];

	if (bestUnitBCI <= bestBonusBCI && bestUnitBCI <= nextSpecialBCI) {
		buyUnit(bestUnitIndex);
		return "Trying to buy " + arUnit[bestUnitIndex][8] + " (BCI: " + beautifyNumber(bestUnitBCI) + ")";
	}
	else if (bestBonusBCI <= bestUnitBCI && bestBonusBCI <= nextSpecialBCI) {
		var nextBonusNumber = getNumberOfBonusesPurchased(bestBonusIndex) + 1;
		if (upgradeAll[bestBonusIndex][nextBonusNumber] == 1) {
			buyUpgrade(bestBonusIndex);
			return "Trying to buy upgrade for " + arUnit[bestBonusIndex][8] + " (BCI: " + beautifyNumber(bestBonusBCI) + ")";
		}
		else {
			if (bestUnitBCI <= nextSpecialBCI) {
				buyUnit(bestUnitIndex);
				return "Trying to buy " + arUnit[bestUnitIndex][8] + " (BCI: " + beautifyNumber(bestUnitBCI) + ")";
			}
			else {
				buySpecial();
				return "Trying to buy Special (BCI: " + beautifyNumber(nextSpecialBCI) + ")";
			}
		}
	}
	else if (nextSpecialBCI <= bestUnitBCI && nextSpecialBCI <= bestBonusBCI) {
		buySpecial();
		return "Trying to buy Special (BCI: " + beautifyNumber(nextSpecialBCI) + ")";
	}

	return "Bought nothing";
}