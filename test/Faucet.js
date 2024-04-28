const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("Faucet", () => {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFaucetFixture() {
    const Faucet = await ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy();
    const [owner, otherAccount] = await ethers.getSigners();
    await faucet.waitForDeployment();
    // console.log(faucet.target)
    // Transfer 1 ether to the faucet
    await owner.sendTransaction({
      to: faucet.target,
      value: ethers.parseEther("0.2"),
    });

    return { faucet , owner, otherAccount};
  }

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      const { faucet, owner } = await loadFixture(deployFaucetFixture);

      expect(await faucet.owner()).to.equal(owner.address);
    });
  });

  describe("Test the withdraw function", async () => {
    it("Should withdraw as long as there is money in the faucet and the amount is within 0.1 eth", async () => {
      const { faucet, otherAccount } = await loadFixture(deployFaucetFixture);
      // Get account's initial balance
      const otherAccountBalance = await ethers.provider.getBalance(otherAccount.address);
      // Withdraw 1 ether from the faucet
      await faucet.connect(otherAccount).withdraw(ethers.parseEther("0.01"));
      // Get account's balance after the withdrawal
      const otherAccountBalanceAfter = await ethers.provider.getBalance(otherAccount.address);
      // Calculate difference in ethers
      const difference = ethers.toBigInt(otherAccountBalanceAfter)-ethers.toBigInt(otherAccountBalance);
      // Convert bigint to ethers
      const differenceInEther = Number(ethers.formatEther(difference)).toFixed(2); // Some gas paid, hence round up
      expect(differenceInEther).to.be.equal('0.01');

      const address = faucet.target
      const balance = ethers.formatEther(await ethers.provider.getBalance(address));
      expect(balance).to.be.equal('0.19');
    });
    it("Should fail when there's insufficient funds in the faucet", async () => {
      const { faucet, otherAccount } = await loadFixture(deployFaucetFixture);
      // Withdraw 0.1 ether from the faucet
      await faucet.connect(otherAccount).withdraw(ethers.parseEther("0.1"));
      await faucet.connect(otherAccount).withdraw(ethers.parseEther("0.01"));
      const address = faucet.target
      const balance = ethers.formatEther(await ethers.provider.getBalance(address));
      expect(balance).to.be.equal('0.09');
      // Withdraw 0.1 ether from the faucet
      await expect(faucet.connect(otherAccount).withdraw(ethers.parseEther("0.1"))).to.be.revertedWith('Insufficient balance in the contract');
      expect(balance).to.be.equal('0.09');
    })
    it("Should fail when trying to withdraw more than 0.1 eth", async () => {
      const { faucet, otherAccount } = await loadFixture(deployFaucetFixture);
      await expect(faucet.connect(otherAccount).withdraw(ethers.parseEther("0.2"))).to.be.revertedWith('amount must be less than .1 ETH');
      const address = faucet.target;
      const balance = ethers.formatEther(await ethers.provider.getBalance(address));
      expect(balance).to.be.equal('0.2');
    })
  });
})
