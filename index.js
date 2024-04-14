const cookie = document.querySelector("#cookie");
const autoClick = document.querySelector("#auto-click");
const autoClickTextPrice = document.querySelector("#auto-click .price span");
const upgradeClick = document.querySelector("#upgrade-click");
const upgradeClickTextPrice = document.querySelector("#upgrade-click .price span");
const autoStrength = document.querySelector("#auto-strength");
const autoStrengthTextPrice = document.querySelector("#auto-strength .price span");


const updateScore = cookies => {
    const title = document.querySelector("title");
    const score = document.querySelector("#score span");

    score.innerText = cookies;
    title.innerHTML = cookies + "  biden haters - Trump Clicker"

    localStorage.setItem("cookies", cookies);
}

const updatePowerupsStorage = powerup => {
    let powerups = JSON.parse(localStorage.getItem("powerups")) || [];
    powerups.push(powerup);

    localStorage.setItem("powerups", JSON.stringify(powerups));
}

const getStorage = () => {
    const cookies = localStorage.getItem("cookies") || 0;
    const powerups = JSON.parse(localStorage.getItem("powerups")) || [];

    const storage = {
        "cookies": cookies,
        "powerups": powerups
    }

    return storage;
}

const cookieClicked = cookies => {
    const storage = getStorage();

    const score = document.querySelector("#score span");
    const scoreValue = cookies ? cookies : parseInt(score.innerText);

    let newScore;

    if(storage.powerups.includes("upgrade-click")) {
        const multiplier = storage.powerups.filter(powerup => powerup == "upgrade-click").length;
        if(multiplier == 1){
            newScore = scoreValue + 2;
        } else {
            newScore = scoreValue + (2 ** multiplier)
        }
    } else {
        newScore = scoreValue + 1;
    }

    updateScore(newScore);
}

const createParticle = (x,y) => {
    const cookieClicks = document.querySelector(".cookie-clicks");

    const particle = document.createElement("img");
    particle.setAttribute("src", "img/cookie.png");
    particle.setAttribute("class", "cookie-particle");
    particle.style.left = x + "px";
    particle.style.top = y + "px";

    cookieClicks.appendChild(particle);


    setTimeout(() => {
        cookieClicks.removeChild(particle);
    }, 3000);
}

cookie.addEventListener("click", (e) => {
    createParticle(e.clientX, e.clientY);
    cookieClicked()
});

const autoClickCookie = () => {
    setInterval(() => {
        const score = document.querySelector("#score span");
        const scoreValue = parseInt(score.innerText);

        newScore = scoreValue + 1;

        updateScore(newScore);
    }, 1000)
}

autoClick.addEventListener("click", () => {
    const price = parseFloat(autoClick.getAttribute("data-price"));
    const score = document.querySelector("#score span");
    const scoreValue = parseInt(score.innerText)

    if (scoreValue >= price) {
        updatePowerupsStorage("auto-click");

        const newPrice = price * 2; // Double the price

        const newScore = scoreValue - price;

        updateScore(newScore);

        autoClick.setAttribute("data-price", newPrice);
        autoClickTextPrice.innerHTML = newPrice;

        document.querySelector(".auto-clicks").classList.remove("disable");
        document.querySelector(".auto-clicks .cursors").innerHTML += '<img src="img/cursor.png" alt="cursor" id="cursor" class="cursor auto">';

        autoClickCookie();
    } else {
        autoClick.classList.add("invalid");
        setTimeout(() => {
            autoClick.classList.remove("invalid");
        }, 300);
    }
})

upgradeClick.addEventListener("click", () => {
    const price = parseFloat(upgradeClick.getAttribute("data-price"));
    const score = document.querySelector("#score span");
    const scoreValue = parseInt(score.innerText)

    if (scoreValue >= price) {
        updatePowerupsStorage("upgrade-click");

        const newPrice = price * 2; // Double the price

        const newScore = scoreValue - price;

        updateScore(newScore);

        upgradeClick.setAttribute("data-price", newPrice);
        upgradeClickTextPrice.innerHTML = newPrice;
    } else {
        upgradeClick.classList.add("invalid");
        setTimeout(() => {
            upgradeClick.classList.remove("invalid");
        }, 300);
    }
})

autoStrength.addEventListener("click", () => {
    const price = parseFloat(autoStrength.getAttribute("data-price"));
    const score = document.querySelector("#score span");
    const scoreValue = parseInt(score.innerText);

    if (scoreValue >= price) {
        updatePowerupsStorage("auto-strength");

        const newPrice = price * 2; // Double the price

        const newScore = scoreValue - price;

        updateScore(newScore);

        autoStrength.setAttribute("data-price", newPrice);
        autoStrengthTextPrice.innerHTML = newPrice;

        enhanceAutoClick();
    } else {
        autoStrength.classList.add("invalid");
        setTimeout(() => {
            autoStrength.classList.remove("invalid");
        }, 300);
    }
});


const getSavedData = () => {
    const storage = getStorage();

    updateScore(storage.cookies);

    if (storage.powerups.includes("upgrade-click")) {
        const multiplier = storage.powerups.filter(powerup => powerup == "upgrade-click").length;

        if (multiplier == 1) {
            upgradeClick.setAttribute("data-price", 100 * 2);
            upgradeClickTextPrice.innerHTML = 100 * 2;
        } else {
            upgradeClick.setAttribute("data-price", 100 * (2 ** multiplier));
            upgradeClickTextPrice.innerHTML = 100 * (2 ** multiplier);
        }
    }

    if (storage.powerups.includes("auto-click")) {
        const quantAutoClicks = storage.powerups.filter(powerup => powerup == "auto-click").length;

        document.querySelector(".auto-clicks").classList.remove("disable");

        if (quantAutoClicks == 1) {
            autoClick.setAttribute("data-price", 100 * 2);
            autoClickTextPrice.innerHTML = 100 * 2;
        } else {
            autoClick.setAttribute("data-price", 100 * (quantAutoClicks + 1));
            autoClickTextPrice.innerHTML = 100 * (quantAutoClicks + 1);
        }

        for (let i = 1; i <= quantAutoClicks; i++) {
            autoClickCookie();

            document.querySelector(".auto-clicks").classList.remove("disable");
            document.querySelector(".auto-clicks .cursors").innerHTML += '<img src="img/cursor.png" alt="cursor" id="cursor" class="cursor auto">';
        }
    }

    if (storage.powerups.includes("auto-strength")) {
        const quantAutoStrength = storage.powerups.filter(powerup => powerup == "auto-strength").length;

        if (quantAutoStrength == 1) {
            autoStrength.setAttribute("data-price", 200 * 2);
            autoStrengthTextPrice.innerHTML = 200 * 2;
        } else {
            autoStrength.setAttribute("data-price", 200 * (quantAutoStrength + 1));
            autoStrengthTextPrice.innerHTML = 200 * (quantAutoStrength + 1);
        }
    }
}


document.addEventListener("load", getSavedData());
