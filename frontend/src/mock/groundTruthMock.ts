/* Field Ledger style: mock records keep the current frontend contract intact and are replaceable by Spring Boot payloads. */
export type Direction = "rise" | "fall" | "mixed" | "neutral";
export type ProjectType = "Airport" | "Road corridor" | "Transit" | "Industrial" | "IT corridor";

export type InfrastructureRecord = {
  id: string;
  regionId: string;
  name: string;
  type: ProjectType;
  status: "Upcoming" | "Under construction" | "Announced" | "Operational";
  openingYear: number;
  latitude: number;
  longitude: number;
  contribution: [number, number];
  confidence: number;
  summary: string;
  proofUrls: string[];
};

export type Driver = {
  id: string;
  name: string;
  type: ProjectType;
  status: string;
  contribution: [number, number];
  confidence: number;
  timeline: string;
  summary: string;
  image: string;
  sourceCount: number;
  x: number;
  y: number;
};

export type Region = {
  id: string;
  name: string;
  district: string;
  value: number;
  unit: string;
  projected: [number, number] | null;
  direction: Direction;
  confidence: number | null;
  x: number;
  y: number;
  size: number;
  color: string;
  drivers: Driver[];
};

export const governmentUrl = "https://bhubharati.telangana.gov.in/viewMarketValueLandStampDuty";
export const airportImage = "/manus-storage/groundtruth-airport-reference_d86cf9c0.png";
export const corridorImage = "/manus-storage/groundtruth-corridor-reference_5b99a7ad.png";
export const industrialImage = "/manus-storage/groundtruth-industrial-reference_369e4cac.png";

export const regions: Region[] = [
  {
    id: "shamshabad", name: "Shamshabad", district: "Rangareddy", value: 5200, unit: "per sq yd", projected: [6150, 6880], direction: "rise", confidence: 0.84, x: 51, y: 59, size: 17, color: "#e55f34",
    drivers: [
      { id: "airport", name: "Rajiv Gandhi International Airport", type: "Airport", status: "Operational · expansion reported", contribution: [5, 8], confidence: 0.88, timeline: "12–24 months", summary: "Airport-linked employment, logistics and improved regional access are the dominant positive signals in this estimate.", image: airportImage, sourceCount: 4, x: 57, y: 51 },
      { id: "orr", name: "ORR logistics & access network", type: "Road corridor", status: "Operational · upgrades ongoing", contribution: [2, 4], confidence: 0.79, timeline: "6–18 months", summary: "Access improvements increase the weight of the airport and industrial ecosystem around the region.", image: corridorImage, sourceCount: 3, x: 44, y: 62 },
    ],
  },
  {
    id: "warangal", name: "Warangal Urban", district: "Hanamkonda", value: 2450, unit: "per sq yd", projected: [2580, 2810], direction: "rise", confidence: 0.71, x: 70, y: 40, size: 13, color: "#a8b78e",
    drivers: [{ id: "rail", name: "Rail & regional mobility upgrades", type: "Transit", status: "Announced", contribution: [2, 4], confidence: 0.71, timeline: "24–36 months", summary: "The signal is positive but remains dependent on project progress and broader employment activity.", image: corridorImage, sourceCount: 2, x: 73, y: 33 }],
  },
  {
    id: "sangareddy", name: "Sangareddy", district: "Sangareddy", value: 1850, unit: "per sq yd", projected: [2010, 2240], direction: "rise", confidence: 0.77, x: 33, y: 36, size: 15, color: "#d58f56",
    drivers: [{ id: "industrial", name: "Industrial park expansion", type: "Industrial", status: "Construction underway", contribution: [4, 7], confidence: 0.81, timeline: "12–30 months", summary: "Manufacturing and logistics announcements create a moderate demand signal near the existing industrial belt.", image: industrialImage, sourceCount: 5, x: 28, y: 29 }],
  },
  {
    id: "medchal", name: "Medchal", district: "Medchal–Malkajgiri", value: 3900, unit: "per sq yd", projected: [4010, 4290], direction: "mixed", confidence: 0.63, x: 46, y: 28, size: 12, color: "#b9a27c",
    drivers: [{ id: "it", name: "Northern IT & logistics corridor", type: "IT corridor", status: "Multiple announcements", contribution: [1, 4], confidence: 0.64, timeline: "18–36 months", summary: "Employment signals are positive, while congestion and delivery uncertainty keep the overall projection mixed.", image: industrialImage, sourceCount: 4, x: 52, y: 23 }],
  },
  {
    id: "nalgonda", name: "Nalgonda", district: "Nalgonda", value: 1180, unit: "per sq yd", projected: [1070, 1230], direction: "mixed", confidence: 0.46, x: 59, y: 76, size: 12, color: "#c1aa88",
    drivers: [{ id: "highway", name: "Regional highway proposal", type: "Road corridor", status: "Proposed", contribution: [-1, 2], confidence: 0.46, timeline: "36+ months", summary: "A proposed corridor creates upside, but the range remains wide because the project is not yet committed.", image: corridorImage, sourceCount: 1, x: 66, y: 71 }],
  },
  { id: "karimnagar", name: "Karimnagar", district: "Karimnagar", value: 1620, unit: "per sq yd", projected: null, direction: "neutral", confidence: null, x: 78, y: 22, size: 11, color: "#c7c3b8", drivers: [] },
  { id: "khammam", name: "Khammam", district: "Khammam", value: 1370, unit: "per sq yd", projected: [1340, 1440], direction: "mixed", confidence: 0.38, x: 84, y: 66, size: 10, color: "#beb6aa", drivers: [] },
];

export const projectTypes: ProjectType[] = ["Airport", "Road corridor", "Transit", "Industrial", "IT corridor"];
export const officialValueUrl = governmentUrl;
export const infrastructureRecords: InfrastructureRecord[] = [
  { id: "infra-airport-expansion", regionId: "shamshabad", name: "RGIA terminal expansion", type: "Airport", status: "Under construction", openingYear: 2028, latitude: 17.2403, longitude: 78.4294, contribution: [5, 8], confidence: 0.88, summary: "Airport capacity and the adjacent logistics ecosystem are the strongest mapped development signals in this estimate.", proofUrls: ["https://www.aai.aero/en/airports/hyderabad"] },
  { id: "infra-orr-logistics", regionId: "shamshabad", name: "ORR logistics & access network", type: "Road corridor", status: "Upcoming", openingYear: 2027, latitude: 17.2776, longitude: 78.3864, contribution: [2, 4], confidence: 0.79, summary: "Access improvements can increase the weight of airport-linked employment and logistics demand.", proofUrls: ["https://www.hmda.gov.in/outer-ring-road/", "https://www.telangana.gov.in/"] },
  { id: "infra-warangal-mobility", regionId: "warangal", name: "Warangal regional mobility upgrade", type: "Transit", status: "Announced", openingYear: 2029, latitude: 17.9784, longitude: 79.5941, contribution: [2, 4], confidence: 0.71, summary: "A regional mobility upgrade can widen access to jobs and services around the urban core.", proofUrls: ["https://www.telangana.gov.in/"] },
  { id: "infra-sangareddy-park", regionId: "sangareddy", name: "Sangareddy industrial park expansion", type: "Industrial", status: "Under construction", openingYear: 2028, latitude: 17.6247, longitude: 78.0844, contribution: [4, 7], confidence: 0.81, summary: "Manufacturing and logistics capacity adds a moderate employment and land-demand signal.", proofUrls: ["https://www.tsiic.telangana.gov.in/"] },
  { id: "infra-medchal-it", regionId: "medchal", name: "Northern IT & logistics corridor", type: "IT corridor", status: "Announced", openingYear: 2029, latitude: 17.6298, longitude: 78.4814, contribution: [1, 4], confidence: 0.64, summary: "Employment signals are positive, while delivery uncertainty keeps this contribution deliberately bounded.", proofUrls: ["https://invest.telangana.gov.in/"] },
  { id: "infra-nalgonda-highway", regionId: "nalgonda", name: "Regional highway proposal", type: "Road corridor", status: "Upcoming", openingYear: 2030, latitude: 17.0732, longitude: 79.2671, contribution: [-1, 2], confidence: 0.46, summary: "The corridor creates upside only if the proposal progresses beyond the current planning stage.", proofUrls: ["https://www.telangana.gov.in/"] },
];

export const groundTruthMock = { state: "Telangana", updatedAt: "18 Aug 2026", evidenceWindow: "Last 90 days", regions, projectTypes, officialValueUrl, infrastructureRecords };
