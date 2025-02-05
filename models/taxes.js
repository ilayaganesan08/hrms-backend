var Taxes={
    taxid:{type:String, required:true, unique:true},
    taxtype:{type:String, required:true},
    taxableamount:{type:Number, required:true},
    taxrate:{type:Number, required:true},
    totaltax:{type:Number, required:true},
    fillingdate:{type:Date, required:true},
    // paymentstatus: { type: Boolean, default:false, required:true},
    paymentstatus: { type: String, required: true }

}

module.exports = Taxes;