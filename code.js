const {
    Client,
    FileCreateTransaction,
    FileAppendTransaction,
    Hbar
} = require("@hashgraph/sdk");
const fs = require('fs');

// Initialize the Hedera client
const client = Client.forTestnet(); // or Client.forMainnet()
client.setOperator("your-account-id", "your-private-key");

// Function to create a file on Hedera
async function createFile(textData) {
    try {
        // Create the file transaction
        const transaction = new FileCreateTransaction()
            .setContents(textData) // Set your text data here
            .setMaxTransactionFee(new Hbar(2)) // Set maximum transaction fee
            .freezeWith(client);

        // Sign the transaction with your private key
        const signTx = await transaction.sign(client.operatorPrivateKey);
        // Execute the transaction
        const txResponse = await signTx.execute(client);
        // Get the receipt of the transaction
        const receipt = await txResponse.getReceipt(client);
        // Get the file ID from the receipt
        const fileId = receipt.fileId;

        console.log(`File created with ID: ${fileId}`);
        return fileId;
    } catch (error) {
        console.error("Error creating file:", error);
    }
}

// Function to append content to a file on Hedera
async function appendToFile(fileId, additionalContent) {
    try {
        // Create the file append transaction
        const appendTransaction = new FileAppendTransaction()
            .setFileId(fileId)
            .setContents(additionalContent) // Set additional content
            .setMaxTransactionFee(new Hbar(2)) // Set maximum transaction fee
            .freezeWith(client);

        // Sign the transaction with your private key
        const signTx = await appendTransaction.sign(client.operatorPrivateKey);
        // Execute the transaction
        const txResponse = await signTx.execute(client);
        // Get the receipt of the transaction
        const receipt = await txResponse.getReceipt(client);

        console.log(`File append status: ${receipt.status}`);
    } catch (error) {
        console.error("Error appending to file:", error);
    }
}

// Example text data to store on the Hedera ledger
const textData = "This is some text data to store on the Hedera ledger.";

// Create the file and append additional content if needed
(async () => {
    const fileId = await createFile(textData);
    if (fileId) {
        const additionalContent = "This is additional content for the file.";
        await appendToFile(fileId, additionalContent);
    }
})();
