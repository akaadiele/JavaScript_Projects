// ----------------------------------------------------------------------------------------
// Variables
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let monsterFighting, monsterHealth;
let inventory = ["stick"];

// ----------------------------------------------------------------------------------------
// HTML DOM Elements
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monstersStats = document.querySelector("#monstersStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weaponText = document.querySelector("#weaponText");
const weaponsList = document.querySelector("#weapons-list");

// ----------------------------------------------------------------------------------------
// Game data
// Weapons - Information about the different weapons in the game and their power
const weapons = [
    {
        name: "stick",
        power: 5
    },
    {
        name: "dagger",
        power: 30
    },
    {
        name: "claw hammer",
        power: 50
    },
    {
        name: "sword",
        power: 100
    }
];

// Monsters - Information about the different monsters in the game
const monsters = [
    {
        name: "slime",
        level: 2,
        health: 20
    },
    {
        name: "fanged beast",
        level: 8,
        health: 60
    },
    {
        name: "dragon",
        level: 20,
        health: 300
    }
];

// Locations - Information about the different locations in the game
// The buttons that should be displayed in each location and the functions that should be called when those buttons are clicked
// The text that should be displayed in each location
const locations = [
    {
        index: 0,
        name: "Town Square",
        "button text": ["Go to store", "Go to cave", "Fight dragon"],
        "button functions": [goToStore, goToCave, fightDragon],
        text: "You are in the town square. You see a sign that says \"Store\""
    },
    {
        index: 1,
        name: "Store",
        "button text": ["Buy 10 health (10 Gold)", "Buy Weapon (30 Gold)", "Go to Town Square"],
        "button functions": [buyHealth, buyWeapon, goToTown],
        text: "You entered the store"
    },
    {
        index: 2,
        name: "Cave",
        "button text": ["Fight slime", "Fight fanged beast", "Go to Town Square"],
        "button functions": [fightSlime, fightFangedBeast, goToTown],
        text: "You entered the cave, you see some monsters"
    },
    {
        index: 3,
        name: "Fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goToTown],
        text: "You are fighting a monster"
    },
    {
        index: 4,
        name: "Kill Monster",
        "button text": ["Go to Town Square", "Go to Town Square", "Go to Town Square"],
        "button functions": [goToTown, goToTown, easterEgg],
        text: 'The monster screams "Arrgghhh!" as it dies \nYou gain experience and find gold.'
    },
    {
        index: 5,
        name: "Lose",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: 'You die.'
    },
    {
        index: 6,
        name: "Win",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: 'You defeat the dragon! \nYOU WIN THE GAME!'
    },
    {
        index: 7,
        name: "Easter Egg",
        "button text": ["2", "8", "Go to Town Square"],
        "button functions": [pick2, pick8, goToTown],
        text: 'You find a secret game! Pick a number above... \n\n 10 numbers will be randomly choose between 0 and 10, \nif the number you choose matches one of the numbers, You Win!'
    }
];


// ----------------------------------------------------------------------------------------
// Initialize onclick functions for buttons 
button1.onclick = goToStore;
button2.onclick = goToCave;
button3.onclick = fightDragon;

// ----------------------------------------------------------------------------------------
// Functions
function update(location) {
    // Dynamic function to update the buttons and text based on the location that is passed in as an argument

    // Hide the monster stats and weapons list when you go to a new location
    monstersStats.style.display = "none";
    weaponsList.style.display = 'none';

    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];

    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];

    text.innerText = location.text;
}


function goToTown() {
    update(locations[0]);
}

function goToStore() {
    update(locations[1]);

    weaponText.innerText = `"${inventory.join(", ")}"`;     // Update the weapons in the inventory shown in the store
    weaponsList.style.display = 'inline';     // Show weapons
}

function goToCave() {
    update(locations[2]);
}


function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;

        goldText.innerText = gold;
        healthText.innerText = health;
    } else {
        text.innerText = "You do not have enough gold to buy health"
    }
}

function buyWeapon() {
    if (currentWeapon < (weapons.length - 1)) {
        if (gold >= 30) {
            gold -= 30;
            currentWeapon++;

            goldText.innerText = gold;

            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "You now have a " + newWeapon;

            inventory.push(newWeapon);

            text.innerText += " \nIn the inventory, you have: " + inventory.join(", ");

            weaponText.innerText = `"${inventory.join(", ")}"`;     // Update the weapons in the inventory shown in the store
        } else {
            text.innerText = "You do not have enough gold to buy a weapon."
        }
    } else {
        text.innerText = "You already have the most powerful weapon.";

        // Change the second button to be the 'Sell weapon' button
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if ((currentWeapon > 1) && (inventory.length > 1)) {
        gold += 15;
        goldText.innerText = gold;

        let currentWeapon;      // using 'let' scopes to this if statement only
        currentWeapon = inventory.shift();

        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText += " \nIn the inventory, you have: " + inventory.join(", ");

        weaponText.innerText = `"${inventory.join(", ")}"`;     // Update the weapons in the inventory shown in the store
    } else {
        text.innerText = "Don't sell your only weapon!";
    }
}


function fightSlime() {
    monsterFighting = 0;
    fight();
}

function fightFangedBeast() {
    monsterFighting = 1;
    fight();
}

function fightDragon() {
    monsterFighting = 2;
    fight();
}

function fight() {
    update(locations[3]);

    monstersStats.style.display = "block";  // Show the monster stats when fighting a monster

    monsterHealth = monsters[monsterFighting].health;   // Get monster's health
    monsterName = monsters[monsterFighting].name;   // Get monster's name
    monsterName = monsterName.charAt(0).toUpperCase() + monsterName.slice(1);     // Capitalize the first letter of the monster's name

    monsterNameText.innerText = monsterName;
    monsterHealthText.innerText = monsterHealth;
}


function attack() {
    text.innerText = "The " + monsters[monsterFighting].name + " attacks.";
    text.innerText += " \nYou attack it with your " + weapons[currentWeapon].name + ".";

    // Check if the monster hits the player, if it does, decrease the player's health by the calculated attack value of the monster
    if (isMonsterHit()) {
        health -= getMonsterAttackValue(monsters[monsterFighting].level);
    } else {
        text.innerText += " \nYou miss.";
    }

    // Calculate a random XP value to add to the player's attack, this would make the attack value of the player more dynamic and less predictable
    let random_XP_value = Math.floor(Math.random() * xp) + 1;    // Getting a random number between 1 and the current xp
    monsterHealth -= weapons[currentWeapon].power + random_XP_value;

    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;

    if (health <= 0) {
        healthText.innerText = 0;
        lose();
    } else if (monsterHealth <= 0) {
        monsterHealthText.innerText = 0;
        monsterFighting === 2 ? winGame() : defeatMonster();
    }

    // 10% chance of your current weapon breaking during the battle
    // and the inventory would have more than 1 weapon
    if ((Math.random() <= .1) && (inventory.length !== 1)) {
        let brokenWeapon = inventory.pop();    // Removes the last elemenet in the array
        text.innerText += ` \nOoops! Your ${brokenWeapon} breaks`;

        currentWeapon--;

        weaponText.innerText = `"${inventory.join(", ")}"`;     // Update the weapons in the inventory shown in the store
    }
}

function getMonsterAttackValue(level) {
    let hit = (level * 5) - (Math.floor(Math.random() * xp));

    return hit;
}

function isMonsterHit() {
    return (Math.random()) > .2 || (health < 20);
    // Return 'True' if random number is greater that '0.2' or the player's health is less than 20
    // Random number will always be between 0 and 1, hence this would result in 80% chance of 'True'
}

function dodge() {
    text.innerText = "You dodged the attack from " + monsters[monsterFighting].name + ".";
}


function defeatMonster() {
    gold += Math.floor(monsters[monsterFighting].level * 6.7);
    xp += monsters[monsterFighting].level;

    goldText.innerText = gold;
    xpText.innerText = xp;

    update(locations[4]);
}

function lose() {
    update(locations[5]);
}

function restart() {
    // Reset all the game variables to their initial values
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["stick"];

    xpText.innerText = xp;
    healthText.innerText = health;
    goldText.innerText = gold;

    goToTown();
}

function winGame() {
    update(locations[6]);
}

// Hidden Easter Egg bonus section
function easterEgg() {
    update(locations[7]);
}

function pick2() {
    pick(2);
}

function pick8() {
    pick(8);
}

function pick(numberPicked) {
    let numbers = []

    // Populate the numbers array
    while (numbers.length < 10) {
        numbers.push((Math.floor(Math.random() * 11)));
    }

    text.innerText = `You picked '${numberPicked}'. Here are the numbers: \n`;

    // Display the numbers in the array
    for (let i = 0; i < numbers.length; i++) {
        text.innerText += `${numbers[i]} \n`;
    }

    // Check if the number picked by the player matches any of the numbers in the array
    if (numbers.indexOf(numberPicked) !== -1) {
        text.innerText += "Right! You win 20 gold!";

        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "Wrong! You lose 10 health!";

        health -= 10;
        healthText.innerText = health;
        
        // Check if player has lost
        if (health <= 0) {
            healthText.innerText = 0;
            lose();
        }
    }
}

// ----------------------------------------------------------------------------------------
