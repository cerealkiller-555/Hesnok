global.window = {};
require('../public/data/azkar-data.js');
const azkarData = global.window.AZKAR_DATA;
let hasErrors = false;

if (!azkarData) {
    console.error("AZKAR_DATA is missing!");
    process.exit(1);
}

const sections = ['morning', 'evening', 'sleeping', 'prayerAzkar', 'jawami'];
sections.forEach(section => {
    const list = azkarData.azkar[section];
    if (!list) {
        console.error(`Section ${section} is missing!`);
        hasErrors = true;
        return;
    }
    console.log(`Checking ${section} (${list.length} items)...`);
    const ids = new Set();
    list.forEach((item, index) => {
        if (item.id === undefined) {
            console.error(`Item at index ${index} in ${section} is missing an ID!`);
            hasErrors = true;
        }
        if (ids.has(item.id)) {
            console.error(`Duplicate ID ${item.id} in ${section} at index ${index}!`);
            hasErrors = true;
        }
        ids.add(item.id);

        if (!item.text) {
            console.error(`Item ${item.id} in ${section} is missing text!`);
            hasErrors = true;
        }
        if (item.count === undefined || item.count < 1) {
            console.error(`Item ${item.id} in ${section} has invalid count: ${item.count}`);
            hasErrors = true;
        }
    });
});

if (hasErrors) {
    process.exit(1);
}

console.log("AZKAR_DATA validation passed.");
