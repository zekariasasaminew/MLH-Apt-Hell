import { TIERS } from "@/pain/pain-cookie";

export type RentEffects = {
  /** Mild */
  feesOnHover: boolean;
  feeAmount: number;
  expensiveFirst: boolean;
  inflatedCount: boolean;
  urgencyBadges: boolean;
  saveSearchModal: boolean;
  /** Annoying */
  sponsoredFiller: boolean;
  filterAmnesia: boolean;
  weirdBeds: boolean;
  lyingPagination: boolean;
  priceCreep: boolean;
  shyPins: boolean;
  /** Hostile */
  selfSorting: boolean;
  ghostListings: boolean;
  incomeGate: boolean;
  filtersAsForm: boolean;
  degradedMap: boolean;
  /** Unhinged */
  geocities: boolean;
  gravityCards: boolean;
  allRoadsOneListing: boolean;
  absurdTags: boolean;
};

/** The single place that decides what Rent does at a given pain level. Tune thresholds here. */
export function rentEffects(pain: number): RentEffects {
  const mild = pain >= TIERS.mild;
  const annoying = pain >= TIERS.annoying;
  const hostile = pain >= TIERS.hostile;
  const unhinged = pain >= TIERS.unhinged;

  return {
    feesOnHover: mild,
    feeAmount: 389 + Math.round(pain * 7),
    expensiveFirst: mild,
    inflatedCount: mild,
    urgencyBadges: mild,
    saveSearchModal: mild,
    sponsoredFiller: annoying,
    filterAmnesia: annoying,
    weirdBeds: annoying,
    lyingPagination: annoying,
    priceCreep: annoying,
    shyPins: annoying,
    selfSorting: hostile,
    ghostListings: hostile,
    incomeGate: hostile,
    filtersAsForm: hostile,
    degradedMap: hostile,
    geocities: unhinged,
    gravityCards: unhinged,
    allRoadsOneListing: unhinged,
    absurdTags: unhinged,
  };
}
