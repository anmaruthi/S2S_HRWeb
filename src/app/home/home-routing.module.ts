import { NgModule } from '@angular/core';
import { Routes, RouterModule, Params, CanActivate } from '@angular/router';
import { AuthGuard } from "../guard/authguard";
import { AppConfig } from "../const/app.config";
import { HomeComponent } from './home.component';


const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [

            { path: AppConfig.USERS_PATH, loadChildren: () => import('../useraccess/usersetup/users.module').then(mod => mod.UsersModule), canActivate: [AuthGuard] },
            { path: AppConfig.ROLE_PATH, loadChildren: () => import('../useraccess/role/role.module').then(mod => mod.RoleModule), canActivate: [AuthGuard] },
            { path: AppConfig.DEPARTMENT_PATH, loadChildren: () => import('../useraccess/department/department.module').then(mod => mod.DepartmentModule), canActivate: [AuthGuard] },
            { path: AppConfig.CORPORATE_PATH, loadChildren: () => import('../useraccess/corporate/corporate.module').then(mod => mod.CorporateModule), canActivate: [AuthGuard] },
            { path: AppConfig.SITE_PATH, loadChildren: () => import('../useraccess/site/site.module').then(mod => mod.SiteModule), canActivate: [AuthGuard] },
            { path: AppConfig.FIELD_MASTER_PATH, loadChildren: () => import('../master/fieldmaster/fieldmaster.module').then(mod => mod.FieldMasterModule), canActivate: [AuthGuard] },
            { path: AppConfig.MATERIAL_CATEGORY_PATH, loadChildren: () => import('../master/materialcategory/materialcategory.module').then(mod => mod.MaterialCategoryModule), canActivate: [AuthGuard] },
            { path: AppConfig.MATERIAL_TYPE_PATH, loadChildren: () => import('../master/itemtype/itemtype.module').then(mod => mod.ItemTypeModule), canActivate: [AuthGuard] },
            //{ path: AppConfig.MATERIAL_MASTER_PATH, loadChildren: () => import('../master/materialmaster/materialmaster.module').then(mod => mod.MaterialMasterModule), canActivate: [AuthGuard] },

            { path: AppConfig.TAX_MASTER_PATH, loadChildren: () => import('../master/taxmaster/taxmaster.module').then(mod => mod.TaxmasterModule), canActivate: [AuthGuard] },
            { path: AppConfig.TRANSPORT_MASTER_PATH, loadChildren: () => import('../master/transportmaster/transportmaster.module').then(mod => mod.TransportmasterModule), canActivate: [AuthGuard] },
            { path: AppConfig.BILLING_ADDRESS_PATH, loadChildren: () => import('../master/billingaddress/billingaddress.module').then(mod => mod.BillingaddressModule), canActivate: [AuthGuard] },
            { path: AppConfig.DELIVERY_ADDRESS_PATH, loadChildren: () => import('../master/deliveryaddress/deliveryaddress.module').then(mod => mod.DeliveryaddressModule), canActivate: [AuthGuard] },

            { path: AppConfig.REASON_MASTER_PATH, loadChildren: () => import('../master/reasons/reasons.module').then(mod => mod.ReasonMasterModule), canActivate: [AuthGuard] },
            { path: AppConfig.HOLIDAY_MASTER_PATH, loadChildren: () => import('../master/holidays/holidays.module').then(mod => mod.HolidayMasterModule), canActivate: [AuthGuard] },
            { path: AppConfig.LEAVE_TYPE_PATH, loadChildren: () => import('../master/leavetype/leavetype.module').then(mod => mod.LeaveTypeModule), canActivate: [AuthGuard] },

            { path: AppConfig.EMPLOYEE_GROUP_PATH, loadChildren: () => import('../master/empgrp/empgrp.module').then(mod => mod.EmpgrpModule), canActivate: [AuthGuard] },
            { path: AppConfig.EMPLOYEE_CATEGORY_PATH, loadChildren: () => import('../master/empcat/empcat.module').then(mod => mod.EmpcatModule), canActivate: [AuthGuard] },
            { path: AppConfig.EMPLOYEE_TYPE_PATH, loadChildren: () => import('../master/emptype/emptype.module').then(mod => mod.EmptypeModule), canActivate: [AuthGuard] },
            { path: AppConfig.EMPLOYEE_DEPARTMENT_PATH, loadChildren: () => import('../master/empdept/empdept.module').then(mod => mod.EmpdeptModule), canActivate: [AuthGuard] },
            { path: AppConfig.EMPLOYEE_DESIGN_PATH, loadChildren: () => import('../master/empdesig/empdesig.module').then(mod => mod.EmpdesigModule), canActivate: [AuthGuard] },
            { path: AppConfig.FPDEVICE_PATH, loadChildren: () => import('../fpdevice/fpdevice.module').then(mod => mod.FPDeviceModule), canActivate: [AuthGuard] },
            { path: AppConfig.EMPLOYEE_PATH, loadChildren: () => import('../employee/employee.module').then(mod => mod.EmployeeModule), canActivate: [AuthGuard] },
            { path: AppConfig.CONFIGURATION_PATH, loadChildren: () => import('../configuration/configuration.module').then(mod => mod.ConfigurationModule), canActivate: [AuthGuard] },
            { path: AppConfig.SHIFT_PATH, loadChildren: () => import('../shift/shift.module').then(mod => mod.shift), canActivate: [AuthGuard] },
            { path: AppConfig.DEDUCTIONS_PATH, loadChildren: () => import('../deductions/deductions.module').then(mod => mod.deductions), canActivate: [AuthGuard] },
            { path: AppConfig.SHIFTMANAGEMENT_PATH, loadChildren: () => import('../shiftmanagement/shiftmanagement.module').then(mod => mod.ShiftmanagementModule), canActivate: [AuthGuard] },
            { path: AppConfig.DAILYATTENDANCE_PATH, loadChildren: () => import('../dailyattendance/dailyattendance.module').then(mod => mod.DailyattendanceModule), canActivate: [AuthGuard] },
            { path: AppConfig.MONTHLYATTENDANCE_PATH, loadChildren: () => import('../monthlyattendance/monthlyattendance.module').then(mod => mod.MonthlyattendanceModule), canActivate: [AuthGuard] },


            { path: AppConfig.LOOKUP_PATH, loadChildren: () => import('../master/lookup/lookup.module').then(mod => mod.LookupModule), canActivate: [AuthGuard] },
            { path: AppConfig.BUYER_MASTER_PATH, loadChildren: () => import('../master/buyermaster/buyermaster.module').then(mod => mod.BuyerMasterModule), canActivate: [AuthGuard] },
            { path: AppConfig.HOUSE_MASTER_PATH, loadChildren: () => import('../master/buyinghousemaster/buyinghousemaster.module').then(mod => mod.BuyingHouseMasterModule), canActivate: [AuthGuard] },
            { path: AppConfig.CONSIGNE_MASTER_PATH, loadChildren: () => import('../master/consigneemaster/consigneemaster.module').then(mod => mod.ConsigneeMasterModule), canActivate: [AuthGuard] },
            { path: AppConfig.AGENT_MASTER_PATH, loadChildren: () => import('../master/agent/agent.module').then(mod => mod.AgentModule), canActivate: [AuthGuard] },
            { path: AppConfig.SUPPLIER_MASTER_PATH, loadChildren: () => import('../master/suppliermaster/suppliermaster.module').then(mod => mod.SupplierMasterModule), canActivate: [AuthGuard] },
            { path: AppConfig.CUSTOMER_MASTER_PATH, loadChildren: () => import('../master/customermaster/customermaster.module').then(mod => mod.CustomerMasterModule), canActivate: [AuthGuard] },
            { path: AppConfig.VENDOR_MASTER_PATH, loadChildren: () => import('../master/vendormaster/vendormaster.module').then(mod => mod.VendorMasterModule), canActivate: [AuthGuard] },
            { path: AppConfig.ITEM_PATH, loadChildren: () => import('../master/item/item.module').then(mod => mod.ItemModule), canActivate: [AuthGuard] },
            { path: AppConfig.COMPONENTFIELDS_PATH, loadChildren: () => import('../master/componentfields/componentfields.module').then(mod => mod.ComponentFieldsModule), canActivate: [AuthGuard] },
            { path: AppConfig.COLOR_PATH, loadChildren: () => import('../master/color/color.module').then(mod => mod.ColorModule), canActivate: [AuthGuard] },
            { path: AppConfig.EVENT_PATH, loadChildren: () => import('../master/event/event.module').then(mod => mod.EventModule), canActivate: [AuthGuard] },
            //{ path: AppConfig.PROJECTSETUP_PATH, loadChildren: () => import('../master/projectsetup/project.module').then(mod => mod.ProjectModule), data: { screenMode: 'Order'}, canActivate: [AuthGuard]},
            //{ path: AppConfig.BUDGET_PATH, loadChildren: () => import('../master/projectsetup/project.module').then(mod => mod.ProjectModule), data: { screenMode: 'Budget'}, canActivate: [AuthGuard] },

            { path: AppConfig.TEMPLATE_PATH, loadChildren: () => import('../master/templates/templates.module').then(mod => mod.TemplatesModule), canActivate: [AuthGuard] },
            { path: AppConfig.SIZE_PATH, loadChildren: () => import('../master/size/size.module').then(mod => mod.SizeModule), canActivate: [AuthGuard] },
            { path: AppConfig.FABRIC_PATH, loadChildren: () => import('../master/fabric/fabric.module').then(mod => mod.FabricModule), canActivate: [AuthGuard] },

            { path: AppConfig.STOCK_PATH, loadChildren: () => import('../inventory/stock/stock.module').then(mod => mod.StockModule), canActivate: [AuthGuard] },
            { path: AppConfig.REORDERLEVEL_PATH, loadChildren: () => import('../inventory/reorderlevel/reorderlevel.module').then(mod => mod.ReOrderLevelModule), canActivate: [AuthGuard] },
            { path: AppConfig.STOCK_INWARD_PATH, loadChildren: () => import('../inventory/stockinward/stockinward.module').then(mod => mod.StockInwardModule), canActivate: [AuthGuard] },
            { path: AppConfig.STOCK_OUTWARD_PATH, loadChildren: () => import('../inventory/stockoutward/stockoutward.module').then(mod => mod.StockOutwardModule), canActivate: [AuthGuard] },
            { path: AppConfig.STOCK_RETURN_PATH, loadChildren: () => import('../inventory/stockreturn/stockreturn.module').then(mod => mod.StockReturnModule), canActivate: [AuthGuard] },
            { path: AppConfig.STOCK_REQUEST_PATH, loadChildren: () => import('../inventory/stockrequest/stockrequest.module').then(mod => mod.StockRequestModule), canActivate: [AuthGuard] },
            { path: AppConfig.STOCK_CANCEL_PATH, loadChildren: () => import('../inventory/stockcancel/stockcancel.module').then(mod => mod.StockCancelModule), canActivate: [AuthGuard] },
            { path: AppConfig.STOCK_TRANSFER_PATH, loadChildren: () => import('../inventory/stocktransfer/stocktransfer.module').then(mod => mod.StockTransferModule), canActivate: [AuthGuard] },
            // { path: AppConfig.STOCK_GATEPASS_PATH, loadChildren: () => import('../master/gatepass/gatepass.module').then(mod => mod.GatePassModule), canActivate: [AuthGuard] },

            { path: AppConfig.EXPENSE_PATH, loadChildren: () => import('../master/expense/expense.module').then(mod => mod.ExpenseModule), canActivate: [AuthGuard] },
            { path: AppConfig.PROCESS_PATH, loadChildren: () => import('../master/process/process.module').then(mod => mod.ProcessModule), canActivate: [AuthGuard] },
            { path: AppConfig.PROCESS_FLOW_PATH, loadChildren: () => import('../master/processflow/processflow.module').then(mod => mod.ProcessFlowModule), canActivate: [AuthGuard] },
            //{ path: AppConfig.WORKORDER_PATH, loadChildren: () => import('../master/workorder/workorder.module').then(mod => mod.WorkOrderModule), canActivate: [AuthGuard] },

            { path: AppConfig.PURCHASE_PATH, loadChildren: () => import('../inventory/purchase/purchase.module').then(mod => mod.PurchaseModule), canActivate: [AuthGuard] },
            { path: AppConfig.PURCHASEREQUEST_PATH, loadChildren: () => import('../inventory/purchaseRequest/purchaserequest.module').then(mod => mod.PurchaserequestModule), canActivate: [AuthGuard] },
            { path: AppConfig.QUOTATION_PATH, loadChildren: () => import('../inventory/quotation/quotation.module').then(mod => mod.QuotationModule), canActivate: [AuthGuard] },
            { path: AppConfig.REPORTS_PATH, loadChildren: () => import('../reports/reports.module').then(mod => mod.ReportsModule), canActivate: [AuthGuard] },

            //{ path: AppConfig.UN_AUTHORIZED_PAGE_PATH, loadChildren: () => import('../unauthorized/unauthorized.module').then(mod => mod.AdvertisementModule), canActivate: [AuthGuard] },

            { path: "**", redirectTo: AppConfig.FIRSTPAGE_PATH }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class HomeRoutingModule {
}
