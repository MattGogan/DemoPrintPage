const GASKET_COST_PER_INCH = .015;
const HANDLE_COST = 1;
const WHEEL_COST = 2;
const ASTS_FILTER_VOLUME_mm = 8100000; //actual carbon area is 7184480
const ASTS_001_FILTER_WEIGHT_lbs = 10;

var dimensions = ["Length", "Width", "Height"];

var options = ["Gasket-Top", "Gasket-Bottom", "Handle-Side", "Handle-Front", "Wheels"];
var optionCosts = [     .1,              .1,             .1,          .1,         .1];



//The following 2 arrays run in parallel for data.  i.e. GP = 1.35 where the name is stored in the first and the value in the second. Price of carbons[i] = carbonPricePerPound[i] 

//Total options: 9
var carbons =               ['GP',    'ACI', 'FOR', 'EDU-NoVal',  'AMM',  'ACR',  'ACM', 'CYN-NoVal', 'SUL-NoVal'];
var carbonPricePerPound =   [1.35,     2.35,  6.07,    0,     2.53,   5.98,  12.16,    0,     0];
var carbonDensity =         [   0,    0.646, 0.578,    0,    0.714,      0,      0,    0,     0]; //grams per cubic centimeter (G/CC)
//var selectedCarbonsMix =    [false,     false, false,  false, false, false, false, false, false]


//I think edu is equal parts GP, ACI, AMM




var dimensionsInputs = [];
var optionsCheckboxes = [];
var quoteVal = "";

var perimeter = 0;
var cost = 0.00;


//costs is an arbitrary array which stores values which add up to the total cost of a filter.
//[0] = Volume * Carbon Cost
//[1] = Top Gasket Cost
//[2] = Bottom Gasket Cost
//[3] = Side Handle Cost
//[4] = Front Handle Cost
//[5] = Wheels Cost
//[6] = Plastic Cost
var costs = [0, 0, 0, 0, 0, 0, 0];



window.onload = function(){
    console.log("Javascript 'Quoter.js' Enabled");
    //Load in all of the HTML DOM items.
    buildDimensionsInputs();
    buildOptionsCheckboxes();
    buildCarbonCheckboxes();
}

function summateCosts(){ 
    var mm3Volume = document.getElementById("numLengthMM").value * document.getElementById("numWidthMM").value * document.getElementById("numHeightMM").value;
    var inPerimeter = document.getElementById("numLengthIN").value * document.getElementById("numWidthIN").value;

    var astsRelativeVolume = mm3Volume/ASTS_FILTER_VOLUME_mm;

    /////////////////////////////////////////////////////////
    /////////////////Checkboxes/////////////////////////////
    ///////////////////////////////////////////////////////

    /*
        The following if statements check if various one-off checkboxes are checked, then set their corresponding spot (n) in the arbitrary costs[n] array for eventual summation
    */

    if(document.getElementById("ckbxGasket-Top").checked){
        costs[1] = inPerimeter * GASKET_COST_PER_INCH;
    }else{
        costs[1] = 0;
    }
    if(document.getElementById("ckbxGasket-Bottom").checked){
        costs[2] = inPerimeter * GASKET_COST_PER_INCH;
    }else{
        costs[2] = 0;
    }

    if(document.getElementById("ckbxHandle-Front").checked){
        costs[3] = HANDLE_COST;
        console.log("Handles was checked.");
    }else{
        costs[3] = 0;
    }
    if(document.getElementById("ckbxHandle-Side").checked){
        costs[4] = HANDLE_COST;
    }else{
        costs[4] = 0;
    }

    if(document.getElementById("ckbxWheels").checked){
        costs[5] = WHEEL_COST;
    }else{
        costs[5] = 0;
    }
    
    //END CHECKBOXES
    ////////////////////////////////////////////////////



    var selectedCarbon; //selected carbon is an integer which tracks which index of carbons[] correponds to the checked carbon box
                        //for example carbons[selectedCarbon] will eventually yield a string "GP, ACI, etc"
    var numberChecked = 0;
    var priceNoDiv = 0;
    var filterDensity = 0;
    for(var i = 0; i<carbons.length; i++){
        if(document.getElementById("ckbx"+carbons[i]).checked){
            selectedCarbon = i; //when a carbon checkbox is found to be checked, set variable selectedCarbon to be the index 
            numberChecked++;
            priceNoDiv += carbonPricePerPound[selectedCarbon];
            filterDensity += carbonDensity[selectedCarbon];
        }
    }
    console.log("numberChecked 2: " + numberChecked);//TEST

    console.log("Selected carbon is " + carbons[i]);

    var roughFilterWeight = astsRelativeVolume * ASTS_001_FILTER_WEIGHT_lbs;
    var newPrice = priceNoDiv / numberChecked;
    filterDensity = filterDensity/numberChecked;
    
    var filterCarbonCost = roughFilterWeight * newPrice;
    costs[0] = filterCarbonCost;
    
    console.log("Weight (" + roughFilterWeight + ") x material price (" + newPrice + ") = " + filterCarbonCost);

    console.log(costs);
    
    console.log("filter density: " + filterDensity);
    
    



    

    /////////////////////////////////////////////////////////
    /////////////////Panels/////////////////////////////////
    ///////////////////////////////////////////////////////

    //Total number of panels
    var shortPanels = document.getElementById("inpSmallPanels").value;
    var mediumPanels = document.getElementById("inpMediumPanels").value;
    var longPanels = document.getElementById("inpLongPanels").value;
    
    //TODO: Move converter so that all values convert to MM (if needed)
    
    //Dimentions in MM
    var lengthMM = document.getElementById("numLengthMM").value;
    var widthMM = document.getElementById("numWidthMM").value;
    var heightMM = document.getElementById("numHeightMM").value;
    
    //Plastic Width
    var plasticWidth = 0;
    var sheetCost = 0;
    if(document.getElementById("huey").checked){ // 1/4"
        plasticWidth = 6.35;  // 1/4" = 6.35mm 
        console.log("huey");
        sheetCost = 64;}
    if(document.getElementById("dewey").checked){ // 3/8"
        plasticWidth = 9.525;  // 3/8" = 9.525mm
        console.log("dewey");
        sheetCost = 96;}
    
    
    var longPanelArea = lengthMM * heightMM;
    //The length of the long panel is equal to Length x Height
    
    var mediumPanelLength = (widthMM) - (2 * plasticWidth);
    //The length of a medium pannel is equal to Width x Height - (2 x Plastic Width)

    //Small Pannels:
    var chambersPerRow = mediumPanels - 1; //The ammount of chambers in a row is equal to the ammount of medium panels - 1
    //var chambers = 1.5 * shortPanels; //There are 1.5 times more chambers than small panels
    var shortPanelsPerRow = chambersPerRow;
    var totalShortPanelRows = shortPanels / shortPanelsPerRow;
    var shortPanelLength = (lengthMM - (mediumPanels * plasticWidth))/shortPanelsPerRow;
    
    //Tests
    //console.log("Start with: " + lengthMM);
    //console.log("Subtract: " + mediumPanels*plasticWidth)
    //console.log("Divded by short panel count: " + shortPanelsPerRow);
    
    //console.log("long panel length: " + " (" + (longPanelArea/heightMM).toFixed(1) + " mm)");
    //console.log("Medium panels: " + mediumPanels)
    //console.log("Short panels per row: " + shortPanelsPerRow);
    //console.log("Short panel rows: " + totalShortPanelRows);
    //console.log("Short panel length: " + shortPanelLength + " (" + (shortPanelLength/heightMM).toFixed(1) + " mm)");
    
    var longPanelLength = lengthMM;
    
    
    console.log("Short panel length: " + shortPanelLength);
    console.log("Med panel length: " + mediumPanelLength);
    console.log("Long panel length: " + longPanelLength);
    var panelcalcerrors = "";
    
    //Volume
        //Variables:
        //volumeOfCarbon = Volume of Carbon (Interior Volume - Volume of Interior Pannels)
        //intVolume = Interior Volume (filter height * medium panel length * (long panel length – medium panel depth*2))
        //volIntPan = Volume of interior panels ( (short panel count * short panel length * short panel height * short panel depth) + ((medium panel count – 2) * med panel length * medium panel height * medium panel depth))
        
    var intVolume = heightMM * mediumPanelLength * (longPanelLength - (plasticWidth * 2)); //plasticWidth may not be the medium pannel depth
    var volIntPan = (shortPanels*shortPanelLength*heightMM*plasticWidth)+((mediumPanels-2)*mediumPanelLength*heightMM*plasticWidth);
    var volumeOfCarbon = (intVolume - volIntPan)/1000; //Divide by thousand to covert to cubic centimeters (CC).
    
    var openFaceArea = (lengthMM * widthMM) - (((longPanelLength*plasticWidth)*longPanels)+((mediumPanelLength*plasticWidth)*mediumPanels)+((shortPanelLength*plasticWidth)*shortPanels));
    openFaceArea = openFaceArea/100 //coverts mm^2 to cm^2
    
    //volumeOfCarbon is off by several CC. TODO: Fix calculations
    
    console.log("intVolume: " + intVolume/1000);
    console.log("volIntPan: " + volIntPan/1000);
    console.log("Volume of Carbon: " + volumeOfCarbon);
    
    //Weight (approx)
    //Find weight by multiplying volume by density.
    var filterWeight = filterDensity * volumeOfCarbon; //weight in grams(?)
    filterWeight = filterWeight/454 //translates weight in grams to pounds
    
    
    
    if(shortPanels%shortPanelsPerRow!==0){
        panelcalcerrors = "ERROR: BAD NUMBER OF SHORT PANELS LISTED.  CANNOT BUILD THIS FILTER.";
    }
    
    
    document.getElementById("lblPanelCalcErrors").innerHTML = panelcalcerrors;
    document.getElementById("lblShortPanelLength").innerHTML = shortPanelLength.toFixed(1); //mm
    document.getElementById("lblMediumPanelLength").innerHTML = mediumPanelLength.toFixed(1); //mm
    document.getElementById("lblLongPanelLength").innerHTML = lengthMM; //mm
    document.getElementById("lblVolumeOfCarbon").innerHTML = volumeOfCarbon.toFixed(1); //cubic cm
    document.getElementById("lblFilterWeight").innerHTML = filterWeight.toFixed(1); //lbs
    document.getElementById("lblOpenFaceArea").innerHTML = openFaceArea.toFixed(1); //cm^2
    
    
    //Calculating Usage
    var plasticSheetArea = 1219.2 * 2438.4; //The size of a sheet of plastic in millimeters (4' * 8' (48" * 96"))
    
    var filterPlasticUsage = 1.25 * ((longPanelArea * longPanels) + (mediumPanelLength * mediumPanels) + (shortPanelLength * shortPanels)); 
    
    var percentSheetsPerFilter = filterPlasticUsage / plasticSheetArea; // Percentage of a sheet used
    
    var totalSheetCost = percentSheetsPerFilter * sheetCost; //Cost of materals
    
    //console.log("Sheet size: " + plasticSheetArea);
    //console.log("Plastic used: " + filterPlasticUsage);
    //console.log("Percent of sheet used: " + percentSheetsPerFilter);
    //console.log("Price: $" + totalSheetCost.toFixed(2));
    
    //Add to "costs[]"
    costs[6] = totalSheetCost;
    console.log(costs)

    
    //END PANELS
    ////////////////////////////
    
    
        ////////////////////////////////////////
    //This loop gets adds all of the items inside of costs[] into an integer costsSummated
    var costsSummated = 0; 
    for(var i = 0; i<costs.length; i++){
        costsSummated += costs[i];
    }
    //////////////////////////////////////
    
    
    
    document.getElementById("spanRelativeToASTS").innerText = astsRelativeVolume.toFixed(2);
    document.getElementById("spanQuote").innerText = costsSummated.toFixed(2);

    if(document.getElementById("ckbxUK").checked){
        document.getElementById("spanQuote").innerText = ((costsSummated * 1.1) + 30).toFixed(2)
    }


}

function buildDimensionsInputs(){
    var div = document.getElementById("divDimensions");
    for(var i = 0; i<dimensions.length; i++){
        var p = document.createElement("p");
        var lbl = document.createElement("label");
        lbl.classList.add("left");
        lbl.appendChild(document.createTextNode(dimensions[i]+ ": "));
        p.appendChild(lbl);
        
        for(var j = 0; j<2; j++){
        var inp = document.createElement("INPUT");
        
        if(j==0){
        inp.setAttribute("placeholder", "mm");
        inp.setAttribute("id", "num"+dimensions[i]+"MM");
        }else{
        inp.setAttribute("placeholder", "inches");
        inp.setAttribute("id", "num"+dimensions[i]+"IN");
        }
        
        inp.setAttribute("oninput", "convertVals(this.value, this.id)");

        dimensionsInputs.push(inp);
        inp.setAttribute("type", "number");
        p.appendChild(inp);
        }

        
        div.appendChild(p);
    }
}


function convertVals(num, id){

    if(id.includes("MM")){
        var idOfIn = id.substring(0, id.indexOf("MM")) + "IN";
        document.getElementById(idOfIn).value = num*.0393701;
        
    }else{
        var idOfMM = id.substring(0, id.indexOf("IN")) + "MM";
        document.getElementById(idOfMM).value = num*25.4;
    }
}


function buildOptionsCheckboxes(){
    var div = document.getElementById("divOptions");
    for(var i = 0; i<options.length; i++){
        var p = document.createElement("p");
        var lbl = document.createElement("label");
        lbl.classList.add("left");
        lbl.appendChild(document.createTextNode(options[i]+ ": "));
    
        var ckbx = document.createElement("INPUT");
        ckbx.setAttribute("type", "checkbox");
        ckbx.setAttribute("id", "ckbx"+options[i]);
        optionsCheckboxes.push(ckbx);

    
        p.appendChild(lbl);
        p.appendChild(ckbx);
        div.appendChild(p);
    }
 
}

function buildCarbonCheckboxes(){
    var div = document.getElementById("divCarbons");
    for(var i = 0; i<carbons.length; i++){
        var p = document.createElement("p");
        var lbl = document.createElement("label");
        lbl.classList.add("left");
        lbl.appendChild(document.createTextNode(carbons[i]+ ": "));
    
        var ckbx = document.createElement("INPUT");
        ckbx.setAttribute("type", "checkbox");
        ckbx.setAttribute("id", "ckbx"+carbons[i]);
        if(i == 0){
            ckbx.setAttribute("checked", "true");
        }
        p.appendChild(lbl);
        p.appendChild(ckbx);
        div.appendChild(p);
    }
}
