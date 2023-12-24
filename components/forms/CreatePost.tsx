"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from 'next/image';

import { PostValidation } from "@/lib/validations/post";
import { createPost } from "@/lib/actions/post.actions";
import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";
import { ChangeEvent } from "react";
import { isBase64Image } from "@/lib/utils";

interface Props {
  userId: string;
}

function CreatePost({ userId }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");

  const { organization } = useOrganization();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      post: "",
      user_id: userId,
    },
  });

  const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    e.preventDefault();

    const fileReader = new FileReader();
    if(e.target.files && e.target.files.length > 0)
    {
        const file = e.target.files[0];

        setFiles(Array.from(e.target.files))

        if(!file.type.includes('image')) return;

        fileReader.onload = async (event) => {
            const imageDataUrl = event.target?.result?.toString() || '';

            fieldChange(imageDataUrl);
        }

        fileReader.readAsDataURL(file);

    }

}

  const onSubmit = async (values: z.infer<typeof PostValidation>) => {

        if(values.image)
        {
          const blob = values.image;
          const hasImageChanged = isBase64Image(blob);

          if(hasImageChanged) 
          {
            const imgRes = await startUpload(files);  
            console.log(imgRes);


            if (imgRes && imgRes[0].url) {
              values.image = imgRes[0].url;
            }

          }
        }
        
    await createPost({
      text: values.post,
      author: userId,
      image: values.image ? values.image : null,
      communityId: organization ? organization.id : null,
      path: pathname,
    });

    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        className='mt-10 flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='post'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Content
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea rows={15} {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel>
                { field.value ? (
                    <Image src={field.value} alt='Post Image' width={360} height={180} priority className="object-contain"/>
                ): (
                    <Image src="/assets/profile.svg" alt='Post Image' width={30} height={30} className="object-contain"/>
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                  <Input 
                      type="file" 
                      accept="image/*" 
                      placeholder="Attach Images" 
                      className="post-form_image-input"
                      onChange={(e) => handleImage(e, field.onChange)}
                  />
              </FormControl>
            </FormItem>
          )}
        />  

        <Button type='submit' className='bg-primary-500'>
          Post Post
        </Button>
      </form>
    </Form>
  );
}

export default CreatePost;