let provider;
let signer;

// ZenChain Testnet network parameters
const ZENCHAIN_PARAMS = {
  chainId: "0x20d8", // 8408 in hex
  chainName: "ZenChain Testnet",
  nativeCurrency: {
    name: "ZenChain Token",
    symbol: "ZTC",
    decimals: 18,
  },
  rpcUrls: ["https://zenchain-testnet.api.onfinality.io/public"],
  blockExplorerUrls: ["https://zentrace.io/"],
};

async function connectWallet() {
  const statusEl = document.getElementById("status");
  const addressEl = document.getElementById("walletAddress");
  const balanceEl = document.getElementById("balance");

  // Clear previous info
  addressEl.innerText = "";
  balanceEl.innerText = "";
  statusEl.innerText = "Connecting...";

  if (!window.ethereum) {
    statusEl.innerText = "MetaMask not detected.";
    alert("لطفاً MetaMask را نصب کنید.");
    return;
  }
  if (typeof window.ethers === 'undefined') {
    statusEl.innerText = "ethers.js library not loaded.";
    alert("کتابخانه ethers.js لود نشده است.");
    return;
  }

  try {
    // Request wallet connection
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Setup provider and signer
    provider = new window.ethers.providers.Web3Provider(window.ethereum, "any");
    signer = provider.getSigner();

    // Check current network
    const currentChainId = await window.ethereum.request({ method: "eth_chainId" });

    if (currentChainId !== ZENCHAIN_PARAMS.chainId) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ZENCHAIN_PARAMS.chainId }],
        });
      } catch (switchError) {
        // If chain not added, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [ZENCHAIN_PARAMS],
          });
        } else {
          throw switchError;
        }
      }
    }

    // Get user address and balance
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);

    addressEl.innerText = "Wallet: " + address;
    balanceEl.innerText = "Balance: " + window.ethers.utils.formatEther(balance) + " ZTC";
    statusEl.innerText = "✅ Connected to ZenChain";

  } catch (err) {
    console.error(err);
    statusEl.innerText = "Connection Error";
    alert("خطا در اتصال: " + (err.message || err));
  }
}

// Event listener for connect button
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("connectBtn").addEventListener("click", connectWallet);
});
