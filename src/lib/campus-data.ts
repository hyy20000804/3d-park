export type BuildingStatus = "normal" | "warning" | "alarm";

export interface CampusBuilding {
  id: string;
  name: string;
  type: string;
  /** 经度 */
  lon: number;
  /** 纬度 */
  lat: number;
  /** 楼层 */
  floors: number;
  /** 入驻率 % */
  occupancy: number;
  /** 当前在场人数 */
  people: number;
  /** 今日能耗 kWh */
  energy: number;
  status: BuildingStatus;
  /** 三维缩略模型中的平面坐标与尺寸 */
  model: { x: number; z: number; w: number; d: number; h: number };
}

/** 园区中心:上海张江科学城附近 */
export const CAMPUS_CENTER = { lon: 121.6018, lat: 31.2045 };

export const buildings: CampusBuilding[] = [
  {
    id: "A1",
    name: "A1 研发主楼",
    type: "研发办公",
    lon: 121.5998,
    lat: 31.2058,
    floors: 24,
    occupancy: 94,
    people: 1286,
    energy: 4820,
    status: "normal",
    model: { x: -3.2, z: -2.4, w: 2.4, d: 2.0, h: 4.6 },
  },
  {
    id: "A2",
    name: "A2 研发副楼",
    type: "研发办公",
    lon: 121.6031,
    lat: 31.2062,
    floors: 18,
    occupancy: 88,
    people: 912,
    energy: 3410,
    status: "warning",
    model: { x: 0.4, z: -2.8, w: 2.0, d: 1.8, h: 3.4 },
  },
  {
    id: "B1",
    name: "B1 智能制造车间",
    type: "生产厂房",
    lon: 121.6052,
    lat: 31.2034,
    floors: 4,
    occupancy: 76,
    people: 540,
    energy: 7960,
    status: "alarm",
    model: { x: 3.4, z: -0.6, w: 3.0, d: 2.6, h: 1.4 },
  },
  {
    id: "C1",
    name: "C1 会议中心",
    type: "公共配套",
    lon: 121.6005,
    lat: 31.2022,
    floors: 6,
    occupancy: 62,
    people: 318,
    energy: 1560,
    status: "normal",
    model: { x: -2.6, z: 1.8, w: 2.2, d: 2.2, h: 1.8 },
  },
  {
    id: "D1",
    name: "D1 人才公寓",
    type: "生活配套",
    lon: 121.5978,
    lat: 31.2015,
    floors: 16,
    occupancy: 97,
    people: 726,
    energy: 2240,
    status: "normal",
    model: { x: 1.2, z: 2.6, w: 1.6, d: 1.6, h: 3.0 },
  },
  {
    id: "E1",
    name: "E1 物流仓储",
    type: "仓储",
    lon: 121.6068,
    lat: 31.2072,
    floors: 2,
    occupancy: 71,
    people: 164,
    energy: 1180,
    status: "normal",
    model: { x: 4.2, z: 2.6, w: 2.6, d: 1.8, h: 0.9 },
  },
];

export const alarms = [
  { id: "AL-2418", level: "严重", text: "B1 车间 3# 配电柜温度 82℃ 超限", time: "08:41", area: "B1" },
  { id: "AL-2417", level: "警告", text: "A2 东侧新风机组滤网压差偏高", time: "08:26", area: "A2" },
  { id: "AL-2415", level: "提示", text: "北门访客通道排队超过 12 人", time: "08:12", area: "北门" },
  { id: "AL-2411", level: "警告", text: "地下车库 B2 区 CO 浓度上升", time: "07:55", area: "车库" },
  { id: "AL-2404", level: "提示", text: "C1 会议中心 2 场会议未签到", time: "07:30", area: "C1" },
];

export const energyTrend = [
  { h: "00", v: 38 },
  { h: "02", v: 31 },
  { h: "04", v: 29 },
  { h: "06", v: 44 },
  { h: "08", v: 78 },
  { h: "10", v: 92 },
  { h: "12", v: 74 },
  { h: "14", v: 88 },
  { h: "16", v: 95 },
  { h: "18", v: 66 },
  { h: "20", v: 52 },
  { h: "22", v: 41 },
];

export const accessFlow = [
  { label: "员工刷卡", value: 3820, tone: "primary" as const },
  { label: "访客登记", value: 486, tone: "accent" as const },
  { label: "车辆进出", value: 1247, tone: "warning" as const },
  { label: "货运车辆", value: 168, tone: "muted" as const },
];

export const totals = {
  people: buildings.reduce((s, b) => s + b.people, 0),
  energy: buildings.reduce((s, b) => s + b.energy, 0),
  occupancy: Math.round(
    buildings.reduce((s, b) => s + b.occupancy, 0) / buildings.length,
  ),
  devices: 1642,
  online: 1613,
};
