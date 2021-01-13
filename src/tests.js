const bitso = require("./BitsoAPI");
const chalk = require("chalk");
const bitsoUrl = process.env.bitsoUrl;
const bitsoApiKey = process.env.bitsoApiKey;
const bitsoApiSecret = process.env.bitsoApiSecret;

const bitsoAPI = new bitso(
    bitsoApiKey,
    bitsoApiSecret,
    bitsoUrl,
    "/api/v3" 
);

function displayError(Exception) {
    console.log("Failed");
    if (Exception.response !== undefined) {
        console.log(
            `${Exception.response.status} : ${
                Exception.response.statusText
            } ${JSON.stringify(Exception.response.data)}`
        );
    } else {
        console.log(Exception);
    }
}

function checkIfSuccessful(test, data) {
    if (data !== undefined && data.success) {
        console.log(chalk.green(`${test} Test passed`));
    } else {
        console.log(chalk.red(`${test} Test failed`));
        console.log(JSON.stringify(data));
    }
    return data.success;
}

async function testBalances() {
    preTestingMessage("Balances");
    try {
        let response = await client.getBalances();
        if (checkIfSuccessful("Balances", response)) return response.payload;
    } catch (Exception) {
        displayError(Exception);
    }
}

async function testwithdrawals(currency, amount, address) {
    preTestingMessage("withdrawals", currency, amount, address);
    try {
        let response = await client.withdrawCrypto(currency, amount, address);
        if (checkIfSuccessful("withdrawals", response)) return response.payload;
    } catch (Exception) {
        displayError(Exception);
    }
}

async function testOrders(book, side, amount, type) {
    preTestingMessage("Orders", book, side, amount, type);
    try {
        let response = await client.placeOrder(book, side, amount, type);
        if (checkIfSuccessful("Orders", response)) return response.payload;
    } catch (Exception) {
        displayError(Exception);
    }
}

async function testAvailableBooks() {
    preTestingMessage("Available books");
    try {
        let response = await client.getAvailableBooks();
        if (checkIfSuccessful("Available books", response))
            return response.payload;
    } catch (Exception) {
        displayError(Exception);
    }
}

async function testTicker(book) {
    preTestingMessage("Ticker", book);
    try {
        let response = await client.getCurrentTicker(book);
        if (checkIfSuccessful("Ticker", response)) return response.payload;
    } catch (Exception) {
        displayError(Exception);
    }
}

async function testGetTrades(book) {
    preTestingMessage("Get trades", book);
    try {
        let response = await client.getTrades(book);
        if (checkIfSuccessful("Get trades", response)) return response.payload;
    } catch (Exception) {
        displayError(Exception);
    }
}
function preTestingMessage(test, ...rest) {
    console.log(chalk.blue(`TESTING ${test} ENDPOINT`));
    console.log(chalk.blue(`USING PARAMETERS: ${rest}`));
}

// Simply tests the functions no actual integrity checks
async function basicTesting() {
    await testAvailableBooks();
    await testTicker("btc_mxn");
    await testGetTrades("btc_mxn");
    await testOrders("eth_mxn", "buy", "1.0", "market");
    await testOrders("eth_mxn", "sell", "1.0", "market");
    await testWithdrawals("btc", "0.001", "15YB8xZ4GhHCHRZXvgmSFAzEiDosbkDyoo");
    await testBalances();
}

basicTesting();