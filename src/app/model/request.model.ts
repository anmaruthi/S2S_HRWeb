import {
  UserInfo, Master_LookUp, RoleInfo, CorpInfo, SettingDetail, Master_Department, BuyerMasterInfo, SupplierMasterInfo,
  Master_Item, VendorMasterInfo, MasterRoleGetallbyLobidResult, SiteInfo, ItemTypeInfo, FieldMasterInfo, TemplateInfo, SizeInfo,
  FabricInfo, EventInfo, ExpenseInfo, MasterMenuGetbyRoleidresult, ItemCategoryInfo,
  MasterRoleFunctionidsGetbyRoleidResult, ProcessInfo, Master_UOM, Project, ProjectDetails,
  StockInwardTransactionInfo, StockOutwardTransactionInfo, Master_Color, Master_ComponentFields,
  StockReturnTransactionInfo, Master_Color_GetAll_ByCorpIDResult, ReportingManagerInfo,
  ReportsInfo, ProjectDocuments, ProcessFlowInfo, MasterComponentFields, MasterColor, MasterHoliday, MasterLeave,
  PurchaseItemOrderInfoExtn, QuotationItemDetails, QuotationCreateItemDetails, DeliveryAddress, BillingAddress,
  ProcessFlowTransactionInfo, ProcessFlowTransactionDetailsInfo, Test_Case, TaxmasterInfo, TransportInfo,
  ProjectWorkOrderByDepartmentIDResult, HouseMasterInfo, AgentMasterInfo, ConsigneeMasterInfo,
  ProjectAccessoriesDetailsSizeDetailsExtn, Master_Item_PUOM, StockInwardTransactionList, MasterReason, MasterReasonCategory,
  StockInwardTransactionItemDetail, StockInwardTransactionProjectDetail, EmployeeGroup, EmployeeCategory, EmployeeType, EmployeeDepartment, EmployeeDesignation,
  StockReplaceTransactionItemDetail, RoleMenu, RoleFunction, RoleReport, Master_LookUp_Domain, ItemCategoryTaxDetails, FP_Devices, TaxDetItemCat, Item_Supplier_Price, SupplierItem, PurchaseOrderInfo, PurchaseItemOrderInfo, PurchaseRequestInfo, PurchaseItemRequestInfo, PurchasePendingItem, QuotationDetails, StockTransferDetail, CustomerMasterInfo, CustomerItem, Employee, PersonalInfo, AddressInfo, EmpFamilyInfo, EmpEducationInfo, Shift, Shiftmanagement, DailyEmployeeShift, WeeklyEmployeeOff, StockOutwardTransactionItemDetail, UpdateStockMaster, BankInfo, KYCDocInfo, DailyAttendance
} from "./shared.model";

export class RequestBase {
  public AppID: number;
  public UserID: number;
  public SiteID: number;
  public CorpID: number;
  public ManagerUserID: number;
  public SessionID: string;
  public DeviceType: string;
  public SaveType: number;
  public DeviceID: string;
  public AppAuthKey: string;
  public RoleID: number;
}

export class ServiceRequest extends RequestBase {
  public Code: string;
  public ID: number;
}

export class PurchaseOrderListGetBySiteIDRequest extends RequestBase {
  public StartDate: string;
  public EndDate: string;
  public StatusCode: number;
  public Stage: string;
}

export class PurchaseRequestListGetBySiteIDRequest extends RequestBase {
  public StartDate: string;
  public EndDate: string;
  public StatusCode: number;
  public Stage: string;
}

export class PurchaseRequestApprovalRequest extends RequestBase {
  public ResultList: PurchasePendingItem[];
}

export class ValidateLoginRequest extends RequestBase {
  public CorporateCode: string;
  public UserName: string;
  public Password: string;
}

export class SaveUserRequest extends RequestBase {
  public Result: UserInfo;
}

export class SaveLookUpRequest extends RequestBase {
  public Result: Master_LookUp;
}

export class ChangePasswordRequest extends RequestBase {
  CurrentPassword: string;
  NewPassword: string;
  ConfirmPassword: string;
}

export class MenuGetByRoleIDRequest extends RequestBase {
  public RoleID: number;
}

export class SaveRoleRequest extends RequestBase {
  public Result: RoleInfo;
  public RoleMenuList: RoleMenu[];
  public RoleFunctionList: RoleFunction[];
  public RoleReportsList: RoleReport[];
}

export class CorporateGetAllRequest extends RequestBase {
  public IsAdmin: boolean;
}

export class DeliveryAddressGetAllRequest extends RequestBase {
  public IsAdmin: boolean;
}

export class BillingAddressGetAllRequest extends RequestBase {
  public IsAdmin: boolean;
}

export class SaveDeliveryAddressRequest extends RequestBase {
  public Result: DeliveryAddress;
}

export class SaveBillingAddressRequest extends RequestBase {
  public Result: BillingAddress;
}


export class SiteGetAllRequest extends RequestBase {
  public IsAdmin: boolean;
}

export class TaxMasterGetAllRequest extends RequestBase {

}
export class SaveTaxMasterRequest extends RequestBase {

  public Result: TaxmasterInfo;
}

export class SaveEmployeeGroupRequest extends RequestBase {

  public Result: EmployeeGroup;
}
export class SaveEmployeeCategoryRequest extends RequestBase {
  public Result: EmployeeCategory;
  //  public categoryList: EmployeeCategory[];

}

export class SaveEmployeeDepartmentRequest extends RequestBase {

  public Result: EmployeeDepartment;
}
export class SaveEmployeeDesignationRequest extends RequestBase {

  public Result: EmployeeDesignation;
}



export class EmployeeCategoryGetAllRequest extends RequestBase {

}
export class EmployeeGroupGetAllRequest extends RequestBase {

}
export class EmployeeTypeGetAllRequest extends RequestBase {

}

export class EmployeeGetAllRequest extends RequestBase {

}

export class EmployeeDepartmentGetAllRequest extends RequestBase {

}
export class EmployeeDesignationGetAllRequest extends RequestBase {

}
export class MasterReasonGetAllRequest extends RequestBase {

}
export class MasterLeaveGetAllRequest extends RequestBase {

}
export class SaveReasonRequest extends RequestBase {

  public Result: MasterReason;

}
export class SaveLeaveRequest extends RequestBase {

  public Result: MasterLeave;

}

export class ItemCategoryTaxDetailsRequest extends RequestBase {
  public ItemCategoryID: number;
}


export class ItemTaxDetailsRequest extends RequestBase {
  public ItemID: number;
  public ItemCategoryID: number;
}

export class MasterHolidayGetAllRequest extends RequestBase {
  public HolidayYear: number;
}

export class SaveHolidayRequest extends RequestBase {
  public Result: MasterHoliday;
}

export class SupplierItemGetByCorpIDRequest extends RequestBase {
  public SupplierID: number;
}

export class CustomerItemGetByCorpIDRequest extends RequestBase {
  public CustomerID: number;
  ItemList: Master_Item[];

}

export class SaveReasonCategoryRequest extends RequestBase {
  // public ResultList: MasterReason;
  //public ReasonCategoryList: MasterReasonCategory;
}

export class SaveFPDeviceRequest extends RequestBase {
  public Result: FP_Devices;
}

export class ItemTypeGetAllRequest extends RequestBase {

}
export class TransportGetAllRequest extends RequestBase {

}

export class SaveTransportRequest extends RequestBase {

  public Result: TransportInfo;
}


export class FieldMasterGetAllRequest extends RequestBase {

}

export class SaveCorporateRequest extends RequestBase {
  public Result: CorpInfo;
}

export class SaveSiteRequest extends RequestBase {
  public Result: SiteInfo;
}

export class SaveItemCategoryRequest extends RequestBase {
  public Result: ItemCategoryInfo;
  public ItemTaxList: TaxDetItemCat[];
}


export class SaveItemTypeRequest extends RequestBase {
  public Result: ItemTypeInfo;
}

export class SaveEmployeeTypeRequest extends RequestBase {
  public Result: EmployeeType;
}

export class SaveEmployeeRequest extends RequestBase {
  public Result: Employee;

}

export class SaveEmployeePersonalInfoRequest extends RequestBase {
  public Result: PersonalInfo;
  public EmployeeAddressDetails: AddressInfo[];
  public EmployeeFamilyDetails: EmpFamilyInfo[];
  public EmployeeEducationDetails: EmpEducationInfo[];

}

export class SaveEmployeeBankInfoRequest extends RequestBase {
  public EmpID: number;
  public EmployeeBankDetails: BankInfo[];
  public EmployeeKYCDetails: KYCDocInfo[];
}

export class SaveFieldMasterRequest extends RequestBase {
  public Result: FieldMasterInfo;
}

export class SavePurchaseOrderRequest extends RequestBase {
  public Result: PurchaseOrderInfo;
  public PurchaseItemDetailList: PurchaseItemOrderInfo[];
  public ResultInfo: PurchaseItemOrderInfo;
}

export class SubmitPurchaseOrderRequest extends RequestBase {
  public PurchaseOrderID: number;
  public StatusCode: number;
  public Stage: string;
  public NoteToUser: string;
}

export class SavePurchaseQuoteRequest extends RequestBase {
  public SupplierList: string;
  public Result: QuotationDetails;
  public PurchaseItemDetailList: QuotationItemDetails[];
  public ResultInfo: QuotationItemDetails;
}

export class SubmitPurchaseRequestRequest extends RequestBase {
  public PurchaseRequestID: number;
  public StatusCode: number;
  public Stage: string;
  public NoteToUser: string;

}

export class UpdatePurchaseQuoteRequest extends RequestBase {
  public Result: QuotationDetails;
}

export class SavePurchaseRequestRequest extends RequestBase {
  public Result: PurchaseRequestInfo;
  public PurchaseItemDetailList: PurchaseItemRequestInfo[];
  public ResultInfo: PurchaseItemRequestInfo;
}

export class ConvertPORequestToPORequest extends RequestBase {
  public ResultInfo: PurchaseRequestInfo;
  public PurchaseItemDetailList: PurchaseItemOrderInfo[];
}

export class SaveSettingRequest extends RequestBase {
  public SettingCorpID: number;
  public SettingSiteID: number;
  public IsCorporateSetting: boolean;
  public SetingDetailList: SettingDetail[];
}

export class SettingGetAllRequest extends RequestBase {
  public IsCorporateSetting: boolean;
  public SettingCorpID: number;
  public SettingSiteID: number;
}



export class SaveConsigneeRequest extends RequestBase {
  public Result: ConsigneeMasterInfo;
  public alsoBuyer: boolean;
}

export class SaveBuyerRequest extends RequestBase {
  public Result: BuyerMasterInfo;
  public alsoAgent: boolean;
}

export class SaveAgentRequest extends RequestBase {
  public Result: AgentMasterInfo;
  public alsoCustomer: boolean;
}

export class SaveSupplierRequest extends RequestBase {
  public Result: SupplierMasterInfo;
  public ItemList: SupplierItem[];
}

export class SaveCustomerRequest extends RequestBase {
  public Result: CustomerMasterInfo;
  public ItemList: CustomerItem[];
}

export class SaveHouseRequest extends RequestBase {
  public Result: HouseMasterInfo;
}


export class SaveDepartmentRequest extends RequestBase {
  public Result: Master_Department;
}

export class SaveItemRequest extends RequestBase {
  public Result: Master_Item;
  //public PurchaseUOMList: Master_Item_PUOM[];
  public ItemTaxList: TaxDetItemCat[];
  public ItemSupplierList: Item_Supplier_Price[];
  public canUpdateStock: boolean;

}

export class SaveVendorRequest extends RequestBase {
  public Result: VendorMasterInfo;
}

export class SaveRoleMenuRequest extends RequestBase {

  public RoleInfo: MasterRoleGetallbyLobidResult;
  public SelectedMoudleID: string;
}

export class CorporateGetByCorpIDRequest extends RequestBase {
  public Result: CorpInfo;
  public Corp_ID: number;
}

export class SaveEventConfigurationRequest extends RequestBase {
  public EventConfigurationList: EventInfo[];
}


export class TemplateGetAllRequest extends RequestBase {
  public ResultList: TemplateInfo;
}

export class SaveTemplateRequest extends RequestBase {
  public ResultList: TemplateInfo;
}

export class SizeGetAllRequest extends RequestBase {

}

export class SaveSizeRequest extends RequestBase {
  public ResultList: SizeInfo;
}

export class FabricGetAllRequest extends RequestBase {

}

export class SaveFabricRequest extends RequestBase {
  public ResultList: FabricInfo;
}

export class SaveExpenseRequest extends RequestBase {
  public Result: ExpenseInfo;
}

export class ProcessGetAllByCorpIDRequest extends RequestBase {
  public ResultList: ProcessInfo[];
  public UOMResult: Master_UOM[];
  public ItemResult: Master_Item[];
}

export class SaveProcessRequest extends RequestBase {
  public ResultList: ProcessInfo;
}

export class ProjectSaveRequest extends RequestBase {
  public ResultList: ProjectDetails;
  public Action: string;
  public DeletedDocuments: ProjectDocuments[];
  public IsBudgetMode: number;
  public IsAmendment: boolean;

  public ProjectID: number;
  public DraftID: number;
}


export class ProjectGetByProjectIDRequest extends RequestBase {
  public ProjectID: number;
  public isDraft: boolean;
  public DraftID: number;
}

export class PurchaseOrderDetailsRequest extends RequestBase {
  public FilterOnlyPendingPO: boolean;
  public StartDate: string;
  public EndDate: string;
}

export class SaveStockInwardTransactionRequest extends RequestBase {
  public StockInwardInfo: StockInwardTransactionList;
  public StockInwardItemDetails: StockInwardTransactionItemDetail[];
  public StockInwardProjectDetails: StockInwardTransactionProjectDetail[];

}

export class SaveStockOutwardTransactionRequest extends RequestBase {
  public StockInwardInfo: StockOutwardTransactionInfo;
  public StockOutwardDetail: StockOutwardTransactionItemDetail[];
}

export class SaveStockTransferRequest extends RequestBase {
  public ResultInfo: StockTransferDetail;
  public Stage: string;
}

export class ItemsToBePurchasedGetAllRequest extends RequestBase {

}

export class SaveColorRequest extends RequestBase {
  public Result: MasterColor;
}

export class SaveComponentFieldsRequest extends RequestBase {
  public Result: MasterComponentFields;
}

export class SaveStockReturnTransactionRequest extends RequestBase {
  public ResultList: StockReturnTransactionInfo;
}

export class ReportTestRequest extends RequestBase {
  public ReportTransanctionID: string;
}

export class ReportRequest extends RequestBase {

}

export class GetReportGuikeyByParametersRequest extends RequestBase {
  public SelectedReport: ReportsInfo;
  public DateFrom: string;
  public DateTo: string;
  public ParameterDataList: string;
}

export class MasterData_RoleMenu_GetAllRequest extends RequestBase {

}

export class ProjectGetAllByCorpIDSiteIDRequest extends RequestBase {
  public StatusCode: number;
  public Options: number;
  public FromDT: Date;
  public ToDT: Date;
  public DepartmentID: number;
}

export class StockGetAllByCorpIDSiteIDRequest extends RequestBase {
  public FromDate: string;
  public ToDate: string;
}

export class ProjectProcessFlowDetailSaveRequest extends RequestBase {
  public ProjectID: number;
  public ProjectProcessID: number;
  public StatusCode: number;
  public ProcessFlowTransactions: ProcessFlowTransactionDetailsInfo[];
}

export class PurchaseOrderSaveRequest extends RequestBase {
  public PurchaseOrderID: number
  public PurchaseOrderNumber: number;
  public SupplierID: number;
  public PurchaseOrderDate: string;
  public ExpectedDeliveryDate: string;
  public PurchaseOrderValue: number;
  public StatusCode: number;
  public ItemDetails: PurchaseItemOrderInfoExtn[];
  public ProjectItemDetails: PurchaseItemOrderInfoExtn[];
}

export class WorkOrderSaveRequest extends RequestBase {
  public ProjectID: number;
  public ProjectProcessID: number;
  public workOrderList: ProjectWorkOrderByDepartmentIDResult[];
}


export class WorkOrderGetAllByProjectProcessIDRequest extends RequestBase {
  public ProjectID: number
  public ProjectProcessID: number;
}

export class PurchaseOrderStatusUpdateRequest extends RequestBase {
  public PurchaseOrderID: number;
  public StatusCode: number;
  public Stage: string;
}

export class PurchaseOrderDetailRequest extends RequestBase {
  public PurchaseOrderID: number;

}

export class PurchaseRequestDetailRequest extends RequestBase {
  public PurchaseRequestID: number;

}

export class QuotationStatusUpdateRequest extends RequestBase {
  public QuotationID: number;
  public StatusCode: number;
  public ActionType: string;
}

export class QuotationDetailsGetBySiteIDRequest extends RequestBase {
  public StartDate: string;
  public EndDate: string;
  public StatusCode: number;
  public TypeID: number;
}

export class QuotationSaveRequest extends RequestBase {
  public QuotationID: number;
  public QuotationNumber: string;
  public SupplierID: number;
  public QuotationDate: string;
  public ExpectedResponseDate: string;
  public FilePath: string;
  public ItemDetails: PurchaseItemOrderInfoExtn[];
  public StatusCode: number;
}

export class QuotationCreateRequest extends RequestBase {
  //public QuotationNumber:number;
  public SupplierList: string;
  public QuotationDate: string;
  public ExpectedResponseDate: string;
  public ItemDetails: QuotationCreateItemDetails[];
}

export class QuotationUpdateRequest extends RequestBase {
  public QuotationID: number;
  public SupplierID: number;
  public QuotationDate: string;
  public ExpectedResponseDate: string;
  public QuotationReceivedDate: string;
  public StatusCode: number;
  public ItemDetails: QuotationCreateItemDetails[];
}

export class QuotationDetailGetByQuoteIDRequest extends RequestBase {
  public QuotationID: number;
}

export class StockPriceGetByItemIDRequest extends RequestBase {
  public ItemID: number;
  public Quantity: number;
}

export class SaveStockInwardReplaceTransactionRequest extends RequestBase {
  public GRNID: number;
  public StatusCode: number;
  public ReplaceDate: string;
  public StockReplaceItemDetails: StockReplaceTransactionItemDetail[];
}

export class SaveYarnColorMaterialRequest extends RequestBase {
  public ItemName: string;
  public ColorName: string;
  public ItemID: number;
}

export class UpdateStockInwardTransactionRequest extends RequestBase {
  public StockInwardTransactionID: number;
  public StatusCode: number;
}

export class DeleteStockInwardTransactionRequest extends RequestBase {
  public StockReplaceTransactionDetailID: number;
  public StatusCode: number;
}

export class PrepareToSendMailRequest extends RequestBase {
  public FilePath: string;
  //public int ParticipantID { get; set; }
}

export class SaveShiftRequest extends RequestBase {
  public Result: Shift;
  public ID: number;
}

export class SaveFixedShiftRequest extends RequestBase {
  public Result: Shiftmanagement;
  public ID: number;
}

export class ShiftManagementIDRequest extends RequestBase {
  public GroupID: number;
  public TypeID: number;
  public DepartmentID: number;
  public DesignationID: number;
  public CategoryID: number;
  public FromDate: string;
  public ToDate: string;
}

export class SaveEmployeeShiftSchedule extends RequestBase {
  public FromDate: string;
  public ToDate: string;
  public WOffDate: string;
  public ShiftDetailList: DailyEmployeeShift[];
  public WeekOffList: WeeklyEmployeeOff[];
  public ShiftType: string;
}

export class StockForceUpdateRequest {
  public ItemList: UpdateStockMaster[];
  public StockDate: string;
}

export class BulkEmployeeUpdateRequest {
  public EmpList: Employee[];
}

export class DailyAttendanceGetBySiteIDRequest extends RequestBase {
  public GroupID: number;
  public TypeID: number;
  public DepartmentID: number;
  public DesignationID: number;
  public CategoryID: number;
  public AttDate: string;
}

export class SaveDailyAttendanceRequest extends RequestBase {
  public Result: DailyAttendance[];

}
