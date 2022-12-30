// Code your whale tracker script here!
// **********************************
// ethers library is a library for talking to EVM compatible 
// based chains
// create a connection using link for the ethereuym node
// !!!! refer to : docs.ethers.io/v5/api/providers/



// supplying Contract below allows to not write this:
// const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI ,provider)
// instead to write more simpler
const { ethers, Contract } = require('ethers')

// maybe try swapping for matic or cronos, just an idea
// rpcURL can be obtained form adding networks on metamask
// const rpcURL = 'https://cloudflare-eth.com/'
// const rpcURL = 'https://polygon-rpc.com/' // works
const rpcURL = 'https://evm.cronos.org/'// works

// create a provider, pass the link (rpcURL) to the provider
// connects an application to the blockchain
const provider = new ethers.providers.JsonRpcProvider(rpcURL)

// address for TONIC Token
const CONTRACT_ADDRESS = '0xDD73dEa10ABC2Bff99c60882EC5b2B81Bb1Dc5B2'
// constant abi is used to look after different parameters of the token, it is copy and paste and standard for ERC-20 tokens
const CONTRACT_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]

// input token contract address, ABI and provider network
const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI ,provider)

// Note: No decimal places in smart contract
// example: 100.00$ == 10000 cents, and we need to use cents
// so 14 zeros after 4 decimal places and the rest of the full numbers
const TRANSFER_THRESHOLD = 100000000000000000000000 // 100,000 USDC (in wei)


// function to run the app
// works sort of like while loop, in reality it is a thread
main = async () => {
    // plays when whale does the transaction
    // Code logic goes here...
    // console.log("program running.")
    // const block = await provider.getBlockNumber()
    // console.log(block) // ** ignore this comment and above

    const name =  await contract.name()
    console.log('Whale tracker started!\nListening for large transfers on ' + name)

    // update the program to listen to transfer events
    // first the type of event is specified, in this case transfer
    // next arguments are addresses from and to, then amount of tonic
    // data == overall event information
    contract.on('Transfer', (from, to, amount, data) => {
        // transferred amount transaction
        // higher or equal to the threshhold
        // is displayed on the console
        if (amount >= TRANSFER_THRESHOLD ) {
            // prints name of the whale wallet and transaction id
            // data can be used to extract transaction hash and
            // other data associated with the transaction
            console.log('New whale transfer for ' + name + ': https://cronoscan.com/tx/' + data.transactionHash)
            console.log('Amount transferred: ' + amount)
        }
        // prints out data
        // console.log(from, to, amount, data)
    })

}

main()