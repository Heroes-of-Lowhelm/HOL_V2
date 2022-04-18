module.exports = {
    generateDLHeroesTrait: async function (random_number) {
        let rem = random_number % 100;
        let rarity = 3;
        let name = "";
        if (rem < 70) {
            rarity = 3;
            if (rem % 2 === 0) {
                name = "Hailey";
            } else {
                name = "Kostas";
            }
        } else if (rem < 90) {
            rarity = 4;
            let rem_three = random_number % 3;
            if (rem_three === 0) {
                name = "Lillian";
            } else if (rem_three === 1) {
                name = "Axel";
            } else {
                name = "Badriyah";
            }
        } else {
            if (rem % 2 === 0) {
                name = "Aurora";
            } else {
                name = "Gabriella";
            }
        }
        return [name, rarity];
    }
}