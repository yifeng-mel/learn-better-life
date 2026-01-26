import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import Script from "next/script";
import { calculateRepayment } from "../lib/repayment-calculator";
import { stampDutyCalculators } from "../lib/stamp-duty-calculator";
import { calculateTotalInterestWithOffset } from "../lib/offset-mortgage-calculator";

const STORAGE_KEY = "learnBetterLifeInputs";

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

  // ------------------------------
  // Offset interest saving
  // ------------------------------
  const [offsetLoan, setOffsetLoan] = useState("");
  const [offsetInterest, setOffsetInterest] = useState(6.6);
  const [offsetTerm, setOffsetTerm] = useState(30);
  const [offsetAmount, setOffsetAmount] = useState("");
  const [interestSaved, setInterestSaved] = useState(null);

  // ------------------------------
  // Load from localStorage (once)
  // ------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const data = JSON.parse(saved);

      setLoanAmount(data.loanAmount ?? "");
      setInterest(data.interest ?? 6.6);
      setTerm(data.term ?? 30);

      setHouseValue(data.houseValue ?? "");
      setSelectedState(data.selectedState ?? "VIC");

      setOffsetLoan(data.offsetLoan ?? "");
      setOffsetInterest(data.offsetInterest ?? 6.6);
      setOffsetTerm(data.offsetTerm ?? 30);
      setOffsetAmount(data.offsetAmount ?? "");
    } catch (e) {
      console.error("Failed to load saved data", e);
    }
  }, []);

  // ------------------------------
  // Save to localStorage (on change)
  // ------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const data = {
      loanAmount,
      interest,
      term,
      houseValue,
      selectedState,
      offsetLoan,
      offsetInterest,
      offsetTerm,
      offsetAmount,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [
    loanAmount,
    interest,
    term,
    houseValue,
    selectedState,
    offsetLoan,
    offsetInterest,
    offsetTerm,
    offsetAmount,
  ]);

  const formatNumber = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString();
  };

  const parseNumber = (value) => value.replace(/,/g, "");

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

  const calculateOffsetSaving = () => {
    if (!offsetLoan || !offsetInterest || !offsetTerm) return;

    const loan = Number(offsetLoan);
    const rate = Number(offsetInterest);
    const years = Number(offsetTerm);
    const offset = Number(offsetAmount || 0);

    const normal = calculateTotalInterestWithOffset(loan, rate, years, 0);
    const withOffset = calculateTotalInterestWithOffset(
      loan,
      rate,
      years,
      offset
    );

    setInterestSaved(normal.totalInterest - withOffset.totalInterest);
  };

  return (
    <>
      <Head>
        <title>Mortgage Repayment Calculator</title>
        <meta
          name="description"
          content="Mortgage, stamp duty and offset calculator"
        />
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
        {/* Stamp Duty */}
        <Box>
          <Typography variant="h5">Stamp Duty Calculator</Typography>

          <TextField
            label="House Value"
            fullWidth
            margin="normal"
            value={formatNumber(houseValue)}
            onChange={(e) => {
              const raw = parseNumber(e.target.value);
              if (/^\d*$/.test(raw)) setHouseValue(raw);
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
            <option value="VIC">Victoria</option>
            <option value="NSW">New South Wales</option>
            <option value="QLD">Queensland</option>
            <option value="WA">Western Australia</option>
            <option value="SA">South Australia</option>
            <option value="TAS">Tasmania</option>
            <option value="ACT">ACT</option>
            <option value="NT">Northern Territory</option>
          </TextField>

          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              if (!houseValue) return;
              setStampDuty(
                stampDutyCalculators[selectedState](Number(houseValue))
              );
            }}
          >
            Calculate Stamp Duty
          </Button>

          {stampDuty !== null && (
            <Typography mt={2} variant="h6">
              ${getReadableNumber(stampDuty)}
            </Typography>
          )}
        </Box>

        {/* Mortgage */}
        <Box mt={6}>
          <Typography variant="h5">Mortgage Repayment</Typography>

          <TextField
            label="Loan Amount"
            fullWidth
            margin="normal"
            value={formatNumber(loanAmount)}
            onChange={(e) => {
              const raw = parseNumber(e.target.value);
              if (/^\d*$/.test(raw)) setLoanAmount(raw);
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

          <Button fullWidth variant="contained" onClick={calculate}>
            Calculate
          </Button>

          {repayment && (
            <Box mt={2}>
              <Typography>Monthly: ${getReadableNumber(repayment)}</Typography>
              <Typography>
                Total paid: ${getReadableNumber(totalPaid)}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Offset */}
        <Box mt={6}>
          <Typography variant="h5">Offset – Interest Saved</Typography>

          <TextField
            label="Loan Amount"
            fullWidth
            margin="normal"
            value={formatNumber(offsetLoan)}
            onChange={(e) => {
              const raw = parseNumber(e.target.value);
              if (/^\d*$/.test(raw)) setOffsetLoan(raw);
            }}
          />

          <TextField
            label="Interest Rate (%)"
            type="number"
            fullWidth
            margin="normal"
            value={offsetInterest}
            onChange={(e) => setOffsetInterest(e.target.value)}
          />

          <TextField
            label="Loan Term (years)"
            type="number"
            fullWidth
            margin="normal"
            value={offsetTerm}
            onChange={(e) => setOffsetTerm(e.target.value)}
          />

          <TextField
            label="Offset Amount"
            fullWidth
            margin="normal"
            value={formatNumber(offsetAmount)}
            onChange={(e) => {
              const raw = parseNumber(e.target.value);
              if (/^\d*$/.test(raw)) setOffsetAmount(raw);
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={calculateOffsetSaving}
          >
            Calculate Interest Saved
          </Button>

          {interestSaved !== null && (
            <Typography mt={2} variant="h6">
              ${getReadableNumber(interestSaved)}
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
};

export default LearnBetterLife;
