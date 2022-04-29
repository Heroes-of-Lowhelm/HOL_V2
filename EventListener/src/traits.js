function getMainStat(number, gearType) {
    if (gearType === "weapon") {
        return "ATTACK";
    } else if (gearType === "helmet") {
        return "HP";
    } else if (gearType === "armor") {
        return "DEF";
    } else if (gearType === "shoes") {
        let possibilities = ["SPD", "ATK", "ATK%", "HP", "HP%", "DEF", "DEF%"];
        let rem = number % 7;
        return possibilities[rem];
    } else if (gearType === "neclace") {
        let possibilities = ["CRIT.RATE%", "CRIT.DMG%", "ATK%", "ATK", "HP", "HP%", "DEF", "DEF%"];
        let rem = number % 8;
        return possibilities[rem];
    } else if (gearType === "ring") {
        let possibilities = ["ACC", "RES%", "ATK", "ATK%", "HP%", "HP", "DEF", "DEF%"];
        let rem = number % 8;
        return possibilities[rem];
    } else {
        console.log("The gear type is not correct");
        return "";
    }
}

function getSubStatTypes(number, gearType, substat_num) {
    let sub_stat_types = [];
    if (gearType === "weapon") {
        let possibilities = ["ATK%", "HP", "HP%", "SPD", "CRIT.RATE%", "CRIT.DMG%", "ACC%", "RES%"];
        for (let i = 0; i < substat_num; i++) {
            let rem = number % (8 - i);
            let sub_stat_type = possibilities[rem];
            possibilities.splice(rem, 1);
            sub_stat_types.push(sub_stat_type);
            number = Math.floor(number / 10);
        }
    } else if (gearType === "helmet" || gearType === "shoes" || gearType === "neclace" || gearType === "ring") {
        let possibilities = ["ATK%", "ATK", "HP", "HP%", "DEF", "DEF%", "SPD", "CRIT.RATE%", "CRIT.DMG%", "ACC%", "RES%"];
        for (let i = 0; i < substat_num; i++) {
            let rem = number % (11 - i);
            let sub_stat_type = possibilities[rem];
            possibilities.splice(rem, 1);
            sub_stat_types.push(sub_stat_type);
            number = Math.floor(number / 10);
        }
    } else if (gearType === "armor") {
        let possibilities = ["HP", "HP%", "DEF%", "SPD", "CRIT.RATE%", "CRIT.DMG%", "ACC%", "RES%"];
        for (let i = 0; i < substat_num; i++) {
            let rem = number % (8 - i);
            let sub_stat_type = possibilities[rem];
            possibilities.splice(rem, 1);
            sub_stat_types.push(sub_stat_type);
            number = Math.floor(number / 10);
        }
    } else {
        console.log("gear type is not correct");
    }
    return sub_stat_types;
}

function getSubStatNum(number, gearType, level) {
    if (level === 1 || level === 2) {
        let sub_stat_num = 0;
        if (gearType === "ATK") {
            sub_stat_num = 10 + number % 91;
        } else if (gearType === "ATK%") {
            sub_stat_num = 1 + number % 4 * Math.random().toFixed(2);
        } else if (gearType === "DEF") {
            sub_stat_num = 10 + number % 91;
        } else if (gearType === "DEF%") {
            sub_stat_num = 1 + number % 4 * Math.random().toFixed(2);
        } else if (gearType === "HP") {
            sub_stat_num = 20 + number % 131;
        } else if (gearType === "HP%") {
            sub_stat_num = 1 + number % 4 * Math.random().toFixed(2);
        } else if (gearType === "SPD") {
            sub_stat_num = 1 + number % 3;
        } else if (gearType === "CRIT.DMG%") {
            sub_stat_num = 3 + number % 3 * Math.random().toFixed(2);
        } else if (gearType === "CRIT.RATE%") {
            sub_stat_num = 2 + number % 3 * Math.random().toFixed(2);
        } else if (gearType === "ACC%") {
            sub_stat_num = 1 + number % 4 * Math.random().toFixed(2);
        } else {
            sub_stat_num = 1 + number % 4 * Math.random().toFixed(2);
        }
        return sub_stat_num;
    } else if (level === 3) {
        let sub_stat_num = 0;
        if (gearType === "ATK") {
            sub_stat_num = 15 + number % 86;
        } else if (gearType === "ATK%") {
            sub_stat_num = 2 + number % 5 * Math.random().toFixed(2);
        } else if (gearType === "DEF") {
            sub_stat_num = 15 + number % 86;
        } else if (gearType === "DEF%") {
            sub_stat_num = 2 + number % 5 * Math.random().toFixed(2);
        } else if (gearType === "HP") {
            sub_stat_num = 30 + number % 121;
        } else if (gearType === "HP%") {
            sub_stat_num = 2 + number % 5 * Math.random().toFixed(2);
        } else if (gearType === "SPD") {
            sub_stat_num = 1 + number % 4;
        } else if (gearType === "CRIT.DMG%") {
            sub_stat_num = 3 + number % 4 * Math.random().toFixed(2);
        } else if (gearType === "CRIT.RATE%") {
            sub_stat_num = 2 + number % 4 * Math.random().toFixed(2);
        } else if (gearType === "ACC%") {
            sub_stat_num = 2 + number % 5 * Math.random().toFixed(2);
        } else {
            sub_stat_num = 2 + number % 5 * Math.random().toFixed(2);
        }
        return sub_stat_num;
    } else if (level === 4) {
        let sub_stat_num = 0;
        if (gearType === "ATK") {
            sub_stat_num = 20 + number % 131;
        } else if (gearType === "ATK%") {
            sub_stat_num = 3 + number % 6 * Math.random().toFixed(2);
        } else if (gearType === "DEF") {
            sub_stat_num = 20 + number % 131;
        } else if (gearType === "DEF%") {
            sub_stat_num = 3 + number % 6 * Math.random().toFixed(2);
        } else if (gearType === "HP") {
            sub_stat_num = 30 + number % 161;
        } else if (gearType === "HP%") {
            sub_stat_num = 3 + number % 6 * Math.random().toFixed(2);
        } else if (gearType === "SPD") {
            sub_stat_num = 1 + number % 5;
        } else if (gearType === "CRIT.DMG%") {
            sub_stat_num = 3 + number % 5 * Math.random().toFixed(2);
        } else if (gearType === "CRIT.RATE%") {
            sub_stat_num = 3 + number % 4 * Math.random().toFixed(2);
        } else if (gearType === "ACC%") {
            sub_stat_num = 3 + number % 6 * Math.random().toFixed(2);
        } else {
            sub_stat_num = 3 + number % 6 * Math.random().toFixed(2);
        }
        return sub_stat_num;
    } else {
        let sub_stat_num = 0;
        if (gearType === "ATK") {
            sub_stat_num = 30 + number % 171;
        } else if (gearType === "ATK%") {
            sub_stat_num = 4 + number % 7 * Math.random().toFixed(2);
        } else if (gearType === "DEF") {
            sub_stat_num = 30 + number % 171;
        } else if (gearType === "DEF%") {
            sub_stat_num = 4 + number % 7 * Math.random().toFixed(2);
        } else if (gearType === "HP") {
            sub_stat_num = 50 + number % 201;
        } else if (gearType === "HP%") {
            sub_stat_num = 4 + number % 7 * Math.random().toFixed(2);
        } else if (gearType === "SPD") {
            sub_stat_num = 2 + number % 5;
        } else if (gearType === "CRIT.DMG%") {
            sub_stat_num = 4 + number % 5 * Math.random().toFixed(2);
        } else if (gearType === "CRIT.RATE%") {
            sub_stat_num = 3 + number % 5 * Math.random().toFixed(2);
        } else if (gearType === "ACC%") {
            sub_stat_num = 4 + number % 7 * Math.random().toFixed(2);
        } else {
            sub_stat_num = 4 + number % 7 * Math.random().toFixed(2);
        }
        return sub_stat_num;
    }
}

function getSubStatsTypeAndNumber(number, gearType, level) {
    if (level === 1) {
        //Chaotic
        if (number % 100 === 0) {
            let sub_stat_types = getSubStatTypes(number, gearType, 1);
            let sub_stat_num = getSubStatNum(number, sub_stat_types[0], 1)
            return [{type: sub_stat_types[0], value: sub_stat_num}];
        } else {
            return []
        }
    } else {
        let sub_stat_types = [];
        let sub_stats = [];
        if (number % 100 === 0) {
            sub_stat_types = getSubStatTypes(number, gearType, level);
        } else {
            sub_stat_types = getSubStatTypes(number, gearType, level - 1);
        }
        for (let j=0; j < sub_stat_types.length; j++) {
            let sub_stat_type = sub_stat_types[j];
            let sub_stat_num = getSubStatNum(number, sub_stat_type, level);
            sub_stats.push({type: sub_stat_type, value: sub_stat_num});
            number = Math.floor(number / 10);
        }
        if (level === 5) {
            let rem = number % 7;
            if (rem === 0) {
                sub_stats.push({type: "Life", value: "Set"});
            } else if (rem === 1) {
                sub_stats.push({type: "Harden", value: "Set"});
            } else if (rem === 2) {
                sub_stats.push({type: "Strength", value: "Set"});
            } else if (rem === 3) {
                sub_stats.push({type: "Degenerate", value: "Set"});
            } else if (rem === 4) {
                sub_stats.push({type: "Effectiveness", value: "Set"});
            } else if (rem === 5) {
                sub_stats.push({type: "Explosion", value: "Set"});
            } else {
                sub_stats.push({type: "Vampire", value: "Set"});
            }
        }
        return sub_stats;
    }

}

function getSubStats(number, gearType, rarity) {
    if (rarity === 1) {
        return getSubStatsTypeAndNumber(number, gearType, 1);
    } else if (rarity === 2) {
        return getSubStatsTypeAndNumber(number, gearType, 2);
    } else if (rarity === 3) {
        return getSubStatsTypeAndNumber(number, gearType, 3);
    } else if (rarity === 4) {
        return getSubStatsTypeAndNumber(number, gearType, 4);
    } else {
        return getSubStatsTypeAndNumber(number, gearType, 5);
    }
}

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
    },
    generateHeroesTrait: async function (random_number, is_high_level) {
        if (is_high_level) {
            let rem = random_number % 100;
            let rarity = 3;
            let name = "";
            if (rem < 80) {
                rarity = 3;
                let rem_sub = random_number % 4;
                if (rem_sub === 0) {
                    name = "Shasta";
                } else if (rem_sub === 1) {
                    name = "Calix";
                } else if (rem_sub === 2) {
                    name = "Mia";
                } else {
                    name = "Gui-Ping";
                }
            } else if (rem < 98) {
                rarity = 4;
                let rem_sub = random_number % 5;
                if (rem_sub === 0) {
                    name = "Eryx";
                } else if (rem_sub === 1) {
                    name = "Sansa";
                } else if (rem_sub === 2) {
                    name = "Callan";
                } else if (rem_sub === 3) {
                    name = "Bozhena";
                } else {
                    name = "Jovann";
                }
            } else {
                rarity = 5;
                let rem_sub = random_number % 6;
                if (rem_sub === 0) {
                    name = "Elena";
                } else if (rem_sub === 1) {
                    name = "Syviis";
                } else if (rem_sub === 2) {
                    name = "Amelia";
                } else if (rem_sub === 3) {
                    name = "Donovan";
                } else if (rem_sub === 4) {
                    name = "LEO";
                } else {
                    name = "Garrett";
                }
            }
            return [name, rarity];
        } else {
            let rem = random_number % 100;
            let rarity = 1;
            let name = "";
            if (rem < 70) {
                rarity = 1;
                let rem_sub = random_number % 3;
                if (rem_sub === 0) {
                    name = "Olga";
                } else if (rem_sub === 1) {
                    name = "Tiffany";
                } else {
                    name = "Nuru";
                }
            } else if (rem < 95) {
                rarity = 2;
                let rem_sub = random_number % 3;
                if (rem_sub === 0) {
                    name = "Willow";
                } else if (rem_sub === 1) {
                    name = "Karen";
                } else {
                    name = "Tabari";
                }
            } else {
                rarity = 3;
                let rem_sub = random_number % 4;
                if (rem_sub === 0) {
                    name = "Shasta";
                } else if (rem_sub === 1) {
                    name = "Calix";
                } else if (rem_sub === 2) {
                    name = "Mia";
                } else {
                    name = "Gui-Ping";
                }
            }
            return [name, rarity];
        }
    },
    generateGearsTrait: async function (random_number, is_high_level) {
        let rem = random_number % 100;
        let rarity = 1;
        let name = "";
        if (is_high_level) {
            if (rem < 80) {
                rarity = 3;
                let gearType = "weapon";
                let rem_sub = random_number % 18;
                if (rem_sub === 0) {
                    name = "Steel Sword";
                    gearType = "weapon";
                } else if (rem_sub === 1) {
                    name = "Steel Helmet";
                    gearType = "helmet";
                } else if (rem_sub === 2) {
                    name = "Steel Armor";
                    gearType = "armor";
                } else if (rem_sub === 3) {
                    name = "Steel Shoes";
                    gearType = "shoes";
                } else if (rem_sub === 4) {
                    name = "Intermediate Archer Bow";
                    gearType = "weapon";
                } else if (rem_sub === 5) {
                    name = "Light Huntsman Helmet";
                    gearType = "helmet";
                } else if (rem_sub === 6) {
                    name = "Light Huntsman Armor";
                    gearType = "armor";
                } else if (rem_sub === 7) {
                    name = "Light Huntsman Boots";
                    gearType = "shoes"
                } else if (rem_sub === 8) {
                    name = "Enchanted Wand";
                    gearType = "weapon";
                } else if (rem_sub === 9) {
                    name = "Enchanted Silk Cap";
                    gearType = "helmet";
                } else if (rem_sub === 10) {
                    name = "Enchanted Silk Robe";
                    gearType = "armor";
                } else if (rem_sub === 11) {
                    name = "Enchanted Silk Shoes";
                    gearType = "shoes";
                } else if (rem_sub === 12) {
                    name = "Steel Kusarigama";
                    gearType = "weapon"
                } else if (rem_sub === 13) {
                    name = "Black Soft Beanie";
                    gearType = "helmet";
                } else if (rem_sub === 14) {
                    name = "Black Soft Hoodie";
                    gearType = "armor";
                } else if (rem_sub === 15) {
                    name = "Black Soft Shoes";
                    gearType = "shoes";
                } else if (rem_sub === 16) {
                    name = "Silver Ring";
                    gearType = "ring";
                } else {
                    name = "Silver Necklace";
                    gearType = "neclace";
                }
                let main_stat = getMainStat(Math.floor(random_number / 10), gearType);
                let substats = getSubStats(Math.floor(random_number / 100), gearType, rarity);
                return [name, rarity, main_stat, substats];
            } else if (rem < 98) {
                rarity = 4;
                let gearType = "weapon";
                let rem_sub = random_number % 18;
                if (rem_sub === 0) {
                    name = "Crimson Sword";
                    gearType = "weapon";
                } else if (rem_sub === 1) {
                    name = "Golden Helmet";
                    gearType = "helmet"
                } else if (rem_sub === 2) {
                    name = "Golden Armor";
                    gearType = "armor"
                } else if (rem_sub === 3) {
                    name = "Golden Shoes";
                    gearType = "shoes"
                } else if (rem_sub === 4) {
                    name = "Crimson Crossbow";
                    gearType = "weapon";
                } else if (rem_sub === 5) {
                    name = "Hardened Leather Helmet";
                    gearType = "helmet"
                } else if (rem_sub === 6) {
                    name = "Hardened Leather Armor";
                    gearType = "armor";
                } else if (rem_sub === 7) {
                    name = "Hardened Leather Shoes";
                    gearType = "armor";
                } else if (rem_sub === 8) {
                    name = "Crimson Staff";
                    gearType = "weapon";
                } else if (rem_sub === 9) {
                    name = "Hardened Silk Cap";
                    gearType = "helmet";
                } else if (rem_sub === 10) {
                    name = "Hardened Silk Robe";
                    gearType = "armor";
                } else if (rem_sub === 11) {
                    name = "Hardened Silk Shoes";
                    gearType = "shoes";
                } else if (rem_sub === 12) {
                    name = "Dual Kusarigama";
                    gearType = "weapon";
                } else if (rem_sub === 13) {
                    name = "Enchanted Headband";
                    gearType = "helmet";
                } else if (rem_sub === 14) {
                    name = "Enchanted Light Sweater";
                    gearType = "armor";
                } else if (rem_sub === 15) {
                    name = "Enchanted Light Sneakers";
                    gearType = "shoes";
                } else if (rem_sub === 16) {
                    name = "Gold Ring";
                    gearType = "ring";
                } else {
                    name = "Gold Necklace";
                    gearType = "neclace";
                }
                let main_stat = getMainStat(Math.floor(random_number / 10), gearType);
                let substats = getSubStats(Math.floor(random_number / 100), gearType, rarity);
                return [name, rarity, main_stat, substats];
            } else {
                rarity = 5;
                let gearType = "weapon";
                let rem_sub = random_number % 18;
                if (rem_sub === 0) {
                    name = "Infinite Sword";
                    gearType = "weapon";
                } else if (rem_sub === 1) {
                    name = "King Helmet";
                    gearType = "helmet";
                } else if (rem_sub === 2) {
                    name = "King Armor";
                    gearType = "armor";
                } else if (rem_sub === 3) {
                    name = "King Shoes";
                    gearType = "shoes";
                } else if (rem_sub === 4) {
                    name = "Mythical Bow";
                    gearType = "weapon";
                } else if (rem_sub === 5) {
                    name = "King Hunting Hat";
                    gearType = "helmet";
                } else if (rem_sub === 6) {
                    name = "King Hunting Suit";
                    gearType = "armor";
                } else if (rem_sub === 7) {
                    name = "King Hunting Shoes";
                    gearType = "shoes";
                } else if (rem_sub === 8) {
                    name = "Superior Staff";
                    gearType = "weapon";
                } else if (rem_sub === 9) {
                    name = "King Wizard Hat";
                    gearType = "helmet";
                } else if (rem_sub === 10) {
                    name = "King Robe";
                    gearType = "armor";
                } else if (rem_sub === 11) {
                    name = "King Silk Shoes";
                    gearType = "shoes";
                } else if (rem_sub === 12) {
                    name = "Dagger of Fatality";
                    gearType = "weapon";
                } else if (rem_sub === 13) {
                    name = "King Headband";
                    gearType = "helmet";
                } else if (rem_sub === 14) {
                    name = "King Ninja Suit";
                    gearType = "armor";
                } else if (rem_sub === 15) {
                    name = "King Ninja Shoes";
                    gearType = "shoes";
                } else if (rem_sub === 16) {
                    name = "King Ring";
                    gearType = "ring";
                } else {
                    name = "King Necklace";
                    gearType = "neclace";
                }
                let main_stat = getMainStat(Math.floor(random_number / 10), gearType);
                let substats = getSubStats(Math.floor(random_number / 100), gearType, rarity);
                return [name, rarity, main_stat, substats];
            }
        } else {
            if (rem < 70) {
                rarity = 1;
                let gearType = "weapon";
                let rem_sub = random_number % 18;
                if (rem_sub === 0) {
                    name = "Wooden Sword";
                    gearType = "weapon";
                } else if (rem_sub === 1) {
                    name = "Copper Helmet";
                    gearType = "helmet";
                } else if (rem_sub === 2) {
                    name = "Copper Armor";
                    gearType = "armor";
                } else if (rem_sub === 3) {
                    name = "Copper Shoes";
                    gearType = "shoes";
                } else if (rem_sub === 4) {
                    name = "Basic Bow";
                    gearType = "weapon";
                } else if (rem_sub === 5) {
                    name = "Leather Helmet";
                    gearType = "helmet";
                } else if (rem_sub === 6) {
                    name = "Leather Armor";
                    gearType = "armor";
                } else if (rem_sub === 7) {
                    name = "Leather Shoes";
                    gearType = "shoes";
                } else if (rem_sub === 8) {
                    name = "Basic Wand";
                    gearType = "weapon";
                } else if (rem_sub === 9) {
                    name = "Silk Cap";
                    gearType = "helmet";
                } else if (rem_sub === 10) {
                    name = "Silk Robe";
                    gearType = "armor";
                } else if (rem_sub === 11) {
                    name = "Silk Shoes";
                    gearType = "shoes";
                } else if (rem_sub === 12) {
                    name = "Basic Dagger";
                    gearType = "weapon";
                } else if (rem_sub === 13) {
                    name = "Common Headband";
                    gearType = "helmet";
                } else if (rem_sub === 14) {
                    name = "White Shirt";
                    gearType = "armor";
                } else if (rem_sub === 15) {
                    name = "Soft Shoes";
                    gearType = "shoes";
                } else if (rem_sub === 16) {
                    name = "Copper Ring";
                    gearType = "ring";
                } else {
                    name = "Copper Necklace";
                    gearType = "neclace";
                }
                let main_stat = getMainStat(Math.floor(random_number / 10), gearType);
                let substats = getSubStats(Math.floor(random_number / 100), gearType, rarity);
                return [name, rarity, main_stat, substats];
            } else if (rem < 95) {
                rarity = 2;
                let gearType = "weapon";
                let rem_sub = random_number % 18;
                if (rem_sub === 0) {
                    name = "Stone Sword";
                    gearType = "weapon";
                } else if (rem_sub === 1) {
                    name = "Bronze Helmet";
                    gearType = "helmet";
                } else if (rem_sub === 2) {
                    name = "Bronze Armor";
                    gearType = "armor";
                } else if (rem_sub === 3) {
                    name = "Bronze Shoes";
                    gearType = "shoes";
                } else if (rem_sub === 4) {
                    name = "Apprentice Crossbow";
                    gearType = "weapon";
                } else if (rem_sub === 5) {
                    name = "Hardened Leather Helmet";
                    gearType = "helmet";
                } else if (rem_sub === 6) {
                    name = "Hardened Leather Armor";
                    gearType = "armor";
                } else if (rem_sub === 7) {
                    name = "Hardened Leather Boots";
                    gearType = "shoes";
                } else if (rem_sub === 8) {
                    name = "Apprentice Staff";
                    gearType = "weapon";
                } else if (rem_sub === 9) {
                    name = "Hardened Silk Cap";
                    gearType = "helmet";
                } else if (rem_sub === 10) {
                    name = "Hardened Silk Robe";
                    gearType = "armor";
                } else if (rem_sub === 11) {
                    name = "Hardened Silk Shoes";
                    gearType = "shoes";
                } else if (rem_sub === 12) {
                    name = "Dual Basic Daggers";
                    gearType = "weapon";
                } else if (rem_sub === 13) {
                    name = "Apprentice Headband";
                    gearType = "helmet";
                } else if (rem_sub === 14) {
                    name = "Apprentice Shirt";
                    gearType = "armor";
                } else if (rem_sub === 15) {
                    name = "Apprentice Slippers";
                    gearType = "shoes";
                } else if (rem_sub === 16) {
                    name = "Bronze Ring";
                    gearType = "ring";
                } else {
                    name = "Bronze Neclace";
                    gearType = "neclace";
                }
                let main_stat = getMainStat(Math.floor(random_number / 10), gearType);
                let substats = getSubStats(Math.floor(random_number / 100), gearType, rarity);
                return [name, rarity, main_stat, substats];
            } else {
                rarity = 3;
                let gearType = "weapon";
                let rem_sub = random_number % 18;
                if (rem_sub === 0) {
                    name = "Steel Sword";
                    gearType = "weapon";
                } else if (rem_sub === 1) {
                    name = "Steel Helmet";
                    gearType = "helmet";
                } else if (rem_sub === 2) {
                    name = "Steel Armor";
                    gearType = "armor";
                } else if (rem_sub === 3) {
                    name = "Steel Shoes";
                    gearType = "shoes";
                } else if (rem_sub === 4) {
                    name = "Intermediate Archer Bow";
                    gearType = "weapon";
                } else if (rem_sub === 5) {
                    name = "Light Huntsman Helmet";
                    gearType = "helmet";
                } else if (rem_sub === 6) {
                    name = "Light Huntsman Armor";
                    gearType = "armor";
                } else if (rem_sub === 7) {
                    name = "Light Huntsman Boots";
                    gearType = "shoes"
                } else if (rem_sub === 8) {
                    name = "Enchanted Wand";
                    gearType = "weapon";
                } else if (rem_sub === 9) {
                    name = "Enchanted Silk Cap";
                    gearType = "helmet";
                } else if (rem_sub === 10) {
                    name = "Enchanted Silk Robe";
                    gearType = "armor";
                } else if (rem_sub === 11) {
                    name = "Enchanted Silk Shoes";
                    gearType = "shoes";
                } else if (rem_sub === 12) {
                    name = "Steel Kusarigama";
                    gearType = "weapon"
                } else if (rem_sub === 13) {
                    name = "Black Soft Beanie";
                    gearType = "helmet";
                } else if (rem_sub === 14) {
                    name = "Black Soft Hoodie";
                    gearType = "armor";
                } else if (rem_sub === 15) {
                    name = "Black Soft Shoes";
                    gearType = "shoes";
                } else if (rem_sub === 16) {
                    name = "Silver Ring";
                    gearType = "ring";
                } else {
                    name = "Silver Necklace";
                    gearType = "neclace";
                }
                let main_stat = getMainStat(Math.floor(random_number / 10), gearType);
                let substats = getSubStats(Math.floor(random_number / 100), gearType, rarity);
                return [name, rarity, main_stat, substats];
            }
        }
    }
}