// Load Unlock
var js = document.createElement("script");
sc = document.getElementsByTagName("script")[0];
js.src = "https://paywall.unlock-protocol.com/static/unlock.1.0.min.js";
sc.parentNode.insertBefore(js, sc);

// Configure Unlock
var unlockProtocolConfig = {
  locks: {
    "0xb71261afAF4db73BD70512c01247A3Bcc282B5a0": {
      name: "Unlock Alex's Class",
      network: 4
    }
  },
  callToAction: {
    default: 'Purchase now to check out Alexs Class!',
    pending: 'Your transaction was sent. It may take a few minutes to go through and you will receive it once it did.',
    confirmed: 'You already have a ticket. Please make sure to check your key chain to view it!',
    noWallet: 'You do not have a wallet yet. Please install one.',
  }
};

// Handle unlock events to hide/show element based on state
window.addEventListener("unlockProtocol", function(e) {
  var state = e.detail;

  document.querySelectorAll(".unlock-protocol").forEach(element => {
    element.style.display = "none";
  });
  document.querySelectorAll(`.${state}`).forEach(element => {
    element.style.display = "block";
  });
});
