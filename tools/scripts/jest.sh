#!/bin/bash

# Testing Workflow
#
# References:
#
# - https://jestjs.io/docs/next/cli
# - https://github.com/hipstersmoothie/jest-github-reporter

# 1. Set test environment variables
export NODE_ENV=test
export NODE_OPTIONS=''
export TS_NODE_PROJECT="$PROJECT_CWD/tsconfig.test.json"

# 2. Clear terminal
clear

# 3. Run test suites with Jest
jest -i --passWithNoTests --testLocationInResults $@
