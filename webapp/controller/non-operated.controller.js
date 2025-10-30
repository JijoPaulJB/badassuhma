sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/Label",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Fragment"
], function(Controller, JSONModel, Label, Filter, FilterOperator, Fragment) {
  "use strict";
  return Controller.extend("sierra.pra.PRA_Custom.controller.non-operated", {
    onInit: function() {
      // Initialization logic if needed
    },
    onBalance: function() {
      var view = this.getView();
      var self = this;
      if (!self.pErrorLogPopover) {
        self.pErrorLogPopover = Fragment.load({
          id: view.getId(),
          name: "sierra.pra.PRA_Custom.view.non-operated_balance",
          controller: self
        }).then(function(oFragment) {
          view.addDependent(oFragment);
          return oFragment;
        });
      }
      self.pErrorLogPopover.then(function(oFragment) {
        oFragment.open();
      });
    },
    onCloseBalance: function() {
      this.byId("non-operated_balance").destroy();
      this.pErrorLogPopover = undefined;
    },
    onImport: function() {
      this.byId("non-operated_balance").destroy();
      this.pErrorLogPopover = undefined;
      var view = this.getView();
      var self = this;
      if (!self.pErrorLogPopover) {
        self.pErrorLogPopover = Fragment.load({
          id: view.getId(),
          name: "sierra.pra.PRA_Custom.view.non-operated_balance_upload",
          controller: self
        }).then(function(oFragment) {
          view.addDependent(oFragment);
          return oFragment;
        });
      }
      self.pErrorLogPopover.then(function(oFragment) {
        oFragment.open();
      });
    },
    onCloseErrorLogPopover: function() {
      this.byId("View1view").destroy();
      this.pErrorLogPopover = undefined;
      var view = this.getView();
      var self = this;
      if (!self.pErrorLogPopover) {
        self.pErrorLogPopover = Fragment.load({
          id: view.getId(),
          name: "sierra.pra.PRA_Custom.view.non-operated_balance",
          controller: self
        }).then(function(oFragment) {
          view.addDependent(oFragment);
          return oFragment;
        });
      }
      self.pErrorLogPopover.then(function(oFragment) {
        oFragment.open();
      });
    }
  });
});