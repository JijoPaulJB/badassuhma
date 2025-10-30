sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/Label",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Fragment",
  "sap/m/MessageToast"
], function(Controller, JSONModel, Label, Filter, FilterOperator, Fragment, MessageToast) {
  "use strict";
  return Controller.extend("sierra.pra.PRA_Custom.controller.payout", {
    onInit: function() {
      var that = this;
      this.globalModel = this.getOwnerComponent().getModel("globalModel");
      var oModel = new JSONModel(this.globalModel);
      oModel.setSizeLimit(500);
      this.getView().setModel(oModel, "oModel");
      console.log("omodel first ", oModel);
      this.onPayoutadd();
      jQuery.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://56d6569dtrial-dev-orp-srv.cfapps.us10.hana.ondemand.com/typedisplay",
        dataType: "json",
        async: false,
        success: function(data) {
          that.globalModel.PayoutAddPayoutType = data;
        }
      });
      jQuery.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://56d6569dtrial-dev-orp-srv.cfapps.us10.hana.ondemand.com/statusdisplay",
        dataType: "json",
        async: false,
        success: function(data) {
          that.globalModel.PayoutAddStatus = data;
        }
      });
      jQuery.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://56d6569dtrial-dev-orp-srv.cfapps.us10.hana.ondemand.com/freqdisplay",
        dataType: "json",
        async: false,
        success: function(data) {
          that.globalModel.PayoutAddFrequency = data;
        }
      });
      jQuery.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://56d6569dtrial-dev-orp-srv.cfapps.us10.hana.ondemand.com/venturedisplay",
        dataType: "json",
        async: false,
        success: function(data) {
          that.globalModel.PayoutVenture = data;
          var oModelPayoutVenture = new JSONModel(data);
          oModelPayoutVenture.setSizeLimit(500);
          that.getView().setModel(oModelPayoutVenture, "oModelPayoutVenture");
        }
      });
      jQuery.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://56d6569dtrial-dev-orp-srv.cfapps.us10.hana.ondemand.com/costdisplay",
        dataType: "json",
        async: false,
        success: function(data) {
          that.globalModel.Payoutcostcenteradd = data;
        }
      });
    },
    onSearch: function(oEvent) {
      debugger;
      var item = oEvent.getParameter("suggestionItem");
      if (item) {
        MessageToast.show("Search for: " + item.getText());
      } else {
        MessageToast.show("Search is fired!");
      }
    },
    onSuggest: function(oEvent) {
      debugger;
      this.oSF = this.getView().byId("searchField");
      var value = oEvent.getParameter("suggestValue"), filters = [];
      if (value) {
        filters = [
          new Filter([
            new Filter("VENTURE_ID", function(sValue) {
              return (sValue || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
            })
          ], false)
        ];
      }
      this.oSF.getBinding("suggestionItems").filter(filters);
      this.oSF.suggest();
    },
    onVentureSelect: function() {
      var that = this;
      let value = that.getView().byId("searchField").mProperties.value;
      jQuery.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://56d6569dtrial-dev-orp-srv.cfapps.us10.hana.ondemand.com/venturejoin?VENTURE_ID='%27" + value + "%27'",
        dataType: "json",
        async: false,
        success: function(data) {
          that.globalModel.PayoutCostcenter = data;
        }
      });
    },
    onPayoutadd: function() {
      var that = this;
      jQuery.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://56d6569dtrial-dev-orp-srv.cfapps.us10.hana.ondemand.com/postdisplay",
        dataType: "json",
        async: false,
        success: function(data) {
          that.globalModel.PayoutTableData = data;
          let ids = data.data.map(function(e) { return { PAYOUT_ID_List: e.PAYOUT_ID }; });
          let n = { ids: ids };
          var oModelPayoutid = new JSONModel(n);
          oModelPayoutid.setSizeLimit(500);
          that.getView().setModel(oModelPayoutid, "oModelPayoutid");
          var oModelPayout = new JSONModel(data);
          oModelPayout.setSizeLimit(500);
          that.getView().setModel(oModelPayout, "oModelPayout");
          let maxObj = that.globalModel.PayoutTableData.data.reduce(function(prev, curr) {
            return curr.PAYOUT_ID >= prev.PAYOUT_ID ? curr : prev;
          });
          let maxId = Number(maxObj.PAYOUT_ID);
          that.globalModel.PayoutID = String(maxId + 1).padStart(5, "0");
        }
      });
    },
    onSavePayoutAdd: function() {
      debugger;
      let payload = {
        PAYOUT_ID: this.getView().byId("productInputpayout").mProperties.value,
        VENTURE: this.getView().byId("ventureselect").mProperties.selectedKey,
        COST_CENTER: this.getView().byId("selectcost").mProperties.selectedKey,
        STATUS: this.getView().byId("selectstatus").mProperties.selectedKey,
        PAYOUT_TYPE: this.getView().byId("payouttypeadd").mProperties.selectedKey,
        REPORTING_FREQUENCY: this.getView().byId("reportingfrequencyadd").mProperties.selectedKey,
        BEGIN_DATE: this.getView().byId("idIssueDate11").mProperties.value,
        END_DATE: this.getView().byId("idIssueDate22").mProperties.value
      };
      $.ajax({
        url: "https://56d6569dtrial-dev-orp-srv.cfapps.us10.hana.ondemand.com/postadd",
        type: "POST",
        data: payload,
        contentType: "application/x-www-form-urlencoded",
        success: function(data) {
          console.log("success" + data);
        },
        error: function(err) {
          console.log("error: " + err);
        }
      });
      this.getView().getModel("oModel").refresh();
      this.onPayoutadd();
      this.byId("payout_add").destroy();
      this.pErrorLogPopover = undefined;
    },
    onDisplayForm: function(oEvent) {
      var oModel = this.getView().getModel("oModel");
      this.globalModel.navigationMode = "Display";
      var router = sap.ui.core.UIComponent.getRouterFor(this);
      router.navTo("Routepayout_position", {}, true);
    },
    onPressPayoutAdd: function() {
      var view = this.getView();
      var that = this;
      if (!that.pErrorLogPopover) {
        that.pErrorLogPopover = Fragment.load({
          id: view.getId(),
          name: "sierra.pra.PRA_Custom.view.payout_add",
          controller: that
        }).then(function(oFragment) {
          debugger;
          view.addDependent(oFragment);
          return oFragment;
        });
      }
      that.pErrorLogPopover.then(function(oFragment) {
        oFragment.open();
      });
    },
    onPayoutBalAdj: function() {
      var view = this.getView();
      var that = this;
      if (!that.pErrorLogPopover) {
        that.pErrorLogPopover = Fragment.load({
          id: view.getId(),
          name: "sierra.pra.PRA_Custom.view.payout_baladj",
          controller: that
        }).then(function(oFragment) {
          debugger;
          view.addDependent(oFragment);
          return oFragment;
        });
      }
      that.pErrorLogPopover.then(function(oFragment) {
        oFragment.open();
      });
    },
    onPayoutProvisions: function() {
      var view = this.getView();
      var that = this;
      if (!that.pErrorLogPopover) {
        that.pErrorLogPopover = Fragment.load({
          id: view.getId(),
          name: "sierra.pra.PRA_Custom.view.payout_provisions",
          controller: that
        }).then(function(oFragment) {
          debugger;
          view.addDependent(oFragment);
          return oFragment;
        });
      }
      that.pErrorLogPopover.then(function(oFragment) {
        oFragment.open();
      });
    },
    onCloseErrorLogPopover: function() {
      this.byId("PayoutBalAdjPopover").destroy();
      this.pErrorLogPopover = undefined;
      debugger;
    },
    onSaveBalAdj: function() {},
    onAddLineItem: function() {
      var total = 0;
      debugger;
      this.globalModel.BalAdjLineItem.forEach(function(item) {
        debugger;
        total += Number(item.Amount);
        this.globalModel.BalAdjLineItemTotal = total;
        debugger;
      }, this);
      console.log(total);
      console.log(this.globalModel.BalAdjLineItem);
      console.log(this.globalModel.BalAdjLineItemTotal);
      this.getView().getModel("oModel").refresh();
      var newItem = {
        FormType: "Bal",
        FormNum: "Bal_001",
        GLAccount: "",
        Description: "",
        Amount: "",
        FundApproved: 0,
        readOnly: false
      };
      this.globalModel.BalAdjLineItem.push(newItem);
      console.log(this.globalModel.BalAdjLineItem);
      this.getView().getModel("oModel").refresh();
    },
    onLiveChge: function() {},
    onpressCostcenter: function() {
      var view = this.getView();
      var that = this;
      if (!that.pErrorLogPopover) {
        that.pErrorLogPopover = Fragment.load({
          id: view.getId(),
          name: "sierra.pra.PRA_Custom.view.payout_costcenter",
          controller: that
        }).then(function(oFragment) {
          debugger;
          view.addDependent(oFragment);
          return oFragment;
        });
      }
      that.pErrorLogPopover.then(function(oFragment) {
        oFragment.open();
      });
    },
    onCloseErrorcost: function() {
      this.byId("Payoutcostcenter").destroy();
      this.pErrorLogPopover = undefined;
      debugger;
    },
    onClosePayoutAdd: function() {
      this.byId("payout_add").destroy();
      this.pErrorLogPopover = undefined;
      debugger;
    },
    onExit: function() {
      this.aKeys = [];
      this.aFilters = [];
      this.oModel = null;
    },
    onToggleHeader: function() {
      this.getPage().setHeaderExpanded(!this.getPage().getHeaderExpanded());
    },
    onToggleFooter: function() {
      this.getPage().setShowFooter(!this.getPage().getShowFooter());
    },
    onSelectChange: function() {
      var arr = [];
      arr.push(this.getSelectedItemText(this.oSelectName));
      arr.push(this.getSelectedItemText(this.oSelectCategory));
      arr.push(this.getSelectedItemText(this.oSelectSupplierName));
      arr.push(this.getSelectedItemText(this.oSelectVenture));
      arr.push(this.getSelectedItemText(this.oSelectWell));
      this.filterTable(arr);
    },
    filterTable: function(arr) {
      this.getTableItems().filter(this.getFilters(arr));
      this.updateFilterCriterias(this.getFilterCriteria(arr));
    },
    updateFilterCriterias: function(arr) {
      this.removeSnappedLabel();
      this.addSnappedLabel();
      this.oModel.setProperty("/Filter/text", this.getFormattedSummaryText(arr));
    },
    addSnappedLabel: function() {
      var label = this.getSnappedLabel();
      label.attachBrowserEvent("click", this.onToggleHeader, this);
      this.getPageTitle().addSnappedContent(label);
    },
    removeSnappedLabel: function() {
      this.getPageTitle().destroySnappedContent();
    },
    getFilters: function(arr) {
      this.aFilters = [];
      this.aFilters = this.aKeys.map(function(key, idx) {
        return new Filter(key, FilterOperator.Contains, arr[idx]);
      });
      return this.aFilters;
    },
    getFilterCriteria: function(arr) {
      return this.aKeys.filter(function(key, idx) {
        if (arr[idx] !== "") {
          return key;
        }
      });
    },
    getFormattedSummaryText: function(arr) {
      if (arr.length > 0) {
        return "Filtered By (" + arr.length + "): " + arr.join(", ");
      } else {
        return "Filtered by None";
      }
    },
    getTable: function() {
      return this.getView().byId("idProductsTable");
    },
    getTableItems: function() {
      return this.getTable().getBinding("items");
    },
    getSelect: function(id) {
      return this.getView().byId(id);
    },
    getSelectedItemText: function(selectObj) {
      return selectObj.getSelectedItem() ? selectObj.getSelectedItem().getKey() : "";
    },
    getPage: function() {
      return this.getView().byId("dynamicPageId");
    },
    getPageTitle: function() {
      return this.getPage().getTitle();
    },
    getSnappedLabel: function() {
      return new Label({ text: "{/Filter/text}" });
    }
  });
});