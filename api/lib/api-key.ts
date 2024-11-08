import { Context } from "hono"
import {sign,decode,verify} from "hono/jwt"
import { getPrisma } from "./prisma";

export const generateAPIKey = async (userId : string, c : Context)=>{
  const prisma = getPrisma(c.env.DATABASE_URL);

  //check if user already has an API key if yes then give them that
  const exists = await prisma.aPIMapping.findFirst({
    where : {
      userId,
    }
  })

  if(exists){
    return exists;
  }
  const apiKey = await sign({
    userId,
    createdAt : new Date()
  },c.env.JWT_SECRET);

  // add key to database
  let newKey;
  try {
      newKey = await prisma.aPIMapping.create({
      data : {
        userId,
        apiKey,
        createdAt : new Date(),
        //TODO : make expiry date optional
        expiry : new Date(),
      }
    })
  } catch (error) {
    throw error;
  }

  return newKey;
}

export const validateKey = async (apiKey : string, c : Context)=>{
  const prisma = getPrisma(c.env.DATABASE_URL);

  let exists;
  try {
    exists = await prisma.aPIMapping.findFirst({
      where : {
        apiKey,
      }
    })
  } catch (error) {
    console.log(error);
    return false;
  }

  if(exists){
    return true;
  }else{
    return false;
  }
}