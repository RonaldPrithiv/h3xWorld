import * as z from 'zod';

export const UserValidation = z.object({
    profile_photo: z.string().url().min(1),
    cover: z.string().url().min(1),
    name: z.string().min(2, {message: 'Name must be atleast 2 characters.'}).max(30),
    username: z.string().min(3, {message: 'Username must be atleast 2 characters.'}).max(30),
    bio: z.string().min(1).max(1000)
})