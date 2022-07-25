import React, { useState } from "react";
import Head from 'next/head'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Script from 'next/script';
import { Container, Typography } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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
      return (annualSalary - calTax(annualSalary)) / 12
    }

    return (annualSalary - calTax(annualSalary) - annualSalary * 0.02) / 12
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={4}>
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
                onChange={e => setLoanAmount(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <TextField
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
              <Grid>
                <Button variant="contained" onClick={calculate}>Calculate</Button>

              </Grid>
              <Grid sx={{ mt: 1.5, minWidth: 300 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="text.secondary">
                      Monthly Repayment:
                    </Typography>
                    <Typography variant="body1" component="div">
                      {repayment ? parseFloat(repayment.toFixed(2)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''}
                    </Typography>
                    <Typography color="text.secondary">
                      Monthly Net Income:
                    </Typography>
                    <Typography variant="body1" component="div">
                      {netIncome ? parseFloat(netIncome.toFixed(2)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''}
                    </Typography>
                    <Typography color="text.secondary">
                      Monthly Balance:
                    </Typography>
                    <Typography variant="body1" component="div">
                      {repayment && netIncome ? parseFloat((netIncome - repayment).toFixed(2)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''}
                    </Typography>
                    <Typography color="text.secondary">
                      Total Payment:
                    </Typography>
                    <Typography variant="body1" component="div">
                      {repayment ? parseFloat((repayment * term * 12).toFixed(2)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''}
                    </Typography>
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
