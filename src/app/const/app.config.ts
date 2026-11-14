import { Injectable } from "@angular/core";

@Injectable()
export class AppConfig {

    public static APP_AUTH_KEY = "4BD5C626-565F-4ADD-B4A8-13BA1433983D";
    public static Version = "19.0.0.0";

    public static DASHBOARD_PATH = "dashboard";
    public static LOGIN_PATH = "login";
    public static HOME_PATH = "home";
    public static APPS_HOME_PATH = "appshome";

    public static USERS_PATH = "user";
    public static ROLE_PATH = "role";
    public static CORPORATE_PATH = "corporate";
    public static PROCESS_PATH = "process";
    public static SITE_PATH = "site";

    public static FIELD_MASTER_PATH = "fieldmaster";
    public static MATERIAL_CATEGORY_PATH = "materialcategory";
    public static MATERIAL_TYPE_PATH = "materialtype";


    public static TAX_MASTER_PATH = "taxmaster";
    public static TRANSPORT_MASTER_PATH = "transportmaster";
    public static BILLING_ADDRESS_PATH = "billingaddress";
    public static DELIVERY_ADDRESS_PATH = "deliveryaddress";
    public static EMPLOYEE_GROUP_PATH = "groupmaster";
    public static EMPLOYEE_CATEGORY_PATH = "catmaster";
    public static EMPLOYEE_TYPE_PATH = "typemaster";
    public static EMPLOYEE_DESIGN_PATH = "desigmaster";
    public static EMPLOYEE_DEPARTMENT_PATH = "deptmaster";
    public static ITEM_TYPE_PATH = "itemtype";

    public static REASON_MASTER_PATH = "reasonmaster";
    public static HOLIDAY_MASTER_PATH = "holidaymaster";
    public static LEAVE_TYPE_PATH = "leavemaster";


    public static BUYER_MASTER_PATH = "buyermaster";
    public static HOUSE_MASTER_PATH = "buyinghousemaster";
    public static CONSIGNE_MASTER_PATH = "consigneemaster";
    public static AGENT_MASTER_PATH = "agent";
    public static SUPPLIER_MASTER_PATH = "suppliermaster";
    public static CUSTOMER_MASTER_PATH = "customermaster";
    public static VENDOR_MASTER_PATH = "vendormaster";

    public static EVENT_PATH = "event";

    public static LOOKUP_PATH = "lookup";
    public static DEPARTMENT_PATH = "department";
    public static ITEM_PATH = "materialmaster";
    public static COLOR_PATH = "color";
    public static COMPONENTFIELDS_PATH = "componentfields";
    public static FPDEVICE_PATH = "biometric";
    public static EMPLOYEE_PATH = "employee";
    public static CONFIGURATION_PATH = "configurations";
    public static SHIFT_PATH = "shiftmaster";
    public static SHIFTMANAGEMENT_PATH = "shiftmapping";
    public static DEDUCTIONS_PATH = "deductmaster";
    public static DAILYATTENDANCE_PATH = "dailyattendance";
    public static MONTHLYATTENDANCE_PATH = "monthlyattendance";

    public static PROJECTSETUP_PATH = "projectsetup";
    public static BUDGET_PATH = "budgetapproval";

    public static REPORTS_PATH = "reports";
    public static PROCESS_FLOW_PATH = "processflow"; //production score
    public static WORKORDER_PATH = "workorder";

    public static FIRSTPAGE_PATH = "login";

    public static TEMPLATE_PATH = "templates";
    public static SIZE_PATH = "size";
    public static FABRIC_PATH = "fabric";

    public static EXPENSE_PATH = "expense";
    // static PROCESS_PATH = "process";

    public static PURCHASE_PATH = "purchaseorder";
    public static PURCHASEREQUEST_PATH = "purchaserequest";
    public static QUOTATION_PATH = "quotation";

    public static REPORTPAGE_PATH = 'http://localhost:57262/Default.aspx';
    //public static REPORTPAGE_PATH = 'http://103.220.223.186/Inventory/Reports/Default.aspx';
    //public static REPORTPAGE_PATH = 'http://www.macromaxxtechnologies.com/Inventory/Reports/Default.aspx';

    public static STOCK_PATH = "stock";
    public static REORDERLEVEL_PATH = "reorderlevel";
    public static STOCK_INWARD_PATH = "stockinward";
    public static STOCK_OUTWARD_PATH = "stockoutward";
    public static STOCK_REQUEST_PATH = "stockrequest";
    public static STOCK_RETURN_PATH = "stockreturn";
    public static STOCK_GATEPASS_PATH = "gatepass";
    public static STOCK_CANCEL_PATH = "stockcancel";
    public static STOCK_TRANSFER_PATH = "stocktransfer";

    public static SaveType_Insert = 1;
    public static SaveType_Update = 2;
    public static SaveType_Delete = 3;

    public static MAT_DT_PICKER_FORMATS = {
        parse: {
            dateInput: 'DD/MM/YYYY',
        },
        display: {
            dateInput: 'DD/MM/YYYY',
            monthYearLabel: 'MMM YYYY',
            dateA11yLabel: 'LL',
            monthYearA11yLabel: 'MMMM YYYY',
        },
    };

    public static DATE_FORMAT = "DD/MM/YYYY";
    public static DATETIME_FORMAT = "DD/MM/YYYY hh:mm A";

    public static GRID_DATE_FORMAT = "DD/MM/YYYY";
    public static GRID_DATETIME_FORMAT = "DD/MM/YYYY hh:mm A";
    public static GRID_TIME_FORMAT = "hh:mm A";

    public static SERVICE_DATE_FORMAT = "MM/DD/YYYY";
    public static CONSOLE_LOG_LEVEL = 5;
    public static VALIDATORS_EMAIL_PATTERN = "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";

    public static UPDATE_DATE_FORMAT = "YYYY/MM/DD";
};

export enum logLevel {
    DevLog = 5,
    Trace = 4,
    Debug = 3,
    Info = 2,
    Warning = 1,
    Error = 0,
};

export enum MasterStatus {
    Active = 10,
    Inactive = 20,
    Deleted = 50,
};

export enum ProjectStatus {
    Approved = 210,
    Completed = 290,
    Deleted = 230,
    New = 200,
    Pending = 205,
    Rejected = 220,
    Budget_Approval_Pending = 240,
    Budget_Approved = 250,

};


export enum PurchaseOrderStatus {
    NextStage = 5,
    Cancelled = 10,
    Rejected = 20,
    Initiated = 30,
    EntryInProgress = 35,
    RedirectedToEntry = 37,
    SubmittedToVerification = 40,
    VerificationInProgress = 45,
    RedirectedToVerification = 47,
    SubmittedToApproval = 50,
    Approved = 70,
    SentToSupplier = 100,
    Pending = 110, //material receiving
    PartiallyReceived = 120,
    FullyReceived = 130,
    InvoiceReceived = 140,
    PaymentPartiallySettled = 150,
    PaymentFullySettled = 160,
    Closed = 170,
};

export enum QuotationStatus {
    QuoteCancelled = 310,
    QuoteExpired = 320,
    QuoteRejected = 330,
    New = 340,
    QuoteRequestPlaced = 350,
    QuoteRedirectedToEntry = 355,
    QuoteResponseReceived = 360,
    QuoteApproved = 370,
};

export enum QuotationType {
    Request = 1,
    Raise = 2,
};

export enum MaterialReturnType {
    Cancel = 1,
    Replacement = 2,
};

export enum MaterialStatus {
    Pending = 110,
    Partially_Received = 120,
    Fully_Received = 130,
    Deleted = 140,
    Rejected = 150,
    Approved = 160,
    New = 100,
};

export enum StockStatus {
    Pending = 600,
    Submitted = 605,
    Rejected = 620,
    Approved = 630,
    Deleted = 610,
};

export enum BillGstType {
    GST = 1,
    IncludingGST = 2,
    NonGst = 0,
};

export enum PurchaseRequestStatus {
    RequestCancelled = 210,
    RequestRejected = 220,
    New = 230,
    RedirectedToRequest = 235,
    RequestPlaced = 240,
    RequestApproved = 250
};


export enum MaterialRequestStatus {
    Pending = 700,
    Submitted = 705,
    Rejected = 720,
    Approved = 730,
    Deleted = 710,
};

export enum MaterialReturnStatus {
    Pending = 800,
    Submitted = 810,
    Cancelled = 820,
    Rejected = 830,
    Approved = 840,
};

export enum MaterialTransferStatus {
    Pending = 900,
    Returned = 905,
    Submitted = 910,
    Cancelled = 920,
    Rejected = 930,
    Approved = 940,
    Received = 950,
    Accepted = 960
};

export enum MasterStage {
    Quotation = 1,
    PurchaseOrder = 2,
    Material = 3,
    PurchaseRequest = 4,
};

export enum OutwardType {
    Internal = 1,
    External = 0,
};

export enum ReturnType {
    Returnable = 1,
    NonReturnable = 0,
};