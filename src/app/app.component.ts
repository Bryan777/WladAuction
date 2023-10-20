import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Bidder } from './models/bidder.model';
import { MaxBid } from './models/maxbid.model';
import { Winner } from './models/winner.model';
import { Constants } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'WladAuction';

  formGroup: FormGroup | undefined;
  post: any | undefined;
  bidders: Bidder[] = [];
  winner: Winner | undefined;
  allMaxBids: number[] = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

  }

  auctionForm = this.formBuilder.group({
    bidder: '',
    bid: '',
    resprice: 0
  });

  onSubmit(): void {
    let bidder = new Bidder();
    let bids = this.auctionForm.value.bid!.split(',').map(Number);

    bidder.name = this.auctionForm.value.bidder!;
    bidder.bids = bids;
    this.bidders.push(bidder);

    let maxbids = this.getMaxBids();

    if (this.bidders.length === Constants.MAX_BIDDERS){
      this.winner = this.foundWinner(maxbids, this.auctionForm.value.resprice!)
      console.warn("winner: ", this.winner);
    }
  }

  private getMaxBids() {
    let maxBids: MaxBid[] = this.bidders.map(bidder => {
        let maxBids: MaxBid = {
            bidderName: bidder.name,
            maxBid: Math.max(...bidder.bids!),
        };
        this.allMaxBids.push(maxBids.maxBid!);
        return maxBids;
    }).sort((maxBid1, maxBid2) => maxBid2.maxBid! - maxBid1.maxBid!);

    return maxBids;
  }

  private foundBiggestBidderName(biggestBid: number): string{
    let bidderName = '';
    this.bidders.forEach(bidder => {
      bidder.bids?.forEach(bid => {
        if (bid === biggestBid){
          bidderName = bidder.name!;
        }
      })
    });
    
    return bidderName;
  }

  private removeBiggestBidderFromBidders(biggestBidderName: string){
    this.bidders.forEach((value, index)=>{
      if(value.name === biggestBidderName){
        this.bidders.splice(index, 1);
      };
    });
  }

  private removeWinningBiggestBidFromAllMaxBids(biggestBid: number) {
    this.allMaxBids.forEach((element,index)=>{
      if(element === biggestBid) this.allMaxBids.splice(index, 1);
    });
  }

  private pickWinner(biggestBid: number, reservePrice: number, biggestBidderName: string): Winner {
    let winningBidderName = '';
    let winningPrice = 0;

    this.bidders.forEach(bidder => {
      bidder.bids?.forEach(bid => {
        if (bid === biggestBid){
          winningBidderName = biggestBidderName;
          winningPrice = Math.max(...bidder.bids!) < reservePrice ? reservePrice : Math.max(...bidder.bids!);
        }
      })
    });

    return new Winner(winningBidderName!, winningPrice!);
  }

  private foundWinner(maxBids: MaxBid[], reservePrice: number) {
    let biggestBidderName = '';
    let filteredMaxBids = this.allMaxBids.filter((bid) => bid >= reservePrice);
    let biggestBid = Math.max(...filteredMaxBids);

    biggestBidderName = this.foundBiggestBidderName(biggestBid);

    this.removeBiggestBidderFromBidders(biggestBidderName);
    this.removeWinningBiggestBidFromAllMaxBids(biggestBid);

    biggestBid = Math.max(...this.allMaxBids);
    console.log('new biggestBid: ', biggestBid);

    return this.pickWinner(biggestBid, reservePrice, biggestBidderName);
  }
}
