import { ImageSource } from "expo-image";

const ALPHA_KING = require("@/assets/images/shows/@alpha-kings-hated-princess.png");
const LOVE_CAPTIVE_TO_THE_MAFIA_BOSS = require("@/assets/images/shows/@love-captive-to-the-mafia-boss.png");
const ALPHA_KINGS_HATED_PRINCESS = require("@/assets/images/shows/@alpha-kings-hated-princess.png");
const SPARK_ME_TENDERLY = require("@/assets/images/shows/@spark-me-tenderly.png");
const MILAN_IN_APRIL = require("@/assets/images/shows/@milan-in-april.png");
const NIGHT_WITH_MY_VAMPIRE_MATE = require("@/assets/images/shows/@night-with-my-vampire-mate.png");
const MATE_MINE = require("@/assets/images/shows/@mate-mine.png");
const THE_ALPHAS_MATE = require("@/assets/images/shows/@the-alphas-mate.png");

export const SHOWS_BANNER: Record<string, ImageSource> = {
  "@the-alphas-mate": THE_ALPHAS_MATE,
  "@love-captive-to-the-mafia-boss": LOVE_CAPTIVE_TO_THE_MAFIA_BOSS,
  "@alpha-kings-hated-princess": ALPHA_KINGS_HATED_PRINCESS,
  "@spark-me-tenderly": SPARK_ME_TENDERLY,
  "@milan-in-april": MILAN_IN_APRIL,
  "@night-with-my-vampire-mate": NIGHT_WITH_MY_VAMPIRE_MATE,
  "@mate-mine": MATE_MINE,
} as const;
