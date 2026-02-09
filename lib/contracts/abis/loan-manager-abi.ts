// Auto-generated ABI for LoanManager
// Generated at: 2026-01-10T04:05:28.031Z
// Source: LoanManager.sol/LoanManager.json

export const LOAN_MANAGER_ABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_lendingPool",
        type: "address",
        internalType: "address"
      },
      {
        name: "_collateralManager",
        type: "address",
        internalType: "address"
      },
      {
        name: "_walletFactory",
        type: "address",
        internalType: "address"
      },
      {
        name: "_usdcToken",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "borrowerLoans",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "loanAmount",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "marginAmount",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "poolFunding",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "startTime",
        type: "uint32",
        internalType: "uint32"
      },
      {
        name: "restrictedWallet",
        type: "address",
        internalType: "address"
      },
      {
        name: "isActive",
        type: "bool",
        internalType: "bool"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "canCreateLoan",
    inputs: [
      {
        name: "borrower",
        type: "address",
        internalType: "address"
      },
      {
        name: "loanAmount",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "canCreate",
        type: "bool",
        internalType: "bool"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "canWithdrawUSDC",
    inputs: [
      {
        name: "borrower",
        type: "address",
        internalType: "address"
      },
      {
        name: "withdrawAmount",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "canWithdraw",
        type: "bool",
        internalType: "bool"
      },
      {
        name: "currentBalance",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "minimumRequired",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "collateralManager",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract CollateralManager"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "createLoan",
    inputs: [
      {
        name: "loanAmount",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "success",
        type: "bool",
        internalType: "bool"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "getLoanInfo",
    inputs: [
      {
        name: "borrower",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "loan",
        type: "tuple",
        internalType: "struct LoanManager.LoanInfo",
        components: [
          {
            name: "loanAmount",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "marginAmount",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "poolFunding",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "startTime",
            type: "uint32",
            internalType: "uint32"
          },
          {
            name: "restrictedWallet",
            type: "address",
            internalType: "address"
          },
          {
            name: "isActive",
            type: "bool",
            internalType: "bool"
          }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getLoanStats",
    inputs: [],
    outputs: [
      {
        name: "totalLoansCreated",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "totalLoansRepaid",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "activeLoans",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getMaxWithdrawableUSDC",
    inputs: [
      {
        name: "borrower",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "maxWithdrawable",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getMinimumUSDCRequired",
    inputs: [
      {
        name: "borrower",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "minRequired",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getPoolFunding",
    inputs: [
      {
        name: "loanAmount",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "funding",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "pure"
  },
  {
    type: "function",
    name: "getRequiredMargin",
    inputs: [
      {
        name: "loanAmount",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "margin",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "pure"
  },
  {
    type: "function",
    name: "hasActiveLoan",
    inputs: [
      {
        name: "borrower",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "hasActive",
        type: "bool",
        internalType: "bool"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "lendingPool",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract LendingPool"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "liquidateLoan",
    inputs: [
      {
        name: "borrower",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "success",
        type: "bool",
        internalType: "bool"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "repayLoan",
    inputs: [],
    outputs: [
      {
        name: "success",
        type: "bool",
        internalType: "bool"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "totalLoans",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "totalRepaid",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "usdcToken",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IERC20"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "walletFactory",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract RestrictedWalletFactory"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "event",
    name: "LoanCreated",
    inputs: [
      {
        name: "borrower",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "loanAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      },
      {
        name: "marginAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      },
      {
        name: "poolFunding",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      },
      {
        name: "restrictedWallet",
        type: "address",
        indexed: true,
        internalType: "address"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "LoanLiquidated",
    inputs: [
      {
        name: "borrower",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "liquidator",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "recoveredAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "LoanRepaid",
    inputs: [
      {
        name: "borrower",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "returnedAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      }
    ],
    anonymous: false
  },
  {
    type: "error",
    name: "ReentrancyGuardReentrantCall",
    inputs: []
  },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address"
      }
    ]
  }
] as const;

export const LOAN_MANAGER_ADDRESS = "0xcB0f6AC0054F58617fB7452772022C74255a5A4e";
