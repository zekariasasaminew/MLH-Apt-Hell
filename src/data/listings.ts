export type Listing = {
  id: string;
  rent: number;
  beds: number;
  baths: number;
  sqft: number;
  street: string;
  city: string;
  state: string;
  zip: string;
  status: "For rent" | "Pending" | "Just listed";
  badge?: string;
  photo: string;
  finePrint: string;
};

const unsplash = (photoId: string) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=800&q=75`;

export const listings: Listing[] = [
  { id: "2701-blackhawk", rent: 1450, beds: 3, baths: 2, sqft: 1800, street: "2701 Blackhawk Rd", city: "Rock Island", state: "IL", zip: "61201", status: "For rent", badge: "Open: Sun 11am-1pm", photo: unsplash("1568605114967-8130f3a36994"), finePrint: "Listing ID #10293847, PRESTIGE PROPERTY MGMT, managed by people who do not answer email" },
  { id: "2720-31st", rent: 1295, beds: 4, baths: 2, sqft: 2174, street: "2720 31st Ave", city: "Rock Island", state: "IL", zip: "61201", status: "For rent", badge: "Price cut: $5 (10/20)", photo: unsplash("1570129477492-45c003edd2be"), finePrint: "Listing ID #10293848, QUAD CITIES LEASING CO, application fee not included" },
  { id: "2311-46th", rent: 980, beds: 3, baths: 2, sqft: 1030, street: "2311 46th Street Ct", city: "Rock Island", state: "IL", zip: "61201", status: "For rent", badge: "Large lower level", photo: unsplash("1564013799919-ab600027ffc6"), finePrint: "Listing ID #10293849, RIVERBEND RENTALS, photos may be from a different decade" },
  { id: "3601-14th", rent: 2100, beds: 3, baths: 3, sqft: 2028, street: "3601 14th St", city: "Rock Island", state: "IL", zip: "61201", status: "Just listed", badge: "In-ground pool", photo: unsplash("1512917774080-9991f1c4c750"), finePrint: "Listing ID #10293850, TELEQUEST REALTY, pool status: theoretical" },
  { id: "820-24th", rent: 1150, beds: 2, baths: 1, sqft: 940, street: "820 24th St", city: "Rock Island", state: "IL", zip: "61201", status: "For rent", badge: "Walk to campus", photo: unsplash("1600596542815-ffad4c1539a9"), finePrint: "Listing ID #10293851, AUGIE AREA APARTMENTS, campus is uphill both ways" },
  { id: "1505-7th-ave", rent: 1675, beds: 2, baths: 2, sqft: 1120, street: "1505 7th Ave", city: "Moline", state: "IL", zip: "61265", status: "For rent", badge: "Showcase", photo: unsplash("1600585154340-be6161a56a0c"), finePrint: "Listing ID #10293852, MOLINE LOFTS LLC, showcase fee applies to you" },
  { id: "412-river-dr", rent: 1395, beds: 1, baths: 1, sqft: 780, street: "412 River Dr", city: "Moline", state: "IL", zip: "61265", status: "For rent", badge: "River views", photo: unsplash("1502672260266-1c1ef2d93688"), finePrint: "Listing ID #10293853, RIVERFRONT LIVING, view of river not guaranteed" },
  { id: "2230-16th-st", rent: 1050, beds: 2, baths: 1, sqft: 860, street: "2230 16th St", city: "Moline", state: "IL", zip: "61265", status: "Pending", photo: unsplash("1522708323590-d24dbb6b0267"), finePrint: "Listing ID #10293854, JOHN DEERE ADJACENT REALTY" },
  { id: "5400-38th-ave", rent: 1890, beds: 3, baths: 2, sqft: 1560, street: "5400 38th Ave", city: "Moline", state: "IL", zip: "61265", status: "For rent", badge: "3D tour", photo: unsplash("1560448204-e02f11c3d0e2"), finePrint: "Listing ID #10293855, SOUTHPARK HOMES, 3D tour requires 4D glasses" },
  { id: "110-e-2nd", rent: 1595, beds: 1, baths: 1, sqft: 820, street: "110 E 2nd St", city: "Davenport", state: "IA", zip: "52801", status: "For rent", badge: "Open: Sat 1-3pm", photo: unsplash("1493809842364-78817add7ffb"), finePrint: "Listing ID #10293856, DOWNTOWN DAVENPORT FLATS" },
  { id: "2045-brady", rent: 1240, beds: 2, baths: 1, sqft: 900, street: "2045 Brady St", city: "Davenport", state: "IA", zip: "52803", status: "For rent", photo: unsplash("1484154218962-a197022b5858"), finePrint: "Listing ID #10293857, BRADY STREET PROPERTIES, kitchen pictured is the model unit" },
  { id: "731-w-locust", rent: 2350, beds: 4, baths: 3, sqft: 2400, street: "731 W Locust St", city: "Davenport", state: "IA", zip: "52804", status: "Just listed", badge: "Pet friendly*", photo: unsplash("1505691938895-1758d7feb511"), finePrint: "Listing ID #10293858, VILLAGE OF EAST DAVENPORT MGMT, *pets under 4 oz" },
  { id: "3920-kimberly", rent: 1475, beds: 2, baths: 2, sqft: 1150, street: "3920 Kimberly Rd", city: "Davenport", state: "IA", zip: "52806", status: "For rent", photo: unsplash("1554995207-c18c203602cb"), finePrint: "Listing ID #10293859, NORTHPARK RESIDENCES" },
  { id: "1801-state-st", rent: 2650, beds: 4, baths: 3, sqft: 2650, street: "1801 State St", city: "Bettendorf", state: "IA", zip: "52722", status: "For rent", badge: "Open: Sun 2-4pm", photo: unsplash("1580587771525-78b9dba3b914"), finePrint: "Listing ID #10293860, BETTENDORF PREMIER HOMES" },
  { id: "4410-crow-creek", rent: 3200, beds: 5, baths: 4, sqft: 3400, street: "4410 Crow Creek Rd", city: "Bettendorf", state: "IA", zip: "52722", status: "For rent", badge: "Luxury", photo: unsplash("1613490493576-7fde63acd811"), finePrint: "Listing ID #10293861, CROW CREEK ESTATES, income must be 40x rent" },
  { id: "925-middle-rd", rent: 1325, beds: 2, baths: 1, sqft: 980, street: "925 Middle Rd", city: "Bettendorf", state: "IA", zip: "52722", status: "Pending", photo: unsplash("1605276374104-dee2a0ed3cd6"), finePrint: "Listing ID #10293862, MIDDLE ROAD PROPERTIES" },
  { id: "601-15th-st-a", rent: 895, beds: 1, baths: 1, sqft: 610, street: "601 15th St Apt A", city: "East Moline", state: "IL", zip: "61244", status: "For rent", badge: "Cozy", photo: unsplash("1449844908441-8829872d2607"), finePrint: "Listing ID #10293863, EAST MOLINE RENTALS, cozy means small" },
  { id: "1700-kennedy", rent: 1180, beds: 2, baths: 2, sqft: 1010, street: "1700 Kennedy Dr", city: "East Moline", state: "IL", zip: "61244", status: "For rent", photo: unsplash("1523217582562-09d0def993a6"), finePrint: "Listing ID #10293864, KENNEDY COURT APTS" },
  { id: "300-main-silvis", rent: 1020, beds: 3, baths: 1, sqft: 1240, street: "300 Main St", city: "Silvis", state: "IL", zip: "61282", status: "For rent", badge: "Fenced yard", photo: unsplash("1572120360610-d971b9d7767c"), finePrint: "Listing ID #10293865, SILVIS HOME LEASING" },
  { id: "2900-18th-ave", rent: 1385, beds: 3, baths: 2, sqft: 1420, street: "2900 18th Ave", city: "Rock Island", state: "IL", zip: "61201", status: "Just listed", badge: "New construction", photo: unsplash("1576941089067-2de3c901e126"), finePrint: "Listing ID #10293866, KEYSTONE NEIGHBORHOOD MGMT, construction ongoing" },
  { id: "1200-38th-st", rent: 1725, beds: 3, baths: 2, sqft: 1690, street: "1200 38th St", city: "Rock Island", state: "IL", zip: "61201", status: "For rent", badge: "Garage", photo: unsplash("1600607687939-ce8a6c25118c"), finePrint: "Listing ID #10293867, WATCH TOWER REALTY" },
  { id: "5100-utica-ridge", rent: 1950, beds: 3, baths: 2, sqft: 1780, street: "5100 Utica Ridge Rd", city: "Davenport", state: "IA", zip: "52807", status: "For rent", badge: "Open: Sat 10am-12pm", photo: unsplash("1598228723793-52759bba239c"), finePrint: "Listing ID #10293868, UTICA RIDGE LIVING" },
];

export const heroPhoto = unsplash("1558036117-15d82a90b9b1").replace("w=800", "w=2400");

export function getListing(id: string): Listing | undefined {
  return listings.find((listing) => listing.id === id);
}

export function formatRent(rent: number): string {
  return `$${rent.toLocaleString("en-US")}/mo`;
}
