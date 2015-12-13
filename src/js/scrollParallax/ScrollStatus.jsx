class ScrollStatus {
	constructor() {
		this.$stage = $(global);
		this.direction = 'y';
		this.functions = [];
		this.debugMode = false;
		this.setDirectionInfo();
	}
	setVal(ops) {
		this.$stage = ops.stage ? $(ops.stage) : $(global);
		this.direction = ops.direction || this.direction;
		this.debugMode = ops.debugMode || this.debugMode;
		this.setDirectionInfo();
	}
	update() {
		var scroll = 'scroll' + this.directionPositionName;
		this.scrollPosition = this.$stage[scroll]();

		var innerWidth = global['inner' + this.stageSizeName];
		this.stageSize = innerWidth ? innerWidth : document.documentElement['client' + this.stageSizeName];
	}
	setDirectionInfo() {
		this.directionPositionName = this.direction === 'y' ? 'Top' : 'Left';
		this.stageSizeName = this.direction === 'y' ? 'Height' : 'Width';
	}
}

export var Status = new ScrollStatus();