/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"com/baba/ZMM_PALLET_RPT/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"com/baba/ZMM_PALLET_RPT/test/integration/pages/View1",
	"com/baba/ZMM_PALLET_RPT/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "com.baba.ZMM_PALLET_RPT.view.",
		autoWait: true
	});
});