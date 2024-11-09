import { getHTML } from "./scrape";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const summarize = async (url: string, env: CloudflareBindings) => {
  const html = await getHTML(url);
  let summary;
  try {
    const genAI = new GoogleGenerativeAI(env.GOOGLE_GENERATIVE_AI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You are a web content analyzer.Summarize the information provided in the HTML within 100-120 words only. The summary should be accurate, concise and easy-to-understand.`,
  });
  logProgress(url);
  summary = await model
    .generateContent(html)
    .then((res) => res.response)
    .then((res) => res.text());
  } catch (error) {
    throw error;
  }
  console.log("-------------------------------------");
  console.log("Summary:",url,summary,"\n");
  return summary;
};

function logProgress(url: string) {
  console.log(`
\nSummarizing : ${url}\n  
`);
}

// const prompt = `You are an AI agent that is capabale of extracting information about a website from html. 
// Html will be given as input and you have to summarize it and return the output in markdown 
// format. Summarize should not exceed 150-180 words.`;
// const summary1 = `This article is a collection of notes on Aaron Swartz's book "A Programmable Web." It highlights Swartz's vision for a web where data is accessible and integrated seamlessly, advocating for open and programmable web design. The article emphasizes the importance of APIs and RESTful architectures, arguing that they should be designed to facilitate data sharing and integration. It also criticizes the tendency towards "standards over design," emphasizing the need to build and test before standardizing. The author draws parallels between the web's development and the history of software, highlighting the importance of accessibility and user freedom. It includes numerous quotes from Swartz and others about the importance of the open web.`;
// const summary2 = `## Website Summary: Notes on A Programmable Web by Aaron Swartz

// This website is a blog post by Shu Ding, reflecting on the influential work of Aaron Swartz and his book "A Programmable Web." The author discusses how Swartz's vision for a more open and interconnected web has shaped his own understanding of web development. 

// **Key Features:**

// * **Quotes from Aaron Swartz:** The post presents several insightful quotes from Swartz's original writing, exploring topics like APIs, URL design, and the evolution of the web.
// * **References to Other Works:** The author provides links to external resources, including articles, blog posts, and online discussions that further delve into the ideas presented.
// * **Focus on Openness:** The website emphasizes the importance of an open web, where data is readily accessible and applications can seamlessly integrate with one another.

// **Target Audience:**

// The target audience is likely web developers, programmers, and anyone interested in the history and future of the internet. 

// **Unique Selling Points:**

// * **Personal Reflections:** The post offers a unique perspective on Swartz's work through the lens of a web developer's journey.
// * **Curated Content:** The website provides a curated collection of resources and quotes relevant to the topic of a programmable web.

// **Contact Information:**

// * **Email:** g@shud.in
// * **Social Media:**
//     * Twitter: https://twitter.com/shuding_
//     * GitHub: https://github.com/shuding
//     * Instagram: https://instagram.com/_shuding`