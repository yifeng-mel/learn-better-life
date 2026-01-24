import React, { useState } from "react";
import Head from "next/head";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import Script from "next/script";
import { calculateRepayment } from "../lib/calculator";

const LearnBetterLife = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [interest, setInterest] = useState(6.6);
  const [term, setTerm] = useState(30);
  const [repayment, setRepayment] = useState(null);

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

    const result = calculateRepayment(
      Number(loanAmount),
      Number(interest),
      Number(term)
    );
    setRepayment(result);
  };

  return (
    <>
      <Head>
        <title>Mortgage Repayment Calculator</title>
        <meta
          name="description"
          content="Simple mortgage repayment calculator"
        />
      </Head>

      {/* Google Analytics */}
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
        <Typography variant="h5" gutterBottom>
          Mortgage Repayment Calculator
        </Typography>

        <Box>
          <TextField
            label="Loan Amount"
            type="text"
            fullWidth
            margin="normal"
            value={formatNumber(loanAmount)}
            onChange={(e) => {
              const rawValue = parseNumber(e.target.value);

              // allow only digits
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

          <Button
            variant="contained"
            fullWidth
            onClick={calculate}
          >
            Calculate
          </Button>

          {repayment !== null && (
            <Box mt={2}>
              <Typography>
                Monthly repayment:
              </Typography>
              <Typography variant="h6">
                ${getReadableNumber(repayment)}
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default LearnBetterLife;
