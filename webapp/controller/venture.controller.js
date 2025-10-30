sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/Label",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Fragment"
], function(Controller, JSONModel, Label, Filter, FilterOperator, Fragment) {
  "use strict";
  return Controller.extend("sierra.pra.PRA_Custom.controller.venture", {
    onInit: function() {
      var that = this;
      this.globalModel = this.getOwnerComponent().getModel("globalModel");
      var oModel = new JSONModel(this.globalModel);
      oModel.setSizeLimit(500);
      this.getView().setModel(oModel, "oModel");
      this.getOwnerComponent().getModel().read("/ventureSet", {
        success: function(data, response) {
          that.globalModel.Venture = [];
          that.globalModel.ventureList1 = data.results;
          for (var i = 0; i < that.globalModel.ventureList1.length; i++) {
            that.globalModel.Venture.push(that.globalModel.ventureList1[i]);
          }
          that.getView().getModel("oModel").refresh();
          that.aKeys = ["cmp_code", "1", "DECKTYPE", "Venture", "WELLNAME"];
          that.oSelectName = that.getSelect("slName");
          that.oSelectCategory = that.getSelect("slCategory");
          that.oSelectSupplierName = that.getSelect("slDOIType");
          that.oSelectVenture = that.getSelect("slVenture");
          that.oSelectWell = that.getSelect("slWell");
          oModel.setProperty("/Filter/text", "Filtered by None");
          that.addSnappedLabel();
          var filterBar = that.getView().byId("filterbar");
          if (filterBar) {
            filterBar.variantsInitialized();
          }
        },
        error: function(err) {
          // Error handling
        }
      });
    },
    onSelectionChge: function(oEvent) {
      var oTable = this.getView().byId("idProductsTable2");
      var oBinding = oTable.getBinding("items");
      var vname = oEvent.getSource().getBindingContext("oModel").getObject().Vname;
      var filters = [new Filter("Vname", FilterOperator.EQ, vname)];
      oBinding.filter(filters);
    },
    onSelectRequestRevenueHeaderList: function(oEvent) {
      var oModel = this.getView().getModel("oModel");
      var selectedPaths = oEvent.getSource()._aSelectedPaths;
      this.globalModel.navigatedRequest = oModel.getProperty(selectedPaths[0]);
      var idx = selectedPaths[0];
      var lastChar = idx.slice(idx.length - 1);
      this.selectedProgramIndex = parseInt(lastChar);
    },
    onPopinLayoutChanged: function() {
      var oTable = this.byId("idProductsTable");
      var oPopinLayout = this.byId("idPopinLayout");
      var selectedKey = oPopinLayout.getSelectedKey();
      switch (selectedKey) {
        case "Block":
          oTable.setPopinLayout(PopinLayout.Block);
          break;
        case "GridLarge":
          oTable.setPopinLayout(PopinLayout.GridLarge);
          break;
        case "GridSmall":
          oTable.setPopinLayout(PopinLayout.GridSmall);
          break;
        default:
          oTable.setPopinLayout(PopinLayout.Block);
          break;
      }
    },
    onDisplayForm: function(oEvent) {
      var oModel = this.getView().getModel("oModel");
      this.globalModel.navigationMode = "Display";
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("owner_details", {}, true);
    },
    onDoiHeaderAddPress: function() {
      var oView = this.getView();
      var that = this;
      if (!that.pErrorLogPopover) {
        that.pErrorLogPopover = Fragment.load({
          id: oView.getId(),
          name: "sierra.pra.PRA_Custom.view.doi_header_add",
          controller: that
        }).then(function(oFragment) {
          oView.addDependent(oFragment);
          return oFragment;
        });
      }
      that.pErrorLogPopover.then(function(oPopover) {
        oPopover.open();
      });
    },
    onCloseErrorLogPopover: function() {
      this.byId("ErrorLogPopover").destroy();
      this.pErrorLogPopover = undefined;
    },
    onCloseLogPopover: function() {
      var oTable = this.getView().byId("idProductsTable");
      var oBinding = oTable.getBinding("items");
      var oTable2 = this.getView().byId("idProductsTable2");
      var oBinding2 = oTable2.getBinding("items");
      oBinding.filter([]);
      oBinding2.filter([]);
      this.byId("ErrorLogPopover").destroy();
      this.pErrorLogPopover = undefined;
    },
    onPressFilter: function() {
      var oView = this.getView();
      var that = this;
      if (!that.pErrorLogPopover) {
        that.pErrorLogPopover = Fragment.load({
          id: oView.getId(),
          name: "sierra.pra.PRA_Custom.view.venture_filter",
          controller: that
        }).then(function(oFragment) {
          oView.addDependent(oFragment);
          return oFragment;
        });
      }
      that.pErrorLogPopover.then(function(oPopover) {
        oPopover.open();
      });
    },
    onChange: function(oEvent) {
      var oTable = this.getView().byId("idProductsTable");
      var oBinding = oTable.getBinding("items");
      var oTable2 = this.getView().byId("idProductsTable2");
      var oBinding2 = oTable2.getBinding("items");
      var value = oEvent.mParameters.value;
      var filters = [new Filter("Vname", FilterOperator.EQ, value)];
      oBinding.filter(filters);
      oBinding2.filter(filters);
      var companyCode = this.getView().byId("idProductsTable").getItems()[0].getCells()[3].mProperties.text;
      this.globalModel = this.getOwnerComponent().getModel("globalModel");
      this.globalModel.companyCode = companyCode;
      this.getView().getModel("oModel").refresh();
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
      var values = [];
      values.push(this.getSelectedItemText(this.oSelectName));
      values.push(this.getSelectedItemText(this.oSelectCategory));
      values.push(this.getSelectedItemText(this.oSelectSupplierName));
      values.push(this.getSelectedItemText(this.oSelectVenture));
      values.push(this.getSelectedItemText(this.oSelectWell));
      this.filterTable(values);
    },
    filterTable: function(values) {
      this.getTableItems().filter(this.getFilters(values));
      this.updateFilterCriterias(this.getFilterCriteria(values));
    },
    updateFilterCriterias: function(criteria) {
      this.removeSnappedLabel();
      this.addSnappedLabel();
      this.oModel.setProperty("/Filter/text", this.getFormattedSummaryText(criteria));
    },
    addSnappedLabel: function() {
      var label = this.getSnappedLabel();
      label.attachBrowserEvent("click", this.onToggleHeader, this);
      this.getPageTitle().addSnappedContent(label);
    },
    removeSnappedLabel: function() {
      this.getPageTitle().destroySnappedContent();
    },
    getFilters: function(values) {
      this.aFilters = this.aKeys.map(function(key, idx) {
        return new Filter(key, FilterOperator.Contains, values[idx]);
      });
      return this.aFilters;
    },
    getFilterCriteria: function(values) {
      return this.aKeys.filter(function(key, idx) {
        return values[idx] !== "";
      });
    },
    getFormattedSummaryText: function(criteria) {
      if (criteria.length > 0) {
        return "Filtered By (" + criteria.length + "): " + criteria.join(", ");
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
    getSelectedItemText: function(oSelect) {
      return oSelect.getSelectedItem() ? oSelect.getSelectedItem().getKey() : "";
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