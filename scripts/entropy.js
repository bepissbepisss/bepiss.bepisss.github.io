function updateEntropyDisplay(box) {
    let systemEntropy = box.calcEntropy();
    let demonEntropy = 0; // Calculate demon entropy here based on your logic
    
    // Update text displays 
    document.getElementById("sys-entropy").textContent = systemEntropy.toFixed(2); // this sets the value
    document.getElementById("dem-entropy").textContent = demonEntropy.toFixed(2); // its like changing the text in the html file
    document.getElementById("sys-temp").textContent = box.calcTemp().toFixed(2);
    
    // Update vertical gauge bar
    let totalEntropy = systemEntropy + demonEntropy;
    let sysPercent;
    let demPercent

    // The "Condition"
    if (totalEntropy > 0) {
        // The "True Path" (Calculate the ratio)
        sysPercent = (systemEntropy / totalEntropy) * 100;
    } else {
        // The "False Path" (Avoid division by zero)
        sysPercent = 0;
    }


    // The "Condition"
    if (totalEntropy > 0) {
        // The "True Path" (Calculate the ratio)
        sysPercent = (systemEntropy / totalEntropy) * 100;
    } else {
        // The "False Path" (Avoid division by zero)
        sysPercent = 0;
    }
    
    document.getElementById('sys-gauge').style.height = sysPercent + '%';
    document.getElementById('dem-gauge').style.height = demPercent + '%';
}


