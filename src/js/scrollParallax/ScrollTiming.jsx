export class ScrollTiming {
	constructor() {
		this.timingLinePercent = 50;
	}
	setVal(ops) {
		this.timingLinePercent = ops.timingLinePercent || this.timingLinePercent;
	};
}