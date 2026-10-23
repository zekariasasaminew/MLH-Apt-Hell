export type HomeType = "Apartment" | "House" | "Townhome" | "Condo";

export type City = {
  slug: string;
  label: string;
  state: string;
  center: [lat: number, lng: number];
};

export type Listing = {
  id: string;
  rent: number;
  beds: number;
  baths: number;
  sqft: number;
  street: string;
  city: string;
  citySlug: string;
  state: string;
  zip: string;
  status: "For rent" | "Pending" | "Just listed";
  badge?: string;
  photo: string;
  photos: string[];
  finePrint: string;
  lat: number;
  lng: number;
  homeType: HomeType;
  listedDaysAgo: number;
  applyInstantly: boolean;
  pets: "cats" | "dogs" | "both" | "none";
  laundry: "in-unit" | "shared" | "none";
  parking: boolean;
  /** ISO date (yyyy-mm-dd). */
  availableFrom: string;
};

export const cities: City[] = [
  { slug: "rock-island-il", label: "Rock Island", state: "IL", center: [41.5095, -90.5787] },
  { slug: "moline-il", label: "Moline", state: "IL", center: [41.5067, -90.5151] },
  { slug: "east-moline-il", label: "East Moline", state: "IL", center: [41.5014, -90.4443] },
  { slug: "silvis-il", label: "Silvis", state: "IL", center: [41.5112, -90.4125] },
  { slug: "davenport-ia", label: "Davenport", state: "IA", center: [41.5236, -90.5776] },
  { slug: "bettendorf-ia", label: "Bettendorf", state: "IA", center: [41.5245, -90.5157] },
];

type SeedListing = Pick<
  Listing,
  "id" | "rent" | "beds" | "baths" | "sqft" | "street" | "city" | "state" | "zip" | "status" | "badge" | "photo" | "finePrint"
>;

const unsplash = (photoId: string) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=800&q=75`;

const seedListings: SeedListing[] = [
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

const extraPhotos = [
  unsplash("1545324418-cc1a3fa10c00"),
  unsplash("1501183638710-841dd1904471"),
  unsplash("1494526585095-c41746248156"),
];

const photoPool = [...seedListings.map((listing) => listing.photo), ...extraPhotos];

type ExtraRow = [street: string, city: string, zip: string, rent: number, beds: number, baths: number, sqft: number];

const extraRows: ExtraRow[] = [
  ["1520 3rd Ave Apt 2B", "Rock Island", "61201", 925, 1, 1, 640],
  ["2210 9th St", "Rock Island", "61201", 1090, 2, 1, 880],
  ["1812 20th St", "Rock Island", "61201", 1340, 3, 1, 1250],
  ["415 17th St Apt 4", "Rock Island", "61201", 780, 0, 1, 520],
  ["3025 7th Ave", "Rock Island", "61201", 1215, 2, 1, 1010],
  ["1100 30th St", "Rock Island", "61201", 1480, 3, 2, 1400],
  ["2630 24th Ave", "Rock Island", "61201", 995, 2, 1, 920],
  ["938 11th St Unit C", "Rock Island", "61201", 850, 1, 1, 700],
  ["1620 4th Ave Apt 3", "Moline", "61265", 875, 1, 1, 690],
  ["2815 41st St", "Moline", "61265", 1560, 3, 2, 1480],
  ["1308 12th St", "Moline", "61265", 1030, 2, 1, 900],
  ["4225 23rd Ave", "Moline", "61265", 1395, 2, 2, 1180],
  ["725 16th Ave Apt 1A", "Moline", "61265", 760, 0, 1, 450],
  ["3410 7th St", "Moline", "61265", 1710, 4, 2, 1850],
  ["1902 5th Ave", "Moline", "61265", 940, 1, 1, 720],
  ["2550 15th St", "Moline", "61265", 1275, 3, 1, 1300],
  ["1425 7th St", "East Moline", "61244", 905, 2, 1, 860],
  ["960 20th Ave", "East Moline", "61244", 1120, 3, 1, 1180],
  ["2201 John Deere Rd", "East Moline", "61244", 1245, 2, 2, 1050],
  ["710 15th Ave Apt 5", "East Moline", "61244", 690, 1, 1, 540],
  ["401 1st St", "Silvis", "61282", 870, 2, 1, 900],
  ["1203 8th Ave", "Silvis", "61282", 1190, 3, 2, 1320],
  ["2710 Hillcrest Rd", "Silvis", "61282", 1025, 2, 1, 980],
  ["1215 W 3rd St", "Davenport", "52802", 1085, 1, 1, 760],
  ["623 Perry St Apt 2", "Davenport", "52801", 995, 1, 1, 700],
  ["1840 Harrison St", "Davenport", "52803", 1180, 2, 1, 1010],
  ["3345 Jersey Ridge Rd", "Davenport", "52807", 1330, 2, 2, 1120],
  ["902 E Locust St", "Davenport", "52803", 1450, 3, 1, 1380],
  ["4811 Elmore Ave", "Davenport", "52807", 1560, 3, 2, 1520],
  ["2630 Eastern Ave", "Davenport", "52803", 925, 2, 1, 880],
  ["515 Brady St Unit 304", "Davenport", "52801", 1385, 1, 1, 830],
  ["6120 N Division St", "Davenport", "52806", 2050, 4, 2, 2100],
  ["3055 Utica Ridge Rd", "Bettendorf", "52722", 1295, 2, 1, 1020],
  ["2100 Spruce Hills Dr", "Bettendorf", "52722", 1590, 2, 2, 1260],
  ["4203 Devils Glen Rd", "Bettendorf", "52722", 1750, 3, 2, 1640],
  ["1560 Grant St", "Bettendorf", "52722", 1115, 2, 1, 960],
  ["5920 Tanglefoot Ln", "Bettendorf", "52722", 2250, 4, 3, 2300],
  ["3300 Middle Rd Apt 12", "Bettendorf", "52722", 1010, 1, 1, 720],
];

const extraBadges = [
  undefined,
  "Pet friendly",
  "Open: Sat 11am-1pm",
  undefined,
  "Price cut: $10",
  undefined,
  "Washer/dryer",
  undefined,
  "Utilities included*",
  undefined,
];

const extraFinePrints = [
  "managed by people who do not answer email",
  "application fee not included",
  "photos may be from a different decade",
  "the landlord is also your neighbor",
  "square footage measured generously",
  "parking is a state of mind",
  "walls shown are suggestions",
  "deposit refunded in spirit",
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const cityFor = (city: string, state: string): City => {
  const found = cities.find((candidate) => candidate.slug === `${slugify(city)}-${state.toLowerCase()}`);
  if (!found) throw new Error(`Unknown city in listings data: ${city}, ${state}`);
  return found;
};

const spread = (index: number, salt: number) => (((index * 37 + salt * 91) % 100) - 50) / 1000;

function homeTypeFor(beds: number, index: number): HomeType {
  if (beds >= 4) return "House";
  if (beds === 3) return index % 2 === 0 ? "House" : "Townhome";
  return index % 5 === 0 ? "Condo" : "Apartment";
}

function enrich(seed: SeedListing, index: number): Listing {
  const city = cityFor(seed.city, seed.state);
  const listedDaysAgo = (index * 7) % 28;
  return {
    ...seed,
    citySlug: city.slug,
    photos: [
      seed.photo,
      ...[3, 7, 11].map((step) => photoPool[(index + step) % photoPool.length]),
    ].filter((photo, position, all) => all.indexOf(photo) === position),
    lat: Number((city.center[0] + spread(index, 1) * 0.7).toFixed(5)),
    lng: Number((city.center[1] + spread(index, 2)).toFixed(5)),
    homeType: homeTypeFor(seed.beds, index),
    listedDaysAgo,
    applyInstantly: index % 3 !== 1,
    pets: (["both", "cats", "none", "dogs"] as const)[index % 4],
    laundry: (["in-unit", "shared", "none"] as const)[index % 3],
    parking: index % 4 !== 3,
    availableFrom: new Date(Date.UTC(2026, 10, 1 + ((index * 5) % 60))).toISOString().slice(0, 10),
  };
}

const extraSeeds: SeedListing[] = extraRows.map(([street, city, zip, rent, beds, baths, sqft], row) => {
  const index = seedListings.length + row;
  const listedDaysAgo = (index * 7) % 28;
  return {
    id: slugify(`${street}-${city}`),
    rent,
    beds,
    baths,
    sqft,
    street,
    city,
    state: zip.startsWith("52") ? "IA" : "IL",
    zip,
    status: listedDaysAgo <= 2 ? "Just listed" : index % 11 === 0 ? "Pending" : "For rent",
    badge: extraBadges[index % extraBadges.length],
    photo: photoPool[(index * 5) % photoPool.length],
    finePrint: `Listing ID #${10293869 + row}, ${city.toUpperCase()} PROPERTY GROUP, ${extraFinePrints[row % extraFinePrints.length]}`,
  };
});

export const listings: Listing[] = [...seedListings, ...extraSeeds].map(enrich);

export const heroPhoto = unsplash("1558036117-15d82a90b9b1").replace("w=800", "w=2400");

export function getListing(id: string): Listing | undefined {
  return listings.find((listing) => listing.id === id);
}

export function formatRent(rent: number): string {
  return `$${rent.toLocaleString("en-US")}/mo`;
}
