async function main() {
    const KycToken = await ethers.getContractFactory("KycToken");
    const kycToken = await KycToken.deploy("KYC Test Token", "KTT");
  
    console.log("KycToken deployed to:", kycToken.address);
}
  
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });