// Additional browser-only financial models. Educational scenarios; no financing offers.
const n=(v,name,min=0,max=1e12)=>{if(v===''||v==null||!Number.isFinite(Number(v))||Number(v)<min||Number(v)>max)throw Error(name+' must be between '+min+' and '+max+'.');return Number(v)};
const percent=(v,name)=>n(v,name,0,100)/100;
const term=(v,name,min,max)=>{const x=n(v,name,min,max);if(!Number.isInteger(x))throw Error(name+' must be a whole number.');return x};
const usd=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(v);
const fmt=v=>new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(v);
const payment=(balance,ratePct,months)=>{if(balance<=0)return 0;const rate=ratePct/1200;return rate===0?balance/months:balance*rate/(1-(1+rate)**(-months))};
export function acquisitionAffordability(d){
 const purchase=n(d.purchase,'Purchase price',1,1e10),equity=n(d.equity,'Buyer equity',0,purchase),rate=n(d.rate,'Annual rate (%)',0,100),years=term(d.years,'Term in years',1,30),cashFlow=n(d.cashFlow,'Annual debt-service cash flow',0,1e10);
 const debt=purchase-equity,monthly=payment(debt,rate,years*12),annual=monthly*12,dscr=annual>0?cashFlow/annual:null;
 return {metrics:[['Estimated debt',usd(debt)],['Monthly debt service',usd(monthly)],['Annual debt service',usd(annual)],['Modeled DSCR',dscr===null?'No debt':fmt(dscr)+'×']],summary:'Illustrative acquisition financing scenario; no lender qualification or SBA eligibility is established.',assumptions:'Purchase price excludes transaction costs, working capital, seller financing, fees, taxes, owner salary adjustments and lender-specific underwriting. DSCR uses user-entered cash available for debt service.'};
}
export function workingCapitalGap(d){
 const cash=n(d.cash,'Current cash'),ar=n(d.receivables,'Expected receivables'),collections=percent(d.collections,'Estimated receivable collection (%)'),ap=n(d.payables,'Payables due'),expenses=n(d.expenses,'Upcoming operating expenses'),buffer=n(d.minimumCash,'Minimum cash buffer');
 const collectible=ar*collections,ending=cash+collectible-ap-expenses,gap=Math.max(0,buffer-ending);
 return {metrics:[['Expected receivables collected',usd(collectible)],['Forecast cash after payments',usd(ending)],['Minimum cash buffer',usd(buffer)],['Estimated funding gap',usd(gap)]],summary:gap>0?'Modeled near-term cash shortfall: '+usd(gap):'Modeled funds cover the chosen cash buffer.',assumptions:'Single-period simplified cash bridge. Not a full timing forecast: assumes expected receivables collect and all payables/expenses are due in the same period.'};
}
export function revenueBasedFinancing(d){
 const advance=n(d.advance,'Advance',1,1e9),factor=n(d.factor,'Factor rate',1,5),sales=n(d.monthlySales,'Monthly sales',1,1e12),holdback=percent(d.holdback,'Sales remittance (%)');
 if(holdback<=0)throw Error('Remittance percentage must be positive');
 const repay=advance*factor,fee=repay-advance,monthly=sales*holdback,months=repay/monthly;
 return {metrics:[['Total contractual payback',usd(repay)],['Fixed financing fee',usd(fee)],['Monthly remittance (at forecast)',usd(monthly)],['Modeled repayment time',fmt(months)+' months']],summary:'Illustrative fixed-factor revenue remittance schedule, not an APR calculation.',assumptions:'Constant gross sales and holdback percentage. Actual reconciliation, minimum payments, fees, early repayment terms and repayment schedules depend on contract.'};
}
export function creditUtilization(d){
 const balance=n(d.balance,'Credit balance'),limit=n(d.limit,'Credit limit',1),paymentAmount=n(d.payment,'Planned payment',0,balance),increase=n(d.limitIncrease,'Additional credit limit');
 if(balance>limit)throw Error('Balance exceeds the supplied credit limit; correct the inputs.');
 const newBalance=balance-paymentAmount,newLimit=limit+increase;
 return {metrics:[['Current utilization',fmt(100*balance/limit)+'%'],['Modeled utilization',fmt(100*newBalance/newLimit)+'%'],['Remaining balance',usd(newBalance)],['Modeled total limit',usd(newLimit)]],summary:'Utilization arithmetic only. This does not predict bureau reporting, score impact or approval outcomes.',assumptions:'Assumes balances and limits are accurately reported and no other transactions occur. Credit bureaus and lenders may use different reported data.'};
}
export function freelanceRate(d){
 const income=n(d.income,'Annual income target',1,1e9),overhead=n(d.overhead,'Annual overhead'),weeks=term(d.weeks,'Weeks worked',1,52),hours=n(d.hours,'Weekly work hours',1,168),utilization=percent(d.utilization,'Billable utilization (%)');
 if(!utilization)throw Error('Billable utilization must be above zero');
 const billable=weeks*hours*utilization,rate=(income+overhead)/billable;
 return {metrics:[['Required hourly rate',usd(rate)],['Annual billable hours',fmt(billable)],['Annual revenue target',usd(income+overhead)],['Billable utilization',fmt(utilization*100)+'%']],summary:'A pricing floor based on your income goal, overhead and billable capacity.',assumptions:'Does not include tax estimates, bad debt, profit reserves or price elasticity. Annual income target is treated as compensation target before applicable tax.'};
}
export function ecommerceBreakEven(d){
 const price=n(d.price,'Sale price',0.01,1e9),unit=n(d.unitCost,'Cost of goods'),shipping=n(d.shipping,'Shipping/fulfillment cost'),ad=n(d.adSpend,'Acquisition spend per order'),fees=percent(d.fees,'Processing fee (%)'),returns=percent(d.returns,'Return or refund rate (%)'),fixed=n(d.fixedCosts,'Monthly fixed costs');
 const recognizedRevenue=price*(1-returns),variable=unit+shipping+ad+price*fees,contribution=recognizedRevenue-variable;
 const breakEven=contribution>0?Math.ceil(fixed/contribution):null;
 return {metrics:[['Expected revenue per order',usd(recognizedRevenue)],['Variable cost per order',usd(variable)],['Contribution per order',usd(contribution)],['Break-even monthly orders',breakEven===null?'Not achievable':String(breakEven)]],summary:contribution<=0?'Contribution is non-positive. Improve unit economics before scaling volume.':'Estimated volume required to cover monthly fixed costs.',assumptions:'Simplified expected-value model; assumes all unit/fulfillment/ads cost is incurred regardless of returns. Tax, replacements, platform credits and discounting are excluded.'};
}
export function valuationEstimator(d){
 const earnings=n(d.earnings,'Annual normalized earnings',0,1e12),low=n(d.low,'Low earnings multiple',0.1,100),high=n(d.high,'High earnings multiple',0.1,100),adjustments=n(d.adjustments,'Enterprise value adjustments',-1e12,1e12),debt=n(d.debt,'Outstanding debt'),cash=n(d.cash,'Excess cash');
 if(low>high)throw Error('Low multiple must not exceed high multiple');
 const evLow=earnings*low+adjustments,evHigh=earnings*high+adjustments,eqLow=evLow-debt+cash,eqHigh=evHigh-debt+cash;
 return {metrics:[['Enterprise value (low)',usd(evLow)],['Enterprise value (high)',usd(evHigh)],['Illustrative equity value (low)',usd(eqLow)],['Illustrative equity value (high)',usd(eqHigh)]],summary:'Assumption-based scenario range; not an appraisal, transaction offer or valuation opinion.',assumptions:'Earnings quality, business concentration, working capital, lease terms, capital expenditures and deal structure can change value materially. Negative value is possible in this scenario.'};
}
