// Deterministic, browser-safe calculation functions. No external market rates or underwriting claims.
const finite=(n,label)=>{const v=Number(n);if(n===''||n==null||!Number.isFinite(v))throw Error(label+' must be a valid number.');return v};
const range=(n,label,low,high)=>{const v=finite(n,label);if(v<low||v>high)throw Error(label+' must be between '+low+' and '+high+'.');return v};
export function loanTrueCost(input){
 const principal=range(input.principal,'Loan amount',1,100000000),rate=range(input.annualRate,'Nominal annual rate',0,100)/1200,months=range(input.months,'Term in months',1,600),fee=range(input.upfrontFee??0,'Upfront fee',0,100000000);
 if(!Number.isInteger(months))throw Error('Term must be a whole number of months.');
 if(fee>=principal)throw Error('Upfront fee must be smaller than the loan amount.');
 const payment=rate===0?principal/months:principal*rate/(1-(1+rate)**(-months));
 const totalPaid=payment*months,netProceeds=principal-fee,financeCharge=totalPaid-netProceeds;
 const balance=(monthlyRate)=>monthlyRate===0?payment*months:payment*(1-(1+monthlyRate)**(-months))/monthlyRate;
 let lo=0,hi=1;
 while(balance(hi)>netProceeds&&hi<100)hi*=2;
 for(let k=0;k<110;k++){const mid=(lo+hi)/2;if(balance(mid)>netProceeds)lo=mid;else hi=mid}
 const monthlyIRR=(lo+hi)/2;
 return {payment,totalPaid,netProceeds,financeCharge,estimatedApr:monthlyIRR*12*100,effectiveAnnualRate:((1+monthlyIRR)**12-1)*100,months,assumptions:'Fixed monthly payments, nominal interest on the full principal, fee deducted at disbursement. Estimated APR is an annualized cash-flow rate, not a lender disclosure or a statutory APR calculation.'};
}
export function cashRunway(input){
 const cash=range(input.cash,'Starting cash',0,1e12),revenue=range(input.revenue,'Monthly revenue',0,1e12),expenses=range(input.expenses,'Monthly expenses',0,1e12),months=range(input.months??12,'Projection months',1,120);
 if(!Number.isInteger(months))throw Error('Projection months must be a whole number.');
 const net=revenue-expenses,monthlyBurn=Math.max(0,-net),runwayMonths=monthlyBurn>0?cash/monthlyBurn:null;
 const forecast=Array.from({length:months+1},(_,m)=>({month:m,balance:cash+m*net}));
 return {net,monthlyBurn,runwayMonths,endingBalance:cash+net*months,forecast,assumptions:'Constant monthly revenue and expenses; excludes taxes, debt timing, changes to working capital, capital expenditures, seasonality, and restricted cash.'};
}
export function agencyPricing(input){
 const labor=range(input.labor,'Labor cost',0,1e9),vendors=range(input.vendors,'Vendor cost',0,1e9),overhead=range(input.overhead,'Allocated overhead',0,1e9),margin=range(input.margin,'Target margin',0,95),actualPrice=range(input.actualPrice??0,'Current client price',0,1e9);
 const totalCost=labor+vendors+overhead;if(totalCost<=0)throw Error('Enter at least one positive delivery or overhead cost.');
 const recommendedPrice=totalCost/(1-margin/100),projectedProfit=recommendedPrice-totalCost;
 const currentProfit=actualPrice>0?actualPrice-totalCost:null;
 const currentMargin=actualPrice>0?100*currentProfit/actualPrice:null;
 return {totalCost,recommendedPrice,projectedProfit,currentProfit,currentMargin,targetMargin:margin,assumptions:'Costs and revenue must use the same billing period. Margin uses delivery costs plus allocated overhead; it is an illustrative operating margin, not a GAAP gross margin or net income.'};
}
