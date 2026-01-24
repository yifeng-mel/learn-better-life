export const calculateRepayment = (amount, interest, term) => {
    const monthlyRate = interest / 100 / 12
    const numberOfPayments = term * 12

    const top = amount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)
    const bottom = Math.pow(1 + monthlyRate, numberOfPayments) - 1
    const result = Math.round(top / bottom)

    return result
}