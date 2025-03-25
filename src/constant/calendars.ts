import { isEmpty } from "@/lib/functions";

const de = require("apexcharts/dist/locales/de.json");

export const defaultCalendarOption = {
  chart: {
    locales: [de],
    defaultLocale: "de",
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: "75%",
      rangeBarGroupRows: true,
    },
  },
  annotations: {
    xaxis: [
      {
        x: new Date().getTime(),
        strokeDashArray: 0,
        label: {
          text: "Heute",
          borderWidth: 0,
          borderRadius: 5,
          offsetX: -5,
          offsetY: 5,
          position: "center",
          style: {
            color: "white",
            background: "black",
            fontWeight: 500,
            lineHeight: "10px",
          },
        },
      },
    ],
  },
  colors: ["#00E98B", "#00D37E", "#00C173", "#009659", "#007043", "#002114"],
  fill: {
    type: "solid",
  },
  xaxis: {
    type: "datetime",
    tickAmount: 0.5,
  },
  yaxis: {
    show: false,
  },
  legend: {
    position: "bottom",
    showForSingleSeries: true,
    onItemClick: {
      toggleDataSeries: false,
    },
  },
};

export const chargeCalendarOption = {
  chart: {
    locales: [de],
    defaultLocale: "de",
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: "75%",
      rangeBarGroupRows: true,
    },
  },
  annotations: {
    xaxis: [
      {
        x: new Date().getTime(),
        strokeDashArray: 0,
        label: {
          text: "Heute",
          borderWidth: 0,
          borderRadius: 5,
          offsetX: -5,
          offsetY: 5,
          position: "center",
          style: {
            color: "white",
            background: "black",
            fontWeight: 500,
            lineHeight: "10px",
          },
        },
      },
    ],
  },
  colors: ["#00E98B", "#00D37E", "#00C173", "#009659", "#007043", "#002114"],
  fill: {
    type: "solid",
  },
  xaxis: {
    type: "datetime",
    tickAmount: 0.5,
  },
  legend: {
    position: "bottom",
    showForSingleSeries: true,
    onItemClick: {
      toggleDataSeries: false,
    },
  },
};

export const strainCalendarSeries = [
  {
    name: "Samen angelegt",
    data: [
      {
        x: "Strain",
        y: [
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          ).getTime(),
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() + 1
          ).getTime(),
        ],
      },
    ],
  },
];

export const plantCalendarSeries = (param: any) => {
  return [
    {
      name: "Samen angelegt",
      data: [
        {
          x: param?.plantname,
          y: [
            isEmpty(new Date(param?.sowing_date).getTime())
              ? undefined
              : new Date(param?.sowing_date).getTime(),
            isEmpty(new Date(param?.germination_date).getTime())
              ? undefined
              : new Date(param?.germination_date).getTime(),
          ],
        },
      ],
    },
    {
      name: "Keimung",
      data: [
        {
          x: param?.plantname,
          y: [
            isEmpty(new Date(param?.germination_date).getTime())
              ? undefined
              : new Date(param?.germination_date).getTime(),
            isEmpty(new Date(param?.cutting_date).getTime())
              ? undefined
              : new Date(param?.cutting_date).getTime(),
          ],
        },
      ],
    },
    {
      name: "Stecklinge gesetzt",
      data: [
        {
          x: param?.plantname,
          y: [
            isEmpty(new Date(param?.cutting_date).getTime())
              ? undefined
              : new Date(param?.cutting_date).getTime(),
            isEmpty(new Date(param?.growing_date).getTime())
              ? undefined
              : new Date(param?.growing_date).getTime(),
          ],
        },
      ],
    },
    {
      name: "Vegetative Phase",
      data: [
        {
          x: param?.plantname,
          y: [
            isEmpty(new Date(param?.growing_date).getTime())
              ? undefined
              : new Date(param?.growing_date).getTime(),
            isEmpty(new Date(param?.flowering_date).getTime())
              ? undefined
              : new Date(param?.flowering_date).getTime(),
          ],
        },
      ],
    },
    {
      name: "Blüte",
      data: [
        {
          x: param?.plantname,
          y: [
            isEmpty(new Date(param?.flowering_date).getTime())
              ? undefined
              : new Date(param?.flowering_date).getTime(),
            isEmpty(new Date(param?.harvest_date).getTime())
              ? undefined
              : new Date(param?.harvest_date).getTime(),
          ],
        },
      ],
    },
    {
      name: "Ernte",
      data: [
        {
          x: param?.plantname,
          y: [
            isEmpty(new Date(param?.harvest_date).getTime())
              ? undefined
              : new Date(param?.harvest_date).getTime(),
            isEmpty(new Date(param?.destruction_date).getTime())
              ? undefined
              : new Date(param?.destruction_date).getTime(),
            new Date(param?.destruction_date).getTime(),
          ],
        },
      ],
    },
  ];
};

export const chargeCalendarSeries = (param: any) => {
  return [
    {
      name: "Samen angelegt",
      data: param.map((item: any) => {
        return {
          x: item.chargename,
          y: [
            isEmpty(new Date(item?.sowing_date).getTime())
              ? undefined
              : new Date(item?.sowing_date).getTime(),
            isEmpty(new Date(item?.germination_date).getTime())
              ? undefined
              : new Date(item?.germination_date).getTime(),
          ],
        };
      }),
    },
    {
      name: "Keimung",
      data: param.map((item: any) => {
        return {
          x: item.chargename,
          y: [
            isEmpty(new Date(item?.germination_date).getTime())
              ? undefined
              : new Date(item?.germination_date).getTime(),
            isEmpty(new Date(item?.cutting_date).getTime())
              ? undefined
              : new Date(item?.cutting_date).getTime(),
          ],
        };
      }),
    },
    {
      name: "Stecklinge gesetzt",
      data: param.map((item: any) => {
        return {
          x: item.chargename,
          y: [
            isEmpty(new Date(item?.cutting_date).getTime())
              ? undefined
              : new Date(item?.cutting_date).getTime(),
            isEmpty(new Date(item?.growing_date).getTime())
              ? undefined
              : new Date(item?.growing_date).getTime(),
          ],
        };
      }),
    },
    {
      name: "Vegetative Phase",
      data: param.map((item: any) => {
        return {
          x: item.chargename,
          y: [
            isEmpty(new Date(item?.growing_date).getTime())
              ? undefined
              : new Date(item?.growing_date).getTime(),
            isEmpty(new Date(item?.flowering_date).getTime())
              ? undefined
              : new Date(item?.flowering_date).getTime(),
          ],
        };
      }),
    },
    {
      name: "Blüte",
      data: param.map((item: any) => {
        return {
          x: item.chargename,
          y: [
            isEmpty(new Date(item?.flowering_date).getTime())
              ? undefined
              : new Date(item?.flowering_date).getTime(),
            isEmpty(new Date(item?.harvest_date).getTime())
              ? undefined
              : new Date(item?.harvest_date).getTime(),
          ],
        };
      }),
    },
    {
      name: "Ernte",
      data: param.map((item: any) => {
        return {
          x: item.chargename,
          y: [
            isEmpty(new Date(item?.harvest_date).getTime())
              ? undefined
              : new Date(item?.harvest_date).getTime(),
            isEmpty(new Date(item?.destruction_date).getTime())
              ? undefined
              : new Date(item?.destruction_date).getTime(),
          ],
        };
      }),
    },
  ];
};
