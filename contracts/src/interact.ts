// SMART CONTRACT
// import { Field, SmartContract, State, UInt64, method, state } from "o1js";

// export class Flow extends SmartContract {
//     @state(UInt64) tokenValue = State<UInt64>();

//     @method update(value: UInt64) {
//         this.tokenValue.getAndRequireEquals();
//         this.tokenValue.set(value)
//     }
// }


import { Account, AccountUpdate, Mina, PrivateKey, UInt64 } from "o1js";
import { Flow } from "./Flow";

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
await Flow.compile();

const deployZkAppTxn = await Mina.transaction( deployer.publicKey, () => {
    AccountUpdate.fundNewAccount(deployer.publicKey);
    zkApp.deploy();
});
await deployZkAppTxn.sign([deployer.privateKey, ZK_APP_PRIVATE_KEY]).send();


export let currTimeStamp = zkApp.network.timestamp.get()
console.log(currTimeStamp.toString())

let from = zkApp.fromTokens.get().toString();
let to = zkApp.toTokens.get().toString();
console.log(`${from} -> ${to}`)

const streamTransferTXN = await Mina.transaction( builder.publicKey, () => {
    zkApp.streamTransfer();
});
await streamTransferTXN.prove();
await streamTransferTXN.sign([builder.privateKey]).send();

from = zkApp.fromTokens.get().toString();
to = zkApp.toTokens.get().toString();
console.log(`${from} -> ${to}`)
