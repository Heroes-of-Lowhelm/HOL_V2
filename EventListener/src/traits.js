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
                let rem_sub = random_number % 18;
                if (rem_sub === 0) {
                    name = "Steel Sword"
                } else if (rem_sub === 1) {
                    name = "Steel Helmet"
                } else if (rem_sub === 2) {
                    name = "Steel Armor"
                } else if (rem_sub === 3) {
                    name = "Steel Shoes"
                } else if (rem_sub === 4) {
                    name = "Intermediate Archer Bow"
                } else if (rem_sub === 5) {
                    name = "Light Huntsman Helmet"
                } else if (rem_sub === 6) {
                    name = "Light Huntsman Armor"
                } else if (rem_sub === 7) {
                    name = "Light Huntsman Boots"
                } else if (rem_sub === 8) {
                    name = "Enchanted Wand"
                } else if (rem_sub === 9) {
                    name = "Enchanted Silk Cap"
                } else if (rem_sub === 10) {
                    name = "Enchanted Silk Robe"
                } else if (rem_sub === 11) {
                    name = "Enchanted Silk Shoes"
                } else if (rem_sub === 12) {
                    name = "Steel Kusarigama"
                } else if (rem_sub === 13) {
                    name = "Black Soft Beanie"
                } else if (rem_sub === 14) {
                    name = "Black Soft Hoodie"
                } else if (rem_sub === 15) {
                    name = "Black Soft Shoes"
                } else if (rem_sub === 16) {
                    name = "Silver Ring"
                } else {
                    name = "Silver Necklace"
                }
            } else if (rem < 98) {
                rarity = 4;
                let rem_sub = random_number % 18;
                if (rem_sub === 0) {
                    name = "Crimson Sword"
                } else if (rem_sub === 1) {
                    name = "Golden Helmet"
                } else if (rem_sub === 2) {
                    name = "Golden Armor"
                } else if (rem_sub === 3) {
                    name = "Golden Shoes"
                } else if (rem_sub === 4) {
                    name = "Crimson Crossbow"
                } else if (rem_sub === 5) {
                    name = "Hardened Leather Helmet"
                } else if (rem_sub === 6) {
                    name = "Hardened Leather Armor"
                } else if (rem_sub === 7) {
                    name = "Hardened Leather Shoes"
                } else if (rem_sub === 8) {
                    name = "Crimson Staff"
                } else if (rem_sub === 9) {
                    name = "Hardened Silk Cap"
                } else if (rem_sub === 10) {
                    name = "Hardened Silk Robe"
                } else if (rem_sub === 11) {
                    name = "Hardened Silk Shoes"
                } else if (rem_sub === 12) {
                    name = "Dual Kusarigama"
                } else if (rem_sub === 13) {
                    name = "Enchanted Headband"
                } else if (rem_sub === 14) {
                    name = "Enchanted Light Sweater"
                } else if (rem_sub === 15) {
                    name = "Enchanted Light Sneakers"
                } else if (rem_sub === 16) {
                    name = "Gold Ring"
                } else {
                    name = "Gold Necklace"
                }
            } else {
                rarity = 5;
                let rem_sub = random_number % 18;
                if (rem_sub === 0) {
                    name = "Infinite Sword"
                } else if (rem_sub === 1) {
                    name = "King Helmet"
                } else if (rem_sub === 2) {
                    name = "King Armor"
                } else if (rem_sub === 3) {
                    name = "King Shoes"
                } else if (rem_sub === 4) {
                    name = "Mythical Bow"
                } else if (rem_sub === 5) {
                    name = "King Hunting Hat"
                } else if (rem_sub === 6) {
                    name = "King Hunting Suit"
                } else if (rem_sub === 7) {
                    name = "King Hunting Shoes"
                } else if (rem_sub === 8) {
                    name = "Superior Staff"
                } else if (rem_sub === 9) {
                    name = "King Wizard Hat"
                } else if (rem_sub === 10) {
                    name = "King Robe"
                } else if (rem_sub === 11) {
                    name = "King Silk Shoes"
                } else if (rem_sub === 12) {
                    name = "Dagger of Fatality"
                } else if (rem_sub === 13) {
                    name = "King Headband"
                } else if (rem_sub === 14) {
                    name = "King Ninja Suit"
                } else if (rem_sub === 15) {
                    name = "King Ninja Shoes"
                } else if (rem_sub === 16) {
                    name = "King Ring"
                } else {
                    name = "King Necklace"
                }
            }
        } else {
            if (rem < 70) {
                rarity = 1;
                let rem_sub = random_number % 18;
                if (rem_sub === 0) {
                    name = "Wooden Sword"
                } else if (rem_sub === 1) {
                    name = "Copper Helmet"
                } else if (rem_sub === 2) {
                    name = "Copper Armor"
                } else if (rem_sub === 3) {
                    name = "Copper Shoes"
                } else if (rem_sub === 4) {
                    name = "Basic Bow"
                } else if (rem_sub === 5) {
                    name = "Leather Helmet"
                } else if (rem_sub === 6) {
                    name = "Leather Armor"
                } else if (rem_sub === 7) {
                    name = "Leather Shoes"
                } else if (rem_sub === 8) {
                    name = "Basic Wand"
                } else if (rem_sub === 9) {
                    name = "Silk Cap"
                } else if (rem_sub === 10) {
                    name = "Silk Robe"
                } else if (rem_sub === 11) {
                    name = "Silk Shoes"
                } else if (rem_sub === 12) {
                    name = "Basic Dagger"
                } else if (rem_sub === 13) {
                    name = "Common Headband"
                } else if (rem_sub === 14) {
                    name = "White Shirt"
                } else if (rem_sub === 15) {
                    name = "Soft Shoes"
                } else if (rem_sub === 16) {
                    name = "Copper Ring"
                } else {
                    name = "Copper Necklace"
                }
            } else if (rem < 95) {
                rarity = 2;
                let rem_sub = random_number % 18;
                if (rem_sub === 0) {
                    name = "Stone Sword"
                } else if (rem_sub === 1) {
                    name = "Bronze Helmet"
                } else if (rem_sub === 2) {
                    name = "Bronze Armor"
                } else if (rem_sub === 3) {
                    name = "Bronze Shoes"
                } else if (rem_sub === 4) {
                    name = "Apprentice Crossbow"
                } else if (rem_sub === 5) {
                    name = "Hardened Leather Helmet"
                } else if (rem_sub === 6) {
                    name = "Hardened Leather Armor"
                } else if (rem_sub === 7) {
                    name = "Hardened Leather Boots"
                } else if (rem_sub === 8) {
                    name = "Apprentice Staff"
                } else if (rem_sub === 9) {
                    name = "Hardened Silk Cap"
                } else if (rem_sub === 10) {
                    name = "Hardened Silk Robe"
                } else if (rem_sub === 11) {
                    name = "Hardened Silk Shoes"
                } else if (rem_sub === 12) {
                    name = "Dual Basic Daggers"
                } else if (rem_sub === 13) {
                    name = "Apprentice Headband"
                } else if (rem_sub === 14) {
                    name = "Apprentice Shirt"
                } else if (rem_sub === 15) {
                    name = "Apprentice Slippers"
                } else if (rem_sub === 16) {
                    name = "Bronze Ring"
                } else {
                    name = "Bronze Neclace"
                }
            } else {
                rarity = 3;
                let rem_sub = random_number % 18;
                if (rem_sub === 0) {
                    name = "Steel Sword"
                } else if (rem_sub === 1) {
                    name = "Steel Helmet"
                } else if (rem_sub === 2) {
                    name = "Steel Armor"
                } else if (rem_sub === 3) {
                    name = "Steel Shoes"
                } else if (rem_sub === 4) {
                    name = "Intermediate Archer Bow"
                } else if (rem_sub === 5) {
                    name = "Light Huntsman Helmet"
                } else if (rem_sub === 6) {
                    name = "Light Huntsman Armor"
                } else if (rem_sub === 7) {
                    name = "Light Huntsman Boots"
                } else if (rem_sub === 8) {
                    name = "Enchanted Wand"
                } else if (rem_sub === 9) {
                    name = "Enchanted Silk Cap"
                } else if (rem_sub === 10) {
                    name = "Enchanted Silk Robe"
                } else if (rem_sub === 11) {
                    name = "Enchanted Silk Shoes"
                } else if (rem_sub === 12) {
                    name = "Steel Kusarigama"
                } else if (rem_sub === 13) {
                    name = "Black Soft Beanie"
                } else if (rem_sub === 14) {
                    name = "Black Soft Hoodie"
                } else if (rem_sub === 15) {
                    name = "Black Soft Shoes"
                } else if (rem_sub === 16) {
                    name = "Silver Ring"
                } else {
                    name = "Silver Necklace"
                }
            }
        }
    }
}