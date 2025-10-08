/**
 * Image-to-Image Editing Page
 */
'use client';

import { useState } from 'react';
import { useEditImage } from '@/hooks/use-edit-image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function EditPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Image-to-Image Editing</h1>
      <Card className="p-6">
        <p>Edit page coming soon...</p>
      </Card>
    </div>
  );
}
