export class Winner {
    constructor(winningBidderName: string | null, winningPrice: number | null) {
        this._winningBidderName = winningBidderName;
        this._winningPrice = winningPrice;
    }

    private _winningBidderName: string | null;
    get winningBidderName(): string | null {
        return this._winningBidderName;
    }

    private _winningPrice: number | null;
    get winningPrice(): number | null {
        return this._winningPrice;
    }
}

export class NoWinner extends Winner {
    constructor() {
        super(null, null);
    }
}