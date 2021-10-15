#!/bin/bash

# Testing Workflow
#
# References:
#
# - https://jestjs.io/docs/next/cli
# - https://github.com/hipstersmoothie/jest-github-reporter

# 1. Clear terminal
# 2. Source environment variables
# 3. Run Jest
clear
node $PROJECT_CWD/tools/cli/loadenv.cjs -c test
jest -i --passWithNoTests --testLocationInResults $@
