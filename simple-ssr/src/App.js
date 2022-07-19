// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from "react";
import LearnBetterLife from "./components/LearnBetterLife";

const App = ({ isSSR, ssrData }) => {
  return (
    <div>
      <LearnBetterLife />
    </div>
  );
};

export default App;
