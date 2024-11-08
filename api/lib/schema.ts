import {z} from "zod";

export const ZCreateUser =  z.object({
  id : z.string().min(1,{message : "user id is required"}),
  email : z.string(),
  firstName : z.string(),
  lastName : z.string(),
  picture : z.string()
});

// z
//   .union([z.string().length(0), z.string()])
//   .optional()
//   .transform(e => e === "" ? undefined : e),