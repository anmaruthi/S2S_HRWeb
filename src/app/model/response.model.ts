import {
   UserInfo, RoleInfo, SiteInfo, GenderInfo, Status, MenuInfo,
   MenuGroup, Master_LookUp, Master_LookUp_Domain, ReportingManagerInfo, AppsInfo,
   CorpInfo, Country, State, TimeZone, SettingCatgory,
   BuyerMasterInfo, SupplierMasterInfo, Master_Item_GetByCorpIDResult, Master_ItemType,
   Master_UOM, VendorMasterInfo, Master_UserList, MasterMenuGetbyRoleidresult,MasterLeave,
   MasterRoleFunctionidsGetbyRoleidResult, FieldMasterInfo, FieldTypeInfo, MasterHoliday, MasterHolidayType,
   ItemTypeInfo, EventInfo, MasterTemplateGetallLimitedResult, EmployeeGroup, EmployeeCategory, EmployeeType, EmployeeDepartment, EmployeeDesignation,
   TemplateInfo, FieldInfo, Master_Department_GetByCorpIDResult, SizeInfo,
   FabricInfo, ExpenseInfo, Master_Buyer, ProjectDetails, Master_Size, ProcessInfo, Master_Item, MasterReason, MasterReasonCategory,
   PurchaseOrderInfo, PurchaseItemOrderInfo, Master_Color, Master_Fabric, Master_ComponentFields, StockInfo, StockDetailInfo, StockInwardTransactionInfo, StockOutwardTransactionInfo, ProjectAccessoriesInfo, Master_Department, ProjectInfo, PurchasePendingItemProjectWise, PurchasePendingItem, Master_Color_GetAll_ByCorpIDResult, Master_ComponentFields_GetAll_ByCorpIDResult, StockReturnTransactionInfo,
   Master_Process, Master_Expense, ReportsInfo, DropDownMaster, Project_GetAll_ByCorpIDSiteIDResult, VehicleTypeMaster,
   ProcessFlowInfo, Master_ExecutionMode, PurchaseItemOrderInfoExtn, QuotationDetails, QuotationItemDetails,
   ItemCategoryInfo, ProjectProcessByDepartmentIDResult, ProcessFlowTransactionInfo, TransportInfo,

   ProcessFlowTransactionDetailsInfo, Process_Group, ProjectWorkOrderByDepartmentIDResult, TaxmasterInfo,
   VendorList, Project_OrderType, HouseMasterInfo, AgentMasterInfo, Master_FabricType, ConsigneeMasterInfo,
   Master_Agent, Master_Consignee, Master_ComponentFieldType, Master_Item_PUOM, PurchaseOrderItemProjectDetails, StockInwardTransactionList, StockInwardPurchasePendingList, StockInwardPurchasePendingProjectList, StockInwardTransactionProjectDetail, StockInwardTransactionItemDetail, StockReplaceTransactionItemDetail, DeliveryAddress, BillingAddress, ItemCategoryTaxDetails, FP_Devices, TaxDetItemCat, Item_Supplier_Price, SupplierItemCategory, SupplierItem, StageStatus, Currency, MasterRoleReports, PurchaseItemRequestInfo, PurchaseRequestInfo, StockTransferDetail, CustomerMasterInfo, StockHistoryInfo, StockBalanceInfo, RelaionShipListInfo, OTFlag, Married, QualificationListInfo, Bank, KYCInfo, Employee, PersonalInfo, AddressInfo, EmpFamilyInfo, EmpEducationInfo, Shift, Shiftmanagement, StockOutwardTransactionItemDetail, Master_Item_Price, BankInfo, KYCDocInfo, DailyAttendance,
} from "./shared.model";

export class ResponseBase {
   public SuccessCode: number;
   public ErrorCode: string;
   public ErrorMessage: string;
   public isAppserverDown: string;
   public ConnectionID: string;
}

export class ServiceReponse extends ResponseBase {

   public ResultList: Employee[];

}

export class MasterData_PersonalInfoGetByEmpID extends ResponseBase {

   public EmployeePersonalInfo: PersonalInfo;
   public MasterEmployeeAddressDetailList:AddressInfo[];
   public MasterEmployeeFamilyDetailList:EmpFamilyInfo[];
   public MasterEmployeeEducationDetailList:EmpEducationInfo[];
   public MasterEmployeeBankDetailList:BankInfo[];
   public MasterEmployeeKycDetailList:KYCDocInfo[];

}


export class SaveReponse extends ResponseBase {
   public ID: number;
   public ID0: number; //parent id
   public ID00: number; //grant parent id
}

export class ValidateLoginResponse extends ResponseBase {
   public SessionID: string;
   public UserInfo: UserInfo;
   public UserRoleInfo: RoleInfo[];
   public UserSiteInfo: SiteInfo[];
   public UserAppInfo: AppsInfo[];

}


export class MasterDataGetAllResponse extends ResponseBase {
   public StatusList: Status[];
   public LookUpList: Master_LookUp[];
   public GenderList: GenderInfo[];
   //public ItemList: Master_Item[];
   //public FabricTypeList: Master_FabricType[];
   public CountryList: Country[];
   public StateList: State[];
   public RelationList: RelaionShipListInfo[];
   public TimeZoneList: TimeZone[];
   public AppsList: AppsInfo[];
   public CurrencyList: Currency[];
}


export class Master_UserGetByCorpIDResponse extends ResponseBase {
   public ResultList: UserInfo[];
}

export class MasterData_SaveUser_GetAllResponse extends ResponseBase {
   public GenderList: GenderInfo[];
   public RoleList: RoleInfo[];
   public ReportingManagerList: ReportingManagerInfo[];
   public AppsList: AppsInfo[];
   public SiteList: SiteInfo[];
}

export class MenuGetByRoleIDResponse extends ResponseBase {
   public GroupMenuList: MenuGroup[];
   public FunctionList: MasterRoleFunctionidsGetbyRoleidResult[];
   public ReportsList: MasterRoleReports[];
}

export class MasterLookUpDataGetAllByCorpIDResponse extends ResponseBase {
   public LookupDomainList: Master_LookUp_Domain[];
   public ResultList: Master_LookUp[];
}


export class RoleGetByCorpIDResponse extends ResponseBase {
   public ResultList: RoleInfo[];
}

export class CorporateGetAllResponse extends ResponseBase {
   public ResultList: CorpInfo[];
}

export class CorporateGetByCorpIDResponse extends ResponseBase {
   public ResultList: CorpInfo;
}

export class AgentGetByCorpIDResponse extends ResponseBase {
   public ResultList: AgentMasterInfo[];
}


export class MasterData_RegisterCorp_GetAllResponse extends ResponseBase {
   public CountryList: Country[];
   public StateList: State[];
   public TimeZoneList: TimeZone[];
   //public HouseList: HouseMasterInfo[];
   //public AgentList: AgentMasterInfo[];
}

export class SiteGetAllResponse extends ResponseBase {
   public ResultList: SiteInfo[];
}

export class DeliveryAddressGetAllByCorpIDResponse extends ResponseBase {
   public ResultList: DeliveryAddress[];
}

export class BillingAddressGetAllByCorpIDResponse extends ResponseBase {
   public ResultList: BillingAddress[];
}

export class SettingGetBySiteIDResponse extends ResponseBase {
   public ResultList: SettingCatgory[];
}
export class EmployeeGroupGetAllByCorpIDResponse extends ResponseBase {
   public ResultList: EmployeeGroup[];
   public categoryList: EmployeeCategory[];

}
export class EmployeeCategoryGetAllByCorpIDResponse extends ResponseBase {
   public ResultList: EmployeeCategory[];
   public categoryList: EmployeeCategory[];

}
export class EmployeeTypeGetAllByCorpIDResponse extends ResponseBase {
   public ResultList: EmployeeType[];
   public categoryList: EmployeeCategory[];

}
export class EmployeeDepartmentGetAllByCorpIDResponse extends ResponseBase {
   public ResultList: EmployeeDepartment[];

}
export class EmployeeDesignationGetAllByCorpIDResponse extends ResponseBase {
   public ResultList: EmployeeDesignation[];
   public DepartmentList: EmployeeDepartment[];

}


export class ItemTypeGetAllBycorpIDResponse extends ResponseBase {
   public ResultList: ItemTypeInfo[];
}

export class ItemCategoryGetAllByCorpIDResponse extends ResponseBase {
   public ResultList: ItemTypeInfo[];
   public CategoryList: ItemCategoryInfo[];
}



export class TaxMasterGetAllByCorpIDResponse extends ResponseBase {
   public ResultList: TaxmasterInfo[];

}

export class TransportGetAllByCorpIDResponse extends ResponseBase {
   public ResultList: TransportInfo[];


}
export class VehicleTypeGetAllByCorpIDResponse extends ResponseBase {
   public ResultList: VehicleTypeMaster[];

}

export class FieldMasterGetByCorpIDResponse extends ResponseBase {
   public ResultList: FieldMasterInfo[];
}

export class FieldTypeGetByCorpIDResponse extends ResponseBase {
   public ResultList: FieldTypeInfo[];
}

export class DepartmentGetByCorpIDResponse extends ResponseBase {

   public ResultList: Master_Department_GetByCorpIDResult[];
}

export class ItemCategoryGetByCorpIDResponse extends ResponseBase {
   public ResultList: ItemCategoryInfo[];
}


export class Master_BuyerGetByCorpIDResponse extends ResponseBase {
   public ResultList: BuyerMasterInfo[];
}

export class Master_ConsigneeGetByCorpIDResponse extends ResponseBase {
   public ResultList: ConsigneeMasterInfo[];
}

export class Master_AgentGetByCorpIDResponse extends ResponseBase {
   public ResultList: AgentMasterInfo[];
}

export class Master_HouseGetByCorpIDResponse extends ResponseBase {
   public ResultList: HouseMasterInfo[];
}

export class Master_SupplierGetByCorpIDResponse extends ResponseBase {
   public ResultList: SupplierMasterInfo[];
   public SupplierTypeList: Master_LookUp[];

}

export class Master_CustomerGetByCorpIDResponse extends ResponseBase {
   public ResultList: CustomerMasterInfo[];

}

export class MasterReasonGetAllByCorpIDResponse extends ResponseBase {
   public ResultList: MasterReason[];
   public ReasonCategoryList: MasterReasonCategory[];

}
export class MasterLeaveGetAllByCorpIDResponse extends ResponseBase {
   public ResultList: MasterLeave[];
   

}
export class MasterHolidayGetAllByCorpIDResponse extends ResponseBase {
   public ResultList: MasterHoliday[];
   public HolidayTypeList: MasterHolidayType[];

}

export class ItemGetByCorpIDResponse extends ResponseBase {
   public ResultList: Master_Item[];
   public PurchaseUOMList: Master_Item_PUOM[];
   public FieldList: FieldMasterInfo[];
   public ItemPriceList: Master_Item_Price[];
}

export class MasterData_SaveItem_GetAllResponse extends ResponseBase {
   public ItemTypeList: Master_ItemType[];
   public UOMList: Master_UOM[];
}

export class Master_VendorGetByCorpIDResponse extends ResponseBase {
   public ResultList: VendorMasterInfo[];
}

export class MasterData_SaveDepartment_GetAllResponse extends ResponseBase {
   public UserList: Master_UserList[];
}

export class MasterData_RoleMenu_GetAllResponse extends ResponseBase {
   public MenuList: MasterMenuGetbyRoleidresult[];
   public FunctionList: MasterRoleFunctionidsGetbyRoleidResult[];
   public ReportsList: MasterRoleReports[];
}

export class EventConfigurationGetAllByCorpIDResponse extends ResponseBase {
   public EventConfigurationList: EventInfo[];
   public TemplatesList: MasterTemplateGetallLimitedResult[];
}


export class MasterSMSEmailTemplateGetAllResponse extends ResponseBase {
   public ResultList: TemplateInfo[];
}

export class MasterSMSEmailTemplateMastersDataGetAllResponse extends ResponseBase {
   //public TemplateInfo: TemplateInfo;
   public FieldList: FieldInfo[];
   public TemplateTypeList: TemplateInfo[];
}

export class SizeGetAllByCorpIDResponse extends ResponseBase {
   public ResultList: SizeInfo[];
}

export class FabricGetAllByCorpIDResponse extends ResponseBase {
   public ResultList: FabricInfo[];
}

export class ExpenseGetAllByCorpIDResponse extends ResponseBase {
   public ResultList: ExpenseInfo[];
}

export class ProcessGetAllByCorpIDResponse extends ResponseBase {
   public ResultList: ProcessInfo[];
   public UOMResult: Master_UOM[];
   public ItemResult: Master_Item[];
}

export class ProjectSave_MasterData_GetAllByCorpIDSiteIDResponse extends ResponseBase {
   public AgentList: Master_Agent[];
   public BuyerList: Master_Buyer[];
   public ConsigneeList: Master_Consignee[];
   public SizeList: Master_Size[];
   public ColorList: Master_Color[];
   public FabricList: Master_Fabric[];
   public LookupList: Master_LookUp[];
   public ComponentFieldsList: Master_ComponentFields[];
   public ItemList: Master_Item[];
   public ProcessList: Master_Process[];
   public ExpenseList: Master_Expense[];
   public FabricItemList: Master_Item[];
   public OrderTypeList: Project_OrderType[];
   public YarnItemList: Master_Item[];
   public ItemCategoryList: ItemCategoryInfo[];
   public ItemTypeList: ItemTypeInfo[];
   public UOMList: Master_UOM[];
   public DepartmentList: Master_Department[];
   public ExecutionModeList: Master_ExecutionMode[]

   public MAX_PROJECT_DOCUMENT_UPLOAD: number;
   public MAX_PROJECT_DOCUMENT_SIZE: number;
}

export class ProjectGetByProjectIDResponse extends ResponseBase {
   public ResultList: ProjectDetails;
}

export class PurchaseOrderDetailsResponse extends ResponseBase {
   public PurchaseOrder: PurchaseOrderInfo[];
   public ItemList: PurchaseItemOrderInfoExtn[];
   public ItemDetails: PurchaseOrderItemProjectDetails[];
}

export class PurchaseOrderListResponse extends ResponseBase {
   public PurchaseOrderList: PurchaseOrderInfo[];
}

export class StockGetBySiteIDResponse extends ResponseBase {
   public ResultList: StockInfo[];
}

export class StockDetailGetByStockIDResponse extends ResponseBase {
   public ResultList: StockHistoryInfo[];
   public BalanceInfo: StockBalanceInfo[];
}

export class MasterData_SaveStockInwardTransaction_GetAllResponse extends ResponseBase {
   public PurchaseOrderList: PurchaseOrderInfo[];
   public SupplierList: SupplierMasterInfo[];
}

export class StockInwardTransactionGetBySiteIDResponse extends ResponseBase {
   public ResultList: StockInwardTransactionList[];
}

export class StockInwardReplaceTransactionGetAllBySiteIDResponse extends ResponseBase {
   public ResultList: StockReplaceTransactionItemDetail[];
}

export class PurchaseOrderItemDetailsGetByPurchaseOrderIDRespone extends ResponseBase {
   public ResultList: Master_Item[];
}


export class MasterData_SaveStockOutwardTransaction_GetAllResponse extends ResponseBase {
   public MaterialList: Master_Item[];
   public DepartmentList: Master_Department[];
   public UserList: Master_UserList[];
   public CustomerList: CustomerMasterInfo[];
}

export class MasterData_SaveStockRequest_GetAllResponse extends ResponseBase {
   public ProjectList: ProjectInfo[];
}

export class StockOutwardTransactionGetBySiteIDResponse extends ResponseBase {
   public ResultList: StockOutwardTransactionInfo[];
}

export class StockOutwardTransactionGetByTransactionIDResponse extends ResponseBase {
   public ResultList: StockOutwardTransactionItemDetail[];
}

export class StockRequestGetBySiteIDResponse extends ResponseBase {
   public ResultList: StockOutwardTransactionInfo[];
}

export class StockTransferGetBySiteIDResponse extends ResponseBase {
   public ResultList: StockTransferDetail[];
}


export class ProjectAccessoriesDetailsGetByProjectIDRespone extends ResponseBase {
   public ResultList: ProjectAccessoriesInfo[];
}

export class ItemsToBePurchasedGetAllResponse extends ResponseBase {
   public PendigItems: PurchasePendingItem[];
   public PendigItemsProjectWise: PurchasePendingItemProjectWise[];
   public PurchaseUOMList: Master_Item_PUOM[];
}


export class ColorGetByCorpIDResponse extends ResponseBase {
   public ResultList: Master_Color_GetAll_ByCorpIDResult[];
}

export class ComponentFieldsGetByCorpIDResponse extends ResponseBase {
   public ResultList: Master_ComponentFields_GetAll_ByCorpIDResult[];
   public ComponentTypeList: Master_LookUp[];
   public ComponentFieldTypeList: Master_ComponentFieldType[];
}

export class MasterData_SaveStockReturnTransaction_GetAllResponse extends ResponseBase {
   public ProjectList: ProjectInfo[];
   public DepartmentList: Master_Department[];
   public UserList: Master_UserList[];
}

export class StockReturnTransactionGetBySiteIDResponse extends ResponseBase {
   public ResultList: StockReturnTransactionInfo[];
}

export class Project_GetAll_ByCorpIDSiteIDResponse extends ResponseBase {
   public ProjectList: Project_GetAll_ByCorpIDSiteIDResult[];
}

export class Process_GetAll_ByDepartmentIDResponse extends ResponseBase {
   public ProcessList: ProjectProcessByDepartmentIDResult[];
   public ProjectList: Process_Group[];
}

export class WorkOrder_GetAll_ByDepartmentIDResponse extends ResponseBase {
   public WorkOrderList: ProjectWorkOrderByDepartmentIDResult[];
   public ProjectList: Process_Group[];
}

export class ReportsGetByCorpIDResponse extends ResponseBase {
   public ReportList: ReportsInfo[];
   public DDList: DropDownMaster[];
}

export class GetReportGuikeyByParametersResponse extends ResponseBase {
   public ReportTransanctionID: string;
}

export class MasterData_ProcessFlowSave_GetAllResponse extends ResponseBase {
   public ProcessList: ProcessInfo[];
   public DepartmentList: Master_Department[];
   public ExecutionModeList: Master_ExecutionMode[]
}

export class MasterData_WorkOrder_GetAllResponse extends ResponseBase {
   public ProcessList: ProcessInfo[];
   public DepartmentList: Master_Department[];
   public ExecutionModeList: Master_ExecutionMode[]
   public VendorList: VendorList[];
}

export class WorkOrderGetAllByProjectProcessIDResponse extends ResponseBase {
   public WorkOrderDetailList: ProjectWorkOrderByDepartmentIDResult[];
}


export class ProjectProcessFlowDetailGetAllByProjectIDResponse extends ResponseBase {
   public ResultList: ProcessFlowInfo[];
}

export class ProcessFlowDetailsGetAllByProjectProcessIDResponse extends ResponseBase {
   public ProcessFlowList: ProcessFlowTransactionInfo[];
   public ProcessFlowListTransactions: ProcessFlowTransactionDetailsInfo[];
   public ProjectColorList: Master_Color[];
   public ProjectSizeList: Master_Size[];
}

export class PurchaseOrderSaveResponse extends ResponseBase {
   public PurchaseOrderID: number;
   public PurchaseOrderNumber: number;
}

export class WorkOrderSaveResponse extends ResponseBase {
   public WorkOrderID: number;
   public WorkOrderNumber: number;
}

export class QuotationDetailsGetBySiteIDResponse extends ResponseBase {
   public ResultList: QuotationDetails[];
   //public ItemDetails: PurchaseItemOrderInfo[];
}

export class QuotationSaveResponse extends ResponseBase {
   public QuotationID: number;
   public QuotationNumber: number;
}

export class QuotationDetailsGetByQuotationIDResponse extends ResponseBase {
   public ResultList: QuotationItemDetails[];
}


export class StockAvailableQuantityGetByItemIDResponse extends ResponseBase {
   public Quantity: number;
}

export class StockPriceGetByItemIDResponseResponse extends ResponseBase {
   public Rate: number;
   public TotalCost: number;
}


export class StockInwardTransactionPendingListGetAllResponse extends ResponseBase {
   public ResultList: StockInwardPurchasePendingList[];
   public ProjectDetail: StockInwardPurchasePendingProjectList[];
   public PurchaseOrdersList: PurchaseOrderInfo[];
   public SupplierList: SupplierMasterInfo[];
}

export class StockInwardTransactionGetByTransactionIDResponse extends ResponseBase {
   public ResultList: StockInwardTransactionList[];
   public ItemDetail: StockInwardTransactionItemDetail[];
   public ProjectDetail: StockInwardTransactionProjectDetail[];
   public PurchaseOrdersList: PurchaseOrderInfo[];
}

export class ItemCategoryTaxDetailsResponse  extends ResponseBase
{
  public ResultList: ItemCategoryTaxDetails[];
}

export class FPDeviceGetAllBySiteIDResponse   extends ResponseBase
{
  public ResultList: FP_Devices[];
}

export class MasterDataMaterialGetAllResponse extends ResponseBase {
   public ItemCategoryList: ItemCategoryInfo[];
   public ItemTypeList: ItemTypeInfo[];
   public UOMList: Master_UOM[];
   public SupplierList: SupplierMasterInfo[];
}

export class ItemTaxDetailGetByItemCategoryIDResponse   extends ResponseBase
{
  public ResultList: TaxDetItemCat[];
  public SupplierList: Item_Supplier_Price[];
}


export class SupplierItemGetByCorpIDResponse   extends ResponseBase
{
  public ItemCategoryList: SupplierItemCategory[];
  public ItemList: SupplierItem[];
}

export class MasterDataForPurchaseOrderGetByCorpIDResponse   extends ResponseBase{

   public SupplierList: SupplierMasterInfo[];
   public LookupList: Master_LookUp[];
   public DeliveryAddressList: DeliveryAddress[];
   public BiilingAddressList: BillingAddress[];
   public MaterialList: Master_Item[];
   public FieldList: FieldMasterInfo[];
   public StageStatusList: StageStatus[];
   public SupplierItemList: SupplierItem[];   
   public TaxDetailList: ItemCategoryTaxDetails[];
   public UOMList: Master_UOM[];
}

export class MasterDataEmployeeGetAllResponse extends ResponseBase {
   public OtFlagList: OTFlag[];
   public StatusList: Status[];
   public MarriedList: Married[];
   public RelationshipList: RelaionShipListInfo[];
   public QualificationList: QualificationListInfo[];
   public BankList: Bank[];
   public KycList: KYCInfo[];
   public ReasonList: MasterReason[];
   public EmpGroupList: EmployeeGroup[];
   public EmpCategoryList: EmployeeCategory[];
   public EmpTypeList: EmployeeType[];
   public EmpDepartmentList: EmployeeDepartment[];
   public EmpDesignationList: EmployeeDesignation[];
   public ShiftList: Shift[];
}

export class PurchaseOrderListGetBySiteIDResponse extends ResponseBase {
   public ResultList: PurchaseOrderInfo[];
}

export class EmpDesignationListGetBySiteIDResponse extends ResponseBase {
   public ResultList: EmployeeDesignation[];
}

export class PurchaseOrderDetailGetByPurchaseOrderIDResponse extends ResponseBase {
   public ResultList: PurchaseItemOrderInfo[];
}

export class PurchaseRequestListGetBySiteIDResponse   extends ResponseBase
{
  public ResultList: PurchaseRequestInfo[];
}


export class PurchaseRequestDetailGetByPurchaseRequestIDResponse   extends ResponseBase
{
  public ResultList: PurchaseItemRequestInfo[];
}

export class PurchasePendingItemGetByCorpIDResponse   extends ResponseBase
{
  public ResultList: PurchasePendingItem[];
  public TotalStockList: StockInfo[];
  public StockList: StockInfo[];
}

export class ShiftGetAllByCorpIDResponse extends ResponseBase {
   public ResultList: Shift[];
   public categoryList: Shift[];

}

export class ShiftManagementResponse extends ResponseBase {
  
   public ResultList: Shiftmanagement[];
   public ShiftMasterList: Shift[];
}

export class DailyAttendanceGetBySiteIDResponse extends ResponseBase {
  
   public ResultList: DailyAttendance[];
}

