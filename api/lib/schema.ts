import {z} from "zod";

export const ZCreateUser =  z.object({
  id : z.string().min(1,{message : "user id is required"}),
  email : z.string().optional(),
  firstName : z.string().optional(),
  lastName : z.string().optional(),
  picture : z.string().optional()
});