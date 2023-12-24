import * as z from 'zod';

export const PostValidation = z.object({
    post: z.string().min(1, { message: 'Minimum 1 character.'}),
    user_id: z.string(),
    image: z.string().url().min(1).optional(),
})

export const CommentValidation = z.object({
    post: z.string().min(1, { message: 'Minimum 1 character.'}),
    user_id: z.string(),
})

