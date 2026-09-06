export const handleResponse = (res) =>
  res.ok
    ? res.json()
    : res.text().then((e) => {
        throw new Error(e);
      });

export const parseError = (error) => JSON.parse(error.message).message;

export const formatContractDate = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${date.toLocaleString("en-US", { month: "long" })} ${day}${suffix}, ${date.getFullYear()}`;
};
