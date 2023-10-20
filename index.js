function setPropertyRequired(attributeName, boolValue = true) {
  //обов"язкове
  var attributeProps = EdocsApi.getControlProperties(attributeName);
  attributeProps.required = boolValue;
  EdocsApi.setControlProperties(attributeProps);
}

function setPropertyHidden(attributeName, boolValue = true) {
  //приховане
  var attributeProps = EdocsApi.getControlProperties(attributeName);
  attributeProps.hidden = boolValue;
  EdocsApi.setControlProperties(attributeProps);
}

function setPropertyDisabled(attributeName, boolValue = true) {
  //недоступне
  var attributeProps = EdocsApi.getControlProperties(attributeName);
  attributeProps.disabled = boolValue;
  EdocsApi.setControlProperties(attributeProps);
}

function setAttrValue(attributeCode, attributeValue) {
  var attribute = EdocsApi.getAttributeValue(attributeCode);
  attribute.value = attributeValue;
  EdocsApi.setAttributeValue(attribute);
}

//Скрипт 1. Автоматичне визначення email ініціатора рахунку та підрозділу
function onCreate() {
  EdocsApi.setAttributeValue({
    code: "OrgRPEmail",
    value: EdocsApi.getEmployeeDataByEmployeeID(CurrentDocument.initiatorId)
      .email,
    text: null,
  });
  EdocsApi.setAttributeValue({
    code: "Branch",
    value: EdocsApi.getOrgUnitDataByUnitID(
      EdocsApi.getEmployeeDataByEmployeeID(CurrentDocument.initiatorId).unitId,
      1
    ).unitId,
    text: null,
  });
}

function onSearchBranch(searchRequest) {
  searchRequest.filterCollection.push({
    attributeCode: "SubdivisionLevelDirect",
    value: "1",
  });
}

//
function onCardInitialize() {
  EnterResultsTask();
  RegisterSpesificationTask();
  MakeDatePaymentTask();
  ReceiptFundsTask();
}
//Скрипт 2. Зміна властивостей атрибутів
function EnterResultsTask() {
  debugger;
  var stateTask = EdocsApi.getCaseTaskDataByCode("EnterResults").state;

  switch (stateTask) {
    case "assigned" || "inProgress" || "delegated":
      setPropertyRequired("SpesificationResult");
      setPropertyRequired("NumberProtocol");
      setPropertyRequired("DateProtocol");
      setPropertyHidden("SpesificationResult", false);
      setPropertyHidden("NumberProtocol", false);
      setPropertyHidden("DateProtocol", false);
      setPropertyDisabled("SpesificationResult", false);
      setPropertyDisabled("NumberProtocol", false);
      setPropertyDisabled("DateProtocol", false);
      break;

    case "completed":
      setPropertyRequired("SpesificationResult");
      setPropertyRequired("NumberProtocol");
      setPropertyRequired("DateProtocol");
      setPropertyHidden("SpesificationResult", false);
      setPropertyHidden("NumberProtocol", false);
      setPropertyHidden("DateProtocol", false);
      setPropertyDisabled("SpesificationResult");
      setPropertyDisabled("NumberProtocol");
      setPropertyDisabled("DateProtocol");

    default:
      setPropertyRequired("SpesificationResult", false);
      setPropertyRequired("NumberProtocol", false);
      setPropertyRequired("DateProtocol", false);
      setPropertyHidden("SpesificationResult");
      setPropertyHidden("NumberProtocol");
      setPropertyHidden("DateProtocol");
      setPropertyDisabled("SpesificationResult", false);
      setPropertyDisabled("NumberProtocol", false);
      setPropertyDisabled("DateProtocol", false);
      break;
  }
}

function onTaskExecuteEnterResults(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    if (!EdocsApi.getAttributeValue("SpesificationResult").value)
      throw `Внесіть значення в поле "Результат розгляду ТУ засіданням"`;
    if (!EdocsApi.getAttributeValue("NumberProtocol").value)
      throw `Внесіть значення в поле "Номер протоколу"`;
    if (!EdocsApi.getAttributeValue("DateProtocol").value)
      throw `Внесіть значення в поле "Дата протоколу"`;
  }
}

//Скрипт 3. Зміна властивостей атрибутів
function RegisterSpesificationTask() {
  debugger;
  var stateTask = EdocsApi.getCaseTaskDataByCode("RegisterSpesification").state;

  switch (stateTask) {
    case "assigned" || "inProgress" || "delegated":
      setPropertyRequired("RegDate");
      setPropertyRequired("RegNumber");
      setPropertyRequired("Registraion");
      setPropertyHidden("RegDate", false);
      setPropertyHidden("RegNumber", false);
      setPropertyHidden("Registraion", false);
      setPropertyDisabled("RegDate", false);
      setPropertyDisabled("RegNumber", false);
      setPropertyDisabled("Registraion", false);
      break;

    case "completed":
      setPropertyRequired("RegDate");
      setPropertyRequired("RegNumber");
      setPropertyRequired("Registraion");
      setPropertyHidden("RegDate", false);
      setPropertyHidden("RegNumber", false);
      setPropertyHidden("Registraion", false);
      setPropertyDisabled("RegDate");
      setPropertyDisabled("RegNumber");
      setPropertyDisabled("Registraion");

    default:
      setPropertyRequired("RegDate", false);
      setPropertyRequired("RegNumber", false);
      setPropertyRequired("Registraion", false);
      setPropertyHidden("RegDate");
      setPropertyHidden("RegNumber");
      setPropertyHidden("Registraion");
      setPropertyDisabled("RegDate", false);
      setPropertyDisabled("RegNumber", false);
      setPropertyDisabled("Registraion", false);
      break;
  }
}

function onTaskExecuteRegisterSpesification(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    if (!EdocsApi.getAttributeValue("RegDate").value)
      throw `Внесіть значення в поле "Реєстраційна дата"`;
    if (!EdocsApi.getAttributeValue("RegNumber").value)
      throw `Внесіть значення в поле "Реєстраційний номер"`;
    if (!EdocsApi.getAttributeValue("Registraion").value)
      throw `Внесіть значення в поле "Реєстрація"`;
  }
}

//Скрипт 4. Зміна властивостей атрибутів
function MakeDatePaymentTask() {
  debugger;
  var stateTask = EdocsApi.getCaseTaskDataByCode(
    "MakeDatePayment" + EdocsApi.getAttributeValue("Sections").value
  ).state;

  switch (stateTask) {
    case "assigned" || "inProgress" || "delegated":
      setPropertyRequired("PaymentOption");
      setPropertyHidden("PaymentOption", false);
      setPropertyDisabled("PaymentOption", false);
      break;

    case "completed":
      setPropertyRequired("PaymentOption");
      setPropertyHidden("PaymentOption", false);
      setPropertyDisabled("PaymentOption");

    default:
      setPropertyRequired("PaymentOption", false);
      setPropertyHidden("PaymentOption");
      setPropertyDisabled("PaymentOption", false);
      break;
  }
}

function onTaskExecuteRegisterAct(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    if (!EdocsApi.getAttributeValue("PaymentOption").value)
      throw `Внесіть значення в поле "Вид оплати"`;
  }
}

//Скрипт 5. Зміна властивостей атрибутів
function ReceiptFundsTask() {
  debugger;
  var stateTask = EdocsApi.getCaseTaskDataByCode(
    "ReceiptFunds" + EdocsApi.getAttributeValue("Sections").value
  ).state;

  switch (stateTask) {
    case "assigned" || "inProgress" || "delegated":
      setPropertyRequired("InvoiceStatus");
      setPropertyHidden("InvoiceStatus", false);
      setPropertyDisabled("InvoiceStatus", false);
      break;

    case "completed":
      setPropertyRequired("InvoiceStatus");
      setPropertyHidden("InvoiceStatus", false);
      setPropertyDisabled("InvoiceStatus");

    default:
      setPropertyRequired("InvoiceStatus", false);
      setPropertyHidden("InvoiceStatus");
      setPropertyDisabled("InvoiceStatus", false);
      break;
  }
}

function onTaskExecuteReceiptFunds(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    if (!EdocsApi.getAttributeValue("InvoiceStatus").value)
      throw `Внесіть значення в поле "Статус оплати Замовником"`;
  }
}

//Скрипт 6. Визначення ролі за розрізом
function setSections() {
  debugger;
  var Branch = EdocsApi.getAttributeValue("Branch");
  if (Branch.value) {
    var Sections = EdocsApi.getAttributeValue("Sections");
    var BranchData = EdocsApi.getOrgUnitDataByUnitID(Branch.value);
    if (Sections.value != BranchData.unitName) {
      Sections.value = BranchData.unitName;
      EdocsApi.setAttributeValue(Sections);
    }
  }
}

function onChangeBranch() {
  setSections();
}
