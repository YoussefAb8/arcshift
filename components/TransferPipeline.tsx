const STEPS: { key: BridgeStatus; label: string }[] = [
  { key: "approving", label: "Approve" },
  { key: "depositing", label: "Prepare" },
  { key: "signing", label: "Sign" },
  { key: "attesting", label: "Attest" },
  { key: "switching-network", label: "Switch" },
  { key: "minting", label: "Mint" },
  { key: "complete", label: "Done" },
];

const ORDER: BridgeStatus[] = [
  "approving",
  "depositing",
  "signing",
  "attesting",
  "switching-network",
  "minting",
  "complete",
];
