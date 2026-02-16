import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import Script from "next/script";
import { calculateRepayment } from "../lib/repayment-calculator";
import { stampDutyCalculators } from "../lib/stamp-duty-calculator";
import { calculateTotalInterestWithOffset } from "../lib/offset-mortgage-calculator";

const STORAGE_KEY = "learnBetterLifeInputs";
const CANONICAL_URL = "https://www.learnbetterlife.com.au/mortgage-calculator";

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
  // Local storage
  // ------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const d = JSON.parse(saved);
      setLoanAmount(d.loanAmount ?? "");
      setInterest(d.interest ?? 6.6);
      setTerm(d.term ?? 30);
      setHouseValue(d.houseValue ?? "");
      setSelectedState(d.selectedState ?? "VIC");
      setOffsetLoan(d.offsetLoan ?? "");
      setOffsetInterest(d.offsetInterest ?? 6.6);
      setOffsetTerm(d.offsetTerm ?? 30);
      setOffsetAmount(d.offsetAmount ?? "");
    } catch { }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        loanAmount,
        interest,
        term,
        houseValue,
        selectedState,
        offsetLoan,
        offsetInterest,
        offsetTerm,
        offsetAmount,
      })
    );
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

  // ------------------------------
  // Helpers
  // ------------------------------
  const format = (v) => (v ? Number(v).toLocaleString() : "");
  const parse = (v) => v.replace(/,/g, "");
  const readable = (n) =>
    n?.toLocaleString(undefined, { maximumFractionDigits: 2 });

  // ------------------------------
  // Calculations
  // ------------------------------
  const calculateMortgage = () => {
    if (!loanAmount || !interest || !term) return;
    const monthly = calculateRepayment(
      Number(loanAmount),
      Number(interest),
      Number(term)
    );
    setRepayment(monthly);
    setTotalPaid(monthly * term * 12);
  };

  const calculateOffsetSaving = () => {
    if (!offsetLoan || !offsetInterest || !offsetTerm) return;

    const normal = calculateTotalInterestWithOffset(
      Number(offsetLoan),
      Number(offsetInterest),
      Number(offsetTerm),
      0
    );

    const withOffset = calculateTotalInterestWithOffset(
      Number(offsetLoan),
      Number(offsetInterest),
      Number(offsetTerm),
      Number(offsetAmount || 0)
    );

    setInterestSaved(normal.totalInterest - withOffset.totalInterest);
  };

  return (
    <>
      <Head>
        <title>
          Mortgage Repayment Calculator Australia | Stamp Duty & Offset Savings
        </title>

        <meta
          name="description"
          content="Free Australian mortgage calculator. Calculate home loan repayments, stamp duty by state, and interest savings using an offset account."
        />

        <meta
          name="keywords"
          content="mortgage calculator Australia, home loan repayment calculator, stamp duty calculator, offset account savings"
        />

        <link rel="canonical" href={CANONICAL_URL} />

        {/* Open Graph */}
        <meta property="og:title" content="Mortgage Calculator Australia" />
        <meta
          property="og:description"
          content="Calculate mortgage repayments, stamp duty and offset account savings for Australian home loans."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Mortgage Calculator Australia" />
        <meta
          name="twitter:description"
          content="Mortgage repayment, stamp duty and offset savings calculator."
        />

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How is mortgage repayment calculated in Australia?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Mortgage repayments are calculated using loan amount, interest rate and loan term. This calculator uses standard amortisation with monthly repayments.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is stamp duty and how is it calculated?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Stamp duty is a government tax on property purchases. The amount depends on the property price and the state or territory where the property is located.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How does an offset account reduce interest?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Money in an offset account reduces the effective loan balance used to calculate interest, which can significantly reduce total interest paid over the life of the loan.",
                  },
                },
              ],
            }),
          }}
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
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        `}
      </Script>

      <Container maxWidth="sm">
        {/* ------------------------------ */}
        {/* SEO Header (User-friendly)     */}
        {/* ------------------------------ */}
        <Box mb={4}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Mortgage Calculator Australia
          </Typography>

          <Box
            sx={{
              backgroundColor: "#f7f7f7",
              borderRadius: 2,
              padding: 2,
              color: "text.secondary",
            }}
          >
            <Typography variant="body2">
              Calculate your home loan repayments, stamp duty costs, and how much
              interest you can save with an offset account. Designed for Australian
              home buyers to make smarter property decisions.
            </Typography>
          </Box>
        </Box>

        {/* Stamp Duty */}
        <Box mt={5}>
          <Typography variant="h5">Stamp Duty Calculator</Typography>

          <TextField
            label="Property Price"
            fullWidth
            margin="normal"
            value={format(houseValue)}
            onChange={(e) => {
              const raw = parse(e.target.value);
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
            {Object.keys(stampDutyCalculators).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </TextField>

          <Button
            fullWidth
            variant="contained"
            onClick={() =>
              setStampDuty(
                stampDutyCalculators[selectedState](Number(houseValue))
              )
            }
          >
            Calculate Stamp Duty
          </Button>

          {stampDuty !== null && (
            <Typography mt={2} variant="h6">
              ${readable(stampDuty)}
            </Typography>
          )}
        </Box>

        {/* Mortgage */}
        <Box mt={6}>
          <Typography variant="h5">Mortgage Repayment Calculator</Typography>

          <TextField
            label="Loan Amount"
            fullWidth
            margin="normal"
            value={format(loanAmount)}
            onChange={(e) => {
              const raw = parse(e.target.value);
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

          <Button fullWidth variant="contained" onClick={calculateMortgage}>
            Calculate Repayment
          </Button>

          {repayment && (
            <Box mt={2}>
              <Typography>Monthly: ${readable(repayment)}</Typography>
              <Typography>Total paid: ${readable(totalPaid)}</Typography>
            </Box>
          )}
        </Box>

        {/* Offset */}
        <Box mt={6} mb={8}>
          <Typography variant="h5">Offset Account Savings</Typography>

          <TextField
            label="Loan Amount"
            fullWidth
            margin="normal"
            value={format(offsetLoan)}
            onChange={(e) => {
              const raw = parse(e.target.value);
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
            label="Offset Balance"
            fullWidth
            margin="normal"
            value={format(offsetAmount)}
            onChange={(e) => {
              const raw = parse(e.target.value);
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
              ${readable(interestSaved)}
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
};

export default LearnBetterLife;
