async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying with account:', deployer.address);
  
    const SimpleStorage = await ethers.getContractFactory('SimpleStorage');
    const instance = await SimpleStorage.deploy();
    await instance.deployed();
  
    console.log('SimpleStorage deployed to:', instance.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  