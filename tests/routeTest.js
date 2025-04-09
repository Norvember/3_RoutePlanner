const { Builder, By, until, Key } = require('selenium-webdriver');
const quickSleep = 1 * 1000; // 1 second
const midSleep = 3 * 1000; // 3 seconds

describe('Google Maps Route Planner Test', function () {
    this.timeout(200000); // Set timeout for Mocha tests
    let driver;

    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async function () {
        await driver.quit();
    });

    it('should create a route in Google Maps', async function () {
        const pointsOfInterest = [
            { name: 'Katedra', coordinates: '54.6851059,25.2865151' },
            { name: 'Prezidentūra', coordinates: '54.6838342,25.2865345' },
            { name: 'VU', coordinates: '54.6831931,25.2868054' },
            { name: 'Alumnatas', coordinates: '54.6820794,25.2862603' },
            { name: 'Rotušė', coordinates: '54.6784913,25.2871451' },
            { name: 'Bazilijonų vartai', coordinates: '54.6759772,25.2884315' },
            { name: 'Šv. Dvasios cerkvė', coordinates: '54.6755994,25.2899818' },
            { name: 'Aušros vartai', coordinates: '54.6746027,25.2894384' }
        ];

        if (pointsOfInterest.length < 3) {
            throw new Error('Error: At least 3 points of interest are required to create a route.');
        }

        // Choice between coordinates or names
        const useCoordinates = true;

        // Open Google Maps
        await driver.get('https://www.google.com/maps');

        // First page is loaded for google consent
        const rejectAllButton = await driver.wait(until.elementLocated(By.css('button[aria-label="Atmesti viską"]')), 10000);
        await rejectAllButton.click();
        await driver.sleep(quickSleep);

        // SearchBox
        const searchBoxContainer = await driver.wait(until.elementLocated(By.id('searchbox')), 10000);
        const searchBox = await searchBoxContainer.findElement(By.css('input'));

        await searchBox.sendKeys(pointsOfInterest[0].coordinates, Key.RETURN);
        await driver.sleep(quickSleep);

        // Directions
        const directionsButton = await driver.findElement(By.css('button[aria-label="Nuorodos"]'));
        await directionsButton.click();
        await driver.sleep(quickSleep);

        // Select "Walking" (Pėsčiomis)
        const walkingButton = await driver.findElement(By.css('div[aria-label="Pėsčiomis"]'));
        await walkingButton.click();
        await driver.sleep(quickSleep);

        // Button "Sukeisti pradžios tašką su kelionės tikslu"
        const swapButton = await driver.findElement(By.css('button[aria-label="Sukeisti pradžios tašką su kelionės tikslu"]'));
        await swapButton.click();
        await driver.sleep(quickSleep);

        // Find div "directions-searchbox-1" and add first point of interest to it's input field
        const destinationBox = await driver.findElement(By.id('directions-searchbox-1'));
        const destinationInput = await destinationBox.findElement(By.css('input'));
        await destinationInput.clear();
        await destinationInput.sendKeys(pointsOfInterest[1].coordinates, Key.RETURN);
        await driver.sleep(quickSleep);

        // Add points of interest to the route
        for (const point of pointsOfInterest.slice(2)) { // Skip the first two points
            // Find span with text "Pridėti kelionės tikslą"
            const addDestinationButton = await driver.findElement(By.xpath("//span[text()='Pridėti kelionės tikslą']/ancestor::button"));
            await addDestinationButton.click();
            await driver.sleep(quickSleep);

            const destinationBox = await driver.findElement(By.id('directions-searchbox-' + (pointsOfInterest.indexOf(point))));
            const destinationInput = await destinationBox.findElement(By.css('input'));
            await destinationInput.clear();

            // Use coordinates or names
            const inputValue = useCoordinates ? point.coordinates : point.name;
            await destinationInput.sendKeys(inputValue, Key.RETURN);
            await driver.sleep(quickSleep);
        }

        console.log('Maršrutas sėkmingai sukurtas „Google“ žemėlapiuose.');
    });
});