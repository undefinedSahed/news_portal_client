"use client";

import React from "react";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import {
  useCreateNews,
  useUpdateNews,
  News,
} from "@/lib/queries";
import { Loader2 } from "lucide-react";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

interface NewsFormProps {
  initialData?: News;
  isEditing?: boolean;
  onSuccess?: () => void;
}

export function NewsForm({
  initialData,
  isEditing = false,
  onSuccess,
}: NewsFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    content: initialData?.content || "",
    category: initialData?.category || "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.imageUrl || "",
  );
  const { mutate: createNews, isPending: isCreating } = useCreateNews();
  const { mutate: updateNews, isPending: isUpdating } = useUpdateNews();

  const isPending = isCreating || isUpdating;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = new FormData();
    body.append("title", formData.title);
    body.append("description", formData.description);
    body.append("content", formData.content);
    body.append("category", formData.category);

    if (imageFile) {
      body.append("image", imageFile);
    }

    if (isEditing && initialData) {
      updateNews(
        { id: initialData._id, formData: body },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        },
      );
    } else {
      createNews(body, {
        onSuccess: () => {
          setFormData({
            title: "",
            description: "",
            content: "",
            category: "",
          });
          setImageFile(null);
          setImagePreview("");
          onSuccess?.();
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title *</label>
        <Input
          name="title"
          placeholder="Enter news title"
          value={formData.title}
          onChange={handleInputChange}
          disabled={isPending}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description *</label>
        <Textarea
          name="description"
          placeholder="Enter brief description"
          value={formData.description}
          onChange={handleInputChange}
          disabled={isPending}
          rows={2}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Content *</label>
        <Textarea
          name="content"
          placeholder="Enter full news content"
          value={formData.content}
          onChange={handleInputChange}
          disabled={isPending}
          rows={8}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category *</label>
        <Input
          name="category"
          placeholder="Enter news category"
          value={formData.category}
          onChange={handleInputChange}
          disabled={isPending}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {isEditing ? "Change Image" : "Image"} {!isEditing && "*"}
        </label>
        <Card className="p-4 border-2 border-dashed">
          <div className="space-y-4">
            {imagePreview && (
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <Image
                  width={1000}
                  height={1000}
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
            )}
            <label className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted transition">
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload image
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isPending}
                required={!isEditing && !imagePreview}
                className="hidden"
              />
            </label>
          </div>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isPending ? "Saving..." : isEditing ? "Update News" : "Create News"}
        </Button>
      </div>
    </form>
  );
}
