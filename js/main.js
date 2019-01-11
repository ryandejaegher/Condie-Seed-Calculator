        /* NEW CALCULATIONS JANUARY 3rd 2019

        1. Total cost per acre (bin run) = (Seeding Rate x Commodity Price) + Cleaning + Freight + Testing + Screening 
        2. Total cost per acre (certified seed) = New Seed Cost x Seeding Rate
        3. $ Benefit of Certified Seed = (total cost bin run - total cost certified seed) + (((current variety - new variety) + genetic gain) x average yield) x commodity price)
        */

        /*
		// CALCULATIONS & FORMULA

		Total Bin Run = seedingRate * (commodityPrice + cleaningCost + freightCost + testingCost + screeningCost)
		Total Certified Seed = certifiedSeedPrice * seedingRate
		Difference = Total Certified Seed - Total Bin Run
		Yield Gain = (Certified Seed Variety - Bin Run Variety + Economic Gain of Certified Seed) * Your Average Yield
		$/ac Benefit of Certified Seed Use = (Yield Gain * Today's Commidity Price) - Difference Per Acre
        */

        //Get the inputs from the bin run form and returns an object
        var getBinRunInputs = function () {
            var inputs = {
                commodityPrice: qs('#commodityPrice'),
                seedingRate: qs('#seedingRate'),
                cleaningCost: qs('#cleaningCost'),
                freightCost: qs('#freightCost'),
                testingCost: qs('#testingCost'),
                screeningCost: qs('#screeningCost'),
                totalBinRun: qs('#totalBinRun')
            };
            return inputs;
        };

        //Get the inputs from getBinRunInputs and return them as values
        var getBinRunInputValues = function () {
            var inputValues = {
                commodityPrice: getBinRunInputs().commodityPrice.valueAsNumber,
                seedingRate: getBinRunInputs().seedingRate.valueAsNumber,
                cleaningCost: getBinRunInputs().cleaningCost.valueAsNumber,
                freightCost: getBinRunInputs().freightCost.valueAsNumber,
                testingCost: getBinRunInputs().testingCost.valueAsNumber,
                screeningCost: getBinRunInputs().screeningCost.valueAsNumber,
                totalBinRun: getBinRunInputs().totalBinRun
            };
            return inputValues;
        };
        var calculateTotalCostBinRun = function () {
            //Total Bin Run = seedingRate * (commodityPrice + cleaningCost + freightCost + testingCost + screeningCost)
            var inputs = getBinRunInputValues();
            var totalBinRun = inputs.seedingRate * (inputs.commodityPrice + inputs.cleaningCost + inputs.freightCost + inputs.testingCost +
                inputs.screeningCost);
            if (totalBinRun < 10) {
                inputs.totalBinRun.value = totalBinRun.toPrecision(3);
            } else {
                inputs.totalBinRun.value = totalBinRun.toPrecision(4);
            }
            console.log(totalBinRun);
            return totalBinRun;
        };

        //Get the inputs from the certified seed form and returns an object
        var getCertifiedSeedInputs = function () {
            var inputs = {
                certifiedSeedPrice: qs('#certifiedSeedPrice'),
                certifiedSeedingRate: qs('#certifiedSeedingRate'),
                totalCertifiedSeed: qs('#totalCertifiedSeed')
            };
            return inputs;
        };

        //Get the inputs from getCertifiedSeedInputValues and return them as values
        var getCertifiedSeedInputValues = function () {
            var inputs = getCertifiedSeedInputs();
            var values = {
                certifiedSeedPrice: inputs.certifiedSeedPrice.valueAsNumber,
                certifiedSeedingRate: inputs.certifiedSeedingRate.valueAsNumber,
                totalCertifiedSeed: inputs.totalCertifiedSeed
            };
            return values;
        };
        var calculateTotalCostCertifiedSeed = function () {
            //Total Certified Seed = certifiedSeedPrice * seedingRate
            var inputs = getCertifiedSeedInputValues();
            var totalCertifiedSeed = inputs.certifiedSeedPrice * inputs.certifiedSeedingRate;
            if (totalCertifiedSeed < 10) {
                inputs.totalCertifiedSeed.value = totalCertifiedSeed.toPrecision(3);
            } else {
                inputs.totalCertifiedSeed.value = totalCertifiedSeed.toPrecision(4);
            }

            return totalCertifiedSeed;
        };

        //Helper function to create shorthand for document.querySelector
        var qs = function (qs) {
            return document.querySelector(qs);
        };


        //Get the inputs from the seeding rate form and returns an object
        var getSeedingRateInputs = function () {
            var inputs = {
                density: qs('#density'),
                weight: qs('#weight'),
                germination: qs('#germination'),
                mortality: qs('#mortality')
            };
            return inputs;
        };

        //Get the inputs from getSeedingRateInputs and return them as values
        var getSeedingRateInputValues = function () {
            var inputValues = {
                density: getSeedingRateInputs().density.valueAsNumber,
                weight: getSeedingRateInputs().weight.valueAsNumber,
                germination: getSeedingRateInputs().germination.valueAsNumber / 100,
                mortality: getSeedingRateInputs().mortality.valueAsNumber / 100
            };
            return inputValues;
        };

        var getResultInputs = function () {
            var inputs = {
                averageYield: qs('#averageYield'),
                economicGain: qs('#economicGain'),
                certifiedBenefit: qs('#certifiedBenefit')
            };
            return inputs;
        };
        var getResultInputValues = function () {
            var inputValues = {
                averageYield: getResultInputs().averageYield.valueAsNumber,
                economicGain: getResultInputs().economicGain.valueAsNumber,
                certifiedBenefit: getResultInputs().certifiedBenefit
            };
            return inputValues;
        };

        var calculateBenefitOfCertifiedSeed = function () {
            var inputs = getResultInputValues();
            if (checkVariety().value === '' && checkNewVariety().value === '') {
                inputs.certifiedBenefit.value = 0;
                return;
            } else {
                var varietyDifference = (checkNewVariety().value / 100 - checkVariety().value / 100) + (inputs.economicGain / 100);
                var result = (calculateTotalCostBinRun() - calculateTotalCostCertifiedSeed()) + ((varietyDifference * inputs.averageYield) * getBinRunInputValues().commodityPrice);
                if (result < 10) {
                inputs.certifiedBenefit.value = result.toPrecision(3);
                } else {
                    inputs.certifiedBenefit.value = result.toPrecision(4);
                }
            }
        }

        var setBinRunSeedingRate = function () {
            var seedingRate = calculateOptimalSeedingRate();
            getBinRunInputs().seedingRate.value = (seedingRate/getBushelWeight()).toFixed(1);
            calculateTotalCostBinRun();
            console.log('success');
        }
        var setCertifiedSeedingRate = function () {
            var seedingRate = calculateOptimalSeedingRate();
            getCertifiedSeedInputs().certifiedSeedingRate.value = (seedingRate/getBushelWeight()).toFixed(1);
            calculateTotalCostCertifiedSeed();
            console.log('success');
        }

        /******
        		
        		FUNCTIONS FOR CHECKING AND UPDATING THE DROPDOWN MENUS
        		
        		*******/

        //Checks value of Zone dropdown and returns selected option
        var checkZone = function () {
            var zoneDropDown = qs('#zone');
            return zoneDropDown.selectedOptions[0].value;
        };

        //Checks value of Crop dropdown and returns selected option
        var checkCrop = function () {
            var cropDropDown = qs('#cropType');
            return cropDropDown.selectedOptions[0].value;
        };

        var getBushelWeight = function () {
            var cropDropDown = qs('#cropType');
            return parseInt(cropDropDown.selectedOptions[0].dataset.bushelWeight)
        }

        //Gets the variety dropdown 
        var checkVariety = function () {
            var variety = qs('#variety');
            return variety;
        };

        //Gets the new variety dropdown
        var checkNewVariety = function () {
            var variety = qs('#newVariety');
            return variety;
        };

        /*
        		This function is used to check the value of the crop dropdown. 
        		Based on which which crop is selected it will pass a different
        		argument to get populate the variety dropdown menu with new variety choices.
        		*/
        var updateVarietyOptions = function () {
            if (checkCrop() === 'winterWheat') {
                return getVariety(cropData.winterWheat);
            } else if (checkCrop() === 'fallRye') {
                return getVariety(cropData.fallRye);
            } else if (checkCrop() === 'maltingBarley') {
                return getVariety(cropData.maltingBarley);
            } else if (checkCrop() === 'foodBarley') {
                return getVariety(cropData.foodBarley);
            } else if (checkCrop() === 'yellowFieldPea') {
                return getVariety(cropData.yellowFieldPea);
            } else if (checkCrop() === 'greenFieldPea') {
                return getVariety(cropData.greenFieldPea);
            } else if (checkCrop() === 'flax') {
                return getVariety(cropData.flax);
            } else if (checkCrop() === 'oats') {
                return getVariety(cropData.oats);
            } else if (checkCrop() === 'redLentil') {
                return getVariety(cropData.redLentil);
            } else if (checkCrop() === 'greenLentil') {
                return getVariety(cropData.greenLentil);
            } else if (checkCrop() === 'canary') {
                return getVariety(cropData.canary);
            } else if (checkCrop() === 'cwrs') {
                return getVariety(cropData.cwrs);
            } else if (checkCrop() === 'cps') {
                return getVariety(cropData.cps);
            } else if (checkCrop() === 'cnhr') {
                return getVariety(cropData.cnhr);
            } else if (checkCrop() === 'softWhiteSpringWheat') {
                return getVariety(cropData.softWhiteSpringWheat);
            } else if (checkCrop() === 'canadaWesternSpecialPurposeWheat') {
                return getVariety(cropData.canadaWesternSpecialPurposeWheat);
            } else if (checkCrop() === 'hardWhiteSpringWheat') {
                return getVariety(cropData.hardWhiteSpringWheat);
            } else if (checkCrop() === 'canadaWesternAmberDurum') {
                return getVariety(cropData.canadaWesternAmberDurum);
            }
        };

        /* var getSelectedVarietyValues = function () {
            var currentVariety = getResultInputs().currentVariety;
            var newVariety = getResultInputs().newVariety;
            currentVariety.value = checkVariety().selectedOptions[0].value;
            newVariety.value = checkNewVariety().selectedOptions[0].value;
            console.log(newVariety.value);
        }; */

        //Iterate over cropData and add options to variety dropdown menu
        var getVariety = function (variety) {
            checkVariety().length = 1;
            checkNewVariety().length = 1;

            if (checkZone() === 'zone1') {
                for (var i = 0; i < variety.length; i++) {
                    checkVariety().innerHTML +=
                        `<option value="${variety[i].zone1}" data-seeding-rate="${variety[i].certifiedSeedingRate}">${variety[i].name} - ${variety[i].zone1}%</option>`;
                }
                for (var i = 0; i < variety.length; i++) {
                    checkNewVariety().innerHTML +=
                        `<option value="${variety[i].zone1}" data-seeding-rate="${variety[i].certifiedSeedingRate}">${variety[i].name} - ${variety[i].zone1}%</option>`;
                }

            } else if (checkZone() === 'zone3') {
                console.log('zone 3 selected');
                for (var i = 0; i < variety.length; i++) {
                    checkVariety().innerHTML +=
                        `<option value="${variety[i].zone3}" data-seeding-rate="${variety[i].certifiedSeedingRate}">${variety[i].name} - ${variety[i].zone3}%</option>`;
                }
                for (var i = 0; i < variety.length; i++) {
                    checkNewVariety().innerHTML +=
                        `<option value="${variety[i].zone3}" data-seeding-rate="${variety[i].certifiedSeedingRate}">${variety[i].name} - ${variety[i].zone3}%</option>`;
                }
            }
        };

        /******

        		THIS SECTION HOLDS ALL OF THE CROP DATA

        		******/
        //cropData holds arrays of products and includes the name, zone yield rates, and certified seeding rate
        var cropData = (function () {
            
            var winterWheat = [{
                    name: 'CDC Buteo',
                    zone1: 100,
                    zone3: 100,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Chase',
                    zone1: 109,
                    zone3: 110,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Elevate',
                    zone1: 110,
                    zone3: 103,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Emerson',
                    zone1: 105,
                    zone3: 97,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Fourish',
                    zone1: 101,
                    zone3: 101,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Gateway',
                    zone1: 101,
                    zone3: 100,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Goldrush',
                    zone1: 111,
                    zone3: 114,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Moats',
                    zone1: 108,
                    zone3: 103,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Radiant',
                    zone1: 103,
                    zone3: 102,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Wildfire',
                    zone1: 114,
                    zone3: 118,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Icefield',
                    zone1: 113,
                    zone3: 99,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Accipiter',
                    zone1: 110,
                    zone3: 106,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Falcon',
                    zone1: 103,
                    zone3: 98,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Peregrine',
                    zone1: 114,
                    zone3: 110,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Pintail',
                    zone1: 109,
                    zone3: 112,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Ptarmigan',
                    zone1: 113,
                    zone3: 113,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Sunrise',
                    zone1: 114,
                    zone3: 118,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Swainson',
                    zone1: 118,
                    zone3: 115,
                    certifiedSeedingRate: ''
                }
            ];

            var fallRye = [{
                    name: 'Hazlet',
                    zone1: 100,
                    zone3: 100,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Prima',
                    zone1: 81,
                    zone3: 94,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'KWS Bono',
                    zone1: 128,
                    zone3: 125,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Brasetto',
                    zone1: 113,
                    zone3: 122,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'KWS Daniello',
                    zone1: 111,
                    zone3: 111,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'KWS Gatano',
                    zone1: 118,
                    zone3: 120,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Guttino',
                    zone1: 116,
                    zone3: 127,
                    certifiedSeedingRate: ''
                }
            ];

            var maltingBarley = [{
                    name: 'AC Metcalfe',
                    zone1: 100,
                    zone3: 100,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Bow',
                    zone1: 113,
                    zone3: 111,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Connect',
                    zone1: 103,
                    zone3: 113,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Copeland',
                    zone1: 107,
                    zone3: 108,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Synergy',
                    zone1: 118,
                    zone3: 118,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Celebration',
                    zone1: 109,
                    zone3: 107,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Legacy',
                    zone1: 104,
                    zone3: 101,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Tradition',
                    zone1: 112,
                    zone3: 107,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Bentley',
                    zone1: 113,
                    zone3: 112,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Fraser',
                    zone1: 112,
                    zone3: 115,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Kindersley',
                    zone1: 105,
                    zone3: 107,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Lowe',
                    zone1: 109,
                    zone3: 109,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Newdale',
                    zone1: 112,
                    zone3: 113,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Polarstar',
                    zone1: 104,
                    zone3: 99,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC PlatinumStar',
                    zone1: 104,
                    zone3: 104,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Cerveza',
                    zone1: 113,
                    zone3: 117,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Goldstar',
                    zone1: 109,
                    zone3: 113,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Harrington',
                    zone1: 95,
                    zone3: 89,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Landis',
                    zone1: 109,
                    zone3: 109,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Major',
                    zone1: 112,
                    zone3: 115,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Meredith',
                    zone1: 114,
                    zone3: 112,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Merit 57',
                    zone1: 109,
                    zone3: 107,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Sirish',
                    zone1: 99,
                    zone3: 103,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Anderson',
                    zone1: 107,
                    zone3: 108,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Battleford',
                    zone1: 108,
                    zone3: 108,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Lacey',
                    zone1: 101,
                    zone3: 101,
                    certifiedSeedingRate: ''
                }
            ];

            var foodBarley = [{
                    name: 'Altorado',
                    zone1: 117,
                    zone3: 111,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Austenson',
                    zone1: 118,
                    zone3: 121,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Brahma',
                    zone1: 114,
                    zone3: 115,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Canmore',
                    zone1: 111,
                    zone3: 114,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Champion',
                    zone1: 117,
                    zone3: 117,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Claymore',
                    zone1: 119,
                    zone3: 117,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Coalition',
                    zone1: 111,
                    zone3: 114,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Cowboy',
                    zone1: 99,
                    zone3: 105,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Dolly',
                    zone1: 103,
                    zone3: 103,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Gadsby',
                    zone1: 110,
                    zone3: 110,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Helgason',
                    zone1: 105,
                    zone3: 106,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Maverick',
                    zone1: 98,
                    zone3: 98,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Oreana',
                    zone1: 117,
                    zone3: 112,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Trey',
                    zone1: 104,
                    zone3: 110,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Amisk',
                    zone1: 113,
                    zone3: 110,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Chigwell',
                    zone1: 107,
                    zone3: 111,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Muskwa',
                    zone1: 112,
                    zone3: 110,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AC Rosser',
                    zone1: 115,
                    zone3: 115,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Sundre',
                    zone1: 120,
                    zone3: 116,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Ascent',
                    zone1: 99,
                    zone3: 97,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Carter',
                    zone1: 94,
                    zone3: 99,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Clear',
                    zone1: 96,
                    zone3: 103,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC MGwire',
                    zone1: 98,
                    zone3: 99,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Taylor',
                    zone1: 82,
                    zone3: 87,
                    certifiedSeedingRate: ''
                }
            ];

            var yellowFieldPea = [{
                    name: 'CDC Amarillo',
                    zone1: 100,
                    zone3: 100,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Abarth',
                    zone1: 93,
                    zone3: 90,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Agassiz',
                    zone1: 98,
                    zone3: 93,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Ardill',
                    zone1: 102,
                    zone3: 99,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Athabasca',
                    zone1: 93,
                    zone3: 99,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Canary',
                    zone1: 96,
                    zone3: 98,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Carver',
                    zone1: 103,
                    zone3: 101,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Chrome',
                    zone1: 105,
                    zone3: 102,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Earlystar',
                    zone1: 92,
                    zone3: 91,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Golden',
                    zone1: 91,
                    zone3: 82,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Hornet',
                    zone1: 91,
                    zone3: 84,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Hyline',
                    zone1: 96,
                    zone3: 96,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Inca',
                    zone1: 104,
                    zone3: 100,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Lacombe',
                    zone1: 98,
                    zone3: 99,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Meadow',
                    zone1: 91,
                    zone3: 89,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Prosper',
                    zone1: 84,
                    zone3: 79,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Saffron',
                    zone1: 98,
                    zone3: 91,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Spectrum',
                    zone1: 104,
                    zone3: 102,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Thunderbird',
                    zone1: 89,
                    zone3: 83,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Treasure',
                    zone1: 88,
                    zone3: 87,
                    certifiedSeedingRate: ''
                }
            ];

            var greenFieldPea = [{
                    name: 'AAC Comfort',
                    zone1: 91,
                    zone3: 99,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Cooper',
                    zone1: 89,
                    zone3: 80,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Forest',
                    zone1: 100,
                    zone3: 101,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Greenwater',
                    zone1: 99,
                    zone3: 92,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Limerick',
                    zone1: 95,
                    zone3: 89,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Patrick',
                    zone1: 87,
                    zone3: 85,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Pluto',
                    zone1: 93,
                    zone3: 83,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Radius',
                    zone1: 77,
                    zone3: 77,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Raezer',
                    zone1: 81,
                    zone3: 81,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Royce',
                    zone1: 92,
                    zone3: 84,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Sage',
                    zone1: 73,
                    zone3: 71,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Spruce',
                    zone1: 95,
                    zone3: 99,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Striker',
                    zone1: 81,
                    zone3: 80,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Tetris',
                    zone1: 89,
                    zone3: 91,
                    certifiedSeedingRate: ''
                }
            ];

            var flax = [{
                    name: 'CDC Bethune',
                    zone1: 100,
                    zone3: 100,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Bravo',
                    zone1: 100,
                    zone3: 96,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Buryu',
                    zone1: 88,
                    zone3: 106,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Glas',
                    zone1: 108,
                    zone3: 102,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Neela',
                    zone1: 111,
                    zone3: 96,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'NuLin VT50',
                    zone1: 97,
                    zone3: 95,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Plava',
                    zone1: 91,
                    zone3: 96,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Prairie Blue',
                    zone1: 99,
                    zone3: 92,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Prairie Grande',
                    zone1: 92,
                    zone3: 98,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Prairie Sapphire',
                    zone1: 104,
                    zone3: 91,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Prairie Thunder',
                    zone1: 93,
                    zone3: 103,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Sanctuary',
                    zone1: 111,
                    zone3: 92,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Sorrel',
                    zone1: 105,
                    zone3: 101,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Topaz',
                    zone1: 90,
                    zone3: 102,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Vimy',
                    zone1: 94,
                    zone3: 90,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'WestLin 60',
                    zone1: 90,
                    zone3: 92,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'WestLin 70',
                    zone1: 102,
                    zone3: 94,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'WestLin 71',
                    zone1: 99,
                    zone3: 96,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'WestLin 72',
                    zone1: 96,
                    zone3: 99,
                    certifiedSeedingRate: ''
                }
            ];

            var oats = [{
                    name: 'CDC Dancer',
                    zone1: 100,
                    zone3: 100,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Arborg',
                    zone1: 114,
                    zone3: 119,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'SW Betania',
                    zone1: 105,
                    zone3: 105,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Big Brown',
                    zone1: 106,
                    zone3: 106,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Boyer',
                    zone1: 99,
                    zone3: 100,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CS Camden',
                    zone1: 113,
                    zone3: 114,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Derby',
                    zone1: 98,
                    zone3: 102,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Haymaker',
                    zone1: 92,
                    zone3: 95,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Justice',
                    zone1: 111,
                    zone3: 107,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Legget',
                    zone1: 103,
                    zone3: 104,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Lu',
                    zone1: 102,
                    zone3: 103,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Minstrel',
                    zone1: 106,
                    zone3: 107,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AC Morgan',
                    zone1: 104,
                    zone3: 108,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Morrison',
                    zone1: 100,
                    zone3: 92,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Nasser',
                    zone1: 109,
                    zone3: 107,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Norseman',
                    zone1: 110,
                    zone3: 108,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'ORe3541M',
                    zone1: 104,
                    zone3: 99,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'ORe3542M',
                    zone1: 108,
                    zone3: 100,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Orrin',
                    zone1: 108,
                    zone3: 109,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Pinnacle',
                    zone1: 113,
                    zone3: 109,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Ronald',
                    zone1: 96,
                    zone3: 99,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Ruffian',
                    zone1: 114,
                    zone3: 110,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Seabiscuit',
                    zone1: 110,
                    zone3: 106,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Souris',
                    zone1: 108,
                    zone3: 103,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Stride',
                    zone1: 110,
                    zone3: 107,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Summit',
                    zone1: 104,
                    zone3: 105,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Triactor',
                    zone1: 114,
                    zone3: 118,
                    certifiedSeedingRate: ''
                }
            ];

            var redLentil = [{
                    name: 'S - CDC Maxim CL',
                    zone1: 100,
                    zone3: 100,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'S - CDC Cherie',
                    zone1: 109,
                    zone3: 106,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'S- CDC Dazil CL',
                    zone1: 97,
                    zone3: 93,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'S - CDC Imax CL',
                    zone1: 92,
                    zone3: 78,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'S - CDC Impact CL',
                    zone1: 80,
                    zone3: 76,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'S - CDC Impulse CL',
                    zone1: 108,
                    zone3: 95,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'S - CDC Proclaim CL',
                    zone1: 105,
                    zone3: 102,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'S - CDC Red Rider',
                    zone1: 95,
                    zone3: 85,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'S - CDC Redberry',
                    zone1: 97,
                    zone3: 99,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'S - CDC Redcliff',
                    zone1: 107,
                    zone3: 103,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'S - CDC Redcoat',
                    zone1: 105,
                    zone3: 96,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'S - CDC Redmoon',
                    zone1: 114,
                    zone3: 106,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'S - CDC Scarlet',
                    zone1: 104,
                    zone3: 104,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'XS - CDC Impala CL',
                    zone1: 80,
                    zone3: 90,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'XS - CDC Imperial CL',
                    zone1: 84,
                    zone3: 79,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'XS - CDC Redbow',
                    zone1: 102,
                    zone3: 99,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'XS - CC Rosebud',
                    zone1: 100,
                    zone3: 99,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'XS - CDC Rosie',
                    zone1: 92,
                    zone3: 90,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'XS - CDC Roxy',
                    zone1: 102,
                    zone3: 98,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'LG - CDC KR-1',
                    zone1: 110,
                    zone3: 92,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'LG - CDC KR-2 CL',
                    zone1: 102,
                    zone3: 90,
                    certifiedSeedingRate: ''
                }
            ];

            var canary = [{
                    name: 'CDC Bastia',
                    zone1: 100,
                    zone3: 100,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Calvi',
                    zone1: 106,
                    zone3: 106,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Cibo',
                    zone1: 105,
                    zone3: 105,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Togo',
                    zone1: 96,
                    zone3: 96,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Cantate',
                    zone1: 115,
                    zone3: 115,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Keet',
                    zone1: 125,
                    zone3: 125,
                    certifiedSeedingRate: ''
                }
            ];

            var greenLentil = [{
                    name: 'S - CDC Imvincible CL',
                    zone1: 92,
                    zone3: 80,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'S - CDC Kermit',
                    zone1: 104,
                    zone3: 99,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'S - CDC Viceroy',
                    zone1: 97,
                    zone3: 98,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'XS - CDC Asterix',
                    zone1: 96,
                    zone3: 93,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'XS - CDC Imigreen CL',
                    zone1: 78,
                    zone3: 71,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'M - CDC Impress CL',
                    zone1: 87,
                    zone3: 71,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'M - CDC Meteor',
                    zone1: 102,
                    zone3: 89,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'M - CDC Richlea',
                    zone1: 93,
                    zone3: 80,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'LG - CDC Greenland',
                    zone1: 89,
                    zone3: 70,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'LG - CDC Greenstar',
                    zone1: 97,
                    zone3: 81,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'LG - CDC Impower CL',
                    zone1: 79,
                    zone3: 63,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'LG - CDC Sovereign',
                    zone1: 83,
                    zone3: 77,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'French - CDC Marble',
                    zone1: 102,
                    zone3: 98,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'French - CDC Peridot',
                    zone1: 84,
                    zone3: 94,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Gr Coty - CDC QG-1',
                    zone1: 80,
                    zone3: 65,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Gr Coty - CDC QG-2',
                    zone1: 88,
                    zone3: 90,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Gr Coty - CDC QG-3 CL',
                    zone1: 73,
                    zone3: 63,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Spanish - CDC SB-3 CL',
                    zone1: 88,
                    zone3: 87,
                    certifiedSeedingRate: ''
                }
            ];

            var cwrs = [{
                    name: 'Carberry',
                    zone1: 100,
                    zone3: 100,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Adamant VB',
                    zone1: 108,
                    zone3: 114,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Alida VB',
                    zone1: 105,
                    zone3: 108,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Bradwell',
                    zone1: 101,
                    zone3: 108,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Brandon',
                    zone1: 106,
                    zone3: 106,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Cameron VB',
                    zone1: 108,
                    zone3: 118,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Cardale',
                    zone1: 99,
                    zone3: 101,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Coleman',
                    zone1: 96,
                    zone3: 96,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Connery',
                    zone1: 101,
                    zone3: 100,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Elie',
                    zone1: 105,
                    zone3: 105,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Glenn',
                    zone1: 99,
                    zone3: 102,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Go',
                    zone1: 95,
                    zone3: 102,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Go Early',
                    zone1: 96,
                    zone3: 102,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Goodeve VB',
                    zone1: 101,
                    zone3: 107,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Hughes',
                    zone1: 100,
                    zone3: 110,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AC Intrepid',
                    zone1: 96,
                    zone3: 105,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Jatharia',
                    zone1: 108,
                    zone3: 114,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Landmark',
                    zone1: 109,
                    zone3: 112,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC VR Morris',
                    zone1: 108,
                    zone3: 106,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Parata',
                    zone1: 98,
                    zone3: 106,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Plentiful',
                    zone1: 105,
                    zone3: 104,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Prevail VB',
                    zone1: 110,
                    zone3: 108,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Redberry',
                    zone1: 105,
                    zone3: 108,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Shaw VB',
                    zone1: 112,
                    zone3: 114,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'SY Slate',
                    zone1: 102,
                    zone3: 107,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'SY Sovite',
                    zone1: 98,
                    zone3: 104,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Stanley',
                    zone1: 102,
                    zone3: 105,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Stettler',
                    zone1: 105,
                    zone3: 107,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Thorsby',
                    zone1: 102,
                    zone3: 102,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Tisdale',
                    zone1: 100,
                    zone3: 109,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Titanium VB',
                    zone1: 106,
                    zone3: 110,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Utmost VB',
                    zone1: 108,
                    zone3: 112,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Viewfield',
                    zone1: 109,
                    zone3: 108,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC W1876',
                    zone1: 98,
                    zone3: 101,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Waskada',
                    zone1: 108,
                    zone3: 107,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'WR859CL',
                    zone1: 101,
                    zone3: 101,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'SY479 VB',
                    zone1: 91,
                    zone3: 100,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'SY Chert VB',
                    zone1: 100,
                    zone3: 106,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'SY Obsidian',
                    zone1: 99,
                    zone3: 105,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Starbuck VB',
                    zone1: 113,
                    zone3: 117,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Warman VB',
                    zone1: 100,
                    zone3: 106,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Wheatland VB',
                    zone1: 110,
                    zone3: 114,
                    certifiedSeedingRate: ''
                }
            ];

            var cps = [{
                    name: 'AAC Crossfield',
                    zone1: 116,
                    zone3: 111,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Entic',
                    zone1: 116,
                    zone3: 109,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Foray VB',
                    zone1: 116,
                    zone3: 120,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Goodwin',
                    zone1: 116,
                    zone3: 116,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Penhold',
                    zone1: 108,
                    zone3: 111,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Ryley',
                    zone1: 103,
                    zone3: 110,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'SY Rowyn',
                    zone1: 101,
                    zone3: 106,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Tenacious VB',
                    zone1: 100,
                    zone3: 106,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Terrain',
                    zone1: 116,
                    zone3: 114,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'SY985',
                    zone1: 107,
                    zone3: 115,
                    certifiedSeedingRate: ''
                },
                {
                    name: '5700PR',
                    zone1: 107,
                    zone3: 113,
                    certifiedSeedingRate: ''
                }
            ];

            var cnhr = [{
                    name: 'AAC Concord',
                    zone1: 106,
                    zone3: 105,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Elgin ND',
                    zone1: 112,
                    zone3: 115,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Faller',
                    zone1: 115,
                    zone3: 120,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Lillian',
                    zone1: 89,
                    zone3: 95,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Prosper',
                    zone1: 116,
                    zone3: 119,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Unity VB',
                    zone1: 106,
                    zone3: 113,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Cordon CLPus VB',
                    zone1: 111,
                    zone3: 114,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Muchmore',
                    zone1: 102,
                    zone3: 98,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Redwater',
                    zone1: 102,
                    zone3: 101,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Vesper VB',
                    zone1: 108,
                    zone3: 113,
                    certifiedSeedingRate: ''
                },
                {
                    name: '5605HR',
                    zone1: 103,
                    zone3: 106,
                    certifiedSeedingRate: ''
                }
            ];

            var softWhiteSpringWheat = [{
                    name: 'AC Andrew',
                    zone1: 130,
                    zone3: 137,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Chiffon VB',
                    zone1: 136,
                    zone3: 137,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Indus VB',
                    zone1: 132,
                    zone3: 131,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Paramount VB',
                    zone1: 133,
                    zone3: 132,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Sadash VB',
                    zone1: 137,
                    zone3: 139,
                    certifiedSeedingRate: ''
                }
            ];

            var canadaWesternSpecialPurposeWheat = [{
                    name: 'Alderon',
                    zone1: 140,
                    zone3: 133,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Awesome VB',
                    zone1: 136,
                    zone3: 134,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Charing VB',
                    zone1: 138,
                    zone3: 133,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Innova',
                    zone1: 128,
                    zone3: 132,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Kinley',
                    zone1: 103,
                    zone3: 110,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC NRG003',
                    zone1: 119,
                    zone3: 123,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Pasteur',
                    zone1: 127,
                    zone3: 133,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Sparrow VB',
                    zone1: 138,
                    zone3: 134,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Throttle',
                    zone1: 121,
                    zone3: 122,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'WFT603',
                    zone1: 111,
                    zone3: 119,
                    certifiedSeedingRate: ''
                }
            ];

            var hardWhiteSpringWheat = [{
                    name: 'AAC Iceberg',
                    zone1: 101,
                    zone3: 96,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Whitefox',
                    zone1: 103,
                    zone3: 106,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Whitehawk',
                    zone1: 99,
                    zone3: 95,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Whitewood',
                    zone1: 95,
                    zone3: 94,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Cirrus',
                    zone1: 103,
                    zone3: 103,
                    certifiedSeedingRate: ''
                }
            ];

            var canadaWesternAmberDurum = [{
                    name: 'Strongfield',
                    zone1: 100,
                    zone3: 100,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Alloy',
                    zone1: 108,
                    zone3: 109,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Brigade',
                    zone1: 107,
                    zone3: 114,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Cabri',
                    zone1: 105,
                    zone3: 104,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Carbide VB',
                    zone1: 106,
                    zone3: 107,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Congress',
                    zone1: 109,
                    zone3: 107,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Credence',
                    zone1: 106,
                    zone3: 110,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Current',
                    zone1: 101,
                    zone3: 97,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Dynamic',
                    zone1: 105,
                    zone3: 106,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Enterprise',
                    zone1: 102,
                    zone3: 103,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Eurostar',
                    zone1: 100,
                    zone3: 104,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Fortitude',
                    zone1: 104,
                    zone3: 103,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Marchwell VB',
                    zone1: 99,
                    zone3: 104,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AC Navigator',
                    zone1: 97,
                    zone3: 89,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Precision',
                    zone1: 108,
                    zone3: 111,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Raymore',
                    zone1: 95,
                    zone3: 99,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Spitfire',
                    zone1: 108,
                    zone3: 110,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Stronghold',
                    zone1: 102,
                    zone3: 102,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'AAC Succeed VB',
                    zone1: 103,
                    zone3: 111,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'Transcend',
                    zone1: 102,
                    zone3: 105,
                    certifiedSeedingRate: ''
                },
                {
                    name: 'CDC Verona',
                    zone1: 102,
                    zone3: 107,
                    certifiedSeedingRate: ''
                }
            ];

            return {
                winterWheat: winterWheat,
                fallRye: fallRye,
                maltingBarley: maltingBarley,
                foodBarley: foodBarley,
                yellowFieldPea: yellowFieldPea,
                greenFieldPea: greenFieldPea,
                flax: flax,
                oats: oats,
                redLentil: redLentil,
                greenLentil: greenLentil,
                canary: canary,
                cwrs: cwrs,
                cps: cps,
                cnhr: cnhr,
                softWhiteSpringWheat: softWhiteSpringWheat,
                canadaWesternSpecialPurposeWheat: canadaWesternSpecialPurposeWheat,
                hardWhiteSpringWheat: hardWhiteSpringWheat,
                canadaWesternAmberDurum: canadaWesternAmberDurum
            };
        })();

        //Append seeding rate from Optimal Seeding Rate to Seeding Rate input on Bin Run and Certified Seed Input
        var calculateOptimalSeedingRate = function () {
            var inputValues = getSeedingRateInputValues();
            var seedingRateResult = qs('#seedingRateResult');
            var optimalSeedingRate = (inputValues.density * inputValues.weight / (inputValues.germination -
                inputValues.mortality) / 10.418).toFixed(1);
            if (isNaN(optimalSeedingRate) === true || optimalSeedingRate == Infinity) {
                return;
            } else {
                seedingRateResult.textContent = optimalSeedingRate;
                return optimalSeedingRate;
            }
        };

        /******
        		
        		EVENT LISTENERS

        		******/
        //Event listener on document listening for any changes to inputs and dropdowns
        document.addEventListener('change', function (event) {
            calculateOptimalSeedingRate();
            calculateTotalCostBinRun();
            calculateTotalCostCertifiedSeed();
            calculateBenefitOfCertifiedSeed();

            if (event.target.matches('#variety') || event.target.matches('#newVariety')) {
                //getSelectedVarietyValues();
                //calculateYieldGain();
                calculateBenefitOfCertifiedSeed();
            }
            if (event.target.matches('#zone') || event.target.matches('#cropType')) {
                console.log(event.target);
                updateVarietyOptions();
                calculateBenefitOfCertifiedSeed();
            }
        });

        document.addEventListener('click', function (event) {
            if (event.target.matches('#save-bin-run')) {
                setBinRunSeedingRate();
            }
            if (event.target.matches('#save-certified-seed')) {
                setCertifiedSeedingRate();
            }
        });


        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })

        $('#bin-run-seeding-rate').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget) // Button that triggered the modal
          //  var recipient = button.data('whatever') // Extract info from data-* attributes
            // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
            // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
            var modal = $(this)
            if (button.data('tkw') === 'certified') {
                console.log(button.data('tkw'))
                modal.find('#save-bin-run').hide();
                modal.find('#save-certified-seed').show();
            } else if (button.data('tkw') === 'binRun') {
                console.log(button.data('tkw'))
                modal.find('#save-certified-seed').hide();
                modal.find('#save-bin-run').show();
            }
            
            //modal.find('.modal-title').text('New message to ' + recipient)
            //modal.find('.modal-body input').val(recipient)
          })