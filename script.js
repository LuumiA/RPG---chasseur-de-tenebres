// @ts-nocheck

let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["Bâton usé"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

// Les armes
const weapons = [
  { name: "Bâton usé", power: 5 },
  { name: "Dague rouillée", power: 30 },
  { name: "Marteau de guerre", power: 50 },
  { name: "Épée d'acier", power: 100 },
  { name: "Arbalète enflammée", power: 150 },
  { name: "Lame enchantée", power: 200 },
  { name: "Marteau divin", power: 300 },
];

// Les ennemis
const monsters = [
  {
    name: "Loup affamé",
    level: 2,
    health: 15,
  },
  {
    name: "Spectre des bois",
    level: 8,
    health: 60,
  },
  {
    name: "Bête des ténèbres",
    level: 20,
    health: 300,
  },
  {
    name: "Démon ancestral",
    level: 25,
    health: 500,
  },
  {
    name: "Dragon infernal",
    level: 30,
    health: 800,
  },
];

// Les lieux
const locations = [
  {
    name: "Place du village",
    "button text": [
      "Aller au marché",
      "Explorer la forêt",
      "Affronter la bête",
    ],
    "button functions": [goStore, goCave, fightDragon],
    text: "Vous êtes sur la place centrale du village d'Arkheim. Où voulez-vous aller ?",
  },
  {
    name: "Marché",
    "button text": [
      "Acheter 10 points de santé (10 pièces d'or)",
      "Acheter une arme (30 pièces d'or)",
      "Retourner à la place du village",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Vous entrez dans le marché animé. Les commerçants crient pour vendre leurs marchandises.",
  },
  {
    name: "Forêt",
    "button text": [
      "Combattre un loup affamé",
      "Affronter un spectre des bois",
      "Retourner à la place du village",
    ],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Vous entrez dans la forêt sombre. Les arbres semblent murmurer et l'air est glacial.",
  },
  {
    name: "Combat",
    "button text": ["Attaquer", "Esquiver", "Fuir"],
    "button functions": [attack, dodge, goTown],
    text: "Vous êtes face à un ennemi redoutable !",
  },
  {
    name: "Monstre vaincu",
    "button text": [
      "Retourner à la place du village",
      "Retourner à la place du village",
      "Retourner à la place du village",
    ],
    "button functions": [goTown, goTown, easterEgg],
    text: "La créature s'effondre dans un cri terrifiant. Vous gagnez de l'expérience et trouvez des pièces d'or.",
  },
  {
    name: "Défaite",
    "button text": ["REJOUER ?", "REJOUER ?", "REJOUER ?"],
    "button functions": [restart, restart, restart],
    text: "Vous avez été vaincu. &#x2620;",
  },
  {
    name: "Victoire",
    "button text": ["REJOUER ?", "REJOUER ?", "REJOUER ?"],
    "button functions": [restart, restart, restart],
    text: "Vous avez terrassé la bête des ténèbres ! Arkheim est sauvé ! &#x1F389;",
  },
  {
    name: "Secret",
    "button text": ["2", "8", "Retourner à la place ?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "Vous découvrez un jeu étrange. Choisissez un numéro ! Si vous devinez correctement, vous gagnez !",
  },
];

// Initialisation des boutons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

// Les autres fonctions restent similaires, mais j'ai adapté les textes dans chaque partie.

function buyHealth() {
  if (health >= 100) {
    text.innerText = "Vous avez déjà toute votre santé !";
    return;
  }

  if (gold >= 10) {
    gold -= 10;
    health += 10;

    if (health > 100) {
      health = 100;
    }

    goldText.innerText = gold;
    updateHealthBar();
  } else {
    text.innerText =
      "Vous n'avez pas assez de pièces d'or pour acheter des points de santé.";
  }
}

function updateHealthBar() {
  const healthPercentage = (health / 100) * 100;
  document.querySelector(".slide-of-life").style.width = healthPercentage + "%";
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Vous avez maintenant une " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " Dans votre inventaire, vous avez : " + inventory;
    } else {
      text.innerText =
        "Vous n'avez pas assez de pièces d'or pour acheter une arme.";
    }
  } else {
    text.innerText = "Vous possédez déjà l'arme la plus puissante !";
    button2.innerText = "Vendre une arme pour 15 pièces d'or";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "Vous avez vendu une " + currentWeapon + ".";
    text.innerText += " Dans votre inventaire, vous avez : " + inventory;
  } else {
    text.innerText = "Ne vendez pas votre seule arme !";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
  console.log("Santé initiale du monstre : ", monsterHealth);
}

function attack() {
  text.innerText = "Le " + monsters[fighting].name + " attaque.";
  text.innerText +=
    " Vous l'attaquez avec votre " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  console.log("Santé avant attaque : ", monsterHealth);
  if (isMonsterHit()) {
    monsterHealth -=
      weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    console.log("Santé après attaque : ", monsterHealth);
  } else {
    text.innerText += " Vous ratez votre coup.";
  }
  updateHealthBar();
  if (monsterHealthText) {
    console.log("monsterHealthText : ", monsterHealthText);

    monsterHealthText.innerText = monsterHealth;
  } else {
    console.error("L'élément monsterHealthText est introuvable !");
  }

  console.log("Texte mis à jour : ", monsterHealth);

  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText += " Votre " + inventory.pop() + " s'est brisé.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = level * 4 - Math.floor(Math.random() * xp);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  text.innerText = "Vous esquivez l'attaque du " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  xpText.classList.add("stat-change");
  setTimeout(() => {
    xpText.classList.remove("stat-change");
  }, 500);

  goldText.classList.add("stat-change");
  setTimeout(() => {
    goldText.classList.remove("stat-change");
  }, 500);

  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  xpText.innerText = xp;
  updateHealthBar();
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText =
    "Vous avez choisi " + guess + ". Voici les nombres aléatoires:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Bravo ! Vous gagnez 20 pièces d'or !";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Raté ! Vous perdez 10 points de santé !";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
