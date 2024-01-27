import { Field, SmartContract, State, UInt64, assert, method, state } from "o1js";

export class Flow extends SmartContract {
    @state(UInt64) tokenValue = State<UInt64>();
    @state(UInt64) fromTokens = State<UInt64>();
    @state(UInt64) toTokens = State<UInt64>();

    init() {
        super.init();
        this.fromTokens.set(UInt64.from(10))
        this.toTokens.set(UInt64.from(0))
    }

    @method update(value: UInt64) {
        this.tokenValue.getAndRequireEquals();
        this.tokenValue.set(value)
    }

    @method streamTransfer() {
        let ft = this.fromTokens.getAndRequireEquals()
        let tt = this.toTokens.getAndRequireEquals()

        ft.assertGreaterThan(UInt64.from(0))
        let newft = ft.sub(1)
        let newtt = tt.add(1)

        this.fromTokens.set(newft)
        this.toTokens.set(newtt)
        
    }
}