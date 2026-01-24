import React, { useState } from "react";
import Head from "next/head";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import Script from "next/script";
import { calculateRepayment } from "../lib/repayment-calculator";
import { stampDutyCalculators } from "../lib/stamp-duty-calculator";

const LearnBetterLife = () => {
  // ------------------------------
  // Mortgage calculator
  // ------------------------------
  const [loanAmount, setLoanAmount] = useState("");
  const [interest, setInterest] = useState(6.6);
  const [term, setTerm] = useState(30);
  const [repayment, setRepayment] = useState(null);
  const [totalPaid, setTotalPaid] = useState(null);

  // ------------------------------
  // Stamp duty calculator
  // ------------------------------
  const [houseValue, setHouseValue] = useState("");
  const [selectedState, setSelectedState] = useState("VIC");
  const [stampDuty, setStampDuty] = useState(null);

  const formatNumber = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString();
  };

  const parseNumber = (value) => {
    return value.replace(/,/g, "");
  };

  const getReadableNumber = (num) => {
    if (!num && num !== 0) return "";
    return num.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  };

  const calculate = () => {
    if (!loanAmount || !interest || !term) return;

    const monthlyRepayment = calculateRepayment(
      Number(loanAmount),
      Number(interest),
      Number(term)
    );

    setRepayment(monthlyRepayment);
    setTotalPaid(monthlyRepayment * Number(term) * 12);
  };

  return (
    <>
      <Head>
        <title>Mortgage Repayment Calculator</title>
        <meta name="description" content="Simple mortgage repayment calculator" />
      </Head>

      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />
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

      <Container maxWidth="sm">
        {/* ------------------------------ */}
        {/* Stamp Duty Calculator          */}
        {/* ------------------------------ */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Stamp Duty Calculator
          </Typography>

          <TextField
            label="House Value"
            type="text"
            fullWidth
            margin="normal"
            value={formatNumber(houseValue)}
            onChange={(e) => {
              const rawValue = parseNumber(e.target.value);
              if (!/^\d*$/.test(rawValue)) return;
              setHouseValue(rawValue);
            }}
          />

          <TextField
            label="State"
            select
            fullWidth
            margin="normal"
            SelectProps={{ native: true }}
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="VIC">Victoria (VIC)</option>
            <option value="NSW">New South Wales (NSW)</option>
            <option value="QLD">Queensland (QLD)</option>
            <option value="WA">Western Australia (WA)</option>
            <option value="SA">South Australia (SA)</option>
            <option value="TAS">Tasmania (TAS)</option>
            <option value="ACT">Australian Capital Territory (ACT)</option>
            <option value="NT">Northern Territory (NT)</option>
          </TextField>

          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              if (!houseValue) return;
              const calculator = stampDutyCalculators[selectedState];
              if (!calculator) return;
              setStampDuty(calculator(Number(houseValue)));
            }}
          >
            Calculate Stamp Duty
          </Button>

          {stampDuty !== null && (
            <Box mt={2}>
              <Typography>Estimated stamp duty:</Typography>
              <Typography variant="h6">
                ${getReadableNumber(stampDuty)}
              </Typography>
            </Box>
          )}
        </Box>

        {/* ------------------------------ */}
        {/* Mortgage Repayment Calculator  */}
        {/* ------------------------------ */}
        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            Mortgage Repayment Calculator
          </Typography>

          <TextField
            label="Loan Amount"
            type="text"
            fullWidth
            margin="normal"
            value={formatNumber(loanAmount)}
            onChange={(e) => {
              const rawValue = parseNumber(e.target.value);
              if (!/^\d*$/.test(rawValue)) return;
              setLoanAmount(rawValue);
            }}
          />

          <TextField
            label="Interest Rate (%)"
            type="number"
            fullWidth
            margin="normal"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
          />

          <TextField
            label="Loan Term (years)"
            type="number"
            fullWidth
            margin="normal"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />

          <Button variant="contained" fullWidth onClick={calculate}>
            Calculate
          </Button>

          {repayment !== null && (
            <Box mt={2}>
              <Typography>Monthly repayment:</Typography>
              <Typography variant="h6">
                ${getReadableNumber(repayment)}
              </Typography>

              <Box mt={1}>
                <Typography>Total amount paid over {term} years:</Typography>
                <Typography variant="h6">
                  ${getReadableNumber(totalPaid)}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default LearnBetterLife;
