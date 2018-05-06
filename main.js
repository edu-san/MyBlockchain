class Transaction{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress=fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor (timestamp,transactions,previousHash=''){
        this.timestamp= timestamp;
        this.previousHash = previousHash;
        this.transactions = transactions;
        this.nonce = 0;
        this.hash=this.calculateHash();
    }

    calculateHash(){
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256');

        hash.update(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce);
        return hash.digest('hex');        
    }

    mineBlock(difficulty){
        while(this.hash.substr(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("mined block: " + this.hash);
    }
}

class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100; //coins for the miner that mines the block
    }

    createGenesisBlock(){
        return new Block('2018/01/01',"Genesis Block","0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    /*addNewBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty) ;
        this.chain.push(newBlock);
    }*/
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(),this.pendingTransactions,this.getLatestBlock().hash);/*adding all pending transactions is impossible
        because there are so many, so miners choose which ones to include. BTC block size cannot be bigger than 1 MB*/
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined.")
        this.chain.push(block);

        //reward the miner
        this.pendingTransactions = [new Transaction(null,miningRewardAddress,this.miningReward)];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceofAddress(address){
        let balance = 0;
        for (const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress == address){
                    balance -= trans.amount;
                }
                if (trans.toAddress == address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValide(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            //console.log("currentBlock.hash:" + currentBlock.hash + "!==Calculated.hash:" + currentBlock.calculateHash());
            if (currentBlock.hash !== currentBlock.calculateHash()){
                
                return false;
            }

            //console.log("currentBlock.previousHash:" + currentBlock.previousHash + "!==previousBlock.hash:" + previousBlock.hash);
            if (currentBlock.previousHash !== previousBlock.hash){
                
                return false;
            }
        }
        return true;
    }
}

let mybc = new BlockChain();
mybc.createTransaction(new Transaction("address567","address123",75)) ;
mybc.createTransaction(new Transaction("address123","address567",15)) ;

console.log("mining pending transacctions....");
mybc.minePendingTransactions("address-Patrick");

console.log("Balance of miner Patrick: " + mybc.getBalanceofAddress("address-Patrick"));

mybc.minePendingTransactions("address-Patrick");

console.log("Balance of miner Patrick: " + mybc.getBalanceofAddress("address-Patrick"));

console.log(JSON.stringify(mybc,null,4));

/*
console.log("mining block 1.........");
mybc.addNewBlock(new Block('2018/03/01',{amount:10}));
console.log("mining block 2.........");
mybc.addNewBlock(new Block('2018/04/01',{amount:23}))*/

//Step1- console.log(JSON.stringify(mybc,null,4));

//Step2- console.log("Is chain valide?: " + mybc.isChainValide());

//Step3- mybc.chain[1].data = {amount: 100};
//Step3- console.log("Is chain valide?: " + mybc.isChainValide());

/*Step4- console.log("Is chain valide?: " + mybc.isChainValide());
mybc.chain[1].data = {amount: 13}; //updated
mybc.chain[1].hash = mybc.chain[1].calculateHash(); //recalculate hash
console.log("Is chain valide?: " + mybc.isChainValide());*/


