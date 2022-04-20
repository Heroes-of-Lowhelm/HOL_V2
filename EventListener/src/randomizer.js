async function getRandom() {
    
    returnRand = (Math.floor(Math.random() * (2 ** 32 - 1)));
    return returnRand;
}

module.exports = {
    getSingleRandom: async function() {
        let randomNumber = await getRandom();
        return randomNumber;
    },
    get13BatchRandom: async function () {
        let randomNumbers = [];
        // 95 ~ 99 random number
        for(let i = 0; i < 9; i ++) {
            let randomNumber = await getRandom();
            randomNumbers.push(randomNumber);
        }
        let randomNumber = await getRandom();
        let rangedRand = 95 + Math.floor(Math.random() * 5);
        let lastRand = Math.floor(randomNumber/100) * 100 + rangedRand;
        randomNumbers.push(lastRand);
        return randomNumbers;
    },

    get35BatchRandom: async function () {
        let randomNumbers = [];
        for (let i = 0; i < 9; i++) {
            let randomNumber = await getRandom();
            randomNumbers.push(randomNumber);
        }
        let randomNumber = await getRandom();
        // 80 ~ 98 random number
        let rangedRand = 80 + Math.floor(Math.random() * 18);
        let lastRand = Math.floor(randomNumber/100) * 100 + rangedRand;
        randomNumbers.push(lastRand);
        return randomNumbers;
    }
}

