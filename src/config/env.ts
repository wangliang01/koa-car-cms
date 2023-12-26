import dotenv from 'dotenv'

const argv = process.argv 

const mode = argv[2] === '--mode' ? argv[3] : ''

const envFile = mode ? `.env.${mode}` : '.env'

dotenv.config({ path: envFile })