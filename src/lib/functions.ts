export const getAvatarLetters = (username: any) => {
  if (!username) return;

  const name = username.split(" ");

  return `${name[0].charAt(0)} ${name[1]?.charAt(0) ?? ""}`;
};

export const isEmpty = (value: any) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return true;
  }

  if (typeof value === "string" && value.trim() === "") {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  if (typeof value === "object" && Object.keys(value).length === 0) {
    return true;
  }

  if (typeof value === "number" && value === 0) {
    return true;
  }

  return false;
};

const convertToCSV = (arr: any) => {
  const array = [Object.keys(arr[0])].concat(
    arr.map((obj: any) => Object.values(obj))
  );

  return array
    .map((row) => row.map((item) => `"${item}"`).join(","))
    .join("\n");
};

export const downloadCSV = (data: any, filename: string) => {
  const csvString = convertToCSV(data);

  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getCleanDate = (param: string, type: number) => {
  const date = new Date(param);

  const formattedDate = date
    .toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .replace(",", "");

  const currentYear = new Date().getFullYear();
  const year = date.getFullYear();
  const age = currentYear - year;
  const ageString = `(${age} Jahre)`;

  let cleanDate;

  if (type === 1) {
    cleanDate = `${formattedDate} ${ageString}`;
  } else {
    cleanDate = `${formattedDate}`;
  }

  return cleanDate;
};

export const getCleanDateTime = (param: string) => {
  const date = new Date(param);

  const formattedDate = date
    .toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", "");

  return `${formattedDate}`;
};

export const getMaxDate = () => {
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  return maxDate;
};

export const getTimeDifferenceInGerman = (param: string) => {
  var now: Date = new Date();
  var start: Date = new Date(param);

  const difference: number = now.getTime() - start.getTime();

  var secondsDifference = Math.floor(difference / 1000);
  var minutesDifference = Math.floor(secondsDifference / 60);
  var hoursDifference = Math.floor(minutesDifference / 60);
  var daysDifference = Math.floor(hoursDifference / 24);
  var weeksDifference = Math.floor(daysDifference / 7);
  var monthsDifference = Math.floor(daysDifference / 30);

  if (monthsDifference > 0) {
    return (
      "vor etwa " +
      monthsDifference +
      " Monat" +
      (monthsDifference > 1 ? "en" : "")
    );
  } else if (weeksDifference > 0) {
    return (
      "vor etwa " +
      weeksDifference +
      " Woche" +
      (weeksDifference > 1 ? "n" : "")
    );
  } else if (daysDifference > 0) {
    return (
      "vor etwa " + daysDifference + " Tag" + (daysDifference > 1 ? "en" : "")
    );
  } else if (hoursDifference > 0) {
    return (
      "vor etwa " +
      hoursDifference +
      " Stunde" +
      (hoursDifference > 1 ? "n" : "")
    );
  } else if (minutesDifference > 0) {
    return (
      "vor etwa " +
      minutesDifference +
      " Minute" +
      (minutesDifference > 1 ? "n" : "")
    );
  } else {
    return "vor weniger als einer Minute";
  }
};

export const compareStrings = (a: string, b: string) => {
  if (a < b) return -1;
  if (a > b) return 1;

  return 0;
};

export const mergeObjects = (prevObj: any, nextObj: any) => {
  const mergedObj = { ...prevObj };

  for (const key in nextObj) {
    if (nextObj.hasOwnProperty(key)) {
      mergedObj[key] = nextObj[key];
    }
  }

  return mergedObj;
};

export const mergeObjectArrays = (prevArr: any, nextArr: any) => {
  const mergedArr = [...prevArr];

  for (const nextObj of nextArr) {
    const prevIndex = mergedArr.findIndex(
      (prevObj) => prevObj.id === nextObj.id
    );

    if (prevIndex !== -1) {
      mergedArr[prevIndex] = { ...mergedArr[prevIndex], ...nextObj };
    } else {
      mergedArr.push(nextObj);
    }
  }

  return mergedArr;
};

export const getPeriod = (value: string) => {
  if (value === "yearly") {
    return "Jährlich";
  } else if (value === "half-yearly") {
    return "Halbjährlich";
  } else if (value === "quarterly") {
    return "Vierteljährlich";
  } else if (value === "monthly") {
    return "Monatlich";
  } else if (value === "weekly") {
    return "Wöchentlich";
  } else if (value === "daily") {
    return "Täglich";
  } else {
    return "Einmalig";
  }
};

export const UriToFileObject = async (param: string, filename: string) => {
  const response = await fetch(param);
  const blob = await response.blob();
  const file = new File([blob], filename, { type: blob.type });

  return file;
};

export const formatEuro = (amount: number) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(".", ",");
};

export const checkRegisterDate = (param: string, flag: "current" | "last") => {
  if (flag === "current") {
    return new Date(param).getMonth() === new Date().getMonth();
  } else {
    const now = new Date();
    const lastMonth = now.getMonth() - 1;

    return new Date(param).getMonth() === lastMonth;
  }
};
