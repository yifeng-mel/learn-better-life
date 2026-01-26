import React, { useState } from "react";
import Head from 'next/head'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Script from 'next/script';
import { Container, FormLabel, InputLabel, Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const LearnBetterLife = ({ result }) => {
  const [houseValue, setHouseValue] = useState();
  const [lvr, setLvr] = useState(80);
  const [loanAmount, setLoanAmount] = useState();
  const [displayLoanAmount, setDisplayLoanAmount] = useState();
  const [isCustomLoanAmount, setIsCustomLoanAmount] = useState();
  const [interest, setInterest] = useState(6.6);
  const [term, setTerm] = useState(30);
  const [downPayment, setDownPayment] = useState();
  const [stampDuty, setStampDuty] = useState();
  const [repayment, setRepayment] = useState();
  const [mySalary, setMySalary] = useState();
  const [partnerSalary, setPartnerySalary] = useState();
  const [netIncome, setNetIncome] = useState();

  const getReadableNumber = (inputNumber) => {
    return inputNumber ? parseFloat(inputNumber.toFixed(2)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''
  }

  const calRepayment = () => {
    const localLoanAmount = isCustomLoanAmount ? loanAmount : displayLoanAmount

    const monthlyRate = interest / 100 / 12
    const numberOfPayments = term * 12

    const top = localLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)
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
      return (annualSalary - calTax(annualSalary)) / 12
    }

    return (annualSalary - calTax(annualSalary) - annualSalary * 0.02) / 12
  }

  const calDisplayLoanAmount = (houseValue, lvr) => {
    setDisplayLoanAmount(houseValue * lvr / 100)
  }

  const calDownPayment = () => {
    if (houseValue !== '' && houseValue !== undefined && lvr !== '' && lvr !== undefined) {
      setDownPayment(houseValue * (100 - lvr) / 100)
    }
  }

  const calStampDuty = () => {
    setStampDuty(getStampDuty())
  }

  const getStampDuty = () => {
    if (houseValue < 25000) {
      return houseValue * 1.4
    } else if (houseValue >= 25000 && houseValue < 130000) {
      return 350 + ((houseValue - 25000) * 2.4 / 100)
    } else if (houseValue >= 130000 && houseValue < 960000) {
      return 2870 + ( (houseValue - 130000) * 6 / 100 )
    } else if (houseValue >= 960000 && houseValue < 2000000) {
      return houseValue * 5.5 / 100
    } else {
      return 110000 + ((houseValue - 2000000) * 6.5 / 100)
    }
  }

  const calculate = () => {
    setDownPayment(undefined)
    setStampDuty(undefined)
    calDownPayment()
    calStampDuty()
    calRepayment()
    calNetIncome()
  }

  return (
    <div>
      <Head>
        <title>Mortgage repayment calculator</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Learn to live a better life! Let's start with knowing our mortage and salary better." />
      </Head>
      <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />

      <Script strategy="lazyOnload">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
        page_path: window.location.pathname,
        });
    `}
      </Script>
      <div>
        <Container>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container
              spacing={2}
              direction="column"
              justifyContent="center"
              // style={{ minHeight: '100vh' }}
            >
              <Grid item xs={12} sm={12} md={4}>
                <Typography variant="h6" component="div" gutterBottom>
                  Mortgage and Salary Calculator (Australia)
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <TextField
                  disabled = {isCustomLoanAmount ? true : false}
                  fullWidth
                  required
                  id="filled-number"
                  label="House Value"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="standard"
                  onChange={e => {
                    if (e.target.value === '') {
                      setIsCustomLoanAmount(true)
                    } else {
                      setIsCustomLoanAmount(false)
                      calDisplayLoanAmount(e.target.value, lvr)
                    }

                    setHouseValue(e.target.value)
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <TextField
                  disabled = {isCustomLoanAmount ? true : false}
                  defaultValue={80}
                  fullWidth
                  required
                  id="filled-number"
                  label="Loan to Value Ratio (%)"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="standard"
                  onChange={e => setLvr(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                {
                  isCustomLoanAmount === undefined || isCustomLoanAmount === true ? 
                  <TextField
                    fullWidth
                    required
                    id="filled-number"
                    label="Principal Loan Amount"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="standard"
                    onChange={e => {
                      if (e.target.value === '') {
                        setIsCustomLoanAmount(false)
                      } else {
                        setIsCustomLoanAmount(true)
                      }

                      setLoanAmount(e.target.value)
                    }}
                  /> : 
                  <div>
                    <InputLabel shrink={true}>Principal Loan Amount</InputLabel>
                    <Typography color="body1" component="span">
                      {getReadableNumber(displayLoanAmount)}
                    </Typography>
                  </div>
                }
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <TextField
                  defaultValue={6.6}
                  fullWidth
                  required
                  id="filled-number"
                  label="Annual Interest Rate"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="standard"
                  onChange={e => setInterest(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <TextField
                  defaultValue={30}
                  required
                  fullWidth
                  id="filled-number"
                  label="Term(years)"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="standard"
                  onChange={e => setTerm(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  required
                  fullWidth
                  id="filled-number"
                  label="My Annual Income"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="standard"
                  onChange={e => setMySalary(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  fullWidth
                  id="filled-number"
                  label="Partner Annual Income (optional)"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="standard"
                  onChange={e => setPartnerySalary(e.target.value)}
                />
              </Grid>
              <Grid item container
                direction="column"
                alignItems="center"
                justify="center"
              >
                <Grid style={{ width: '100%' }}>
                  <Button variant="contained" onClick={calculate} style={{ width: '100%' }}>Calculate</Button>

                </Grid>
                <Grid sx={{ mt: 1.5, minWidth: 300 }} style={{ width: '100%' }}>
                  <Card variant="outlined">
                    <CardContent>
                    <div>
                        <Typography color="text.secondary" component="span">
                          Upfront Cost (Down Payment + Stamp Duty): &nbsp;
                          
                        </Typography>
                        <Typography variant="body1" component="span">
                          {downPayment === undefined ? <div></div> : <div>{getReadableNumber(downPayment)} + {getReadableNumber(stampDuty)} = {getReadableNumber(downPayment + stampDuty)}</div>}
                        </Typography>
                      </div>
                      <div>
                        <Typography color="text.secondary" component="span">
                          Monthly Repayment: &nbsp;
                        </Typography>
                        <Typography variant="body1" component="span">
                          {repayment ? parseFloat(repayment.toFixed(2)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''}
                        </Typography>
                      </div>
                      <div>
                        <Typography color="text.secondary" component="span">
                          Monthly Net Income: &nbsp;
                        </Typography>
                        <Typography variant="body1" component="span">
                          {netIncome ? parseFloat(netIncome.toFixed(2)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''}
                        </Typography>
                      </div>
                      <div>
                        <Typography color="text.secondary" component="span">
                          Monthly Balance: &nbsp;
                        </Typography>
                        <Typography variant="body1" component="span">
                          {repayment && netIncome ? parseFloat((netIncome - repayment).toFixed(2)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''}
                        </Typography>
                      </div>
                      <div>
                        <Typography color="text.secondary" component="span">
                          Total Payment: &nbsp;
                        </Typography>
                        <Typography variant="body1" component="span">
                          {repayment ? parseFloat((repayment * term * 12).toFixed(2)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''}
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </div>
    </div >
  );
};
export default LearnBetterLife;
