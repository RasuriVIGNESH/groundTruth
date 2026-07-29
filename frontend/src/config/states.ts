export type StateCode = string;

export interface StateOption {
  code: StateCode;
  name: string;
  isLive: boolean;
}

export const STATES: StateOption[] = [
  // { code: 'andaman-nicobar', name: 'Andaman and Nicobar Islands', isLive: false },
  // { code: 'andhra-pradesh', name: 'Andhra Pradesh', isLive: false },
  // { code: 'arunachal-pradesh', name: 'Arunachal Pradesh', isLive: false },
  // { code: 'assam', name: 'Assam', isLive: false },
  // { code: 'bihar', name: 'Bihar', isLive: false },
  // { code: 'chandigarh', name: 'Chandigarh', isLive: false },
  // { code: 'chhattisgarh', name: 'Chhattisgarh', isLive: false },
  // { code: 'dadra-nagar-haveli-daman-diu', name: 'Dadra and Nagar Haveli and Daman and Diu', isLive: false },
  // { code: 'delhi', name: 'Delhi', isLive: false },
  // { code: 'goa', name: 'Goa', isLive: false },
  // { code: 'gujarat', name: 'Gujarat', isLive: false },
  // { code: 'haryana', name: 'Haryana', isLive: false },
  // { code: 'himachal-pradesh', name: 'Himachal Pradesh', isLive: false },
  // { code: 'jammu-kashmir', name: 'Jammu and Kashmir', isLive: false },
  // { code: 'jharkhand', name: 'Jharkhand', isLive: false },
  // { code: 'karnataka', name: 'Karnataka', isLive: false },
  // { code: 'kerala', name: 'Kerala', isLive: false },
  // { code: 'ladakh', name: 'Ladakh', isLive: false },
  // { code: 'lakshadweep', name: 'Lakshadweep', isLive: false },
  // { code: 'madhya-pradesh', name: 'Madhya Pradesh', isLive: false },
  // { code: 'maharashtra', name: 'Maharashtra', isLive: false },
  // { code: 'manipur', name: 'Manipur', isLive: false },
  // { code: 'meghalaya', name: 'Meghalaya', isLive: false },
  // { code: 'mizoram', name: 'Mizoram', isLive: false },
  // { code: 'nagaland', name: 'Nagaland', isLive: false },
  // { code: 'odisha', name: 'Odisha', isLive: false },
  // { code: 'puducherry', name: 'Puducherry', isLive: false },
  // { code: 'punjab', name: 'Punjab', isLive: false },
  // { code: 'rajasthan', name: 'Rajasthan', isLive: false },
  // { code: 'sikkim', name: 'Sikkim', isLive: false },
  // { code: 'tamil-nadu', name: 'Tamil Nadu', isLive: false },
  { code: 'telangana', name: 'Telangana', isLive: true }
  // { code: 'tripura', name: 'Tripura', isLive: false },
  // { code: 'uttar-pradesh', name: 'Uttar Pradesh', isLive: false },
  // { code: 'uttarakhand', name: 'Uttarakhand', isLive: false },
  // { code: 'west-bengal', name: 'West Bengal', isLive: false }
];
