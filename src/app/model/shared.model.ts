import { DateAdapter, MatDateFormats } from '@angular/material/core';
import { DateSelectionModelChange } from "@angular/material/datepicker";
import { Calendar } from 'primeng/calendar';
import { StockReturnTransactionGetBySiteIDResponse } from './response.model';
import { NumberValueAccessor } from '@angular/forms';

export class UserInfo {
    public UserID: number;
    public CorpID: number;
    public Mobile: string;
    public UserName: string;
    public FirstName: string;
    public LastName: string;
    public Password: string;
    public EmployeeID: string;
    public Email: string;
    public StatusCode: number;
    public StatusMessage: string;
    public Gender: string;
    public ModifiedDtTm: string;
    public ModifiedBy: number;
    public Description: string;
    public PrimarySiteID:number;
    public DepartmentID:number;
    public ConfirmPassword: string;
    public RoleList:string;
    public SiteList:string;
    public ManagerUserID:number;
    public AppIDs: string;

    public CorpName: string;
    public CorpCode: string;
    public GenderCode: string;
}

export class Status {
    public StatusCode: number;
    public StatusMessage: string;
    public StatusLabel: string;
    public Category: string;
}

export class Currency {
    public CurrencyID: number;
    public CurrencyCode: string;
    public CurrencyName: string;
    public CurrencySymbol: string;
}

export class MasterReason{
    public  ReasonID: number;
    public  Reason: string;
    public  ReasonDescription: string;
    public  CorpID:number;
    public  ReasonCategoryID: number;
    public  ReasonCategory: string; 
    public  StatusCode: number;
    public  StatusMessage: string;
}

export class MasterReasonCategory
{
    public  CorpID: number; 
    public  ReasonCategoryID: number; 
    public  ReasonCategory: string;
}


export class Master_LookUp {

    public LookupID: number;
    public CorpID: number;
    public DomainID: number;
    public Description: string;
    public DomainDescription: string;
    public LookupDomain: string;
    public StatusCode:number;
    public SortOrder:number;
    public IsDefault:boolean;
    public IsDefaultText:string;
    public StatusMessage:string;
}

export class Master_LookUp_Domain {
    public DomainID: number;
    public CorpID: number;
    public Description: string;
    public StatusCode:number;
}

export class EmployeeGroup 
{
    public  GroupID: number;
    public  GroupCode: string;
    public  CorpID: number;
    public  GroupName: string ;
    public  StatusCode: number;
    public  StatusMessage: string ;
}

export class EmployeeCategory
{
    public  CategoryID:number;
    public  CategoryCode:string;
    public  CorpID:number;
    public  CategoryName: string ;
    public  StatusCode: number;
    public  StatusMessage: string ;
}

export class EmployeeType 
{
    public TypeID:number;
    public  TypeCode: string ;
    public  CorpID:number;
    public TypeName: string ;
    public  StatusCode: number ;
    public  StatusMessage: string ;
}

export class EmployeeDepartment
{
    public  DepartmentID: number; 
    public  DepartmentShortName: string ;
    public  CorpID:number;
    public  DepartmentName: string ;
    public  StatusCode: number;
    public  StatusMessage: string ;
}

export class EmployeeDesignation
{
    public  DesignationID:number;
    public  DesignationShortName: string ;
    public  CorpID: number;
    public  DesignationName: string ;
    public  DepartmentID: number;
    public  StatusCode: number ;
    public  StatusMessage: string ;
    public  DepartmentName: string ;
}




export class UserRoleInfo {
    public UserID:number;
    public RoleID: number;
    public RoleCode: string;
    public RoleName: string;
    public StatusCode: number;
    public ReportingRoleID: number;
    public HierarchyID: number;
    public CorpID:number;

}

export class RoleInfo {
    public RoleID: number;
    public RoleCode: string;
    public RoleName: string;
    public StatusCode: number;
    public ReportingRoleID: number;
    public HierarchyID: number;
    public CorpID:number
    public CorpCode: string;
    public CorpName: string;
    public StatusMessage: string;
    public CreatedBy: number;
    public CreatedDtTm: string;
    public ModifiedDtTm: string;
    public ModifiedBy: number;

}

export class Master_Department {
    public DepartmentID: number;
    public CorpID:number
    public DepartmentName: string;
    public StatusCode: number;
    public UserList: string;

}

export class Master_UserList{
    public UserID: number;
    public UserName: string;
    public DepartmentID:number;
}

export class Master_Department_GetByCorpIDResult {
    public DepartmentID: number;
    public CorpID:number
    public DepartmentName: string;
    public StatusCode: number;
    public StatusMessage: string;
    public UserList: string;

}

export class Master_ItemType {
    public ItemTypeID: number;
    public ItemTypeName: string;
}

export class Master_ExecutionMode {
    public ExecutionModeID: number;
    public ExecutionModeName: string;
}


export class Master_UOM {
    public UOMID: number;
    public UOM: string;
    public StatusCode: number;
    public StatusMessage: string;
}

export class Master_Item_Price {
    public ItemID: number;
    public ItemPrice: number;
    public BulkItemPrice: number;
    public EffectiveDate: string;
}

export class Master_Item {
    public ItemID: number;
    public CorpID:number;
    public ItemCode: string;
    public ItemName: string;
    public ItemDescription: string;
    public ItemBarCode: string;
    public ItemSize: string;
    public ItemCategoryName: string;
    public ItemTypeName: string;
    public ItemField1: string;
    public ItemField2: string;
    public ItemField3: string;
    public ItemField4: string;
    public ItemField5: string;
    public ReservedQuantity: number;
    public ItemTypeID: number;
    public ItemCategoryID: number;
    public ItemTax: number;
    public ItemTaxAmount: number;
    public ItemPrice: number;
    public BulkItemPrice: number;
    public UOMID:number;
    public UOM:string;
    public CGST:number;
    public SGST:number;
    public IGST:number;
    public StatusCode: number;
    public StatusMessage: string;
    public EffectiveDate: string;

    public PurchaseUOMDetails:Master_Item_PUOM[];
    public MaterialPriceHistory: Master_Item_Price[];

    //Stock Detail
    public StockQuantity: number;
    public StockDate: string;
}


export class Master_Item_PUOM {
    public ItemPurchaseDetID: number;
    public ItemID: number;
    public PUOMID: number;
    public BaseConversionRate: number;
    public StatusCode: number;

    public isDuplicate: boolean;
    public UOM: string;
}

export class Item_Supplier_Price
{
    public DetID:number;
    public ItemID: number;
    public SupplierID: number;
    public ItemPrice: number;
    public SupplierName: string;
}

export class FabricProgramItemMaster {
    public ItemID: number;
    public ItemName: string;
    public ItemTypeID: number;
    public ItemTypeName: string;
    public YarnPercentage:number;
    public YarnColorPercentage:number;
}

export class Master_Item_GetByCorpIDResult {
    public ItemID: number;
    public CorpID:number;
    public ItemName: string;
    public ItemTypeID: number;
    public ItemTypeName: string;
    public UOMID:number;
    public UOM:string;
    public MOQ: number;
    public PriceMOQ: number;
    public StatusCode: number;
    public StatusMessage: string;
    public ItemColor: string;
    public ItemRefCode: string;
    public AcceptableQuantity: number;
    public GST: number;
}


export class GenderInfo {
    public GenderCode: string;
    public Gender: string;
}


export class MenuGroup{
    public AppID:number;
    public GroupName:string;
    public DisplayName: string;
    public IsExpanded:boolean;
    public CanExpand:boolean;
    public MenuList:MenuInfo[];
}

export class MenuInfo {
    public MenuID: number;
    public MenuName: string;
    public RouterLink: string;
    public IconName: string;
    public MenuOrder: number;
    public GroupName:string;
    public StatusCode: number;
    public DeviceType: string;
    public IsTagged: string;
    public DisplayName: string;
    public IsSelected:boolean;
    public HasValidationError:boolean;
    public ValidationErrorText:string;
    public AvailableFunction:FunctionInfo[];
    public AssignedFunction:FunctionInfo[];
}

export class FunctionInfo {
    public FunctionID: number;
    public FunctionName: string;
    public MenuID: number;
    public IsTagged: string;
    public DisplayName: string;
    public DisplayOrder: number;
    public Type: string;
}


export class ErrorInfo {
    public LangCode: string;
    public ScreenName : string;
    public ErrorCode: string;
    public ErrorDescription: string;
}

export class CorpInfo{
    CorpID:number;
    CorpName:string;
    CorpCode:string;
    ContactPerson:string;
    MobileNumber:string;
    Email:string;
    Address1:string;
    Address2:string;
    City:string;
    StateID:number;
    CountryCode:string
    Pincode:string;
    RegionalTimeZone:string;
    StatusCode:number;
    StatusMessage: string;

    public AppIDs: string;
}

export class SiteInfo {
    public SiteID: number;
    public CorpID: number;
    public CorpName:string;
    public SiteCode: string;
    public SiteName: string;
    public ContactPerson:string;
    public MobileNumber:string;
    public Address1: string;
    public Address2: string;
    public City: string;
    public StateID: number;
    public CountryCode:string
    public Pincode: string;
    public Email: string;
    public StatusCode: number;
    public StatusMessage: string;
    public RegionalTimeZone:string;
}


export class Country {
    CountryCode: string;
    CountryName: string;
    CurrencyCode: string;
    MessageFormatDefinition: any;
}

export class State {
    StateID: number;
    StateCode: string;
    StateName: string;
    CountryCode: string;
    TIN: string;
}


export class Setting {
    public SettingID:number;
    public CategoryName:string;
    public SettingName:string;
    public DisplayName:string;
    public OrderSequence:number;
    public Datatype:string;
    public MinValue:number;
    public MaxValue:number;
    public SettingsValue:string;
    public ValueRange:string;
    public Description:string;
    public IsMandatory:boolean;
    public IsVisible:boolean;
    public RangeList:string[]
    public IsSelected:boolean;
    public HasError:boolean
    public ErrorMessage:string;
}

export class SettingCatgory{
    public CategoryName:string;
    public SettingList:Setting[];
}

export class SettingDetail{
    public SettingID:number;
    public Datatype:string;
    public SettingsValue:string;
}

export class ReportingManagerInfo {
    public UserID: number;
    public FullName: string;
    public RoleID: number;
    public HierarchyID: number;
    public ReportingRoleID:number;
}

export class AppsInfo {
    public AppID: number;
    public AppCode: string;
    public AppName: string;
    public Description:string;
    public StatusCode: number;
    public Icon: string;
    public DefaultPage: string;
    public Color: string;
}

export class TimeZone {
      Id: string;
      DisplayName: string;
}


export class HouseMasterInfo {
    public HouseID: number;
    public CorpID: number;
    public HouseName: string;
    public Address1: string;
    public Address2: string;
    public City: string;
    public StateID: number;
    public CountryCode: string;
    public Pincode: string;
    public Lat: number;
    public Lng: number;
    public CurrencyCode: string;
    public SPOC: string;
    public MobileNumber: string;
    public Email: string;
    public StatusCode:number;
    public ModifiedDtTm:string;
    public ModifiedBy: number;
    public StatusMessage: string;

    public AgentID:number;
    public AgentName:string;
}


export class ConsigneeMasterInfo {
    public ConsigneeID: number;
    public CorpID: number;
    public ConsigneeName: string;
    public Address1: string;
    public Address2: string;
    public City: string;
    public StateID: number;
    public CountryCode: string;
    public Pincode: string;
    public Lat: number;
    public Lng: number;
    public CurrencyCode: string;
    public SPOC: string;
    public MobileNumber: string;
    public Email: string;
    public StatusCode:number;
    public ModifiedDtTm:string;
    public ModifiedBy: number;
    public StatusMessage: string;

    public BuyerID:number;
    public BuyerName:string;

    public AgentID:number;
    public AgentName:string;
}

export class BuyerMasterInfo {
    public BuyerID: number;
    public CorpID: number;
    public BuyerName: string;
    public Address1: string;
    public Address2: string;
    public City: string;
    public StateID: number;
    public CountryCode: string;
    public Pincode: string;
    public Lat: number;
    public Lng: number;
    public CurrencyCode: string;
    public SPOC: string;
    public MobileNumber: string;
    public Email: string;
    public StatusCode:number;
    public ModifiedDtTm:string;
    public ModifiedBy: number;
    public StatusMessage: string;

    public AgentID:number;
    public AgentName:string;
}

export class AgentMasterInfo {
    public AgentID: number;
    public CorpID: number;
    public AgentName: string;
    public Address1: string;
    public Address2: string;
    public City: string;
    public StateID: number;
    public CountryCode: string;
    public Pincode: string;
    public Lat: number;
    public Lng: number;
    public CurrencyCode: string;
    public SPOC: string;
    public MobileNumber: string;
    public Email: string;
    public StatusCode:number;
    public ModifiedDtTm:string;
    public ModifiedBy: number;
    public StatusMessage: string;
}

export class SupplierMasterInfo {
    public SupplierID: number;
    public SupplierTypeID: number;
    public SupplierType: string;
    public SupplierIDString: string;
    public CorpID: number;
    public SupplierName: string;
    public Address1: string;
    public Address2: string;
    public City: string;
    public StateID: number;
    public CountryCode: string;
    public Pincode: string;
    public Lat: number;
    public Lng: number;
    public CurrencyCode: string;
    public ContactPerson: string;
    public MobileNumber: string;
    public Email: string;
    public PAN: string;
    public TAN: string;
    public GSTIN: string;
    public StatusCode:number;
    public ModifiedDtTm:string;
    public ModifiedBy: number;
    public StatusMessage: string;
    public StateName: string;
    public CountryName: string;
}

export class CustomerMasterInfo {
    public CustomerID: number;
    public CustomerTypeID: number;
    public CustomerType: string;
    public CustomerIDString: string;
    public CorpID: number;
    public CustomerName: string;
    public Address1: string;
    public Address2: string;
    public City: string;
    public StateID: number;
    public CountryCode: string;
    public Pincode: string;
    public Lat: number;
    public Lng: number;
    public CurrencyCode: string;
    public ContactPerson: string;
    public MobileNumber: string;
    public Email: string;
    public PAN: string;
    public TAN: string;
    public GSTIN: string;
    public StatusCode: number;
    public ModifiedDtTm: string;
    public ModifiedBy: number;
    public StatusMessage: string;
    public StateName: string;
    public CountryName: string;
}

export class VendorList {
    public VendorID: number;
    public VendorName: string;
    public StatusCode: number;
}

export class VendorMasterInfo {
    public VendorID: number;
    public CorpID: number;
    public VendorName: string;
    public Address1: string;
    public Address2: string;
    public City: string;
    public StateID: number;
    public CountryCode: string;
    public Pincode: string;
    public Lat: number;
    public Lng: number;
    public CurrencyCode: string;
    public SPOC: string;
    public MobileNumber: string;
    public Email: string;
    public PAN: string;
    public TAN: string;
    public GSTIN: string;
    public StatusCode:number;
    public ModifiedDtTm:string;
    public ModifiedBy: number;
    public StatusMessage: string;
}

export class MasterModuleGetbyUseridresult {
    public Moduleid: number;
    public Modulename: string;
    public Description: string;
    public Icon: string;
    public Defaultpage: string;
    public Color: string;
}

export class MasterMenuGetbyRoleidresult {
    public MenuID: number;
    public MenuName: string;
    public RouterLink: string;
    public IconName: string;
    public MenuOrder: number;
    public StatusCode: number;
    public IsTagged: string;
    public IsSelected:boolean;
    public DeviceType:string;
    public ModuleID: number;
    public HasValidationError:boolean;
    public AvailableFunction:MasterRoleFunctionidsGetbyRoleidResult[];
    public AssignedFunction:MasterRoleFunctionidsGetbyRoleidResult[];

}

export class MasterRoleFunctionidsGetbyRoleidResult {
    public FunctionID: number;
    public MenuID: number;
    public FunctionName: string;
    public IsTagged: string;
    public Type: string;
}

export class MasterTabView
{
    public TabID: number;
    public TabName: string;
    public TabTitle: string;
}

export class MasterRoleReports
{
    public ReportID: number ;
    public ReportName: string ;
    public FieldDetail: string ;
    public IsDetail: number ;
    public StatusCode: number ;
    public CorpID: number ;
    public DeviceType: string ;
    public SortOrder: number ;
    public IsDownloadable: number ;
    public ModuleName: string ;
    public AppID: number ;
    public AppName: string ;
    public IsTagged: string ;
    public IsSelected:boolean;
}


export class MasterRoleGetallbyLobidResult {
    public RoleID: number;
    public RoleName: string;
    public StatusCode: number;
    public LobID: number;
    public LobName: number;
    public LastModifiedBy: number;
    public CreatedDT: string;
    public ModifiedDT: string;
    public StatusName: string;
    public ModuleIDs: string;
    public MenuIDs: string;
    public FunctionIDs: string;
}

export class FieldMasterInfo
{
    public CorpID: number;
    public FieldID: number;
    public FieldTypeID: number;
    public FieldName: string;
    public StatusCode: number;
    public IsMandatory: boolean;
    public DisplayInGrid: boolean;
}

export class ItemTypeInfo {
  public ItemTypeID: number;
  public CorpID: number;
  public ItemTypeName: string;
  public StatusCode: number;
  public StatusMessage: string;
  public CreatedBy: number;
  public CreatedDtTm: string;
  public ModifiedDtTm: string;
  public ModifiedBy: number;

  public ItemCategoryID: number;
  public ItemCategoryName: string;
}


export class TaxmasterInfo {
    public CorpID: number;
    public TaxID: number;  
    public TaxCode: string;  
    public TaxName: string; 
    public ApplyOtherState: boolean;
    public ApplyInternational: boolean; 

    public Description: string;  
    public StatusCode: number;
    public StatusMessage: string;
    
    
}

export class SupplierItemCategory
{
    public ItemCategoryID: number;
    public ItemCategoryName: string;
    public StatusCode: number;
    public IsTagged: string;

}

export class SupplierItem
{
    public ItemID: number;
    public ItemName: string;
    public ItemCategoryID: number;
    public IsTagged: string;
    public ItemPrice: number;
    public SupplierID: number;
    public SupplierName: string;

    public IsSelected:boolean;
}

export class CustomerItem {
    public ItemID: number;
    public ItemName: string;
    public ItemCategoryID: number;
    public IsTagged: string;
    public ItemPrice: number;
    public CustomerID: number;
    public CustomerName: string;

    public IsSelected: boolean;
}


export class SupplierItemCategoryExt extends SupplierItemCategory {
    public ItemCategoryID: number;
    public ItemCategoryName: string;
    public StatusCode: number;
    public IsTagged: string;
    public IsSelected:boolean;

    //public ItemList:SupplierItem[];
    public AvailableItem:SupplierItem[];
    public AssignedItem:SupplierItem[];
}

export class VehicleTypeMaster {
    public CorpID: number;
    public VehicleTypeID: number;
    public VehicleType: string; 
    public DrivingLicenceNo: number;  
    public StatusCode: number;
    public statusMessage: string;
    
      
}



export class TransportInfo {
    public CorpID: number;
    public TransportID: number;  
    public VehicleRegNo: number;  
    public VehicleName: string;  
    public VehicleDescription: string; 
    public VehicleTypeID: number;
    public IsOwned: string;
    public OwnedBy: string;
    public DriverName: string;
    public DrivingLicenceNo: string;
    public StatusCode: number;
    public StatusMessage: string;
    public VehicleType: string  
    
}


export class DeliveryAddress {
    public DelAddrID: number;
    public DelRefCode: number;
    public CorpID: number;
    public CorpName: string;
    public CorpCode: number;
    public ContactPerson: string;
    public MobileNumber: number;
    public Address1: string;
    public Address2: string;
    public City: string;
    public StateID: number;
    public CountryCode: string;
    public Pincode: number;
    public Email: string;
    public RegionalTimeZone: string;
    public StatusCode: number;
    public StatusMessage: string;
    public StateName: string;
    public CountryName: string;
}

export class BillingAddress {
    public BillAddrID: number;
    public BillingName: string;
    public BillRefCode: number;
    public CorpID: number;
    public ContactPerson: string;
    public MobileNumber: number;
    public Address1: string;
    public Address2: string;
    public City: string;
    public StateID: number;
    public CountryCode: string;
    public Pincode: number;
    public Email: string;
    public RegionalTimeZone: string;
    public PAN: number;
    public TAN: string;
    public GSTIN: string;
    public StatusCode: number;
    public StatusMessage: string;
    public StateName: string;
    public CountryName: string;
}

export class ItemCategoryInfo {
    public ItemCategoryID: number;
    public ItemCategoryName: string;
    public StatusCode: number;
    public StatusMessage: string;
    public CorpID: number;
}

  export class FieldTypeInfo{
      public FieldTypeID: number;
      public FieldTypeName: string;
      public StatusCode: number;
      public StatusMessage: string;
  }


export class EventInfo {
    public CorpID:number;
    public ConfigID:number;
    public EventName:string;
    public EventID:number;
    public StatusCode:number;
    public SendSMS:boolean;
    public SendEmail:boolean;
    public SMSTemplateID:number;
    public SMSTemplateName:string;
    public EmailTemplateID:number;
    public EmailTemplateName:string;
    public DefaultCCEmailID:string;
    public DefaultBCCEmailID:string;
    public DefaultMobileNumber:string;
    public DefaultToEmailID:string;
    public SelectedSMSTemplate:MasterTemplateGetallLimitedResult;
    public SelectedEmailTemplate: MasterTemplateGetallLimitedResult;
}

export class MasterTemplateGetallLimitedResult {
    public TemplateID:number;
    public TemplateName:string;
    public TemplateType:string;
}

export class Project {
    public ProjectID: number;
    public CorpID: number;
    public SiteID: number;
    public BuyerID: number;
    public ProjectName: string;
    public ExternalOrderNumber: string;
    public StyleName: string;
    public StyleDescription: string;
    public TotalOrderQuantity: number;
    public AdditionalQuantityPercentage: number;
    public ProjectStartDate: Date;
    public ProjectCompletionDate: Date;
    public ShipmentDate: Date;
    public ConversionRate: number;
    public StatusCode : number;

    public IHONumber: string;
    public ProjectReference: string;
    public MainFabricItemID : number;
    public MainFabricGSM : number;

    public OrderTypeID: number;
    public ConsigneeID: number;
    public ConsigneeName: string;
    public ModeID: number;
    public PayTermID: number;

    public OrderID: string;
    public OrderIDText: string;

    public EmbroideryTypeID: number;
    public PrintTypeID: number;
    public PackingTypeID: number;
    public CategoryID: number;
    public StyleGroupID: number;
    public DiaTypeID: number;
    public TwistTypeID: number;
    public YarnCategoryID: number;

    public AgentID: number;
    public AgentName: string;

    public IncoTermID: number;
    public AgentCommission:number;
    public InputCurrencyCode:string;

    public TotalOrderValue: number;

    public OrderInfo_Update: number;
    public OrderDet_Update: number;
    public FabricBom_Update: number;
    public MaterialBom_Update: number;
    public ProcessFlow_Update: number;
    public ProductionFlow_Update: number;
    public OtherExp_Update: number;

    private VersionInfo:string;
	private NewAmmendments: number;
	private RowNum: number;
}

export class Project_OrderQuantityDetails {
    public OrderDetailID: number;
    public ProjectID: number;
    public OrderNumber:string;
    public InputCurrencyCode:string;
    public InputPrice:number;
    public PackingTypeID:number;
    public PackingType:string;
    public PcsPerPack:number;
    public NoOfPacks:number;
    public TotalQuantity:number;
    public TotalCost:number;
    public ColorSizeDetails:Project_ColorSizeQuantityDetails[];
    public isError:boolean;
    public ErrDescription:string;
    public RecordModified:boolean;

    public ColorID: number;
    public SizeID: number;
    public ColorName: string;
    public SizeName: string;
}

export class Project_ColorSizeQuantityDetails {
    public ColorSizeDetailID: number;
    public ProjectID: number;
    public OrderDetailID: number;
    public ColorID: number;
    public SizeID: number;
    public PcsPerPack: number;
    public OrderQuantity: number;
    public SortOrder:number;
    public isError:boolean;
    public ErrDescription:string;
    public RecordModified:boolean;

    public ColorName: string;
    public SizeName: string;
}

export class Project_OrderQuantitySummary {
    public OrderRowID: number;
    public OrderDetailID: number;
    public OrderNumber:string;
    public ColorID: number;
    public ColorName: string;
    public OrderQuantity: number;
    public SizeQuantity:Project_ColorSizeQuantityDetails[];
    public ColorTotal:number;
    public ColorSerialNo:number;
    public noOfColors:number;
    public SizeID: number;
}


export class Project_MaterialSizeDetails {
    public ProjectMaterialSizeID: number;
    public ProjectID: number;
    public SizeID: number;
    public PieceRate: number;
    public PieceWeight: number;
    public SizeName: string;
    public SortOrder: number;
}

export class ProjectColorDetails {
    public ProjectColorID: number;
    public ProjectID: number;
    public ColorID: number;
    public SizeID: number;
    public OrderQuantity: number;
    public ManufactureQuantity: number;

    public ColorName: string;
    public SizeName: string;
    public Ratio: number;

    public OrderNumber:string;
    public SortOrder:number;
}

export class ProjectSizeColorDetails {
    public ProjectColorID: number;
    public ColorID: number;
    public OrderQuantity: number;
    public SizeQuantity:ProjectSizeQuantity[];
    public ColorName: string;
    public ColorTotal:number;
    public OrderNumber:string;
    public ColorSerialNo:number;
    public noOfColors:number;
}

export class ProjectSizeQuantity
{
    public ProjectMaterialSizeID: number;
    public SizeID:number;
    public SizeQuantity:number;
    public isAvailable:boolean;
    public SortOrder:number;
}

export class ProjectSizeRatio
{
    public SizeID:number;
    public SizeRatio:number;
    public SizeTotal:number;
    public SortOrder: number;
}

export class FieldsList {
    FieldID: number;
    FieldName: string;
    FieldDescription: string;
    SizeList: SizeList[];
    IsDefault: boolean;
    SortOrder: number;
    isRemovable:boolean;
    FieldSortOrder:number;

    FieldTypeID: number;
    FieldTypeValues: string;

    FieldTypeValuesList: string[];
}

export class SizeList {
    SizeID: number;
    SizeName: string;
    FieldValue: string;
    FieldDescription: string;
    isAvailable:boolean;
    SortOrder:number;
}

export class ProjectFabricBomDetails {
    public FabricBOMID : number;
    public ProjectID : number;
    public ItemID : number;
    public ItemName : string;
    public ItemColor: string;
    public ItemRefCode: string;
    public DyeingTypeID : number;
    public PrintTypeID : number;
    public PrintTypeName : string;
    public YarnTypeID : number;
    public YarnTypeName : string;

    public ComponentTypeID : number;
    public ComponentTypeName : string;
    public FabricTypeID : number;
    public FabricTypeName : string;
    public DiaTypeID : number;
    public DiaTypeName : string;
    public TwistTypeID : number;
    public TwistTypeName : string;
    public YarnCategoryID : number;
    public YarnCategoryName : string;
    public IsYarnDyed: boolean;
    public IsPurchaseDyedYarn: boolean; //new field
    public YarnDyed : string;

    public ColorID: number;
    public ColorName: string;

    public ComponentParameterList : FieldsList[];
    public ComponentSizeList : SizeList[];
    public NewFieldItem :  ProjectFabricBomParameterDetails;
    public BomParameterList: ProjectFabricBomParameterDetails[];

    public YarnList: ProjectFabricBomYarnDetails[];
    public NewYarnItem :  ProjectFabricBomYarnDetails;

    public ReserveFromStock:boolean;
    public ReserveStockQuantity: number;
    public TotalCost: number;
    public RequiredQuantity: number;
    public BalanceRequiredQuantity: number;

    public saveFlag:boolean;
    public fbomMode:string;
    public expanded:boolean;

    public SelectedColors:string;
    public SelectedComponents:string;
    public isRemovable:boolean;


    public isError:boolean;
    public ErrDescription:string;
    public RecordModified:boolean;

}

export class ProjectFabricBomYarnDetails {
    public FabricBomYarnID: number;
    public FabricBOMID : number;
    public ProjectID : number;
    public ItemID : number;
    public ItemName : string;
    public ItemPercentage : number;
    public ColorPercentage : string;
    public RequiredQuantity: number;
    public ColorPercentageList:ProjectFabricBomYarnColorDetails[];
    public newColor:string;
    public newPercent:number;
    public submitAttempt:boolean;
    public isLast:boolean;

    public isError:boolean;
    public ErrDescription:string;
    public RecordModified:boolean;
}

export class ProjectFabricBomYarnColorDetails {
    public YarnColorID:number;
    public FabricBomYarnID: number;
    public FabricBOMID : number;
    public ProjectID : number;
    public ColorName : string;
    public ColorID : number;
    public ColorPercentage : number;
    public RequiredQuantity: number;
    public ItemID : number;
    public ItemName : string;

    public isError:boolean;
    public ErrDescription:string;
    public RecordModified:boolean;
}

export class ProjectFabricBomParameterDetails {
    public FabricBomParameterID : number;
    public ProjectID : number;
    public SizeID : number;
    public SizeName : string;
    public FabricBOMID : number;
    public FieldID : number;
    public FieldName : string;
    public FieldValue : string;

    public FieldDescription: string;
    public IsDefault: boolean;
    public SortOrder: number;
    public FieldSortOrder:number;

    public isAvailable:boolean;
    public isRemovable:boolean;

    public FieldTypeID: number;
    public FieldTypeValues: string;
    public FieldTypeValuesList: string[];

    public isError:boolean;
    public ErrDescription:string;
    public RecordModified:boolean;
}

export class ProjectComponentDetails {
    public ComponentID : number;
    public ProjectID : number;
    public ComponentName : string;
    public FabricID : number;
    public FabricName : string;
    public FabricDescription : string;
    public QuantityPerOrderPeice : number;
    public ComponentTypeID : number;
    public ComponentTypeDescription : string;
    public GrossWeightVariance : number;

    //
    public ComponentParameterList : FieldsList[];
    public ComponentSizeList : SizeList[];
    public NewFieldItem :  ProjectComponentParameterDetails;
}

export class ProjectComponentParameterDetails {
    public ComponentParameterID : number;
    public ProjectID : number;
    public SizeID : number;
    public SizeName : string;
    public ComponentID : number;
    public FieldID : number;
    public FieldName : string;
    public FieldValue : string;

    public FieldDescription: string;
    public IsDefault: boolean;
    public SortOrder: number;
}

export class StageStatus
{
    public StageStatusCode: number;
    public StageID: number;
    public StatusMessage: string;
    public StageName: string;
}

export class ProjectAccessoriesDetails {
    public AccessoriesID: number;
    public ProjectID: number;
    public ItemID: number;
    public ItemName: string;
    public ItemColor: string;
    public ItemRefCode: string;
    public ItemHSNCode: string;

    public Quantity: number; //consumption
    public Excess: number;
    public Rate: number;
    public ReserveFromStock:boolean;
    public ReserveStockQuantity: number;
    public InputRatio: number;
    public OutputRatio: number;
    public TotalCost: number;
    public ProcurementCost: number;
    public ColorID: number;
    public ColorName: string;
    public RefCode: string;
    public ReverseRatio: boolean;
    public RequiredQuantity: number;
    public BalanceRequiredQuantity: number;
    public HasSizeBreakup: boolean;

    public OrderQuantity: number;
    public ExcessQuantity: number;
    public SizeDetails:ProjectAccessoriesDetailsSizeDetailsExtn[];
    public ActualRequiredQuantity: number;
    public ExcessRequiredQuantity: number;
    public TotalRequiredQuantity: number;
    public FinalRequiredQuantity: number;

    public ExcessFlag: string;

    public saveFlag:boolean;
    public bomMode:string;
    public GST:number;
    public GSTCost: number;
    public FinalCost: number;
    public newAccessoriesDetailsArray: ProjectAccessoriesDetails[];
    public newAccessoriesDetailsSizeDetail: ProjectSizeColorDetails;
    public SizeQuantity:ProjectSizeQuantity[];

    public expanded:boolean;
    //public ColorIDs:number[];
    public SelectedColors:string;

    public ItemTypeID:number;
    public ItemTypeName:string;
    public ItemCategoryID:number;
    public ItemCategoryName:string;

    public UOMID:number;
    public UOM:string;
    public PurchaseUOMID:number;
    public ConversionRate:number;

    public AllowedVariancePercentage: number;
    public consType:string;
    public StockAvailableQuantity:number; //*
    public StockUnitPrice:number;   //*
    public StockCost:number;
    public StockGST:number;
    public StockGSTCost: number;
    public StockFinalCost: number;

    public BalanceQtyCost:number;
    public FinalCostWithStockCost:number;
    public BudgetCost:number;

    public isDyedYarn:boolean;
    public isError:boolean;
    public ErrDescription:string;
    public RecordModified:boolean;

    public OrderNumbers:string;
    public ImportDuty:number;
    public FreightCharges:number;
    public OtherCharges:number;

    public SelectedColorListFiltered:Master_Color[];
    public ItemListFiltered:Master_Item[];

    constructor()
    {
        this.ReserveFromStock = false;
        this.ReserveStockQuantity = 0;

        this.ReverseRatio = false;
        this.InputRatio = 1;
        this.OutputRatio = 1;
        this.HasSizeBreakup = false;

        this.ExcessFlag = '%';
        this.saveFlag = false;
        this.bomMode = 'ADD';

        this.SelectedColorListFiltered = new Array();
    }


}

export class OrderNumberInfo {
    public OrderNumber:string;
    public OrderNumberStr:string;
}

export class ProjectAccessoriesDetailsSizeDetails {
    public ProjectID: number;
    public AccessoriesID: number;
    public ColorID: number;
    public SizeID: number;
    public Quantity: number;
    public Rate: number;
    public ColorName: string;
    public SizeName: string;

    public isError:boolean;
    public ErrDescription:string;
    public RecordModified:boolean;
}

export class Test_Case
{
    public ProjectID: number;
    public AccessoriesID: number;
    public ColorID: number;
    public SizeID: number;
    public Quantity: number;
}

export class ProjectAccessoriesDetailsSizeDetailsExtn   {
    public ProjectID: number;
    public AccessoriesID: number;
    public ColorID: number;
    public SizeID: number;
    public Quantity: number;
    public Rate: number;
    public ColorName: string;
    public SizeName: string;
    public OrderQuantity: number;
    public ExcessPercentage: number;
    public ExcessQuantity: number;
    public AddPercentage: number;
    public AddQuantity: number;
    public FinalQuantity: number;
    public SortOrder: number;
    public IsAvailable:boolean;

}

export class ProjectProcessExpenseDetails {
    public ProcessExpenseID: number;
    public ProjectID: number;
    public ProcessID: number;
    public ProcessName: string;
    public Quantity: number;
    public CostPerUnit: number;
    public TotalCost: number;
    public AllowedPriceVariancePercentage: number;
    public UOMID:number;
    public RecordModified:boolean;
}

export class ProjectOtherExpenseDetails {
    public OtherExpenseID: number;
    public ProjectID: number;
    public ExpenseID: number;
    public ExpenseName: string;
    public Quantity: number;
    public CostPerUnit: number;
    public TotalCost: number;

    public BudgetCost: number;
    public AllowedCostVariancePercentage:number;
    public RecordModified:boolean;
}

export class DocumentImageInfo {
    public DocumentImage: string;
    public FolderPath: string;
    public DocumentImagePath: string;
    public HeaderTitle:string;
}



export class ProjectDocuments {
    public DocumentID: number;
    public ProjectID: number;
    public FileName: number;
    public DocumentPath: string;
    public StatusCode: number;

    public DocumentImage: string;
}

export class ProjectDetails {
    public Project: Project;
    public Project_OrderQuantityDetails:Project_OrderQuantityDetails[];
    public Project_ColorSizeQuantityDetails:Project_ColorSizeQuantityDetails[];

    public ProjectFabricBomDetails: ProjectFabricBomDetails[];
    public ProjectFabricBomParameterDetails: ProjectFabricBomParameterDetails[];
    public ProjectFabricBomYarnDetails: ProjectFabricBomYarnDetails[];
    public ProjectFabricBomYarnColorDetails:ProjectFabricBomYarnColorDetails[];

    public ProjectAccessoriesDetails: ProjectAccessoriesDetails[];
    public ProjectAccessoriesDetailsSizeDetails: ProjectAccessoriesDetailsSizeDetailsExtn[];

    public ProjectProcessFlowList: ProcessFlowInfo[];
    public ProjectProductionFlowList: ProductionFlowInfo[];

    public ProjectOtherExpenseDetails: ProjectOtherExpenseDetails[];
    public ProjectDocuments: ProjectDocuments[];

    public Project_OrderQuantitySummary:Project_OrderQuantitySummary[];

    // public Project_MaterialSizeDetails: Project_MaterialSizeDetails[];
    // public ProjectColorDetails: ProjectColorDetails[];
    // public ProjectProcessExpenseDetails: ProjectProcessExpenseDetails[];
    public ProjectOrderDetails: ProjectSizeColorDetails[];

    public DraftID:number;
    public ProjectID:number;
}

export class TemplateInfo {
  public TemplateID: number;
  public TemplateName: string;
  public TemplateType: string;
  public TemplateTypeName: string;
  public CorpID: number;
  public Subject: string;
  public Body: string;
  public IsBodyHtml: boolean;
  public StatusCode: number;
  public StatusMessage: string;
}

export class MasterLookup {

}

export class FieldInfo {
  public FieldID: number;
  public FieldName: string;
  public PlaceHolder: string;
  public Description: string;
  public StatusCode: number;
}

export class SizeInfo {
  public SizeID: number;
  public CorpID: number;
  public SizeName: string;
  public StatusCode: number;
  public StatusMessage: string;
//   public CreatedDtTm: string;
//   public CreatedBy: number;
//   public ModifiedDtTm: string;
//   public ModifiedBy: number;
  public SortOrder: number;
}

export class FabricInfo {
  public FabricID: number;
  public CorpID: number;
  public FabricName: string;
  public Description: string;
  public StatusCode: number;
  public StatusMessage: string;
  public CreatedDtTm: string;
  public CreatedBy: number;
  public ModifiedDtTm: string;
  public ModifiedBy: number;
}

export class ExpenseInfo {
    public ExpenseID: number;
    public CorpID: number;
    public ExpenseName: string;
    public StatusCode: number;
    public StatusMessage: string;
    public CreatedBy: number;
    public CreatedDtTm: string;
    public ModifiedDtTm: string;
    public ModifiedBy: number;
}

export class ProcessInfo {
    public ProcessID: number;
    public CorpID: number;
    public ProcessName: string;
    public InputUOMID: number;
    public InputUOMDescription: string;
    public OutputUOMDescription: string;
    public OutputUOMID: number;
    public UOM: string;
    public CategoryName: string;
    public CostPerUnit: number;
    public DependentItemID: number;
    public ItemName: string;
    public StatusCode: number;
    public StatusMessage: string;
    public CreatedDtTm: string;
    public CreatedBy: number;
    public ModifiedDtTm: string;
    public ModifiedBy: number;
}

export class Master_Buyer {
    public BuyerID: number;
    public BuyerName: string;
    public AgentID: number;
    public AgentName: string;
}

export class Master_Agent {
    public AgentID: number;
    public AgentName: string;
    public BuyerID: number;
    public BuyerName: string;
}

export class Master_Consignee {
    public ConsigneeID: number;
    public ConsigneeName: string;
    public AgentID: number;
    public AgentName: string;
    public BuyerID: number;
    public BuyerName: string;
    public StatusCode  :number;
}

export class Master_Size {
    public SizeID: number;
    public SizeName: string;
    public SortOrder: number;
}

export class Master_Color {
    public ColorID: number;
    public ColorName: string;
}

export class Master_Orders {
    public rowNo:number;
    public OrderNumber:string;
    public newColor:Master_Color;
    public newSize:Master_Size;
    public SizeList: Master_Size[];
    public ColorList: Master_Color[];
    public noOfColors:number;

    public prvOrderNumber:string;
}

export class MasterColor {
    public ColorID: number;
    public ColorName: string;
    public CorpID :number;
    public StatusCode  :number;
    public ModifiedDtTm :number;
    public ModifiedBy :number;
}

export class Master_Fabric {
    public FabricID: number;
    public FabricName: string;
    public FabricDescription: string;
}

export class Master_ComponentFields {
    public FieldID: number;
    public FieldName: string;
    public FieldDescription: string;
    public IsDefault: boolean;
    public SortOrder: number;

    public TypeID:string;
    public TypeIDs:number[];

    public FieldTypeID: number;
    public FieldTypeValues: string;
    public FieldTypeValuesList: string[];
}

export class PurchaseItemOrderInfo
{
    public PurchaseOrderDetailID: number;
    public PurchaseOrderID: number;
    public ItemID: number;
    public ItemName: string;
    public OrderQuantity: number;
    public ReceivedQuantity: number;
    public CancelledQuantity: number;
    public Rate: number;
    public PurchaseRate: number;
    public TotalItemValue: number;
    public ReferenceQuotationNumber:string;
    public UOMID:number;
    public PUOMID:number;
    public PUOM:string;
    public UOM:string;
    public ConversionRate: number;
    public ConvertedOrderQuantity: number;
    public ReceivedUOMQuantity: number;
    public CancelledUOMQuantity: number;

    public ItemPrice: number;
    public ItemValue: number;
    public ItemUOMValue: number;
    public TaxPercentage: number;
    public TaxBreakup1: number;
    public TaxBreakup2: number;
    public TaxAmount: number;
    public TaxBreakAmount1: number;
    public TaxBreakAmount2: number;
    public ExpectedDeliveryDate: string;
    public ExpectedDeliveryDateStr: string;

    public DiscountPercentage: number;
    public DiscountAmount: number;
    public StatusCode: number;
    public StatusMessage: string;

    public TaxBreakupLabel1: string;
    public TaxBreakupLabel2: string;
    public ItemRemarks: string;

    public PurchaseRequestID: number;
    RwID: any;
}

export class PurchaseItemRequestInfo {
    public PurchaseRequestDetailID: number;
    public PurchaseRequestID: number;
    public ItemID: number;
    public ItemName: string;
    public RequestQuantity: number;
    public ApprovedQuantity: number;
    public TotalItemValue: number;
    public UOMID: number;
    public UOM: string;
    public ConversionRate: number;
    public ConvertedOrderQuantity: number;
    public ReceivedUOMQuantity: number;
    public CancelledUOMQuantity: number;

    public ExpectedDeliveryDate: string;
    public ExpectedDeliveryDateStr: string;
    public CreatedDtTm: string;
    public CreatedBy: number;
    public ModifiedDtTm: string;
    public ModifiedBy: number;

    public DiscountPercentage: number;
    public DiscountAmount: number;
    public StatusCode: number;
    public StatusMessage: string;


    public ItemRemarks: string;
    public RwID: number;
   
}

export class GstType {
    public GstTypeID: number;
    public GstType: string;
}

export class RadioButtonField {
    public RadioButtonFieldID: number;
    public RadioButtonField: string
}

export class PurchaseItemOrderInfoExtn extends PurchaseItemOrderInfo {
    PUOMList: any;
    // public RequiredQuantity: number;
    // public OrderPlacingQuantity: number;
    // public QuoteRate: number;
    // public TotalDiff: number;

    // public expanded:boolean;
    // public errTotal:boolean;

    // public QuotationDetailID: number;
    // public QuotationID: number;
    // public ExpectedDeliveryinDays: number;
    // public AcceptedDeliveryinDays: number;

    // public ItemValue: number;
    // public ItemPrice: number;
    // public Amt: number;
    // public GST: number;
    // public GSTAmt: number;

    // public SGST: number;
    // public CGST: number;
    // public IGST: number;
    // public SGSTAmt: number;
    // public CGSTAmt: number;
    // public IGSTAmt: number;

    // public PUOMList:Master_Item_PUOM[];
    // public SubItemList:PurchaseOrderItemProjectDetails[];
}

export class PurchaseOrderItemProjectDetails
{
    public PurchaseOrderID: number;
    public ProjectID: number;
    public ItemID: number;
    public OrderQuantity: number;
    public ReceivedQuantity: number;
    public CancelledQuantity: number;

    public OrderIDText: string;
    public StyleName: string;
    public StyleDescription: string;
}

export class GstInfo
{
    public GST: number;
    public GSTAmt: number;

    public SGST: number;
    public CGST: number;
    public IGST: number;
    public SGSTAmt: number;
    public CGSTAmt: number;
    public IGSTAmt: number;

}

export class PurchaseOrderInfo
{
    public PurchaseOrderID: number;
    public CorpID: number;
    public SiteID: number;
    public GstTypeID: number;
    public PurchaseOrderNumber: number;
    public PurchaseOrderNumberString :string;
    public SupplierID: number;
    public SupplierName: string;
    public BillAddrID: number;
    public BillRefCode: string;
    public DelAddrID: number;
    public DelRefCode: string;
    public MobileNumber: string;
    public Email: string;
    public PurchaseOrderDate: string;
    public PurchaseOrderDateStr: string;
    public ExpectedDeliveryDate: string;
    public ExpectedDeliveryDateStr: string;
    public PurchaseOrderValue: number;
    public StatusCode: number;
    public StatusMessage: string;
    public CurrencyCode: string;
    public CurrencyID: number;
    public PaymentTermID: number;
    public PaymentTerm: string;
    public TaxTypeID: number; //1 - Within State, 2 - Other State, 3 - Other Country
    public TotalTaxValue: number;
    public TotalOrderValue: number;
    public TotalDiscountValue: number;
    public EntryUserID: number;
    public VerifyUserID: number;
    public ApproveUserID: number;
    public EntryUser: string;
    public VerifyUser: string;
    public ApproveUser: string;
    public EntryUserDtTm: string;
    public VerifyUserDtTm: string;
    public ApproveUserDtTm: string;

    public Remarks: string;
    public NoteToUser: string;
}

export class PurchaseRequestInfo {
    public PurchaseRequestID: number;
    public CorpID: number;
    public SiteID: number;
    public GstTypeID: number;
    public PurchaseRequestNumber: number;
    public PurchaseRequestNumberString: string;
    public PurchaseRequestDate: string;
    public PurchaseRequestDateStr: string;
    public ExpectedDeliveryDate: string;
    public ExpectedDeliveryDateStr: string;
    public StatusCode: number;
    public RequestAddrID: number;
    public StatusMessage: string;
    public CreatedDtTm: string;
    public CreatedBy: number;
    public ModifiedDtTm: string;
    public ModifiedBy: number;

    
    public EntryUserID: number;
    public VerifyUserID: number;
    public ApproveUserID: number;
    public EntryUser: string;
    public VerifyUser: string;
    public ApproveUser: string;
    public EntryUserDtTm: string;
    public VerifyUserDtTm: string;
    public ApproveUserDtTm: string;

    public Remarks: string;
    public NoteToUser: string;
    public SupplierID: number;
    public BillAddrID: number;
    public PurchaseOrderID: number;

    public POStatusCode: number;
}

export class PurchasePendingItem
{
    public CorpID: number;
    public SiteID: number;
    public PurchaseRequestDetailID: number;
    public PurchaseRequestID: number;
    public PurchaseRequestNumber: number;
    public RequestAddrID: number;
    public PurchaseRequestDate: string;
    public ExpectedDeliveryDate: string;
    public ItmExpectedDeliveryDate: string;
    public PurchaseRequestNumberString: string;
    public StatusCode: number;
    public StatusMessage: string;
    public ReqRefCode: string;
    public ExpectedDeliveryDateStr: string;
    public PurchaseRequestDateStr: string;
    public ItmExpectedDeliveryDateStr: string;
    public EntryUserID: number;
    public VerifyUserID: number;
    public ApproveUserID: number;
    public EntryUser: string;
    public VerifyUser: string;
    public ApproveUser: string;
    public EntryUserDtTm: string;
    public VerifyUserDtTm: string;
    public ApproveUserDtTm: string;
    public Remarks: string;
    public NoteToUser: string;
    public ItemID: number;
    public UOMID: number;
    public RequestQuantity: number;
    public ApprovedQuantity: number;
    public ItemName: string;
    public UOM: string;
    public ItemRemarks: string;
    public ItemCategoryID: string;
    public ItemTypeID: number;
    public ItemCategoryName: string;
    public ItemTypeName: string;


    public OrderQuantity:number;
    public Rate:number;
    public AlreadyOrderedQty:number;
    public BalanceQty:number;
    public IsSelected:boolean;

    public req:string;
    public ord:string;
    public bal:string;

    public QuoteRate:number;
    public ReferenceQuotationNumber:string;

    public SupplierID:number;
    public PurchaseOrderID: number;
    public PUOMID: number;

    public ExpectedDeliveryinDays: number;
    public AcceptedDeliveryinDays: number;

    public StockQuantity: number;
}

export class QuotationInfo {
    ItemID: number;
    RwID: any;

}

export class StockInfo {
    public StockID: number;
    public ItemID: number;
    public ItemName: string;
    public QuantityOnHand: number;
    public UOMID: number;
    public UOM: string;
    public TotalReserveQuantity: number;
    public TotalDeliveredQuantity: number;
    public TotalAvailableQuantity: number;
    public SiteCode: string;
    public DelAddrID: number;
    public ItemCode: string;
    public ItemPrice: number;
}

export class StockDetailInfo {
    public StockID: number;
    public ItemID: number;
    public ItemName: string;
    public ProjectName: string;
    public ReserveStockQuantity: number;
    public RequestedQuantity: number;
    public DeliveredQuantity: number;
    public CancelledQuantity: number;
    public Comments: string;
    public DepartmentName: string;
    public UserName: string;
    public CreatedDtTm:string;
}


export class StockHistoryInfo {
    public StockID: number;
    public ItemID: number;
    public ItemName: string;
    public ItemCode: string;
    public QuantityOnHand: number;
    public QuantityReceived: number;
    public QuantityDelivered: number;
    public TransDate: string;
    public TransNumber: string;
    public CustomerFlag: string;
    public MovementFlag:string;
    public Customer: string;
    public Comments: string;   
}


export class StockBalanceInfo {
    public StockID: number;
    public ItemID: number;
    public ItemCode: string;
    public QuantityOnHand: number;
    public QuantityReceived: number;
    public QuantityDelivered: number;
    public ReservedQuantity: number;
    public ReturnedQuantity: number;
    public ClosingStock: number;
}

export class StockInwardTransactionInfo {
    public StockInwardTransactionID:number;
    public ItemID: number;
    public ItemName: string;
    public ItemTypeName: string;
    public UOM: string;
    public PurchaseOrderID: number;
    public PurchaseOrderNumber: number;
    public PurchaseOrderNumberString: number;
    public QualityRating: number;
    public QuantityReceived: number;
    public StatusCode: number;
    public StatusMessage:string;
    public CreatedDtTm: string;
}

export class StockOutwardTransactionInfo {
    public StockOutwardTransactionID: number;
    public ProjectID: number;
    public ItemID: number;
    public RequestedDepartmentID: number;
    public RequestedUserID: number;
    public RequestedQuantity: number;
    public IsBudgeted: boolean;
    public DeliveredQuantity: number;
    public CancelledQuantity: number;
    public Comments: string;
    public StatusCode: number;
    public ProjectName: string;
    public ItemName: string;
    public UOMID: number;
    public UOM: string;
    public DepartmentName: string;
    public UserName: string;
    public VehicleNo: string;
    public StatusMessage: string;
    public CreatedDtTm: string;
    public ModifiedBy: string;
    public IsInternal: number;
    public IsReturnable: number;
    public ModifiedDtTm: string;
    public CustomerName: string;
    public ClientName: string;
    public OutwardType: string;
    public ReturnType: string;
    public OutwardDate: string;    
    public RequestedDepartmentName: string;
    public RequestedUserName: string;
}

export class StockOutwardTransactionItemDetail {
    public StockOutwardTransactionDetailID: number;
    public StockOutwardTransactionID: number;
    public ItemID: number;
    public RequestedDepartmentID: number;
    public RequestedUserID: number;
    public RequestedQuantity: number;
    public IsBudgeted: boolean;
    public DeliveredQuantity: number;
    public CancelledQuantity: number;
    public Comments: string;
    public StatusCode: number;
    public ItemName: string;
    public UOMID: number;
    public UOM: string;
    public DepartmentName: string;
    public UserName: string;
    public VehicleNo: string;
    public StatusMessage: string;
    public CreatedDtTm: string;
    public ModifiedBy: string;
    public IsInternal: number;
    public IsReturnable: number;
    public ModifiedDtTm: string;
    public CustomerName: string;
    public ClientName: string;
    public OutwardType: string;
    public ReturnType: string;
    public OutwardDate: string;    
    public RequestedDepartmentName: string;
    public RequestedUserName: string;
}


export class ProjectAccessoriesInfo {
    public AccessoriesID: number;
    public ProjectID: number;
    public ItemID: number;
    public ItemName: string;
    public Quantity: number;
    public Rate: number;
    public ReserveFromStock: number;
    public ReserveStockQuantity: number;
    public InputRatio: number;
    public OutputRatio: number;
    public TotalCost: number;
    public CreatedDtTm:string;
}

export class ProjectInfo{
    public ProjectID:number;
    public ProjectName:string;
}

export class PurchasePendingItemProjectWise
{
    public ProjectID:number;
    public OrderIDText:string;
    public StyleName:string;
    public StyleDescription:string;
    public ItemID:number;
    public OrderQuantity:number;
    public ItemName:string;
    public UOMID:number;
    public UOM:string;
    public Rate:number;
    public ItemPrice:number;
    public AlreadyOrderedQty:number;
    public BalanceQty:number;

    public req:string;
    public ord:string;
    public bal:string;

    public GST: number;
}


export class Master_Color_GetAll_ByCorpIDResult {
    public ColorID: number;
    public CorpID: number;
    public ColorName: string;
    public StatusCode: number;
    public StatusMessage: string;
}

export class Master_Process {
    public ProcessID: number;
    public ProcessName: string;
    public InputUOMID: number;
    public OutputUOMID: number;
    public CostPerUnit:number;
    public CategoryName:string;
}

export class Master_ComponentFields_GetAll_ByCorpIDResult
{
    public FieldID: number;
    public CorpID: number;
    public FieldName: string;
    public FieldDescription: string;
    public StatusCode: number;
    public StatusMessage: string;
    public SortOrder:number;
    public IsDefault:boolean;
    public IsDefaultText:string;
    public TypeID: string;
    public TypeIDs: number[];
    public FieldTypeID: number;
    public FieldTypeValues:string;
}

export class Master_ComponentFieldType
{
    public FieldTypeID: string;
    public FieldTypeName:string;
}

export class StockReturnTransactionInfo {
    public StockReturnTransactionID: number;
    public ProjectID: number;
    public DepartmentName:string;
    public ReturnedDepartmentID: number;
    public ReturnedUserID: number;
    public UserName:string;
    public SiteID: number;
    public ItemID: number;
    public Quantity: number;
    public Comments:string;
    public ProjectName:string;
    public ItemName:string;
    public UOMID:number;
    public UOM:string;
    public StatusCode: number;
    public ReturnDate: string;
    public ReturnNumber: number;
    public ReturnNumberString:string;
}

export class StockTransferDetail {
    public StockTransferDetailID: number;
    public CorpID: number;
    public FromSiteID: number;
    public ToSiteID: number;
    public ItemID: number;
    public QuantityTransfer: number;
    public QuantityReceived: number;
    public FromEntryUserID: number;
    public FromEntryUserDtTm: string;
    public ToEntryUserID: number;
    public ToEntryUserDtTm: string;
    public FromApproveUserID: number;
    public FromApproveUserDtTm: string;
    public ToApproveUserID: number;
    public ToApproveUserDtTm: string;
    public FromRemarks: string;
    public ToRemarks: string;
    public ItemName: string;    
    public StatusCode: number;
    public StatusMessage: string;

    public FromSite: string;
    public ToSite: string;
    public TransBy: string;
    public FrApprvBy: string;
    public RecdBy: string;
    public ToApprvBy: string;

    public FromDate: string;
    public ToDate: string;
    public FromDateStr: string;
    public ToDateStr: string;
}

export class Master_Expense {
    public ExpenseID: number;
    public ExpenseName: string;
}

export class Project_GetAll_ByCorpIDSiteIDResult {
    public ProjectID: number;
    public CorpID: number;
    public SiteID: number;
    public BuyerID: number;
    public BuyerName: string;
    public ProjectName: string;
    public ExternalOrderNumber: string;
    public StyleName: string;
    public StyleDescription: string;
    public TotalOrderQuantity: number;
    public AdditionalQuantityPercentage: number;
    public ProjectStartDate : string;
    public ProjectCompletionDate: string;
    public ShipmentDate: string;
    public ConversionRate: number;
    public StatusMessage: string;
    public StatusCode: number;
    public OrderIDText: string;

    public SaveMode: string;
    public DraftID:number;

    public VersionInfo:string;
    public NewAmmendments:number;
    public RowNum:number;

    public VersionInfoList:VersionInfo[];
    public VersionInfoFormed:string;
    public SelectedVersion:number;
    public FinalVersion:number;
}

export class VersionInfo {
    public VersionInfo:string;
    public ProjectID:number;
}

export class ProjectProcessByDepartmentIDResult {
    public ProjectProcessID: number;
    public ProjectID: number;
    public ProcessID: number;
    public SequenceID: number;
    public AllowedQuantityVariancePercentage: number;
    public TentativeProcessStartDate : string;
    public ProcessCompletionDate: string;
    public ExecutionMode: number;
    public StatusCode: number;
    public ProcessInChargeDepartmentID: number;
    public ProcessName: number;
    public StatusMessage: string;
    public DepartmentName: string;
    public ExecutionModeName: string;
    public ProjectName: string;
    public BuyerName: string;
    public StyleName: string;
    public StyleDescription: string;
    public TotalOrderQuantity: number;
    public AdditionalQuantityPercentage: number;

    public TentativeProcessStartDate1 : string;
    public ProcessCompletionDate1: string;
    public sizeCount:number;
    public AdditionalQuantity: number;
    public FinalOrderQuantity: number;

    public ProducedQuantity: number;
}

export class ProjectWorkOrderByDepartmentIDResult {
    public ProjectProcessID: number;
    public ProjectID: number;
    public ProcessID: number;
    public SequenceID: number;
    public AllowedQuantityVariancePercentage: number;
    public TentativeProcessStartDate : string;
    public ProcessCompletionDate: string;
    public ExecutionMode: number;
    public StatusCode: number;
    public ProcessInChargeDepartmentID: number;
    public ProcessName: number;
    public StatusMessage: string;
    public DepartmentName: string;
    public ExecutionModeName: string;
    public ProjectName: string;
    public BuyerName: string;
    public StyleName: string;
    public StyleDescription: string;
    public TotalOrderQuantity: number;
    public AdditionalQuantityPercentage: number;

    public TentativeProcessStartDate1 : string;
    public ProcessCompletionDate1: string;
    public sizeCount:number;
    public AdditionalQuantity: number;
    public FinalOrderQuantity: number;

    public WorkOrderID: number;
    public WorkOrderNumber: number;
    public WorkOrderDate: string;
    public WorkOrderDate1: string;
    public VendorID: number;
    public WorkOrderStatusCode: number;
    public Quantity: number;

    public VendorName: string;
    public WorkOrderStatusMessage: string;
    public bgColor:string;
}



//reports block
export class ReportsInfo {
    public ReportID:number;
    public ReportName:string;
    public FieldDetail:string;
    public StatusCode:number;
    public IsDetail:boolean;
    public IsDownloadable:boolean;

    
}

export class DropDownMaster {
    public MasterId:number;
    public MasterName:string;
    public Domain:string;
}

export class ParameterInfo {
    public ParameterId:number;
    public ParameterName:string;
    public ParameterType:string;
    public ParameterDomain:string;
    public ParameterValue:string;
    public MasterDataList: DropDownMaster[];
    public SelectedDataList:DropDownMaster[];
    public SelectedDataListSingle: DropDownMaster;
    public IsMultiple: boolean;
    public IsSelected:boolean;
}
//end of reports block


export class ProcessFlowInfo {
    public ProjectProcessID:number;
    public ProcessFlowID:number;
    public ProjectID:number;
    public ProcessID:number;
    public SequenceID:number;
    public AllowedQuantityVariancePercentage:number;
    public TentativeProcessStartDate:string;
    public ProcessCompletionDate: string;
    public ExecutionMode:number;
    public ExecutionModeName:string;
    public StatusCode: number;
    public ProcessInChargeDepartmentID: number;
    public ProcessName: string;
    public StatusMessage: string;
    public DepartmentName: string;

    public TentativeProcessStartDate1:string;
    public ProcessCompletionDate1: string;
    public ExcessFlag:string;

    public SelectedFabrics: string;
    public SelectedColors: string;
	public SelectedComponents: string;
	public InputQuantity: number;
	public OutputQuantity: number;
	public InputUOMID: number;
    public OutputUOMID: number;

    public Comments:string;

    public CostPerUnit: number;
    public TotalCost: number;
    public BudgetCost: number;
    public AllowedCostVariancePercentage:number;

    public ProcessSeqID:number;
    public PreReqProcessID:string;


    public RecordModified:boolean;

    public SelectedColorListFiltered: Master_Color[];
    public ComponentTypeListFiltered: Master_LookUp[];

    constructor()
    {
       this.SelectedColorListFiltered = new Array();
       this.ComponentTypeListFiltered = new Array();
    }
}

export class ProcessFlowTransactionInfo {

    //public ProcessFlowTransactionID:number;
    public ProjectProcessID:number;
    public ProjectID:number;
    //public SequenceID:number;
    public ProcessStartDateTime:string;
    public ProcessCompletionDateTime: string;
    public ExecutionMode:number;
    public ExecutionModeName:string;
    public StatusCode: number;
    public StatusMessage: string;

    public ProcessStartDateTime1:string;
    public ProcessCompletionDateTime1: string;

    public InputQuantity:number;
    public OutputQuantity:number;

    public FlowDetails: ProcessFlowTransactionDetails[];
}

export class ProcessFlowTransactionDetails {
    public ProcessFlowTransactionID:number;
    public ProjectProcessID:number;
    public ProjectID:number;
    public HourID:number;
    public ExecutionMode:number;
    public ExecutionModeName:string;
    public StatusCode: number;
    public StatusMessage: string;
    public ProcessingDate: string;
    public ProcessingDate1: string;

    public ProductionDetails: ProcessFlowTransactionDetailsColorDetails[];
    public TotalQuantity: number;
}

export class ProcessFlowTransactionDetailsInfo
{
    public ProcessFlowTransactionID: number;
    public ProjectProcessID: number;
    public ProjectID: number;
    public ProcessingDate: string;
    public HourID: number;
    public ExecutionMode: number;
    public StatusCode: number;
    public ColorID: number;
    public SizeID: number;
    public Quantity: number;
    public StatusMessage: string;
    public ExecutionModeName: string;

    public ColorName: string;
    public SizeName: string;
}

export class ProcessFlowTransactionDetailsColorDetails {
    public ColorID: number;
    public ColorName: string;
    public SizeDetails: ProcessFlowTransactionDetailsSizeDetails[];
    public ColorQuantity: number;
}

export class ProcessFlowTransactionDetailsSizeDetails {
    public SizeID:number;
    public SizeName: string;
    public Quantity:number;
}

export class ProductionFlowInfo {
    public ProjectProcessID:number;
    public ProjectID:number;
    public ProcessID:number;
    public SequenceID:number;
    public AllowedQuantityVariancePercentage:number;
    public TentativeProcessStartDate:string;
    public ProcessCompletionDate: string;
    public ExecutionMode:number;
    public ExecutionModeName:string;
    public StatusCode: number;
    public ProcessInChargeDepartmentID: number;
    public ProcessName: string;
    public StatusMessage: string;
    public DepartmentName: string;

    public TentativeProcessStartDate1:string;
    public ProcessCompletionDate1: string;
    public ExcessFlag:string;

    public SelectedSizes: string;
    public SelectedColors: string;
	public InputQuantity: number;
	public OutputQuantity: number;
	public InputUOMID: number;
    public OutputUOMID: number;

    public CostPerUnit: number;
    public TotalCost: number;
    public BudgetCost: number;
    public AllowedCostVariancePercentage:number;

    public ProcessSeqID:number;
    public PreReqProcessID:string;


    public RecordModified:boolean;
    public SelectedSizeListFiltered:Master_Size[];

    constructor()
    {
       this.SelectedSizeListFiltered = new Array();
    }
}

export class BudgetSummaryInfo {
    public budgetSerialNo:number;
    public budgetTitle:string;
    public budgetRevenue:number;
    public budgetExpense:number;
    public budgetPandL:number;
    public budgetValue:number;
}

export class AccessRightInfo {
    OrderInfoView:boolean;
    OrderInfoEdit:boolean;

    FabricProgramView:boolean;
    FabricProgramEdit:boolean;

    MaterialBOMView:boolean;
    MaterialBOMEdit:boolean;

    ProcessFlowView:boolean;
    ProcessFlowEdit:boolean;

    ProductionFlowView:boolean;
    ProductionFlowEdit:boolean;

    OtherExpensesView:boolean;
    OtherExpensesEdit:boolean;


    OrderPanel:boolean;
    FabricPanel:boolean;
    MaterialPanel:boolean;
    ProcessPanel:boolean;
    ProductionPanel:boolean;
    OtherExpensePanel:boolean;
}

export class MasterComponentFields {
    public FieldID :number;
    public CorpID :number;
    public FieldName :string;
    public FieldDescription :string;
    public IsDefault :boolean;
    public SortOrder :number;
    public StatusCode :number;
    public ModifiedDtTm :number;
    public ModifiedBy :number;
    public TypeIDs:number[];
    public TypeID: string;
    public FieldTypeID: number;
    public FieldTypeValues: string;
}

export class QuotationDetails
{
  public QuotationID: number;
  public QuotationNumber: number;
  public QuotationNumberString: string;
  public SupplierID: number;
  public SupplierName: string;
  public MobileNumber: string;
  public Email: string;
  public QuotationDate: string;
  public ExpectedResponseDate: string;
  public QuotationReceivedDate:string;
  public StatusCode: number;
  public StatusMessage: string;
  public QuoteTypeID: number;

  public QuotationDateTxt: string;
  public ExpectedResponseDateTxt: string;
  public QuotationReceivedDateTxt:string;
  public RwID: number;

  public Remarks: string;
  public NoteToUser: string;

}

export class QuotationItemDetails
{
  public QuotationDetailID: number;
  public QuotationID: number;

  public ItemID: number;
  public OrderQuantity: number;
  public AcceptedQuantity: number;
  public Rate: number;
  public ItemValue: number;

  public TaxPercentage: number;
  public TaxAmount: number;
  public DiscountPercentage: number;
  public DiscountAmount: number;
  public TotalItemValue: number;

  public ExpectedDeliveryinDays: number;
  public AcceptedDeliveryinDays: number;
  public ItemName: string;
  public UOM:string;
  public PUOM:string;

  public OrderQuantityTxt: string;
  public SupplierID: number;
  public SupplierName: string;

  public UOMID: number;
  public PUOMID: number;
  public ConvertedOrderQuantity: number;
  public ConversionRate: number;
  public  RwID: any;
 
  public ItemRemarks: string;
  public StatusCode: number;
  public NoteToUser: string;

}

export class QuotationCreateItemDetails
{
  public ItemID: number;
  public ItemName: string;
  public QuotationDetailID: number;
  public OrderQuantity: number;
  public OrderQuantityTxt: string;
  public SupplierID: number;
  public SupplierName: string;
  public UOM:string;
  public PUOM:string;
  public ExpectedDeliveryinDays: number;
  public AcceptedDeliveryinDays: number;
  public Rate:number;

  public UOMID: number;
  public PUOMID: number;
  public ConvertedOrderQuantity: number;
  public ConversionRate: number;

  public PUOMList:Master_Item_PUOM[];
}

export class Process_Group
{
    public ProjectID: number;
    public ProcessCount: number;
    public GridRow: number;
}

export class Project_OrderType
{
    public OrderTypeID: number;
    public OrderType: number;
}

export class Master_FabricType
{
    public FabricTypeID: number;
    public FabricTypeName: string;
    public StatusCode:number;
    public SortOrder:number;
    public IsDefault:boolean;
}

export class StockInwardTransactionList {
    public StockInwardTransactionID:number;
    public SupplierID: number;
    public SupplierName: string;
    public SiteID: number;
    public GRNID: number;
    public GRNIDText: string;
    public DCNumber: string;
    public InwardID: number;
    public InwardIDText: string;
    public InvoiceNumber: string;
    public DCDate: string;
    public InwardDate: string;
    public InvoiceDate: string;
    public GRNDate: string;
    public StatusCode: number;
    public StatusMessage:string;
    public Comments:string;

    public PurchaseOrderID:number;
    public PurchaseOrderNumbers:string;
    public QualityRating: number;

    public DCDateStr: string;
    public GRNDateStr: string;
    public InvoiceDateStr: string;


}

export class StockInwardTransactionItemDetail {
    public StockInwardTransactionDetailID:number;
    public StockInwardTransactionID:number;
    public PurchaseOrderID: number;
    public PurchaseOrderDetailID: number;
    public ItemID: number;
    public ItemName: string;

    public OrderQuantity:number;
    public ConvertedOrderQuantity:number;

    public BalanceToBeReceived:number;
    public BalancePUOMToBeReceived:number;

    public QuantityReceived: number;
    public QuantityPUOMReceived: number;
    public QuantityAccepted: number;
    public QuantityPUOMAccepted: number;
    public QuantityCancelled: number;
    public QuantityPUOMCancelled: number;

    public ExcessQuantityReceived: number;
    public ExcessPUOMQuantityReceived: number;

    public BalanceQuantity:number;
    public BalanceQuantityConverted:number;

    public UOMID: number;
    public PUOMID: number;
    public UOM: string;
    public PUOM: string;
    public ConversionRate: number;
    public StatusCode: number;
    public StatusMessage:string;
    public Comments:string;


    public AlreadyReceivedQuantity:number;
    //public BalanceOrderQuantity:number;
    public AlreadyReceivedQuantityConverted:number;
    // public BalanceOrderQuantityConverted:number;

    public ProjectItemDetail:StockInwardTransactionProjectDetail[];
    public expanded:boolean;

    public PurchaseOrderNumber:string;
    public PurchaseOrderNumberString:string;
}

export class StockInwardTransactionProjectDetail {
    public StockInwardTransactionDetailID:number;
    public StockInwardTransactionID:number;
    public PurchaseOrderID: number;
    public PurchaseOrderDetailID: number;
    public ItemID: number;
    public ItemName: string;
    public ProjectID: number;
    public QuantityReceived: number;
    public QuantityAccepted: number;
    public QuantityCancelled: number;

    public OrderQuantity:number;
    public BalanceToBeReceived:number;


    public AlreadyReceivedQuantity:number;
    public BalanceOrderQuantity:number;

    public BalanceQuantity:number;

    public OrderIDText: string;
    public StyleName: string;
    public StyleDescription: string;
}

export class StockInwardPurchasePendingList {
    public PurchaseOrderDetailID: number;
    public PurchaseOrderID: number;
    public ProjectID: number;
    public ItemID: number;
    public OrderQuantity: number;
    public ConvertedOrderQuantity: number;
    public UOMID: number;
    public PUOMID: number;
    public ReceivedQuantity: number;
    public ReceivedUOMQuantity: number;
    public SupplierID: number;
    public PurchaseOrderNumber: string;
    public PurchaseOrderNumberString: string;
    public PurchaseOrderDate: number;
    public BalanceToBeReceived: number;
    public BalancePUOMToBeReceived: number;
    public UOM : string;
    public PUOM: string;
    public SupplierName: string;
    public ItemName: string;
    public ConversionRate: number;
}

export class StockInwardPurchasePendingProjectList {
    public PurchaseOrderID: number;
    public ProjectID: number;
    public ItemID: number;
    public OrderQuantity: number;
    public ReceivedQuantity: number;
    public BalanceToBeReceived: number;
    public ItemName: string;
    public OrderIDText: string;
    public StyleName: string;
    public StyleDescription: string;
}

export class StockReplaceTransactionItemDetail {
    public StockReplaceTransactionDetailID:number;
    // From Stock Inward data
    public StockInwardTransactionDetailID:number;
    public StockInwardTransactionID:number;
    public SupplierID: number;
    public SupplierName: string;
    public GRNID: number;
    public GRNIDText: string;
    public DCNumber: string;
    public InwardIDText: string;
    public InvoiceNumber: string;
    public DCDate: string;
    public InwardDate: string;
    public InvoiceDate: string;
    public GRNDate: string;

    public PurchaseOrderID:number;
    public PurchaseOrderDetailID: number;
    public PurchaseOrderNumber:string;
    public PurchaseOrderNumberString:string;

    public ItemID: number;
    public ItemName: string;
    public OrderQuantity:number;
    public ConvertedOrderQuantity:number;
    public QuantityReceivedInDC: number;
    public QuantityPUOMReceivedInDC: number;
    public UOMID: number;
    public PUOMID: number;
    public UOM: string;
    public PUOM: string;
    public ConversionRate: number;

    //Replace/Cancel Data

    public QuantityReturn:number;
    public QuantityPUOMReturn:number;
    public QuantityReceived: number;
    public QuantityPUOMReceived: number;
    public ReplacementType:string;
    public StatusCode: number;
    public StatusMessage:string;
    public Reason:string;

    public TotalQtyReturned:number;
    public TotalQtyReceived:number;

    public totalReturnalbleQty:number;

    public GRNDateStr: string;
    public DCDateStr: string;
    public InvoiceDateStr: string;
    public InwardDateStr: string;

    public ReplaceDate: string;
    public ReplaceNumber: number;
    public ReplaceNumberString:string;
}

export class InwardDCInfo {
    public DCNumber:string;
    public DCNumberText:string;
    public DCDate:string;
}

export class RoleMenu {
    public RoleID:number;
    public MenuID:number;
}

export class RoleFunction {
    public RoleID:number;
    public FunctionID:number;
}

export class RoleReport {
    public RoleID:number;
    public ReportID:number;
}

export class FP_Devices
{
    public  FPDeviceID:number;
    public  FPDeviceName: string ;
    public  CorpID: number;
    public  FPDeviceIP: string ;
    public  FPDevicePort: number;
    public  FPDeviceType: string;
    public  FPDeviceNote: string;
    public  StatusCode: number ;
    public  StatusMessage: string ;
}

export class AccessType {
    public AccessTypeID: number;
    public AccessTypeName: string;
}

export class MasterHolidayYear
{
    public CorpID: number; 
    public Year: number ;
}


export class MasterHolidayType
{
    public CorpID: number; 
    public HolidayTypeID: number;
    public HolidayType: string ;
    public HolidayYear:number;
}
export class MasterHoliday
{
    public  HolidayID: number;
    public  Holiday:string;
    public  HolidayDescription:string ;
    public  CorpID: number;
    public  HolidayTypeID: number;
    public  HolidayType: string;
    public  StatusCode: number;
    public  StatusMessage:string;
    public  HolidayDate: string;
}


export class MasterLeave
{
    public LeaveID: number;
    public LeaveName: string;
    public LeaveDescription: string;
    public LeaveCount: number;
    public  StatusCode: number;
    public  StatusMessage:string;
}

export class ItemCategoryTaxDetails
{
    public TaxDetID: number;
    public TaxID: number;
    public TaxCode: string;
    public TaxName: string;
    public TaxValue: number;
    public ItemCategoryID: number;
    public EffectiveDateFrom: string;
    public EffectiveDateTo: string;
    public EffectiveDateFromStr: string;
    public EffectiveDateToStr: string;
    public StatusCode: number;
    public StatusMessage:string;
}


export class TaxDetItemCat
{
    public TaxID: number;
    public ItemCategoryID: number;
    public EffectiveDateFrom: string;
    public EffectiveDateTo: string;
    public TaxValue: number;
    public TaxCode: string;
    public TaxName: string;
}

export class Employee {
    public EmpCode: string;
    public EmpFID: number;
    public EmpID: number;
    public EmpName: string;
    public GroupID: number;
    public GroupName: string;
    public DesignationID: number;
    public DestinationName: string;
    public DepartmentID: number;
    public GenderCode: string;
    public DepartmentName: string;
    public CategoryID: number;
    public TypeID: number;
    public EmpDOB: Date;
    public EmpDOJ: Date;
    public StatusCode: number;
    public StatusMessage: string;
    public OTFlagID: number;
    public OTFlag: string;
    public AttBonusFlag: boolean;
    public FullPresentBonus: string;
    public HalfDayAbsentBonus: string;
    public OneDayAbsentBonus: string;
    public EmpDOL: Date;
    public Reason: string;
    public ReasonID: number;
    public CreatedDtTm: string;
    public CreatedBy: number;
    public ModifiedDtTm: string;
    public ModifiedBy: number;

}

export class PersonalInfo {
    public EmpDetID: number;
    public EmpID: number;
    public EmpCode: string;
    public EmpEmail: string;
    public EmpContact1: string;
    public EmpContact2: string;
    public MarriedID: number;
    public Married: string;
    public IsHandicap: boolean;
    public CreatedDtTm: string;
    public CreatedBy: number;
    public ModifiedDtTm: string;
    public ModifiedBy: number;
    // public StateCode: string;
    // public StatusMessage: string;
    public AddressInfoDetailList: AddressInfo[];
    public FamilyInfoDetailList: EmpFamilyInfo[];

}

export class AddressInfo {
    public AddrDetID: number;
    public EmpID: number;
    public AddressID: number;
    public Address1: string;
    public Address2: string;
    public CountryCode: string;
    public CountryName: string;
    public StateName: string;
    public Pincode: string;
    public StateCode: string;
    public StateID: number;
    public RwID: number;
    public StatusCode: number;
    public StatusMessage: string;
    public City: string;
    public IsPermanentAddr: boolean;
}

export class EmpFamilyInfo {
    public FamilyDetID: number;
    public EmpID: number;
    public RelationshipID: number;
    public RelationshipName: string;
    public RContactNo: string;
    public Relationship: string;
    public RAge: number;
    public StatusCode: number;
    public StatusMessage: string;
    public RDOB: string;
    public RwID: number;
 
}

export class EmpEducationInfo {
    public EducationDetID: number;
    public EmpID: number;
    public Qualification: string;
    public QualificationID: number;
    public Institute: string;
    public Location: string;
    public PassingYear: number;
    public Percentage: number;
    public Description: string;
    public StatusCode: number;
    public StatusMessage: string;
    public RwID: number;
    
}

export class RelaionShipListInfo {
    public RelationshipID: number;
    public Relationship: string;
}

export class QualificationListInfo {
    public QualificationID: number;
    public Qualification: string;
}

export class Bank {
    public BankID: number;
    public BankName: string;
}
export class KYCDocInfo {
    public KycDetID: number;
    public EmpID: number;
    public KycID: number;
    public KycTitle: string;
    public NameAsInDocument: string;
    public DocumentNumber: string;
    public ExpiryDate: Date;
    public RwID: number;
    public CreatedDtTm: string;
    public CreatedBy: number;
    public ModifiedDtTm: string;
    public ModifiedBy: number;
}


export class KYCInfo {
    public KycID: number;
    public KycTitle: string;
}
export class Married {
    public MarriedID: number;
    public Married: string;
}

export class OTFlag {
    public OTFlagID: number;
    public OTFlag: string;
    public OTDescription: string;
}

export class BankInfo {
    public BankDetID: number;
    public EmpID: number;
    public BankID: number;
    public AccountTypeID: number;
    public AccountType: string;
    public IFSCCode: string;
    public Branch: string;
    public BankName: string;
    public RwID: number;
    public IsDefault: boolean;
    public AccountNumber: string;
    public StatusCode: string;
    public StatusMessage: string;
    public CreatedDtTm: string;
    public CreatedBy: number;
    public ModifiedDtTm: string;
    public ModifiedBy: number;

}

export class PurchaseOrderList {
    public Material: string;
    public Quentity: number;
    public Rate: number;
    public Amount: number;
    public City: string;
}

export class AccountType {
    public AccountTypeID: number;
    public AccountType: string;
}

export class SalaryFields {
    public FieldLableID: number;
    public FieldLableName: string;
    public Percentage: number;
    public IsPfApplicable: boolean;
    public IsEsiApplicable: boolean;
    public RwID: number
}
export class AdditionalFields {
    public FieldLableID: number;
    public FieldLableName: string;
    public IsEsiApplicable: boolean;
    public RwID: number
}
export class DeductionFields {
    public FieldLableID: number;
    public FieldLableName: string;
    public RwID: number
}

export class Shift {
    public EmpID: number;
    public ShiftID: number;
    public Shift: string;
    public InTime: string;
    public OutTime: string;
    public FirstSession: any;
    public SecondSession: any;
    public TotalBreakHours: number;
    public GraceTime: number;
    public HalfDayBelow: number;
    public AbsentBelow: number;
    public ShifEndNextDay: boolean;
    public ApplicableMale: boolean;
    public ApplicableFemale: boolean;
    public StatusCode: number;
    public StatusMessage: string;
    public LateAsPermissionGoBeyond: number;
    public AddOneMoreBreakIfOtHours: number;
    public inTimeVal: number;
    public outTimeVal: number;
}

export class Shiftmanagement {
    public FxShiftDetID: number;
    public EmpID: number;
    public ShiftID: number;
    public Shift: string;
    public InTime: string;
    public OutTime: string;
    public EmpName: string;
    public EmpCode: string;
    public GroupID: number;
    public TypeID: number;
    public TypeName: string;
    public CategoryID: number;
    public Category: string;
    public GroupName: string;
    public DesignationID: number;
    public DestinationName: string;
    public DepartmentID: number;
    public GenderCode: string;
    public DepartmentName: string;
    public RadioButtonFieldID: number;
    public RadioButtonField: string;
    public IsSelected: boolean;
    public FromDate: string;
    public ToDate: string;
    public FromDateStr: string;
    public ToDateStr: string;
    public WeekOffDate: string;
    public WeekOffDay: string;

}

export class Days {
    public DayID: number;
    public Day: String;

}

export class DailyAttendance {
    public DlyAttID: number;
    public EmpID: number;
    public EmpCode: string;
    public EmpName: string;
    public EmpFID: number;
    public GroupID: number;
    public TypeID: number;
    public TypeCode: string;
    public CategoryID: number;
    public CategoryCode: string;
    public GroupCode: string;
    public DesignationID: number;
    public DestinationName: string;
    public DepartmentID: number;
    public GenderCode: string;
    public DepartmentName: string;
    public ShiftID: number;
    public Shift: string;
    public StsS1: string;
    public StsS2: string;
    public OtS1: number;
    public OtS2: number;
    public LateMins: number;
    public EarlMins: number;

    public OTFlagID: number;
    public AttBonusFlag: boolean;

    public AttDate: string;
    public AttIn: string;
    public AttOut: string; 

    public ShiftMst:Shift;
    public FnOt: number;
    public AnOt: number;
    public FnStatus: string;
    public AnStatus: string;
    public AttFlag: string;
    public AttStatus: string;
}

export class DailyEmployeeShift {
    public DlyShiftDetID: number;
    public EmpID: number;
    public ShiftID: number;
    public ShiftDate: string;
    public StatusCode: number;
}

export class WeeklyEmployeeOff {
    public WOffDetID: number;
    public EmpID: number;
    public ShiftDate: string;
}


export class UpdateStockMaster {
    public ItemCode:string;
    public ItemName:string;
    public StockQuantity:number;
    public ItemID:number;
}

