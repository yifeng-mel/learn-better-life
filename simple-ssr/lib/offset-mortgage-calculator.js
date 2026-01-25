export const calculateTotalInterestWithOffset = (
  loanAmount,
  annualRate,
  termYears,
  offsetAmount = 0
) => {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = termYears * 12;

  // Standard mortgage repayment (NO offset effect here)
  const repayment =
    (loanAmount *
      monthlyRate *
      Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  let balance = loanAmount;
  let totalInterest = 0;
  let month = 0;

  while (balance > 0 && month < totalMonths * 5) {
    const effectiveBalance = Math.max(balance - offsetAmount, 0);
    const interest = effectiveBalance * monthlyRate;

    totalInterest += interest;
    balance = balance + interest - repayment;

    month++;
  }

  return {
    totalInterest,
    monthsToPayoff: month,
    repayment,
  };
};
