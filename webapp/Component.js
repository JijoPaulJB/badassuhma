sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","sierra/pra/PRA_Custom/model/models"],function(t,e,a){"use strict";return t.extend("sierra.pra.PRA_Custom.Component",{metadata:{manifest:"json"},init:function(){t.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(a.createDeviceModel(),"device");var e=this;this.globalModel={constraints:{start:[],end:[],selectedConstraintStart:"",selectedConstraintEnd:"",selectedStartDate:"",selectedEndDate:""},Venture:[],DOI:[],DOI2:[],revenueHeader:{},companyList:[],header:[],companyCode:[],ventureList:[],ventureList1:[],ventureList2:[],ventureList3:[],payoutCompanyNameList:[],payoutVentureList:[],payoutWellNameList:[],payoutOwnerNameList:[],payoutBPODOIList:[],payoutAPODOIList:[],payoutFrequencyList:[],BalAdjLineItemTotal:"",BalAdjLineItem:[{FormType:"Bal",FormNum:"Bal_001",GLAccount:"",Description:"",Amount:"",FundApproved:0,readOnly:false}],PayOutProvisionsLineItem:[],PayoutAddPayoutType:[],PayoutAddStatus:[],PayoutAddFrequency:[],PayoutTableData:[],PayoutID:"00001",PayoutVenture:[],PayoutidList:[],PayoutCostcenter:[],Payoutcostcenteradd:[]};this.setModel(this.globalModel,"globalModel")}})});

/* --- CF Dependency Descriptor --- */
/* File: webapp/ui5-dependencies.json */
{
  "dependencies": [
    "@sap/ui5-builder",
    "@sap/ui5-server",
    "@sap/ui5-fiori-tools",
    "@sap/approuter"
  ],
  "ui5": {
    "minVersion": "1.60.0",
    "requiredLibraries": [
      "sap.ui.core",
      "sap.ui.Device"
    ]
  }
}