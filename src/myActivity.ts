import { sleep } from "./utils";

function percentage(num: number, per: number) {
  return (num / 100) * per;
}
let current = 0;

const runMyActivity = async () => {
  await sleep(1000);
  const timeout = setTimeout(runMyActivity, 3000);

  const marketPlaceHolder = document.getElementsByClassName(
    "c-perpetual-placeorder-market"
  )?.[0] as HTMLDivElement | undefined;
  if (!marketPlaceHolder) {
    clearTimeout(timeout);
    await sleep(1000);
    runMyActivity();

    return;
  }
  const trading = document.getElementsByClassName("section-execute")?.[0] as
    | HTMLDivElement
    | undefined;

  if (!trading) {
    return;
  }

  const sectiontype = document.querySelector(".section-type") as
    | HTMLHeadingElement
    | undefined;
  if (!sectiontype) {
    clearTimeout(timeout);
    await sleep(1000);
    runMyActivity();

    return;
  } else {
    clearTimeout(timeout);
  }
  const StopAmount = [
    { label: "0.25", value: "8" },
    { label: "0.5", value: "4" },
    { label: "0.75", value: "3" },
    { label: "1", value: "2" },
  ];
  // const StopAmountBuy = [
  //   "0.25",
  //   "0.50",
  //   "0.75",
  //   "1",
  //   "1.25",
  //   "1.50",
  //   "1.75",
  //   "2",
  // ];
  let select = document.createElement("select");
  select.className =
    "el-button via-btn-switch type-button ms-6 el-button--default";

  select.onchange = addAmount;
  const option = document.createElement("option");
  option.innerText = "No Stop";
  select.appendChild(option);
  StopAmount.map((item) => {
    const _options = document.createElement("option");
    _options.innerText = `${item.label}%`;
    _options.style.color = "red";
    _options.value = item.value;
    select.appendChild(_options);
  });

  // StopAmountBuy.map((item) => {
  //   const _options = document.createElement("option");
  //   _options.innerText = `B ${item}%`;
  //   _options.style.color = "green";
  //   _options.value = item;
  //   select.appendChild(_options);
  // });
  const input = document.createElement("input");
  input.type = "number";
  input.maxLength = 3;
  input.minLength = 0;
  input.min = "1";
  input.max = "100";
  input.name = "risk";
  input.placeholder = "Risk(%)";
  input.className =
    "el-button via-btn-switch type-button ms-6 el-button--default";
  sectiontype?.children?.[0].appendChild(select);
  sectiontype?.children?.[0].appendChild(input);
};

const addAmount = async (e: any) => {
  const stopLoss = e?.target?.value;
  if (!stopLoss) {
    return;
  }
  let risk = document.getElementsByName("risk")?.[0] as HTMLInputElement;

  if (!risk.value) {
    risk.focus();
    await sleep(300);
    risk.value = "2";
  }

  await sleep(300);
  const balance = document
    .getElementsByClassName("c-exchange-placeorder-available")?.[0]
    ?.querySelector(".cursor-pointer")
    ?.querySelector("span")?.innerText;
  if (!balance) {
    alert("موجودی نداری!");
  }
  let _risk = 2;
  if (Number(risk) !== 2) {
    _risk = Number(risk.value) / 2;
  }

  console.log(Number(risk.value))

  const levrage = document
    .querySelector("div.lever")
    ?.children?.[2].innerHTML.replace("X", "");

  const coinAmount = (document
    .getElementsByClassName("c-perpetual-quota-depth")?.[0]
    ?.querySelector(".cursor-pointer")?.innerHTML as unknown) as number;
  const BtcForPosition =
    _risk !== 2
      ? ((_risk * (Number(stopLoss) * Number(balance)) / Number(levrage)) *
          Number(levrage)) /
        coinAmount
      : (((stopLoss * Number(balance)) / Number(levrage)) * Number(levrage)) /
        coinAmount;

  console.log({ _risk });
  await sleep(300);
  navigator.clipboard.writeText(String(BtcForPosition.toFixed(4))).then(
    function () {
      alert("کپی شد");
    },
    function (err) {
      alert("کپی نشد " + err);
    }
  );

  return;
};

export { runMyActivity };
