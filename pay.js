var calculateMonthlyPayment = function(principal, years, rate) {
    if (rate) {
        var monthlyRate = rate / 100 / 12;
    }
    var monthlyPayment = principal * monthlyRate /
        (1 - (Math.pow(1 / (1 + monthlyRate), years * 12)));
    return monthlyPayment;
};