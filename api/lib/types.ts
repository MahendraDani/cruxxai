export type TRefererLink = {
  baseURL : string
  name ?: string;
  href : string;  // can be "/blogs" || "/https://abc.com/paht" || "/http://abc,com"
  target : string;
  alt : string
  url : string // will always start with "http://" || "https://"
}