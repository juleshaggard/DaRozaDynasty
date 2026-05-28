import homeRaw from "../legacy/index.html?raw";
import floraRaw from "../legacy/posts/2013-12-24-flora-daroza.html?raw";
import gailRaw from "../legacy/posts/2010-01-07-gail-haggard.html?raw";
import gregRaw from "../legacy/posts/2010-01-06-greg-costa.html?raw";
import gwenRaw from "../legacy/posts/2013-11-25-gwen-wilder.html?raw";
import juliaRaw from "../legacy/posts/2013-11-23-julia-coster.html?raw";
import lorraineRaw from "../legacy/posts/2010-12-24-lorraine-daroza.html?raw";
import wesRaw from "../legacy/posts/2013-11-25-wes-costa.html?raw";

export const homePage = {
  raw: homeRaw,
};

export const profilePages = [
  { slug: "gail-haggard", raw: gailRaw },
  { slug: "lorraine-daroza", raw: lorraineRaw },
  { slug: "gwen-wilder", raw: gwenRaw },
  { slug: "flora-daroza", raw: floraRaw },
  { slug: "wes-costa", raw: wesRaw },
  { slug: "julia-coster", raw: juliaRaw },
  { slug: "greg-costa", raw: gregRaw },
] as const;

export type ProfilePage = (typeof profilePages)[number];
