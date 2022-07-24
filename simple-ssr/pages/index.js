import React, { useState } from "react";
import Head from 'next/head'

const LearnBetterLife = ({ result }) => {
  const [loanAmount, setLoanAmount] = useState();
  const [interest, setInterest] = useState();
  const [term, setTerm] = useState();
  const [repayment, setRepayment] = useState();
  const [mySalary, setMySalary] = useState();
  const [partnerSalary, setPartnerySalary] = useState();
  const [netIncome, setNetIncome] = useState();

  const calRepayment = () => {
    const monthlyRate = interest / 100 / 12
    const numberOfPayments = term * 12

    const top = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)
    const bottom = Math.pow(1 + monthlyRate, numberOfPayments) - 1
    const result = Math.round(top / bottom)

    setRepayment(result)
  }

  const calNetIncome = () => {
    let netIncome = 0
    if (mySalary) {
      netIncome += calMonNetIncome(mySalary)
    }
    if (partnerSalary) {
      netIncome += calMonNetIncome(partnerSalary)
    }

    setNetIncome(netIncome)
  }

  const calTax = (annualSalary) => {
    let taxInCent = 0

    if (annualSalary <= 18200) {
      return 0
    } else if (annualSalary <= 45000) {
      const taxable = annualSalary - 18200
      taxInCent = taxable * 19
    } else if (annualSalary <= 120000) {
      const taxable = annualSalary - 45000
      taxInCent = 5092 * 100 + taxable * 32.5
    } else if (annualSalary <= 180000) {
      const taxable = annualSalary - 120000
      taxInCent = 29467 * 100 + taxable * 37
    } else {
      const taxable = annualSalary - 180000
      taxInCent = 51667 * 100 + taxable * 45
    }

    return taxInCent / 100
  }

  const calMonNetIncome = (annualSalary) => {
    if (annualSalary < 23365 && !partnerSalary) {
      return (annualSalary - calTax(annualSalary))  / 12
    } 

    return (annualSalary - calTax(annualSalary) - annualSalary * 0.02)  / 12
  }


  const calculate = () => {
    calRepayment()
    calNetIncome()
  }

  return (
    <div>
      <Head>
        <title>Mortgage repayment calculator</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Learn to live a better life! Let\'s start with knowing our mortage and salary better." />
      </Head>
      <div>
        Principal Loan Amount: <input type="text" onChange={e => setLoanAmount(e.target.value)} />
        Annual Interest Rate: <input type="text" onChange={e => setInterest(e.target.value)} />
        Term(years): <input type="text" onChange={e => setTerm(e.target.value)} />
      </div>
      <div>
        My Annual Income: <input type="text" onChange={e => setMySalary(e.target.value)}/>
        Partner Annual Income (optional) <input type="text" onChange={e => setPartnerySalary(e.target.value)}/>
      </div>
      <div>
        <button onClick={calculate}>Calculate</button>
      </div>
      <div>
        Total Payment: <label>{repayment ? (repayment * term * 12).toFixed(2) : ''}</label>
      </div>
      <div>
        Monthly Repayment: <label>{repayment ? repayment.toFixed(2) : ''}</label>
      </div>
      <div>
        Monthly Net Income: <label>{netIncome ? netIncome.toFixed(2) : ''}</label>
      </div>
      <div>
        Monthly Balance: <label>{repayment && netIncome ? (netIncome - repayment).toFixed(2) : ''}</label>
      </div>
    </div>
  );
};
export default LearnBetterLife;
