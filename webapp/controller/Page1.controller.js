sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./Dialog1",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel"
], function (BaseController, MessageBox, Dialog1, Utilities, History, JSONModel) {
	"use strict";

	return BaseController.extend("com.baba.ZMM_PALLET_RPT.controller.Page1", {
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.globalVar = {};
			this.globalVar.oDataModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMMO_PALLET_RPT_SRV/", true);
			var jsonModel = new JSONModel();
			this.byId("ListPalletInfo").setModel(jsonModel);
			// this._clearContent();
			this.oRouter.getTarget("Page1").attachDisplay(jQuery.proxy(this._handleRouteMatched, this));
		},

		onGetPallet: function () {
			this._clearContent();
			
			var oBusy = new sap.m.BusyDialog();

			var inPallet = this.byId("InPallet").getValue();
			if (inPallet === "") {
				MessageBox.error("Please enter Pallet ID");
			} else {
				this._onBusyS(oBusy);
				this.globalVar.oDataModel.read("/MrfAndDeliverySet('" + inPallet + "')", {
					success: function (res, oResponse) {
						if (res.Error !== "") {
							MessageBox.error(res.Error);
						} else {
							this.globalVar.palletInfo = {
								Material: res.Material,
								Pallet: res.Pallet,
								MaterialDesc: res.MaterialDesc,
								PurchaseOrder: res.PurchaseOrder,
								DeliveryOrder: res.DeliveryOrder,
								QtyInKg: res.QtyInKg,
								Unit: res.Unit,
								QtyInBags: res.QtyInBags,
								Supplier: res.Supplier,
								SupplierName: res.SupplierName,
								ReceivedDate: res.ReceivedDate,
								Batch: res.Batch,
								ExpiryDate: res.ExpiryDate,
								ReceivedPlant: res.ReceivedPlant
							};
							this._setPalletData();
						}
						this._onBusyE(oBusy);
					}.bind(this),
					error: function (oResponse) {
						this._onBusyE(oBusy);
						var oMsg = JSON.parse(oResponse.responseText);
						MessageBox.error(oMsg.error.message.value);
					}.bind(this)
				});
			}
		},

		onClear: function () {
			this._clearContent();
			this._clearInput();
		},

		onExit: function () {

		},

		_onBusyS: function (oBusy) {
			oBusy.open();
			oBusy.setBusyIndicatorDelay(40000);
		},

		_onBusyE: function (oBusy) {
			oBusy.close();
		},

		_clearContent: function () {
			this.globalVar.palletInfo = {
				Material: "",
				Pallet: "",
				MaterialDesc: "",
				PurchaseOrder: "",
				DeliveryOrder: "",
				QtyInKg: "",
				Unit: "",
				QtyInBags: "",
				Supplier: "",
				SupplierName: "",
				ReceivedDate: "",
				Batch: "",
				ExpiryDate: "",
				ReceivedPlant: "",
				Error: ""
			};
			this._removePalletData();
		},

		_removePalletData: function () {
			var oModel = this.byId("ListPalletInfo").getModel();
			oModel.setData({
				PalletInfo: {}
			});
			this.byId("ListPalletInfo").setModel(oModel);
			this.byId("ListPalletInfo").getModel().refresh(true);
		},

		_setPalletData: function () {
			var oModel = this.byId("ListPalletInfo").getModel();
			oModel.setData({
				PalletInfo: [{
					label: "Pallet",
					value: this.globalVar.palletInfo.Pallet
				}, {
					label: "Material",
					value: this.globalVar.palletInfo.Material
				}, {
					label: "Description",
					value: this.globalVar.palletInfo.MaterialDesc
				}, {
					label: "Inbound Delivery",
					value: this.globalVar.palletInfo.DeliveryOrder
				}, {
					label: "Purchase Order",
					value: this.globalVar.palletInfo.PurchaseOrder
				}, {
					label: "Actual Qty",
					value: this.globalVar.palletInfo.QtyInKg
				}, {
					label: "Unit",
					value: this.globalVar.palletInfo.Unit
				}, {
					label: "No. of Bags",
					value: this.globalVar.palletInfo.QtyInBags
				}, {
					label: "Vendor ID",
					value: this.globalVar.palletInfo.Supplier
				}, {
					label: "Vendor Name",
					value: this.globalVar.palletInfo.SupplierName
				}, {
					label: "Batch",
					value: this.globalVar.palletInfo.Batch
				}, {
					label: "Receiving Date",
					value: this.globalVar.palletInfo.ReceivedDate
				}, {
					label: "Shelf Life",
					value: this.globalVar.palletInfo.ExpiryDate
				}, {
					label: "Plant",
					value: this.globalVar.palletInfo.ReceivedPlant
				}]
			});
			this.byId("ListPalletInfo").setModel(oModel);
			this.byId("ListPalletInfo").getModel().refresh(true);
		},

		_clearInput: function () {
			this.byId("InPallet").setValue("");
		},

		_handleRouteMatched: function (oEvent) {
			var sAppId = "App5dcd0f866271e11160b6f9dd";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function (oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype" && prop.includes("Set")) {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},

		_onPageNavButtonPress: function (oEvent) {

			var sDialogName = "Dialog1";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Dialog1(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		}
	});
}, /* bExport= */ true);