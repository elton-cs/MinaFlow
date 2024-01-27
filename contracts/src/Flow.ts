import { Field, SmartContract, State, UInt64, method, state } from "o1js";

export class Flow extends SmartContract {
    @state(UInt64) tokenValue = State<UInt64>();

    @method update(value: UInt64) {
        this.tokenValue.getAndRequireEquals();
        this.tokenValue.set(value)
    }
}