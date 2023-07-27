console.log("commonFunctionJS");
// چند نکته
// این توابع بر اساس نیازهای خاص در فرآیندهای مختلف به وجود آمده‌اند و همه‌ی آنها مفید یا کامل نیستند
// اگر ایده‌ی بهتری برای تابع وجود دارد لطفا تابع قدیمی را هم با تابع جدید سازگار کنید (اگر امکانش بود) ولی اسم آنرا عوض نکنید که کدهای از پیش نوشته شده خراب نشوند
// در نهایت تابع قدیمی را به قسمت پایین این صفحه منتقل کنید
// در توابعی که گرید به عنوان ورودی گرفته میشود هم میتوان آن را به صورت آبجکت و هم به صورت اسم گرید پاس داد
// همه‌ی توابع هم تک مقداری میتوانند کار کنند و هم اگر مقادیر به صورت آرایه پاس داده شوند

// تمام سطرهای گرید رو حذف میکند
// آبجکت گرید یا اسم گرید را میگیرد
// deleteAllRows(invoiceDetail) یا deleteAllRows(invoiceDetail.name)
function deleteAllRows(grid) {
	let gridName = getGridName(grid);
	const rows = $(`#${gridName}`).getNumberRows();
	for (let row = 1; row <= rows; row++) {
		$(`#${gridName}`).deleteRow(1);
	}
}

// در سطرهای گرید اگر شماره ستون فرستاده شده مقدارش خالی باشد آن سطر حذف می‌شود
// هم بر اساس مقدار و هم بر اساس اینکه فایل آپلود شده باشد کار میکند
// deleteRowBasedOnColumnIndex(invoiceDetail, 2)
// در این مثال اگر در هر سطر گرید اگر مثدار ستون دوم آن خالی باشد آن سطر حذف خواهد شد
function deleteRowBasedOnColumnIndex(grid, columnNumber) {
	let gridName = getGridName(grid);
	const rowIndiceToBeDeleted = rowsThatShouldBeDeleted?.(gridName, columnNumber).reverse?.();
	rowIndiceToBeDeleted.forEach?.(rowIndex => {
		$(`#${gridName}`).deleteRow(rowIndex);
	});

	function rowsThatShouldBeDeleted(gridName, columnNumber) {
		if (!gridName || !columnNumber) return;
		let result = [];
		const rows = $(`#${gridName}`).getNumberRows();
		for (let row = 1; row <= rows; row++) {
			if (isColumnAttachment(gridName, row, columnNumber)) {
				if (!doesHaveAttachment(gridName, row, columnNumber)) {
					result.push(row);
				}
				continue;
			}
			if ($(`#${gridName}`).getValue(row, columnNumber) == '') {
				result.push(row);
			}
		}
		return result;
	}
}

// تشخیص میدهد که در گرید و سطر و ستون مشخص شده آیا ستون از نوع فایل آپلودی است یا خیر
// true => ستون از نوع فایل آپلودی است
// isColumnAttachment(invoiceDetail, 1, 3)
// در این مثال بررسی میشود که سطر اول و ستون سوم از نوع فایل آپلود است یا نه
function isColumnAttachment(grid, row, columnNumber) {
	const gridName = getGridName(grid);
	if (getFieldById(`${gridName}`)?.gridtable[row - 1][columnNumber - 1]?.model?.attributes?.fileCollection) return true;
	return false;
}

// تشخیص میدهد که در گرید، سطر و ستون مشخص شده فایل آپلود شده است یا نه
// true => فایل آپلود شده
// doesHaveAttachment(invoiceDetail, 1, 3)
// در سطر 1 و ستون سوم آیا فایل آپلود شده است یا نه
function doesHaveAttachment(grid, row, columnNumber) {
	const gridName = getGridName(grid);
	if (getFieldById(`${gridName}`)?.gridtable[row - 1][columnNumber - 1]?.model?.attributes?.fileCollection?.models?.length !== 0) return true;
	return false;
}

// صرفا جهت راحت صدا زدن تابعهای گرید است
// اگر آبجکت گرید فرستاده بشود نام گرید را برمیگرداند
// اگر نام گرید فرستاده شود همان نام را برمیگرداند
function getGridName(grid) {
	if (!grid) return;
	let gridName;
	if (typeof (grid) === "object") gridName = grid.name;
	else gridName = grid;
	return gridName;
}

// صرفا برای استفاده از بهتر از تابعهای es6
// متغیر ورودی اگر آرایه نباشد یک آرایه تک عنصری از آن مقدار برمیگرداند
// اگر آرایه‌ای از متغیرها فرستاده شده باشد همان را برمیگرداند
// اگر یک مقدار فرستاده شده باشد آنرا تبدیل به آرایه تک عنصری میکند و برمیگرداند
// getInputAsArray('stuff') => ['stuff']
// getInputAsArray([1, 2, 3]) => [1, 2, 3]
function getInputAsArray(sentVariable) {
	if (Array.isArray(sentVariable)) return sentVariable.filter(Boolean);
	else if (!sentVariable) return [];
	return [sentVariable];
}

// آرایه ای از آبجکت گریدها را به آرایه ای از اسم گریدها تبدیل میکند
function getArrayOfGridNames(sentVariable) {
	const arrayOfGridNames = getInputAsArray(sentVariable).map(input => {
		if (typeof input === 'object') return getGridName(input);
		return input;
	});
	return arrayOfGridNames;
}

// سطر بی مقدار اول را حذف میکند
// به صورت پیش فرض ستون اول را بررسی مقدار میکند
// deleteFirstRow(invoiceDetail, 2) => اگر ستون دوم بی مقدار بود از سطر اول آن را حذف میکند
// deleteFirstRow(invoiceDetail) => ستون اول از سطر اول اگر بی مقدار بود حذف میکند
function deleteFirstRow(grids, columnToCheck = 1) {
	const firstRow = 1;
	grids = getArrayOfGridNames(grids);

	grids.forEach(grid => {
		grid = getGridName(grid);
		if ($(`#${grid}`).getValue(firstRow, columnToCheck) == "" && $(`#${grid}`).getNumberRows() > 0)
			$(`#${grid}`).deleteRow(firstRow);
	});
}

// فیلدهای غیر گریدی فرستاده شده را غیر ضروری و پنهان میکند
// اگر در صدا زدن
// hide و show و toggle
// اگر عدد قرار دهیم بر اساس عدد(میلی ثانیه) با انیمیشن 
// hide و show و toggle
// را انجام می‌دهد
// hideElements(['elementID1', 'elementID2']) => پنهان کردن هم به صورت آرایه ای میتواند صورت بگیرد
// hideElements('elementID3', 270); =>  هم مقداری، با 270 میلی ثانیه انیمیشن
function hideElements(elementStrings, animationDelay = 0) {
	hideShowElements(elementStrings, 'hide', animationDelay);
}

// فیلدهای غیر گریدی فرستاده شده را ضروری و آشکار"؟" میکند
// مثال همانند بالا
function showElements(elementStrings, animationDelay = 0) {
	hideShowElements(elementStrings, 'show', animationDelay);
}

// این تابع برای پنهان کردن ستونها از گرید و غیرضروری کردن آنها است
// hideColumns(invoiceDetail, [1, 2, 3]) => ستون های 1 و 2 و 3 را از گرید پنهان و غیر ضروری میکند
// hideColumns(invoiceDetail.name, 1) => به صورت تک مقدار نیز کار میکند
function hideColumns(grid, columnNumbers) {
	hideShowColumns(grid, columnNumbers, "hide");
}

function showColumns(grid, columnNumbers) {
	hideShowColumns(grid, columnNumbers, "show");
}

// ستون‌های گرید فرستاده شده را غیر ضروری میکند
// disableValidationForColumns(invoiceDetail, [1, 2, 3]) => ستون های شماره 1 و 2 و 3 را غیر ضروری میکند
// disableValidationForColumns(invoiceDetail, 1) => به صورت مقداری هم میتوانید تابع را صدا بزنید
function disableValidationForColumns(grid, columns) {
	enableDisableValidationForColumns(grid, columns, true);
}

// ستون‌های گرید فرستاده شده را ضروری میکند
// مثال همانند بالا
function enableValidationForColumns(grid, columns) {
	enableDisableValidationForColumns(grid, columns, false);
}

// هشدار با کتابخانه jqueryConfirm
function customeAlert(message) {
	customAlert(message);
}

// هشدار با کتابخانه jqueryConfirm
// کار میکند
function customAlert(message) {
	$.confirm({
		title: 'خطا!',
		content: message,
		type: 'red',
		typeAnimated: true,
		buttons: {
			tryAgain: {
				text: 'تلاش مجدد',
				btnClass: 'btn-red'
			}
		}
	});
}

// پیام موفقیت آمیز بودن
// کتابخانه jqueryConfirm
// نیاز دارد
function successAlert(message) {
	customSuccess(message);
}

function customSuccess(message) {
	$.confirm({
		title: 'ثبت!',
		content: message,
		type: 'green',
		typeAnimated: true,
		buttons: {
			tryAgain: {
				text: 'تایید',
				btnClass: 'btn-green',
			}
		}
	});
}

// دکمه‌ی حذف را از گرید پنهان می‌کند
// hideDeleteButtonsFromGrid(invoiceDetail);
function hideDeleteButtonsFromGrid(grid, animationDelay = 0) {
	const gridName = getGridName(grid);
	$(`#${gridName}`).find('.remove-row button.glyphicon-trash').hide(animationDelay);
}

// دکمه اضافه کردن را از گرید پنهان می‌کند
// مثال مانند بالا
function hideNewButtonFromGrid(grid, animationDelay = 0) {
	const gridName = getGridName(grid);
	$(`#${gridName}`).find('.pmdynaform-grid-new').hide(animationDelay);
}

// هم دکمه حذف و هم دکمه اضافه را از گرید پنهان کند
// مثال مانند بالا
function hideNewAndDeleteButtonsFromGrid(grid, animationDelay = 0) {
	hideNewButtonFromGrid(grid, animationDelay)
	hideDeleteButtonsFromGrid(grid, animationDelay);
}

// هم دکمه حذف و هم دکمه اضافه را در گرید نمایان"؟" میکند
// مثال مانند بالا
function showNewAndDeleteButtonsFromGrid(grid, animationDelay = 0) {
	const gridName = getGridName(grid);
	$(`#${gridName}`).find('.pmdynaform-grid-new').show(animationDelay);
	$(`#${gridName}`).find('.remove-row').show(animationDelay);
}

// دکمه حذف و اضافه را از گرید حذف میکند
// مثال مانند بالا
function deleteNewAndDeleteButtonsFromGrid(grid) {
	const gridName = getGridName(grid);
	$(`#${gridName}`).find('.pmdynaform-grid-new').remove();
	$(`#${gridName}`).find('.remove-row').remove();
}

// آرایه‌ای از فیلدهای گریدی و غیر گریدی را دریافت میکند
// و فقط اجازه ورود شماره میدهد و آنرا فارسی میکند
// flagPriceFormat = true
// باشد سه رقم سه رقم اعداد را از هم جدا میکند
// parentElement
// محدود کننده‌ی آیدی‌ها می‌باشد برای بهینه سازی
// onlyAcceptPersianNumber(['columnName1', 'columnName2']) => فقط اجازه ورود اعداد فارسی به ستون‌ها با نام‌های مقابل دارند
// onlyAcceptPersianNumber('columnName1', true) => به صورت تک مقداری نیز میتوان فرستاد و سه رقم سه رقم آنها را جدا میکند
// onlyAcceptPersianNumber('columnName3', true, $('#invoiceDetail')) => المان گرید را به آن میدهیم تا کل داکیومنت را دنبال المان نگردد
function onlyAcceptPersianNumber(fieldNames, flagPriceFormat = false, parentElement = $("form").first()) {
	fieldNames = getInputAsArray(fieldNames);
	numberOnly(fieldNames, parentElement);
	persianNumberOnly(fieldNames, parentElement, flagPriceFormat);
}

// آرایه‌ای از المان‌های گریدی و غیرگریدی را دریافت می‌کند و تمام مقدارهای داخلشان را به فارسی تبدیل می‌کند
// persianConversion(['fieldName1', 'fieldName2'], true) => مقادیر از قبل وارد شده‌ را فارسی میکند و سه رقم سه رقم از هم جدا میکند
function persianConversion(fieldNames, flagPriceFormat = false) {
	persianEnglishConversion(fieldNames, 'persian', flagPriceFormat);
}

// آرایه‌ای از المان‌های گریدی و غیرگریدی را دریافت می‌کند و تمام مقدارهای داخلشان را به انگلیسی تبدیل می‌کند
// englishConversion(['fieldName1', 'fieldName2']) => مقادیر فارسی از قبل وارد شده را انگلیسی می‌کند
// englishConversion('fieldName1'); => به صورت تک مقداری نیز کار میکند
function englishConversion(fieldNames) {
	persianEnglishConversion(fieldNames, 'english');
}

// آرایه‌ای از فیلدهای گریدی و غیرگریدی دریافت میکند و فقط اجازه ورود شماره می‌دهد
// parentElement
// برای بهینه سازی می‌باشد
// numberOnly(['fieldName1', 'fieldName2'])
// numberOnly('fieldName1', $("#invoiceDetail"))
function numberOnly(fieldNames, parentElement = $("form").first()) {
	parentElement.on("keypress", turnElementIDStringsIntoElements(fieldNames), event => {
		return ((event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46)
	});
}

// آرایه‌ای از فیلدهای گریدی و غیرگریدی دریافت میکند و تمام اعداد داخل خود را فارسی میکند
// parentElement
// برای بهینه سازی می‌باشد
// flagPriceFormat = true
// اعداد را سه رقم سه رقم جدا میکند
// persianNumberOnly('ADDRESS')
function persianNumberOnly(fieldNames, parentElement = $("form").first(), flagPriceFormat = false) {
	parentElement.on("keyup", turnElementIDStringsIntoElements(fieldNames), event => {
		$(event.target).val(toPersian($(event.target).val(), flagPriceFormat));
	});
}

// عدد انگلیسی را به فارسی تبدیل میکند
// flagPriceFormat = true
// باشد سه رقم سه رقم اعداد را جدا می‌کند
// 123456 => ۱۲۳,۴۵۶
function toPersian(inputInEnglish, flagPriceFormat = false) {
	let isNegative = false;
	if (inputInEnglish < 0) {
		isNegative = true;
		inputInEnglish *= -1;
	}
	if (inputInEnglish.includes?.('-')) {
		isNegative = true;
		inputInEnglish = inputInEnglish.replace('-', '');
	}
	if (!inputInEnglish && inputInEnglish != 0) return;
	const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
	let inputInPersian = inputInEnglish.toString().replace(/[0-9]/g, w => id[+w]);
	if (flagPriceFormat) inputInPersian = priceFormat(inputInPersian);
	if (isNegative) {
		inputInPersian = `-${inputInPersian}`;
	}
	return inputInPersian;
}

// تابع سه رقم سه رقم جدا کننده‌ی اعداد
// priceFormat(1234) => 1,234
function priceFormat(number) {
	return number.replace(/,/g, "")
		.replace(/./g, function (c, i, a) {
			return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
		});
}

// عدد فارسی را به عدد انگلیسی تبدیل میکند
// toEnglish('۱۲۳') => '123'
function toEnglish(inputInPersian) {
	if (!inputInPersian) return;
	const id = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	const id1 = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

	inputInPersian = typeof inputInPersian === 'number' ? (inputInPersian).toString() : inputInPersian;

	return inputInPersian.replace(/,/g, "").replace(/[۰-۹]/g, function (w) {
		return id[id1.indexOf(w)];
	});
}

// تشخیص می‌دهد که المان از گرید است یا خیر
// isElementFromGrid($("#ADDRESS").getControl()) => false
// isElementFromGrid($("#InvoiceDetail").getControl(1, 3)) => true
function isElementFromGrid(element) {
	if (!element) return;
	const idOfElement = element?.attr?.('id');
	if (!idOfElement) return;

	const regex = /\w*\[\w+]\[\d+\]\[\w+\]/gm;
	const result = regex.test(idOfElement);
	return result;
}

// از گرید و اسم ستون فرستاده شده شماره ستون مربوط به آن گرید را استخراج می‌کند
// getColumnIndex(InvoiceDetail, 'fieldName1') => 1
function getColumnIndex(gridName, columnName) {
	let columnIndex;
	$(`#${gridName} .form-group`)
		.first()
		.children()
		.not('.index-row')
		.not('.remove-row')
		.each((index, element) => {
			if ($(element).find(`div#\\[${gridName}\\]\\[1\\]\\[${columnName}\\]`).attr("id")) {
				columnIndex = index + 1;
				return;
			}
		});
	return columnIndex;
}

// آرایه‌ای از آیدی‌های المان‌ها دریافت میکند و آن را به استرینگی تبدیل میکند که با آن بشود
// با jquery
// کل المان‌هایی که با 
// elementID]
// تمام می‌شوند را انتخاب می‌کند
// مخصوصا برای انتخاب المان‌های گرید نوشته شده است
function turnElementIDStringsIntoElements(elementStrings, additionalLimiterInsideInput = '', additionalLimiterOutsideInput = '') {
	elementStrings = getInputAsArray(elementStrings);

	return elementStrings.map(elementString =>
		// `:input[id$="[${elementString}]${additionalLimiterInsideInput}"]${additionalLimiterOutsideInput}, :input[id$="[${elementString}_label]${additionalLimiterInsideInput}"]${additionalLimiterOutsideInput}`
		`:input[id$="[${elementString}]${additionalLimiterInsideInput}"]${additionalLimiterOutsideInput}`
	).join(", ");
}

// کل ستون‌های سطر را غیرفعال می‌کند
// disableRow(invoiceDetail, 1) => کل ستون‌های سطر اول را غیرفعال میکند
function disableRow(gridName, rowIndex) {
	enableOrDisableRow(gridName, rowIndex, true);
}

// کل ستون‌های سطر را فعال می‌کند
// برعکس بالا
function enableRow(gridName, rowIndex) {
	enableOrDisableRow(gridName, rowIndex, false);
}

// تمام فیلدهای فرم را غیرفعال میکند
function disableAll() {
	const formGroup = $('.form-group input, .form-group select, .form-group textarea');

	$.each(formGroup, function (index, element) {
		$(element).attr("disabled", true);
	});

	const dateChooseDayButtons = $('.input-group-addon');

	$.each(dateChooseDayButtons, (index, element) => {
		$(element).unbind();
	});
}

// فیلد غیرگریدی فرم را اگر مقدار داشته باشد 
// ضروری و فعالش میکند
function enableFieldIfEmpty(elementID) {
	enableIfEmptyDisableIfNonEmpty(elementID);
}

// فیلد غیرگریدی فرم را اگر مقدار نداشته باشد
// غیرضروری و غیرفعالش می‌کند
function disableFieldIfNonEmpty(elementID) {
	enableIfEmptyDisableIfNonEmpty(elementID);
}

// فیلدهای گریدی یا غیرگریدی را فعال می‌کند
// enableFields(['fieldName1', 'fieldName2']);
function enableFields(fieldNames) {
	enableDisableFields(fieldNames, false);
}

// فیلدهای گریدی یا غیرگریدی را غیرفعال می‌کند
// مثال مانند بالا
function disableFields(fieldNames) {
	enableDisableFields(fieldNames, true);
}

// ستون‌ها را برای سطر مشخص شده غیرفعال می‌کند
// disableColumns(invoiceDetail, [4, 5, 6], 2) => برای گرید سطر 2 ستون‌های 4 و 5 و 6 را غیرفعال می‌کند
function disableColumns(grid, columnIndexes, rowIndex) {
	enableOrDisableColumns(grid, columnIndexes, rowIndex, true);
}

// برعکس بالا
// مثال مانند بالا
function enableColumns(grid, columnIndexes, rowIndex) {
	enableOrDisableColumns(grid, columnIndexes, rowIndex, false);
}

// اگر گرید خالی باشد یک سطر به گرید اضافه میکند
function ifEmptyAddRow(grid) {
	grid = getGridName(grid);

	if ($(`#${grid}`).getNumberRows() == 0) {
		$(`#${grid}`).addRow();
	}
}

// عدد فارسی یا انگلیسی استرینگ را به صورت عدد اینتیجر برمیگرداند اگر مقدارش قابل قبول نباشد 0 برمیگرداند
// getNumber('۱۲۳') => 123
// getNumber('randomText') => 0
function getNumber(numberInPersian) {
	if (numberInPersian == "") return 0;
	const englishNumber = parseFloat(toEnglish(numberInPersian)) ?? 0;
	if (isNaN(englishNumber)) return 0;
	return englishNumber;
}

// جهت استفاده برای تابع‌های گرید می‌باشد
// بر اساس
// event object
// سطر را برمیگرداند
function getRowIndex(event) {
	return (event.target.id).match(/[\d+]/g).join("");
}




//-------------------------------------------------------------------------required Fields Have Value-------------------------------------------------------
// بررسی میکند که آیا فیلد غیرضروری خالی وجود دارد یا نه
// doRequiredFieldsHaveValue() => true تمام فیلدهای ضروری مقدار دارند
function doRequiredFieldsHaveValue() {
	const requiredFormElements = getRequiredFormElements();
	const formFieldsHaveValue = doFieldsHaveValue(requiredFormElements) ?? true;
	const gridsHaveValue = doRequiredGridColumnHaveValue();

	return (gridsHaveValue && formFieldsHaveValue);
}

// تشخیص اینکه فیلدهای فرستاده شده مقدار دارند یا نه
// doFieldsHaveValue(['fieldName1', 'fieldName2']) => true
// doFieldsHaveValue('fieldName1') => true
function doFieldsHaveValue(fields) {
	const fieldNames = getInputAsArray(fields);
	let result = true;
	$(turnElementIDStringsIntoElements(fieldNames)).each((index, element) => {
		if ($(element).val() === "") {
			result = false;
			return false;
		}
	});
	return result;
}
//--------------------------------------------------------------------------end of required Fields Have Value -----------------------------------------------------
// اگر گریدهای فرستاده شده سطر داشته باشند true
// اگر هر کدام از گریدهای فرستاده شده سطر نداشته باشند false
// برای استفاده در 
// validation
// doesNotHaveAtLeastOneRow([invoiceDetail, paymentDetail]) => false -> اگر هر کدام از دو گرید هیچ سطری نداشته باشند
function doesNotHaveAtLeastOneRow(grids) {
	grids = getArrayOfGridNames(grids);
	return grids.some(gridName => $(`#${gridName}`).getNumberRows() === 0);
}

// فقط اجازه ورود کاراکترهای فارسی به فیلدهای فرستاده شده را می‌دهد
// عدد هم میشه وارد کرد اگه پارامتر
// isNumberAcceptable = true باشه
// parentElement صرفا جهت بهینه سازی است 
// onlyAcceptPersianCharacters('Address', true); => اجازه ورود حروف و اعداد را در فیلد آدرس می‌دهد
// onlyAcceptPersianCharacters(['FIRST_NAME', 'LAST_NAME']); => فقط اجازه را برای حروف فارسی در اسم و فامیل میدهد
function onlyAcceptPersianCharacters(fieldIDs, isNumberAcceptable = false, parentElement = $("form").first()) {
	fieldIDs = getInputAsArray(fieldIDs);

	let farsiKeys = [
		32, 1548, 1711, 1608,
		1705, 44,
		1616, 1584, 1609, 1615, 1609, 1604,
		1570, 1548, 8217, 1583,
		1614, 1613, 1601, 1611,
		1618, 1573, 1580, 1688, 1670,
		1662, 1588, 1584, 1586, 1740, 1579, 1576, 1604,
		1575, 1607, 1578, 1606, 1605, 1574, 1583, 1582,
		1581, 1590, 1602, 1587, 1601, 1593, 1585, 1589,
		1591, 1594, 1592, 1617
	];

	if (isNumberAcceptable === true) {
		farsiKeys = farsiKeys.concat([48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
	}

	parentElement.on("keypress", turnElementIDStringsIntoElements(fieldIDs), event => {
		if (farsiKeys.indexOf(event.charCode) === -1) {
			let message = "کیبورد خود را فارسی کنید";
			if (!isNumberAcceptable) {
				message = `${message}. همچنین عدد و حروفی مانند )(/*,%@ وارد نکنید.`
			}
			// customeAlert(message);
			showMessage('', 'danger', 4000, message);
			return false;
		}
		return true;
	});

	if (isNumberAcceptable === true) {
		parentElement.on("keyup", turnElementIDStringsIntoElements(fieldIDs), event => {
			$(event.target).val(toPersian($(event.target).val()));
		});
	}
}

// برای فیلدهای فرستاده شده فقط امکان ورود اطلاعات کد پستی را می‌دهد
function validationPostalCode(fieldIDs, parentElement = $("form").first()) {
	fieldIDs = getInputAsArray(fieldIDs);

	defineMinMaxForInputs(fieldIDs, 10, 10, parentElement);
	// onlyAcceptPersianNumber(fieldIDs, false, parentElement);
}

// برای فیلدهای فرستاده شده فقط امکان ورود اطلاعات کدملی موجود میشود
function validationNationalNumber(fieldIDs, person, parentElement = $("form").first()) {
	if (!person || (person !== "real" && person !== "legal")) return;
	fieldIDs = getInputAsArray(fieldIDs);
	const characterLimit = person === "real" ? 10 : 11;

	defineMinMaxForInputs(fieldIDs, characterLimit, characterLimit, parentElement);
	// onlyAcceptPersianNumber(fieldIDs, false, parentElement);

	const errorType = person === "real" ? ['کد ملی', 'شخص حقیقی'] : ['شناسه ملی', 'شخص حقوقی'];

	parentElement.on("focusout", turnElementIDStringsIntoElements(fieldIDs), event => {
		const nationalNumberToBeChecked = toEnglish($(event.target).val());
		if (!nationalNumberToBeChecked) return;
		const isValid = person === "legal" ? isNationalCodeValid(nationalNumberToBeChecked) : isNationalIDValid(nationalNumberToBeChecked);
		if (!isValid) {
			$(event.target).val("");
			showMessage('', 'danger', 4000, `${errorType[0]} وارد شده برای ${errorType[1]} معتبر نیست. لطفا مجددا تلاش کنید`);
		}
	});
}

// برای فیلدهای فرستاده شده فقط امکان ورود اطلاعات کد اقتصادی وجود دارد
function validationEconomicCode(fieldIDs, parentElement = $("form").first()) {
	fieldIDs = getInputAsArray(fieldIDs);

	defineMinMaxForInputs(fieldIDs, 12, 12, parentElement);
	// onlyAcceptPersianNumber(fieldIDs, false, parentElement);
}

// برای فیلدهای فرستاده شده فقط امکان ورود اطلاعات شماره موبایل وجود دارد
function validationMobile(fieldIDs, parentElement = $("form").first()) {
	fieldIDs = getInputAsArray(fieldIDs);

	defineMinMaxForInputs(fieldIDs, 11, 10, parentElement);
	// onlyAcceptPersianNumber(fieldIDs, false, parentElement);
}

// برای فیلدهای فرستاده شده فقط امکان ورود اطلاعات شماره موبایل وجود خواهد داشت
function validationPhone(fieldIDs, parentElement = $("form").first()) {
	fieldIDs = getInputAsArray(fieldIDs);

	defineMinMaxForInputs(fieldIDs, 11, 8, parentElement);
	// onlyAcceptPersianNumber(fieldIDs, false, parentElement);
}

// برای فیلدهای فرستاده شده فقط امکان ورود اطلاعات شماره تلفن وجود خواهد داشت
function validationFax(fieldIDs, parentElement = $("form").first()) {
	fieldIDs = getInputAsArray(fieldIDs);

	defineMinMaxForInputs(fieldIDs, 11, 8, parentElement);
	// onlyAcceptPersianNumber(fieldIDs, false, parentElement);
}

// تشخیص اینکه شماره وارد شده شناسه ملی صحیح است یا خیر
function isNationalCodeValid(code) {
	if (!code) return;
	const L = code.length;

	if (L < 11 || parseInt(code, 10) == 0) return false;

	if (parseInt(code.substr(3, 6), 10) == 0) return false;
	const c = parseInt(code.substr(10, 1), 10);
	const d = parseInt(code.substr(9, 1), 10) + 2;
	const z = new Array(29, 27, 23, 19, 17);
	let s = 0;
	for (let i = 0; i < 10; i++)
		s += (d + parseInt(code.substr(i, 1), 10)) * z[i % 5];
	s = s % 11; if (s == 10) s = 0;
	return (c == s);
}

// تشخیص اینکه شماره وارد شده کد ملی صحیح است یا خیر
const isNationalIDValid = code => {
	if (code.length !== 10 || /(\d)(\1){9}/.test(code)) return false;

	let sum = 0,
		chars = code.split(''),
		lastDigit,
		remainder;

	for (let i = 0; i < 9; i++) sum += +chars[i] * (10 - i);

	remainder = sum % 11;
	lastDigit = remainder < 2 ? remainder : 11 - remainder;

	return +chars[9] === lastDigit;
};

// در گرید اگه صفحه بندی موجود باشه و اگه کمتر از
// paginationNumberOfPages
// صفحه بندی رو پنهان میکنه تعداد سطر داشته باشه 
// اگه بیشتر بود نمایانش میکنه
// togglePaginationOnGrids(invoiceDetail, 10) => اگه اندازه صفحه بندی 10 بود وقتی گرید کمتر از 10 سطر داشته باشه صفحه بندی پنهان میشه
// باید در 
// onaddrow
// و اول فرم اجرا شود
function togglePaginationOnGrids(arrayOfGrids, paginationNumberOfPages = 5) {
	arrayOfGrids = getArrayOfGridNames(arrayOfGrids);

	arrayOfGrids.forEach(grid => {
		const name = getGridName(grid);
		if ($(`#${name}`).getNumberRows() <= paginationNumberOfPages) {
			$(`#${name} .pmdynaform-grid-pagination`).hide(220);
		}
		else {
			$(`#${name} .pmdynaform-grid-pagination`).show(220);
		}
	});
}

// به صورت داینامیک میتوان انتخاب کننده تاریخ را فعال یا غیرفعال کرد
// نحوه کار به این صورت است که با property 
// css
// pointer-events: none;
// جلوی کلیک شدن روی انتخاب کننده را میگیریم
// در اینجا mainStyle کلاسی دارد
// به نام disable-date-picker
// که دقیقا همین کار را انجام می‌دهد
// disableDatePicker('BEGIN_DATE')
function disableDatePicker(inputElement) {
	enableDisableDatePicker(inputElement, true);
}

// مثل بالا
function enableDatePicker(inputElement) {
	enableDisableDatePicker(inputElement, false);
}

// تاریخ امروز میلادی رو برمیگردونه
// => "2022-01-23"
// قابل استفاده برای مقدار گذاری 
// datepicker processmaker
function getCurrentDate() {
	const today = new Date();

	const dd = today.getDate().toString().padStart(2, '0');
	const mm = (today.getMonth() + 1).toString().padStart(2, '0');
	const yyyy = today.getFullYear();

	return `${yyyy}-${mm}-${dd}`;
}

// تاریخ شمسی را برمیگرداند با اعداد فارسی
// getPersianDate() => تاریخ امروز
// getPersianDate("2023-02-12") => "۱۴۰۱/۱۱/۲۳"
// getPersianDate("۲۰۲۳-۰۲-۱۲") => "۱۴۰۱/۱۱/۲۳"
function getPersianDate(inputEnglishDate = '') {
	const dateTime = inputEnglishDate ? inputEnglishDate : getCurrentDate();
	const inputInEnglish = toEnglish(dateTime).split(' ')[0];
	const dateInPersian = new Date(inputInEnglish).toLocaleDateString('fa-IR');
	return dateInPersian;
}

// کل فیلدهای فرم رو غیرضروری میکنه
function disableValidationOnAllElements() {
	$('.form-group').each((index, element) => { $(element).disableValidation() })
}

// تشخیص میده که آیا عدد خالی هست یا نه
function isEmpty(value) {
	if (value == 0) return false;
	if (!value) return true;
	return false;
}

// فیلد فرستاده شده رو خالی و دوباره با همون مقدار پر میکنه
// برای اجرا شدن کوئری معمولا ازش استفاده می‌شه
function manualReload(fieldID) {
	const valueOfField = $(`#${fieldID}`).getValue();
	if (!valueOfField || valueOfField == '') return;
	$(`#${fieldID}`).setValue('');
	$(`#${fieldID}`).setValue(valueOfField);
	$(`#${fieldID}`).getControl?.().trigger?.("change");
}

// کل سطرهای گرید رو پنهان میکنه
function hideAllRows(grid) {
	const gridName = getGridName(grid);
	const rows = $(`#${gridName}`).getNumberRows();
	for (let row = 1; row <= rows; row++) {
		$(`#${gridName}`).find("div.pmdynaform-grid-row").eq(row).hide();
	}
}

// اگر گرید خالی از سطر باشد زیرفرم مربوط به گرید را پنهان میکند
function hideSubFormIfGridHasNoRows(grid) {
	const gridName = getGridName(grid);
	const rowCount = $(`#${gridName}`).getNumberRows();

	if (rowCount === 0) {
		hideSubFormOfGrid(gridName);
		return true;
	}
	return false;
}

// زیرفرم مربوط به گرید را پنهان می‌کند
function hideSubFormOfGrid(grid, animationDelay) {
	hideShowFormOfGrid(grid, true, animationDelay);
}

// زیرفرم مربوط به گرید را نمایان می‌کند
function showSubFormOfGrid(grid, animationDelay) {
	hideShowFormOfGrid(grid, false, animationDelay);
}

// اگر ستونی در هیچ کدام از سطرها مقدار نداشته باشد آن ستون پنهان می‌شود
// hideColumnsIfNoRowHasValue(invoiceDetail, 3) => اگر ستون 3 در هیچ کدام از سطرها مقدار نداشته باشد کل ستون پنهان می‌شود
function hideColumnsIfNoRowHasValue(grid, columnNumbers, falseValue = "") {
	grid = getGridName(grid);
	columnNumbers = getInputAsArray(columnNumbers);
	columnNumbers.forEach(columnNumber => {
		hideGridColumnIfNoRowHasValue(grid, columnNumber, falseValue);
	});
}

// در فیلدهای فرستاده شده فقط اجازه ورود مقدار ساعتی ممکن می‌شود
// چه فیلد گریدی یا غیر گریدی
// onlyAcceptClock(['ENTRANCE_TIME'])
function onlyAcceptClock(fieldNames) {
	function gridCallback(gridName, rowIndex, columnIndex) {
		const rawValue = $(`#${gridName}`).getValue(rowIndex, columnIndex);
		const clockValue = convertNumberToTime(rawValue);
		$(`#${gridName}`).setValue(clockValue, rowIndex, columnIndex);
	}

	function formCallback(fieldID) {
		const rawValue = $(`#${fieldID}`).getValue();
		const clockValue = convertNumberToTime(rawValue);
		$(`#${fieldID}`).setValue(clockValue);
	}

	addListener(fieldNames, gridCallback, formCallback);
}

// عدد دریافت کرده را به مقدار ساعتی تبدیل می‌کند
// 7 => 07:00
// 12 => 12:00
// 1230 => 12:30
// 730 => 07:30
function convertNumberToTime(valueOfElement) {
	if (!valueOfElement || typeof valueOfElement !== 'string') return '';
	const findNumbersRegex = /[0-9]/g;
	const arrayOfNumberInputs = valueOfElement.match(findNumbersRegex);
	if (!arrayOfNumberInputs) return "";
	let clockNumbers = ['', '', '', ''];
	switch (arrayOfNumberInputs.length) {
		case 0:
			return "";
		case 1:
			clockNumbers[1] = arrayOfNumberInputs[0];
			break;
		case 2:
			clockNumbers[0] = arrayOfNumberInputs[0];
			clockNumbers[1] = arrayOfNumberInputs[1];
			break;
		case 3:
			clockNumbers[1] = arrayOfNumberInputs[0];
			clockNumbers[2] = arrayOfNumberInputs[1];
			clockNumbers[3] = arrayOfNumberInputs[2];
			break;
		case 4:
			clockNumbers[0] = arrayOfNumberInputs[0];
			clockNumbers[1] = arrayOfNumberInputs[1];
			clockNumbers[2] = arrayOfNumberInputs[2];
			clockNumbers[3] = arrayOfNumberInputs[3];
			break;
		default:
			return "";
	}
	clockNumbers = clockNumbers.map(number => !number ? "0" : number);
	const hours = hoursLogic(clockNumbers[0], clockNumbers[1]);
	const minutes = minutesLogic(clockNumbers[2], clockNumbers[3]);
	if (!hours || !minutes) return "";
	return `${hours}:${minutes}`;

	function hoursLogic(firstHourDigit, secondHourDigit) {
		if (firstHourDigit > 2 || firstHourDigit == 2 && secondHourDigit > 3) return "";
		return `${firstHourDigit}${secondHourDigit}`;
	}

	function minutesLogic(firstMinuteDigit, secondMinuteDigit) {
		if (firstMinuteDigit > 5) return "";
		return `${firstMinuteDigit}${secondMinuteDigit}`;
	}
}

// دکمه با علامت ویرایش را به گرید اضافه میکند
// addEditButtonToGrid(invoiceDetail, rowIndex => {console.log(rowIndex)}); => سطری که دکمه‌اش کلیک زده میشود را پرینت میکند
function addEditButtonToGrid(gridName, callbackFunction = f => f) {
	gridName = getGridName(gridName);
	const iconClass = "glyphicon-edit";
	addButtonToGrid(gridName, callbackFunction, iconClass);
}

// دکمه با علامت باز کردن را به گرید اضافه میکند
function addOpenButtonToGrid(gridName, callbackFunction = f => f) {
	gridName = getGridName(gridName);
	const iconClass = "glyphicon-eye-open";
	addButtonToGrid(gridName, callbackFunction, iconClass);
}

// در گرید در المان حذف گرید دکمه‌ای را اضافه میکند
// یک تابع به عنوان ورودی می‌گیرد که خود تابع شماره سطر را دریافت میکند برای اینکه مشخص باشد کدام سطر کلیک اتفاق افتاده
// آیکون برای آیکون دکمه است glyphicon
function addButtonToGrid(grid, callbackFunction = f => f, iconClass = "") {
	gridName = getGridName(grid);
	getRowIndexesAsArray(gridName)
		.forEach(rowIndex => {
			const button = `<span data-edit-button data-row="${rowIndex}" class="glyphicon ${iconClass} btn btn-primary btn-sm"></span>`;
			$(`#${gridName} .remove-row`).eq(rowIndex - 1).append(button);
		});

	$(`#${gridName} [data-edit-button]`).click(event => {
		const row = $(event.target).attr("data-row");
		callbackFunction(row);
	});
}

// فیلد مولتی فایل آپلود اگه فایلی آپلود شده باشه true
// اگه فایل نداشته باشه false
function hasFile(fieldID) {
	return $(`#${fieldID}`).getInfo().fileCollection.length > 0;
}

// اسم آخرین فایل آپلود شده را برمی‌گرداند
function getLastFileName(fieldID) {
	if ($(`#${fieldID}`).getInfo().fileCollection.length > 0) {
		const lastFileName = $(`#${fieldID}`).getInfo().fileCollection.models[0].attributes.file.name;
		return lastFileName;
	}
}

// اگر تسک چند فرمی باشد در بالای صفحه دکمه مرحله بعد و قبل ظاهر میشود
// این تابع آنها را پنهان میکند
function hideNextPrevButtonsFromTop() {
	$("#dyn_forward").parent().hide();
}

// select2 => multiselect2
// element => $("#InvoiceDetail").getControl(rowIndex, 3) برای گرید $("#formField").getControl() برای فیلد عادی
// changeCallbackFunction => یک تابع با دو ورودی به تابع میدهیم اولی مقدار‌های انتخاب شده و دومی event
// حتما باید مقادیر انتخاب شده در فیلد دیگری ذخیره شوند. با تابع فرستاده شده این کار را انجام دهید
/*	
	multiSelect2($("select2Form").getControl(), (valuesSelected, event) => {
		valuesSelected = valuesSelected.join("");
		$("#select2FormSelectedItems").setValue(valuesSelected);
	})	
*/
function multiSelect2(element, changeCallbackFunction) {
	if (!element.select2) return;
	element.select2('destroy');
	element[0].multiple = true;
	element.select2({ placeholder: '' });
	modifyRenderSelect2(element);

	element.change(changeCallback);
	function changeCallback(event) {
		const values = [];
		for (let index = 0; index < event.target.options.length; index++) {
			if (event.target.options[index].selected) {
				values.push(event.target.options[index].value);
			}
		}
		if (values.some(value => value === '')) {
			element.val(values.filter(Boolean)).trigger('change');
		}
		changeCallbackFunction(values.filter(Boolean), event);
	}

	function modifyRenderSelect2(element) {
		// const renderSelect2Element = element.parent().find('.select2-selection__rendered');
		// const renderSelect2List = renderSelect2Element.find('li').not('.select2-search');
		// if(renderSelect2List.length === 0) return;
		// renderSelect2List[0].remove();
		// element.val()[0].split(',').forEach(optionValue => {
		// 	const elementToPrepend = `<li class="select2-selection__choice" title="${optionValue}">${optionValue}</li>`;
		// 	renderSelect2Element.prepend(elementToPrepend);
		// });
	}
}

function getAppUID() {
	return (frames?.app_uid || $("form").first().attr("id") || '');
}

function getToken() {
	return PMDynaform.getAccessToken();
}

// تمام سطرهای گرید را پنهان میکند جز سطرهای مشخص شده
// hideRowsExcept(invoiceDetail, 1) => همه‌ی سطرها جز سطر اول پنهان می‌شوند
function hideRowsExcept(grid, arrayOfRowIndexes) {
	const gridName = getGridName(grid);
	getRowIndexesAsArray(gridName)
		.forEach(rowIndex => {
			if (!arrayOfRowIndexes.includes(rowIndex)) {
				$(`#${gridName} .pmdynaform-grid-row`).eq(rowIndex - 1).hide();
			}
		});
}

// تشخیص اینکه فایل آپلود شده است یا نه
// برای استفاده در گرید
function doesElementHaveFile(grid, rowIndex, columnNumber) {
	grid = getGridName(grid);
	const rowElement = $(`#${grid} .pmdynaform-grid-row`).eq(rowIndex - 1);
	const mainElement = rowElement.find('.grid-cell-responsive, .pmdynaform-grid-field-static:not(.index-row, .wildcard)').eq(columnNumber - 1);
	const isEmpty = mainElement.find('.content-print').is(':empty');
	return !isEmpty;
}

// تمام سطرهای گرید را لوپ میکند و کال بک را بر اساس شماره سطر اجرا میکند
function forEveryRowOfGrid(grid, callback = f => f) {
	const gridName = getGridName(grid);
	if (!gridName) return;
	const rowCount = $(`#${gridName}`).getNumberRows();
	if (rowCount === 0) return;
	for (let rowIndex = 1; rowIndex <= rowCount; rowIndex++) {
		const result = callback(rowIndex);
		if (result) return result;
	}
}

// در فایل آپلودی گرید
// doc uid شماره سطر و
// آپلود شده را برمیگرداند
// getDocUIDs(invoiceDetail, 'receipt', 2) => سطر دوم فاکتور و فیلد رسید که فایل آپلودی هست را doc uid و سطرش را برمیگرداند
function getDocUIDs(grid, fieldName, rowIndex) {
	const gridName = getGridName(grid);
	const result = getRowIndexesAsArray(gridName, rowIndex).reduce((DOC_UIDs, rowIndex) => {
		const inputElements = $(`input[name^=form\\[${gridName}\\]\\[${rowIndex}\\]\\[${fieldName}\\]][name$=\\[appDocUid\\]]`);
		inputElements.each((index, element) => {
			const FILE_NAME = $(element).parent().parent().find(".multiple-file-grid-web").eq(index).text();
			DOC_UID = $(element).val();
			DOC_UIDs.push({ DOC_UID, ROW_INDEX: rowIndex, FILE_NAME });
		});
		return DOC_UIDs;
	}, []);
	return result;

}

// برای جلوگیری از حروف غیرعادی در فیلدها
// onlyAcceptValidHTMLCharacters('experimentInfo');
// onlyAcceptValidHTMLCharacters(['experimentInfo', 'experimentQuantity']);
function onlyAcceptValidHTMLCharacters(fieldNames) {
	$("form").first().on("keypress", $(turnElementIDStringsIntoElements(fieldNames)), event => {
		const forbiddenCharacters = [`"`, `'`, '&', '<', '>'];
		if (forbiddenCharacters.includes(event.key)) {
			customeAlert(`لطفا از کارکترهای ${forbiddenCharacters.join(" ")} استفاده نکنید.`);
			return false;
		}
	});
}

// کل سطرهای گرید را حذف میکند و دوباره آنها را درست میکند
function repopulateGrid(gridName) {
	gridName = getGridName(gridName);
	const rows = $(`#${gridName}`).getValue().map(row => {
		return row.map(columnValue => ({ value: columnValue }))
	});
	deleteAllRows(gridName);
	rows.forEach(row => {
		$(`#${experiment.name}`).addRow(row);
	})
}

// شماره سطرهای گرید را به عنوان آرایه‌ای سطرها بازمیگرداند
// اگر شماره سطر را نیز همراه نام گرید به آن بدهیم فقط آن سطر را به صورت آرایه برمیگرداند تا عملیات فقط برای آن سطر اجرا شود
// getRowIndexesAsArray(invoiceDetail) => [1, 2, 3, ...];
// getRowIndexesAsArray(invoiceDetail, 1) => [1]
function getRowIndexesAsArray(grid, rowIndex) {
	const gridName = getGridName(grid);
	if (!gridName) return [];
	if (rowIndex > 0) return [rowIndex];
	const rowCount = $(`#${gridName}`).getNumberRows();
	if (rowCount === 0) return [];
	const result = [];
	forEveryRowOfGrid(gridName, rowIndex => {
		result.push(rowIndex);
	});
	return result;
}

// select2 به select اضافه میکند
function addSelect2ToGrid(gridName, rowIndex, placeholder = 'انتخاب کنید') {
	gridName = getGridName(gridName);
	if (!gridName) return;
	if (rowIndex > 0) $(`#${gridName} .pmdynaform-grid-row`).eq(rowIndex - 1).find('select').select2({ placeholder });
	else $(`#${gridName} select`).select2({ placeholder });
}

// اگر صفحه بندی برای گرید موجود باشد برای رفتن به صفحه آخر از صفحات گرید از این تایع میتوان استفاده کرد
function goToLastPageOfPagination(grid) {
	const gridName = getGridName(grid);
	$(`#${gridName} .pmdynaform-grid-pagination .toLast a`)?.[0]?.click?.();
}

// از فیلد فرستاده شده سطری که فیلد در آن ذخیره شده را برمیگرداند
function getBootstrapRow(fieldID) {
	const fieldElement = typeof fieldID === 'string' ? $(`#${fieldID}`) : fieldID;
	return fieldElement.parent().parent();
}

// از گرید در سطر مشخص شده ستونهای مشخص شده را پنهان میکند به جای اینکه کل ستون را پنهان کند
function hideColumnBasedOnRow(grid, fieldNames, rowIndex) {
	hideOrShowColumnsBasedOnRow(grid, fieldNames, rowIndex, 'hide');
}

// از گرید در سطر مشخص شده ستونهای مشخص شده را نمایان میکند به جای اینکه کل ستون را نمایان کند
function showColumnBasedOnRow(grid, fieldNames, rowIndex) {
	hideOrShowColumnsBasedOnRow(grid, fieldNames, rowIndex, 'show');
}



// select2
// مشکلی دارد که اگه گزینه قبلا انتخاب شده باشد بقیه مقادیر را نشان نمی‌دهد
// این تابع مشکل را حل می‌کند
function autoFocusOnSelectOnSelect2Focus() {
	$('form').first().on('select2:open', e => {
		e.target.focus();
	});
}


// فیلدهای گریدی و غیرگریدی را میگیرد
// فقط اجازه ورود اعداد زیر 100 را می‌دهد
// onlyAcceptPercentGrid
function onlyAcceptPercent(fieldNames, callback = f => f) {
	function gridCallback(gridName, rowIndex, columnIndex) {
		const rawValue = $(`#${gridName}`).getValue(rowIndex, columnIndex);
		const isValid = isPercentValid(rawValue);
		if (isValid === false) $(`#${gridName}`).setValue('', rowIndex, columnIndex);
	}

	function formCallback(fieldID) {
		const rawValue = $(`#${fieldID}`).getValue();
		const isValid = isPercentValid(rawValue);
		if (isValid === false) $(`#${fieldID}`).setValue('');
	}

	function isPercentValid(rawValue) {
		const numberValue = getNumber(rawValue);
		if (numberValue > 100) {
			callback();
			return false;
		}
		return true;
	}

	addListener(fieldNames, gridCallback, formCallback);
}

function uuid() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
}


/* private functions */
/* این توابع را مستقیما صدا نکنید */

function hideShowElements(elementStrings, operation, animationDelay = 0) {
	const arrayOfElementIDs = getInputAsArray(elementStrings);
	arrayOfElementIDs.forEach(element => {
		if (operation === 'show') {
			$(`#${element}`).enableValidation();
			$(`#${element}`).show(animationDelay);
		}
		else if (operation === 'hide') {
			$(`#${element}`).disableValidation();
			$(`#${element}`).hide(animationDelay);
		}
	})
}

function enableDisableValidationForColumns(grid, columns, disable) {
	const gridName = getGridName(grid);
	columns = getInputAsArray(columns);
	columns.forEach(columnIndex => {
		if (!columnIndex) return;
		if (disable === true) $(`#${gridName}`).disableValidation(columnIndex);
		else if (disable === false) $(`#${gridName}`).enableValidation(columnIndex);
	});
}

function hideShowColumns(grid, columns, operation) {
	const gridName = getGridName(grid);
	const columnIndexes = getInputAsArray(columns);
	columnIndexes.forEach(columnIndex => {
		if (!columnIndex) return;
		if (operation === "hide") {
			$(`#${gridName}`).disableValidation(columnIndex);
			$(`#${gridName}`).hideColumn(columnIndex);
		}
		else if (operation === "show") {
			$(`#${gridName}`).showColumn(columnIndex);
			$(`#${gridName}`).enableValidation(columnIndex);
		}
	});
}

// برای استفاده در تابع‌های گریدی است
// نام گرید را برمیگرداند
// getGridIDOfElement($("#form[invoiceObject][1][columnName]")) => invoiceObject)
function getGridIDOfElement(element) {
	if (!element[0].id) return;
	const regex = /\w*\[(\w+)]\[\d+\]\[\w+\]/gm
	const [wholeMatch, gridID] = regex.exec(element[0].id);
	return gridID;
}

function persianEnglishConversion(fieldNames, persianOrEnglish, flagPriceFormat = false) {
	fieldNames = getInputAsArray(fieldNames);
	if (fieldNames.length === 0 || !persianOrEnglish) return;

	fieldNames.forEach(fieldName => {
		const element = $(turnElementIDStringsIntoElements([fieldName]));
		isElementFromGrid(element) === true ? inGridConversion(element, fieldName) : inFormConversion(fieldName);
	});

	function inFormConversion(fieldName) {
		const unconvertedNumber = $(`#${fieldName}`).getValue();
		const convetedNumber = convertNumber(unconvertedNumber);
		$(`#${fieldName}`).setValue(convetedNumber);
	}

	function inGridConversion(element, fieldName) {
		const gridID = getGridIDOfElement(element);
		const columnIndex = getColumnIndex(gridID, fieldName);
		getRowIndexesAsArray(gridID).forEach(rowIndex => {
			const unconvertedNumber = $(`#${gridID}`).getValue(rowIndex, columnIndex);
			const convetedNumber = convertNumber(unconvertedNumber);
			$(`#${gridID}`).setValue(convetedNumber, rowIndex, columnIndex);
		});
	}

	function convertNumber(unconvertedNumber) {
		const convertedNumber = persianOrEnglish === 'persian' ? toPersian(unconvertedNumber, flagPriceFormat) : toEnglish(unconvertedNumber);
		return convertedNumber;
	}
}

function enableOrDisableRow(gridName, rowIndex, disable) {
	gridName = getGridName(gridName);
	if (!gridName || !rowIndex) return;
	const countOfGridColumns = $(`#${gridName} .pmdynaform-grid-thead div`).length - 1;
	for (let columnIndex = 1; columnIndex <= countOfGridColumns; columnIndex++) {
		const element = $(`#${gridName}`).getControl?.(rowIndex, columnIndex);
		if (!element) continue;
		element.attr?.("disabled", disable);
		enableDisableDatePicker(element, disable);
	}
}

function enableIfEmptyDisableIfNonEmpty(elementID) {
	const isElementEmpty = $(`#${elementID}`).getValue() === '';
	if (isElementEmpty === true) {
		$(`#${elementID}`).enableValidation?.();
		$(`#${elementID}`).getControl?.().attr("disabled", false);
	}
	else if (isElementEmpty === false) {
		$(`#${elementID}`).disableValidation?.();
		$(`#${elementID}`).getControl?.().attr("disabled", true);
	}
}

function enableDisableFields(fieldNames, disable) {
	fieldNames = getInputAsArray(fieldNames);
	if (fieldNames.length === 0 || typeof disable === 'undefined') return;

	const elements = disable === true ? $(turnElementIDStringsIntoElements(fieldNames, '', ':not(:disabled)')) : $(turnElementIDStringsIntoElements(fieldNames));
	elements.each((index, element) => {
		$(element).attr("disabled", disable);
		enableDisableDatePicker(element, disable);
	});
}

function enableOrDisableColumns(grid, columnIndexes, rowIndex, disable) {
	columnIndexes = getInputAsArray(columnIndexes);
	const gridName = getGridName(grid);
	if (!rowIndex) return;
	columnIndexes.forEach(columnIndex => {
		const inputElement = $(`#${gridName}`).getControl(rowIndex, columnIndex);
		if (!inputElement) return;
		inputElement?.attr?.('disabled', disable);
		enableDisableDatePicker(inputElement, disable);
	});
}

function doRequiredGridColumnHaveValue() {
	let result = true;
	getAllGrids().some(gridName => {
		const allColumnIndexesOfColumn = getAllColumnIndexes(gridName);
		const requiredColumnIndexes = filterNonRequiredColumnIndexes(allColumnIndexesOfColumn);
		const rows = $(`#${gridName} .pmdynaform-grid-row:visible`);
		rows.each((index, row) => {
			const cells = getRequiredCellsForRow(row, requiredColumnIndexes);
			const isAnyRequiredColumnCellEmpty = cells.some(cell => {
				const isContentPrintEmpty = $(cell).find('.content-print').is(':empty');
				const isElementHaveNoValue = $(cell).find(':input').val() == ''
				return (isContentPrintEmpty || isElementHaveNoValue);
			});
			if (isAnyRequiredColumnCellEmpty === true) {
				result = false;
				return false; //break each
			}
		});
		return !result; //break some
	});
	return result; //actual result

	function getAllGrids() {
		const gridNames = [];
		$('.pmdynaform-field-grid').each((index, element) => {
			gridNames.push(element.id);
		});
		return gridNames;
	}

	function getAllColumnIndexes(gridName) {
		const allColumnIndexesOfColumn = $(`#${gridName}`)
			.find('.pmdynaform-grid-thead')
			.find('div')
			.not('.wildcard')
			.not('.pmdynaform-grid-removerow-static');

		return allColumnIndexesOfColumn;
	}

	function filterNonRequiredColumnIndexes(allColumnIndexesOfColumn) {
		const filteredColumnIndexes = []
		allColumnIndexesOfColumn.each((index, tableHeadElement) => {
			const requiredElement = $(tableHeadElement)
				.find('.pmdynaform-field-required')
				.not('[style*="display: none"]')

			if (requiredElement?.length > 0) {
				filteredColumnIndexes.push(index + 1);
			}
		});
		return filteredColumnIndexes;
	}

	function getRequiredCellsForRow(rowElement, requiredColumnIndexes) {
		const allCells = getCellsForRow(rowElement);
		const requiredCells = requiredColumnIndexes.map(columnIndex => $(allCells).eq(columnIndex - 1));
		return requiredCells;

		function getCellsForRow(rowElement) {
			return $(rowElement).find("div.grid-cell-responsive, div.pmdynaform-grid-field-static")
				.not('.index-row')
				.not('.remove-row');
		}
	}
}

function getRequiredFormElements() {
	const result = [];
	const requiredFormElements = $(".pmdynaform-field-required").not('[style*="display: none"]').parent().parent().next().filter(".pmdynaform-field-control");
	requiredFormElements.each((index, element) => {
		const elementID = $(element).parent().attr("id");
		result.push(elementID);
	});
	return result;
}

function getRequiredColumns() {
	const result = [];
	const gridHeaders = $(".pmdynaform-grid-thead .title-column");
	let currentGridID = '';
	let columnCount = 1;
	gridHeaders.each((index, element) => {
		let thisGridID = getGridIDOfElement($(element));
		if (currentGridID !== thisGridID) {
			currentGridID = thisGridID;
			columnCount = 1;
		}
		else {
			columnCount++;
		}
		if ($(element).next(".pmdynaform-field-required").not('[style*="display: none"]').length !== 0) {
			result.push({ gridID: currentGridID, columnNumber: columnCount });
		}
	});
	return getColumnIDs(result);
}

function getColumnIDs(arrayObjectResults) {
	const firstRow = 1;
	arrayObjectResults = getInputAsArray(arrayObjectResults);

	return arrayObjectResults.reduce((columnIDs, currentObject) => {
		const { gridID, columnNumber } = currentObject;
		if ($(`#${gridID}`).getNumberRows() === 0) return columnIDs;
		columnIDs.push(
			$(`#${gridID}`).getControl?.(firstRow, columnNumber)
				.attr?.('id')
				.match(/\[\w+]$/gm)
				.join("")
				.replace(/[\[\]]/g, '')
		);
		return columnIDs;
	}, []).filter(Boolean);
}

function defineMinMaxForInputs(fieldIDs, maxLimit, minLimit, parentElement = $("form").first()) {
	fieldIDs = getInputAsArray(fieldIDs);
	if (maxLimit) {
		parentElement.on("keypress", turnElementIDStringsIntoElements(fieldIDs), event => {
			return !($(event.target).val().toString().length >= maxLimit);
		});
	}
	if (minLimit) {
		parentElement.on("focusout", turnElementIDStringsIntoElements(fieldIDs), event => {
			if (!$(event.target).val()) return;
			if ($(event.target).val().length < minLimit) {
				$(event.target).val("");
				showMessage('', 'danger', 1000, 'اطلاعات وارد شده معتبر نیست');
			}
		});
	}
}

function enableDisableDatePicker(inputElement, disable) {
	if (!inputElement || typeof disable === 'undefined') return;
	inputElement = !inputElement?.parent?.() ? $(inputElement) : inputElement;
	const datePickerElement = inputElement.parent().find('[data-mdpersiandatetimepicker]');
	if (datePickerElement?.length === 0) return;

	const hasDisableDatePickerClass = datePickerElement.hasClass('disable-date-picker');
	if (disable === false && hasDisableDatePickerClass === true) {
		datePickerElement.removeClass('disable-date-picker');
	}
	else if (disable === true && hasDisableDatePickerClass === false) {
		datePickerElement.addClass('disable-date-picker');
	}
}

function hideShowFormOfGrid(grid, hide, animationDelay = 0) {
	const gridName = getGridName(grid);
	const domElement = $(`#${gridName}`).parent().parent().parent();
	if (hide === true) domElement.hide(animationDelay);
	if (hide === false) domElement.show(animationDelay);
}

function hideGridColumnIfNoRowHasValue(grid, columnNumber, falseValue = "") {
	grid = getGridName(grid);
	const rowCount = $(`#${grid}`).getNumberRows();
	for (let rowIndex = 1; rowIndex <= rowCount; rowIndex++) {
		const valueInsideGrid = $(`#${grid}`).getValue(rowIndex, columnNumber);
		if (valueInsideGrid != falseValue) {
			return;
		}
	}
	$(`#${grid}`).hideColumn(columnNumber);
}

function hideOrShowColumnsBasedOnRow(grid, fieldNames, rowIndex, hideOrShow) {
	if (!rowIndex) return;
	const gridName = getGridName(grid);
	fieldNames = getInputAsArray(fieldNames);
	fieldNames.forEach(fieldName => {
		if (hideOrShow === 'hide') $(`#\\[${gridName}\\]\\[${rowIndex}\\]\\[${fieldName}\\]`).hide();
		else if (hideOrShow === 'show') $(`#\\[${gridName}\\]\\[${rowIndex}\\]\\[${fieldName}\\]`).show();
	});
}

function addListener(fieldNames, gridCallback = f => f, formCallback = f => f, listenerType = 'change') {
	fieldNames = getInputAsArray(fieldNames);

	$('form').first().on(listenerType, turnElementIDStringsIntoElements(fieldNames), callback);

	function callback(event) {
		const matches = getMatches(event);
		if (matches.length === 0) return;
		else if (matches.length === 1) { //از فیلد عادی صدا زده شده
			const [formID] = matches;
			formCallback(formID);
		}
		else if (matches.length === 3) { // از گرید صدا زده شده
			const [gridName, rowIndex, columnName] = matches;
			const columnIndex = getColumnIndex(gridName, columnName);
			gridCallback(gridName, rowIndex, columnIndex);
		}
	}

	function getMatches(event) {
		const regex = /\[(\w+)\]/g
		const { id } = event.target;
		const result = [];
		while (regexResponse = regex.exec(id)) {
			const [wholeMatch, selectedGroup] = regexResponse;
			result.push(selectedGroup);
		}
		return result;
	}
}

/* این توابع صرفا جهت سازگاری با کدهای از پیش نوشته شده است و استفاده آن دیگر توصیه نمیشود */

// استفاده نشود
// از onlyAcceptClock
// استفاده کنید
function onlyAcceptClockInput(elementID) {
	onlyAcceptClock(elementID);
}

// استفاده نشود
// از onlyAcceptClock
// استفاده کنید
function onlyAcceptClockInputGrid(gridName, columnName) {
	onlyAcceptClock(columnName);
}

// استفاده نکنید
function onlyAcceptPercentGrid(fieldNames, callback) {
	onlyAcceptPercent(fieldNames, callback);
}

// استفاده نشود
// از getPersianDate استفاده کنید
function convertDateToPersian(processmakerDate, returnType = "persian") {
	if (!processmakerDate) return;
	processmakerDate = processmakerDate.replace("-", "/");
	const dateInPersian = new Date().toLocaleDateString('fa-IR').split("/").map(digit => digit.padStart(2, '۰')).join("/");
	if (returnType === "persian") return dateInPersian;
	else if (returnType === "english") return toEnglish(dateInPersian);
	else {
		console.error(`returnType of ${returnType} is not recognized`);
	}
}

// از این تابع استفاده مجدد نشود
//برای وارد کردن مقادیر از فرم یا گرید منبع به داخل فیلدهای مخفی گرید مقصد
function updateHiddenFieldsInsideGridValue(rowIndex, fieldsToGetValuesFrom = [], gridNameSource = '', fieldsToPutValuesInto = [], gridNameDestination = gridNameSource) {
	if (!rowIndex || !Array.isArray(fieldsToGetValuesFrom) || fieldsToGetValuesFrom.length == 0 || !Array.isArray(fieldsToPutValuesInto) || fieldsToPutValuesInto.length == 0) return;

	fieldsToGetValuesFrom.forEach((field, index) => {
		const valueOfField = typeof field === "string" ? $(`#${field}`).getValue() : $(`#${gridNameSource}`).getValue(rowIndex, field);
		if (!valueOfField) return;
		$(`#${gridNameDestination}`).setValue(valueOfField, rowIndex, fieldsToPutValuesInto[index]);
		console.log(`value inside row = ${rowIndex}, column = ${fieldsToPutValuesInto[index]}, value = ${$(`#${gridNameDestination}`).getValue(rowIndex, fieldsToPutValuesInto[index])}`);
	});
}

function removeButtonsAddedToGrid(gridName) {
	gridName = getGridName(gridName);
	$(`#${gridName} [data-edit-button]`).remove();
}


function getOptionValueBasedOnText(selectID, text) {
	const valueOfOption = $(`#${selectID} option:contains(${text})`).val();
	return valueOfOption;
}