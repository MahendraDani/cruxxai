import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { getPrisma } from "../lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { ZCreateUser } from "../lib/schema";
import { Prisma } from "@prisma/client";
import { bearerAuth } from "hono/bearer-auth";
import { generateAPIKey, validateKey } from "../lib/api-key";
import { getHTML, scrapeHTML } from "../lib/scrape";
import { TRefererLink } from "../lib/types";
import { summarize } from "../lib/ai";
import { cors } from "hono/cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import {sign,encode,decode} from "hono/jwt"

const app = new Hono<{ Bindings: CloudflareBindings }>();

// app.use(prettyJSON());


app.use(cors());
app.use(
  "/cruxx/api/*",
  bearerAuth({
    verifyToken(token, c) {
      return validateKey(token, c);
    },
    invalidTokenMessage(c) {
      return {
        erorr: "Incorrect or Invalid API KEY",
        message: "Please provide valid API KEY or generate a new API KEY",
      };
    },
    noAuthenticationHeaderMessage(c) {
      return {
        error: "Authorization Header Not Found",
        message: "Authorization : Bearer <API_KEY>",
      };
    },
    invalidAuthenticationHeaderMessage(c) {
      return {
        error: "Invalid Auhentication Header",
        message: "Authorization : Bearer <API_KEY>",
      };
    },
  })
);

app.get("/", (c) => {
  return c.json({ message: "Hello,World!" });
});

app.get("/cruxx", (c) => {
  return c.json({ message: "Hello,World!" });
});

// Admin Routes
app.get("/cruxx/users", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const users = await prisma.user.findMany();
  return c.json({ data: users });
});

// User routes
app.get("/cruxx/users/:id", async (c) => {
  const userId = c.req.param("id");
  let user;
  try {
    const prisma = getPrisma(c.env.DATABASE_URL);
    user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    return c.json({ error });
  }
  return c.json({ user }, { status: 200, statusText: "Ok" });
});

app.post("/cruxx/users", zValidator("json", ZCreateUser), async (c) => {
  const { id, email, firstName, lastName, picture } = c.req.valid("json");
  const prisma = getPrisma(c.env.DATABASE_URL);
  let newUser, existingUser;
  try {
    existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    return c.json({ error }, { status: 500 });
  }

  if (existingUser) {
    return c.json(
      { user: existingUser, message: "User already exists in database" },
      { status: 400 }
    );
  }

  try {
    newUser = await prisma.user.create({
      data: {
        id,
        email,
        firstName,
        lastName,
        picture,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    return c.json(
      { error, message: "Error inserting user into database" },
      { status: 500 }
    );
  }
  console.log(newUser);
  return c.json(
    { user: newUser, message: "User inserted into database successfully" },
    { status: 201 }
  );
});

app.delete("/cruxx/users/:id", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const id = c.req.param("id");
  let user;
  try {
    user = await prisma.user.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    return c.json(
      {
        error: "User with given id does not exists",
        message: "Invalid or incorrect user id",
      },
      { status: 400 }
    );
  }
  return c.json({ message: "User account deleted" });
});

// Generate API Key
app.get(
  "/cruxx/key",
  zValidator(
    "query",
    z.object({
      userId: z.string(),
    })
  ),
  async (c) => {
    const { userId } = c.req.valid("query");
    let apiKey;
    try {
      apiKey = await generateAPIKey(userId, c);
    } catch (error) {
      return c.json({ error, message: "Error generating API key" });
    }
    return c.json(apiKey);
  }
);

app.get("/cruxx/api/whoami", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const apiKey = c.req.header("Authorization")?.split(" ")[1];
  const data = await prisma.token.findFirst({
    where: {
      apiKey,
    },
    include: {
      user: true,
    },
  });
  return c.json({ data });
});

app.get(
  "/cruxx/summarize",
  zValidator("query", z.object({ url: z.string() })),
  async (c) => {
    const { url } = c.req.valid("query");
    let html;
    try {
      html = await getHTML(url);
    } catch (error) {
      console.log("HTML Scrape Error", error);
      return c.json({ error, message: "Error scrapping HTML from URL" });
    }
    let summary;
    try {
      summary = await summarize(url, c.env);
    } catch (error) {
      console.log(error)
      return c.json({ data: null, url, error: "Error summarizing URL" });
    }
    return c.json({
      data: {
        url,
        summary,
      },
      error: null,
    });
  }
);

app.post('/snipy', async (c) => {
  try {
    const body = await c.req.json()
    const { promptType, prompt } = body

    // Print to console
    console.log('promptType:', promptType)
    console.log('prompt:', prompt)

    // Validate inputs
    if (!promptType || !prompt) {
      return c.json({ 
        success: false, 
        error: 'promptType and prompt are required' 
      }, 400)
    }

    // Set system prompt based on promptType
    let systemPrompt = ""
    if (promptType === "EXPLAIN_LIKE_FIVE") {
      systemPrompt = `You will be provided with a text or multiple paragraphs.
       Your task is to explain the text to a person who has minimal or no knowledge of the subject.
       Use a friendly tone and explain the answer within 50-80 words in plain text format. 
       Please use examples and analogies or comparisons to explain the topic in a more concise and clear way.`
    } else if (promptType === "EXPLAIN_TOPIC") {
      systemPrompt = `You will be provided with a text or multiple paragraphs. 
      Your task is to understand the text and extract the core subject or topic.
      Explain the core subject or topic in 40-60 words briefly, providing examples and analogies and return the output in plain text format.`
    } else if (promptType === "LIST_TAKEAWAYS") {
      systemPrompt = `You will be provided with a text or paragraph. Follow these steps to answer the user queries.
        Step 1: First understand the context, subject, tone and style of writing in the provided text.
        Step 2: Based on the findings of step 1, list out in 4-5 points the key points of understanding from the text.
        Please provide with relevant points and avoid using the same words as in text.
        Please output only the points in step 2.`
    } else if (promptType === "LONG_SUMMARY") {
      systemPrompt = `You will be provided with a text or multiple paragraphs. 
    Please summarise the provided text based on the subject and topics 
    explained in the text within 100-150 words. Explain the core topics in-depth and how they are used in the provided text. The summary should be in-depth and detailed based on the context provided in the text. Please provide bullet-points and analogies if necessary for better understanding in plain text format.`
    } else if (promptType === "SHORT_SUMMARY") {
      systemPrompt = `You will be provided with a text or multiple paragraphs. Please summarise the provided text based on the subject and topics explained in the text within 30-50 words in plain text format. The summary should be short, concise and easy to understand.`
    } else if (promptType === "REPHRASE_FOR_REFERENCE") {
      systemPrompt = `You will be provided with a text or multiple paragraphs. The given text is to be used as an reference in a paper, article or blog. Your task is deduce a conclusion from the provided text and rephrase it within 20-30 words in assertive tone in plain text format`
    } else if (promptType === "SINGLE_PARAGRAPH") {
      systemPrompt = `You will be provided with text or multiple paragraphs. Your task is to convert the given text into a single paragraph. Please keep the paragraph small (30-50 words), concise and clear and output in plain text format.`
    } else if (promptType === "CUSTOM_PROMPT") {
      systemPrompt = `You will be provided with a text or multiple paragraphs. Based on the user query write an appropriate response. The response should be clear, concise and easy to understand and output in plain text. Answer within 60-100 words.`
    } else {
      return c.json({ 
        success: false, 
        error: 'Please provide a valid prompt type' 
      }, 400)
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(c.env.GOOGLE_GENERATIVE_AI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-001",
      systemInstruction: systemPrompt,
    })

    // Generate content
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    console.log('AI Response:', text)

    return c.json({ 
      success: true,
      promptType,
      result: text
    })
  } catch (error) {
    console.error('Error:', error)
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An error occurred' 
    }, 500)
  }
})

app.get("/cruxx/summarize/all", zValidator("query", z.object({ url: z.string() })), async c => {
  const { url } = c.req.valid("query");
  let html;
  
  try {
    html = await getHTML(url);
  } catch (error) {
    console.log(error);
    return c.json({ 
      data: null, 
      error: "Error fetching HTML from base URL",
      totalLinks: 0,
      successCount: 0
    });
  }

  let refererLinks: TRefererLink[];
  refererLinks = scrapeHTML(html, url);
  const totalLinks = refererLinks.length;

  try {
    // Create an array of promises for all summaries
    const summaryPromises = refererLinks.map(link => 
      summarize(link.url, c.env)
        .catch(error => {
          console.error(`Error summarizing ${link.url}:`, error);
          return null; // Return null for failed summaries
        })
    );

    // Wait for all summaries to complete in parallel
    const summaries = await Promise.all(summaryPromises);

    // Filter out failed summaries and combine with URLs
    const results = refererLinks
      .map((link, index) => ({
        ...link,
        summary: summaries[index]
      }))
      .filter(result => result.summary !== null);

    return c.json({ 
      totalLinks,
      successCount: results.length,
      data: results,
      error: null
    });
  } catch (error) {
    console.error("Error in parallel summarization:", error);
    return c.json({ 
      data: null, 
      error: "Error during parallel summarization",
      totalLinks,
      successCount: 0
    });
  }
});
export default app;

// `/api/*` Routes will not require API Key
// `/api/cruxx/*` Routes will require API Key
