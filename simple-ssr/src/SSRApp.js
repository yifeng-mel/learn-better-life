// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState } from "react";
import ProductList from "./components/ProductList";
import LearnBetterLife from "./components/LearnBetterLife";

const SSRApp = ({ data }) => {
  const [result, setResult] = useState({ loading: false, products: data });
  return (
    <div>
       <LearnBetterLife />
    </div>
  );
};

export default SSRApp;
