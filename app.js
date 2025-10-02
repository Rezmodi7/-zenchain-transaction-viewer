<script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>
<script>
let provider;
let signer;

// مشخصات شبکه ZenChain Testnet
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

// اتصال به کیف پول و شبکه
async function connectWallet() {
  if (!window.ethereum || !window.ethers) {
    alert("لطفاً MetaMask و کتابخانه ethers.js را نصب کنید");
    return;
  }

  try {
    // درخواست اتصال به کیف پول
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // ساخت provider و signer
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    // بررسی شبکه فعلی
    const currentChainId = await window.ethereum.request({ method: "eth_chainId" });

    if (currentChainId !== ZENCHAIN_PARAMS.chainId) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ZENCHAIN_PARAMS.chainId }],
        });
      } catch (switchError) {
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

    // نمایش آدرس و موجودی
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);

    document.getElementById("walletAddress").innerText = "Wallet: " + address;
    document.getElementById("balance").innerText =
      "Balance: " + ethers.utils.formatEther(balance) + " ZTC";

    document.getElementById("status").innerText = "✅ Connected to ZenChain";

  } catch (err) {
    console.error(err);
    alert("خطا در اتصال: " + err.message);
  }
}
</script>
