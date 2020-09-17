class Tensor {
    constructor(array) {
        if (Array.isArray(array) == false){
            throw "Not an array"
        }
        this.rank = 1;
		this.shape = [array.length];
		// Todo: Check to ensure Tensor is not a SparceTensor; i.e. all arrays of the same rank have the same length
    }
}

function Zeros(shape){
	var array = [];
	var rank = 1;
	if (Array.isArray(shape)){
		for (var i = 0; i < shape.length; i++){
			for(var j = 0; j < shape[i]; j++){

			}
		} 
	} else {

	}
}

function MatMul(a, b){
	var c = [];
	var i, j;
	for (i = 0; i < a[0].length; i++) {
		if (i > 0) {
			c.push([]);
		}
		for (j = 0; i < b[1].length; j++){
			c[i][j] = math.dot(a[i], b[j]);
		}
	}
	return c;
}