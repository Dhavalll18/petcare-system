// Simple algorithmic implementation for AI tips
// based on breed, species, age, and activity level.

function generatePetCareTips(pet) {
    let tips = [];
    
    const species = pet.species?.toLowerCase() || 'unknown';
    
    if (species === 'dog') {
        tips.push("Dogs thrive on routine. Try to maintain consistent feeding and walking times.");
        if (pet.age < 1) {
            tips.push("Puppies need lots of socialization. Introduce them to new people and friendly pets regularly in safe environments.");
            tips.push("Ensure puppy vaccinations are up to date before frequenting dog parks.");
        } else if (pet.age > 7) {
            tips.push("Senior dogs might benefit from joint supplements. Keep an eye on any stiffness or reluctance to climb stairs.");
            tips.push("Schedule bi-annual vet checkups for early detection of age-related issues.");
        } else {
            tips.push("Adult dogs need at least 30-60 minutes of exercise daily, depending on the breed.");
        }
    } else if (species === 'cat') {
        tips.push("Cats mask illness well. Watch for subtle changes in appetite, litter box habits, or grooming.");
        if (pet.age < 1) {
            tips.push("Kittens need high-protein food to support their rapid growth.");
        } else if (pet.age > 10) {
            tips.push("Senior cats are prone to kidney issues. Monitor water intake and consider wet food diets.");
        } else {
            tips.push("Provide vertical spaces like cat trees for exercise and mental stimulation.");
            tips.push("Engage playtime for 10-15 minutes daily to mimic hunting behaviors.");
        }
    } else if (species === 'bird') {
        tips.push("Birds need daily mental stimulation and interaction to prevent plucking behaviors.");
        tips.push("Ensure a varied diet of pellets, fresh fruits, and vegetables. Seeds should be a treat.");
        tips.push("Provide daily out-of-cage time in a bird-safe room.");
    } else {
        tips.push("Keep a close eye on your pet's eating habits and energy levels.");
        tips.push("Ensure fresh water is available at all times.");
    }
    
    // Add some random generic tips to simulate variability
    const genericTips = [
        "Regular grooming helps prevent matting and distributes natural oils.",
        "Check ears regularly for any signs of redness, odor or discharge.",
        "Dental care is important. Consider pet-safe toothpaste or dental treats.",
        "Mental stimulation is just as important as physical exercise."
    ];
    
    tips.push(genericTips[Math.floor(Math.random() * genericTips.length)]);
    return tips;
}

module.exports = generatePetCareTips;
