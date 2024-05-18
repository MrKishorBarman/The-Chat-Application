import { Account, Client, Databases } from 'appwrite';

export const PROJECT_ID = '6646af71003039b274f2'
export const DATABASE_ID = '6646b1370035ac5788f8'
export const COLLECTION_ID_MESSAGES = '6646b153002ed13d749c'

// List documents
export const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);
    
export const account = new Account(client)
export const databases = new Databases(client);
