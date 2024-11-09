export const API_CONFIG = {
  BASE_API  : process.env.NODE_ENV=="development" ? process.env.DEV_BASE_API : process.env.PROD_BASE_API,
  BASE_API_AUTH : process.env.NODE_ENV==="development" ? process.env.DEV_BASE_API_AUTH : process.env.PROD_BASE_API_AUTH
}