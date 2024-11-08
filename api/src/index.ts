import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { getPrisma } from "../lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { ZCreateUser } from "../lib/schema";
import { Prisma } from "@prisma/client";
import { bearerAuth } from "hono/bearer-auth";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(prettyJSON());

app.get("/cruxx", async (c) => {
  return c.json({ message: "Hello World!" });
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

app.post("/cruxx/users",zValidator("json",ZCreateUser) , async (c) => {
  const { id, email, firstName, lastName, picture } = c.req.valid("json");
    const prisma = getPrisma(c.env.DATABASE_URL);
    let newUser, existingUser;
    try{
      existingUser = await prisma.user.findUnique({
        where : {
          id
        }
      })
    }catch(error){
      return c.json({error},{status : 500});
    }

    if(existingUser){
      return c.json({user : existingUser,message : "User already exists in database"}, {status : 400});
    }

    try {
      newUser = await prisma.user.create({
        data : {
          id,
          email,
          firstName,
          lastName,
          picture,
          createdAt : new Date()
        }
      })
    } catch (error) {
      return c.json({error, message : "Error inserting user into database"},{status : 500})
    }
    console.log(newUser);
    return c.json({user : newUser,message : "User inserted into database successfully"}, {status : 201});
  }
);

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

export default app;

// `/api/any` Routes will not require API Key
// `/api/cruxx/any` Routes will require API Key
