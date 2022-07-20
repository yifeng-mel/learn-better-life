import React, { useState } from "react";
import Product from "./Product";

const LearnBetterLife = ({ result }) => {
  const [loanAmount, setLoanAmount] = useState();
  const [interest, setInterest] = useState();
  const [term, setTerm] = useState();
  const [repayment, setRepayment] = useState();

  const calRepayment = () => {
    const monthlyRate = interest / 100 / 12
    const numberOfPayments = term * 12

    const top = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)
    const bottom = Math.pow(1 + monthlyRate, numberOfPayments) - 1
    const result = Math.round(top / bottom)

    setRepayment(result)
  }

  return (
    <div>
      Principal Loan Amount: <input type="text" onChange={e => setLoanAmount(e.target.value)} />
      Annual Interest Rate: <input type="text" onChange={e => setInterest(e.target.value)} />
      Term(years): <input type="text" onChange={e => setTerm(e.target.value)}/>
      <button onClick={calRepayment}>Calculate</button>
      Monthly Repayment: <label>{repayment}</label>
    </div>
  );
};
export default LearnBetterLife;
