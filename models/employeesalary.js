var Employeesalary = {
    // employeesalaryid:{type:String, required:true},
    employeeid:{type:String, required:true},
    basicsalary:{type:Number, required:true},
    allowances: [ { payrollItemId: { type: String, required: true },
                    amount: { type: Number, required: true }, 
                } ], 
   deductions: [ { payrollItemId: { type: String, required: true }, 
                amount: { type:Number, required: true }, 
                }], 
   
    netsalary:{type:Number, required:true},
    effectivedate:{type:Date, required:true},
}

module.exports = Employeesalary;