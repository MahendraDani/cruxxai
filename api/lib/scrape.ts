import * as cheerio from "cheerio";
import { TRefererLink } from "./types";
/*
Error Handling
1. BaseURL
2. 
*/

/*
Validations to run on baseURL
1. If it isn't valid URL fetch request throws error

*/

export const getHTML = async (baseUrl: string) => {
  let html;
  try {
    const res = await fetch(baseUrl, {
      method: "GET",
    });
    html = await res.text();
  } catch (error) {
    throw error;
  }
  return html;
};

// Returns all refererLinks from html using cheerio
export const scrapeHTML = (html: string,baseURL : string) : TRefererLink[] => {
  let rawRefererLinks;
  try {
    const $ = cheerio.load(html);
    rawRefererLinks = $("a");
  } catch (error) {
    console.log("CHEERIO ERROR");
  }
  let refererLinks : TRefererLink[] = [];
  for (let link of rawRefererLinks!) {

    // Validations
    // 1. Link should be either "http://*" | "https://*" | "/"-> should append with 

    let validLink = "";
    if(link.attribs.href.startsWith("#")){
      console.log("SKIPPED", link.attribs.href);
      continue;
    }else if(link.attribs.href.startsWith("/")){
      validLink = `${baseURL}${link.attribs.href}`;
    }else if (link.attribs.href.startsWith("http://") || link.attribs.href.startsWith("https://")){
      validLink = link.attribs.href;
    }else{
      console.log("SKIPPED", link.attribs.href);
      continue;
    }

    let refererLink : TRefererLink;
    const $link = cheerio.load(link);
    // console.log($.text());
    try {
       refererLink = {
        // @ts-ignore
        name: $link.text() || link.childNodes[0]?.innerHTML,
        href: link.attribs.href,
        alt : link.attribs.alt || "",
        target: link.attribs?.target || "blank",
        url : validLink,
        baseURL,
      };
    } catch (error) {
      console.log("SKIPPED DUE TO URL ERROR", link.attribs.href);
      continue;
    }
    refererLinks.push(refererLink);
  }
  return refererLinks;
};
