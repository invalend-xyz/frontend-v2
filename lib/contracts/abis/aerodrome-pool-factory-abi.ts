// Auto-generated ABI for PoolFactory
// Generated at: 2026-01-10T04:05:28.034Z
// Source: PoolFactory.sol/PoolFactory.json

export const AERODROME_POOL_FACTORY_ABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_implementation",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "MAX_FEE",
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
    name: "ZERO_FEE_INDICATOR",
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
    name: "allPools",
    inputs: [
      {
        name: "index",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "allPools",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address[]",
        internalType: "address[]"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "allPoolsLength",
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
    name: "createPool",
    inputs: [
      {
        name: "tokenA",
        type: "address",
        internalType: "address"
      },
      {
        name: "tokenB",
        type: "address",
        internalType: "address"
      },
      {
        name: "stable",
        type: "bool",
        internalType: "bool"
      }
    ],
    outputs: [
      {
        name: "pool",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "createPool",
    inputs: [
      {
        name: "tokenA",
        type: "address",
        internalType: "address"
      },
      {
        name: "tokenB",
        type: "address",
        internalType: "address"
      },
      {
        name: "fee",
        type: "uint24",
        internalType: "uint24"
      }
    ],
    outputs: [
      {
        name: "pool",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "customFee",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
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
    name: "feeManager",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getFee",
    inputs: [
      {
        name: "pool",
        type: "address",
        internalType: "address"
      },
      {
        name: "_stable",
        type: "bool",
        internalType: "bool"
      }
    ],
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
    name: "getPool",
    inputs: [
      {
        name: "tokenA",
        type: "address",
        internalType: "address"
      },
      {
        name: "tokenB",
        type: "address",
        internalType: "address"
      },
      {
        name: "fee",
        type: "uint24",
        internalType: "uint24"
      }
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getPool",
    inputs: [
      {
        name: "tokenA",
        type: "address",
        internalType: "address"
      },
      {
        name: "tokenB",
        type: "address",
        internalType: "address"
      },
      {
        name: "stable",
        type: "bool",
        internalType: "bool"
      }
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "implementation",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "isPaused",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "isPool",
    inputs: [
      {
        name: "pool",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "pauser",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "poolAdmin",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "setCustomFee",
    inputs: [
      {
        name: "pool",
        type: "address",
        internalType: "address"
      },
      {
        name: "fee",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "setFee",
    inputs: [
      {
        name: "_stable",
        type: "bool",
        internalType: "bool"
      },
      {
        name: "_fee",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "setFeeManager",
    inputs: [
      {
        name: "_feeManager",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "setPauseState",
    inputs: [
      {
        name: "_state",
        type: "bool",
        internalType: "bool"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "setPauser",
    inputs: [
      {
        name: "_pauser",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "setPoolAdmin",
    inputs: [
      {
        name: "_poolAdmin",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "stableFee",
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
    name: "volatileFee",
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
    type: "event",
    name: "PoolCreated",
    inputs: [
      {
        name: "token0",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "token1",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "stable",
        type: "bool",
        indexed: true,
        internalType: "bool"
      },
      {
        name: "pool",
        type: "address",
        indexed: false,
        internalType: "address"
      },
      {
        name: "",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "SetCustomFee",
    inputs: [
      {
        name: "pool",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "fee",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "SetFeeManager",
    inputs: [
      {
        name: "feeManager",
        type: "address",
        indexed: true,
        internalType: "address"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "SetPauseState",
    inputs: [
      {
        name: "state",
        type: "bool",
        indexed: true,
        internalType: "bool"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "SetPauser",
    inputs: [
      {
        name: "pauser",
        type: "address",
        indexed: true,
        internalType: "address"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "SetPoolAdmin",
    inputs: [
      {
        name: "poolAdmin",
        type: "address",
        indexed: true,
        internalType: "address"
      }
    ],
    anonymous: false
  },
  {
    type: "error",
    name: "FailedDeployment",
    inputs: []
  },
  {
    type: "error",
    name: "FeeInvalid",
    inputs: []
  },
  {
    type: "error",
    name: "FeeTooHigh",
    inputs: []
  },
  {
    type: "error",
    name: "InsufficientBalance",
    inputs: [
      {
        name: "balance",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "needed",
        type: "uint256",
        internalType: "uint256"
      }
    ]
  },
  {
    type: "error",
    name: "InvalidPool",
    inputs: []
  },
  {
    type: "error",
    name: "NotFeeManager",
    inputs: []
  },
  {
    type: "error",
    name: "NotPauser",
    inputs: []
  },
  {
    type: "error",
    name: "NotPoolAdmin",
    inputs: []
  },
  {
    type: "error",
    name: "PoolAlreadyExists",
    inputs: []
  },
  {
    type: "error",
    name: "SameAddress",
    inputs: []
  },
  {
    type: "error",
    name: "ZeroAddress",
    inputs: []
  },
  {
    type: "error",
    name: "ZeroFee",
    inputs: []
  }
] as const;

export const AERODROME_POOL_FACTORY_ADDRESS = "0x740166B014F11c1E7652bE4Abb527dC4aC015706";
