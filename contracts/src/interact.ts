import { Account, AccountUpdate, Mina, PrivateKey } from "o1js";

// SMART CONTRACT

import { Field, SmartContract, State, UInt64, method, state } from "o1js";

export class Flow extends SmartContract {
    @state(UInt64) tokenValue = State<UInt64>();

    @method update(value: UInt64) {
        this.tokenValue.getAndRequireEquals();
        this.tokenValue.set(value)
    }
}

// INTERACTION:

const useProof = false;

const Local = Mina.LocalBlockchain({proofsEnabled: useProof})

Mina.setActiveInstance(Local);

const builder = Local.testAccounts[0];
const hunter = Local.testAccounts[1];
const deployer = Local.testAccounts[2];

const ZK_APP_PRIVATE_KEY = PrivateKey.fromBase58('EKEYXmPQTTTT2vFKeBm769prz8yUVc5Gb6QnoM2d98aMv3fmrYSG');
const zkAppAddress = ZK_APP_PRIVATE_KEY.toPublicKey();
console.log(zkAppAddress.toBase58())

const zkApp = new Flow(zkAppAddress);
const deployZkAppTxn = await Mina.transaction( deployer.publicKey, () => {
    AccountUpdate.fundNewAccount(deployer.publicKey);
    zkApp.deploy();
});
await deployZkAppTxn.sign([deployer.privateKey, ZK_APP_PRIVATE_KEY]).send();

let tokenValue = zkApp.tokenValue.get();
console.log(tokenValue.toString())


const setNewValueTxn = await Mina.transaction( builder.publicKey, () => {
    zkApp.update(UInt64.from(1000))
});
await setNewValueTxn.prove();
await setNewValueTxn.sign([builder.privateKey]).send();


tokenValue = zkApp.tokenValue.get();
console.log(tokenValue.toString())

let currTimeStamp = zkApp.network.timestamp.get()
let value = 1706321445049
console.log(currTimeStamp.toString())
let difff = currTimeStamp.sub(UInt64.from(1706321445049)).div(UInt64.from(10)).toString();

console.log(`difference: ${difff} `);