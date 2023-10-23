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
  if (
    stateTask == "assigned" ||
    stateTask == "inProgress" ||
    stateTask == "delegated"
  ) {
    setPropertyRequired("SpesificationResult");
    setPropertyRequired("NumberProtocol");
    setPropertyRequired("DateProtocol");
    setPropertyHidden("SpesificationResult", false);
    setPropertyHidden("NumberProtocol", false);
    setPropertyHidden("DateProtocol", false);
    setPropertyDisabled("SpesificationResult", false);
    setPropertyDisabled("NumberProtocol", false);
    setPropertyDisabled("DateProtocol", false);
  } else if (stateTask == "completed") {
    setPropertyRequired("SpesificationResult");
    setPropertyRequired("NumberProtocol");
    setPropertyRequired("DateProtocol");
    setPropertyHidden("SpesificationResult", false);
    setPropertyHidden("NumberProtocol", false);
    setPropertyHidden("DateProtocol", false);
    setPropertyDisabled("SpesificationResult");
    setPropertyDisabled("NumberProtocol");
    setPropertyDisabled("DateProtocol");
  } else {
    setPropertyRequired("SpesificationResult", false);
    setPropertyRequired("NumberProtocol", false);
    setPropertyRequired("DateProtocol", false);
    setPropertyHidden("SpesificationResult");
    setPropertyHidden("NumberProtocol");
    setPropertyHidden("DateProtocol");
    setPropertyDisabled("SpesificationResult", false);
    setPropertyDisabled("NumberProtocol", false);
    setPropertyDisabled("DateProtocol", false);
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
  if (
    stateTask == "assigned" ||
    stateTask == "inProgress" ||
    stateTask == "delegated"
  ) {
    setPropertyRequired("RegDate");
    setPropertyRequired("RegNumber");
    setPropertyRequired("Registraion");
    setPropertyHidden("RegDate", false);
    setPropertyHidden("RegNumber", false);
    setPropertyHidden("Registraion", false);
    setPropertyDisabled("RegDate", false);
    setPropertyDisabled("RegNumber", false);
    setPropertyDisabled("Registraion", false);
  } else if (stateTask == "completed") {
    setPropertyRequired("RegDate");
    setPropertyRequired("RegNumber");
    setPropertyRequired("Registraion");
    setPropertyHidden("RegDate", false);
    setPropertyHidden("RegNumber", false);
    setPropertyHidden("Registraion", false);
    setPropertyDisabled("RegDate");
    setPropertyDisabled("RegNumber");
    setPropertyDisabled("Registraion");
  } else {
    setPropertyRequired("RegDate", false);
    setPropertyRequired("RegNumber", false);
    setPropertyRequired("Registraion", false);
    setPropertyHidden("RegDate");
    setPropertyHidden("RegNumber");
    setPropertyHidden("Registraion");
    setPropertyDisabled("RegDate", false);
    setPropertyDisabled("RegNumber", false);
    setPropertyDisabled("Registraion", false);
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
  )?.state;

  if (
    stateTask == "assigned" ||
    stateTask == "inProgress" ||
    stateTask == "delegated"
  ) {
    setPropertyRequired("PaymentOption");
    setPropertyHidden("PaymentOption", false);
    setPropertyDisabled("PaymentOption", false);
  } else if (stateTask == "completed") {
    setPropertyRequired("PaymentOption");
    setPropertyHidden("PaymentOption", false);
    setPropertyDisabled("PaymentOption");
  } else {
    setPropertyRequired("PaymentOption", false);
    setPropertyHidden("PaymentOption");
    setPropertyDisabled("PaymentOption", false);
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
  )?.state;

  if (
    stateTask == "assigned" ||
    stateTask == "inProgress" ||
    stateTask == "delegated"
  ) {
    setPropertyRequired("InvoiceStatus");
    setPropertyHidden("InvoiceStatus", false);
    setPropertyDisabled("InvoiceStatus", false);
  } else if (stateTask == "completed") {
    setPropertyRequired("InvoiceStatus");
    setPropertyHidden("InvoiceStatus", false);
    setPropertyDisabled("InvoiceStatus");
  } else {
    setPropertyRequired("InvoiceStatus", false);
    setPropertyHidden("InvoiceStatus");
    setPropertyDisabled("InvoiceStatus", false);
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

function onBeforeCardSave() {
  setSections();
}
//Скрипт 6. Передача ТУ для ознайомлення  в зовнішню систему
function setDataForESIGN() {
  debugger;
  var registrationDate = EdocsApi.getAttributeValue("RegDate").value;
  var registrationNumber = EdocsApi.getAttributeValue("RegNumber").value;
  var caseType = EdocsApi.getAttributeValue("DocType").value;
  var caseKind = EdocsApi.getAttributeValue("DocKind").text;
  var name = "";
  if (caseKind) {
    name += caseKind;
  } else {
    name += caseType;
  }
  name +=
    " №" +
    (registrationNumber ? registrationNumber : CurrentDocument.id) +
    (!registrationDate
      ? ""
      : " від " + moment(registrationDate).format("DD.MM.YYYY"));
  doc = {
    DocName: name,
    extSysDocId: CurrentDocument.id,
    ExtSysDocVersion: CurrentDocument.version,
    docType: "Spesification",
    docDate: registrationDate,
    docNum: registrationNumber,
    File: "",
    parties: [
      {
        taskType: "ToSign",
        taskState: "Done",
        legalEntityCode: EdocsApi.getAttributeValue("OrgCode").value,
        contactPersonEmail: EdocsApi.getAttributeValue("OrgRPEmail").value,
        signatures: [],
      },
      {
        taskType: "ToRead",
        taskState: "NotAssigned",
        legalEntityCode: EdocsApi.getAttributeValue("ContractorCode").value,
        contactPersonEmail:
          EdocsApi.getAttributeValue("ContractorRPEmail").value,
        expectedSignatures: [],
      },
    ],
    additionalAttributes: [
      {
        code: "docDate",
        type: "dateTime",
        value: registrationDate,
      },
      {
        code: "docNum",
        type: "string",
        value: registrationNumber,
      },
    ],
    sendingSettings: {
      attachFiles: "fixed", //, можна також встановлювати 'firstOnly' - Лише файл із першої зафіксованої вкладки(Головний файл), або 'all' - всі файли, 'fixed' - усі зафіксовані
      attachSignatures: "signatureAndStamp", // -'signatureAndStamp'Типи “Підпис” або “Печатка”, можна також встановити 'all' - усі типи цифрових підписів
    },
  };
  EdocsApi.setAttributeValue({ code: "JSON", value: JSON.stringify(doc) });
}

function onTaskExecuteSendOutDoc(routeStage) {
  debugger;
  if (routeStage.executionResult == "rejected") {
    return;
  }
  setDataForESIGN();
  var idnumber = EdocsApi.getAttributeValue("DocId");
  var methodData = {
    extSysDocId: idnumber.value,
  };

  routeStage.externalAPIExecutingParams = {
    externalSystemCode: "ESIGN1", // код зовнішньої системи
    externalSystemMethod: "integration/importDoc", // метод зовнішньої системи
    data: methodData, // дані, що очікує зовнішня система для заданого методу
    executeAsync: true, // виконувати завдання асинхронно
  };
}

function onTaskCommentedSendOutDoc(caseTaskComment) {
  debugger;
  var orgCode = EdocsApi.getAttributeValue("OrgCode").value;
  var orgShortName = EdocsApi.getAttributeValue("OrgShortName").value;
  if (!orgCode || !orgShortName) {
    return;
  }
  var idnumber = EdocsApi.getAttributeValue("DocId");
  var methodData = {
    extSysDocId: idnumber.value,
    eventType: "CommentAdded",
    comment: caseTaskComment.comment,
    partyCode: orgCode,
    userTitle: CurrentUser.name,
    partyName: orgShortName,
    occuredAt: new Date(),
  };

  caseTaskComment.externalAPIExecutingParams = {
    externalSystemCode: "ESIGN1", // код зовнішньої системи
    externalSystemMethod: "integration/processEvent", // метод зовнішньої системи
    data: methodData, // дані, що очікує зовнішня система для заданого методу
    executeAsync: true, // виконувати завдання асинхронно
  };
}
