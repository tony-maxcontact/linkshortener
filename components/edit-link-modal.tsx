'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Link as LinkIcon } from 'lucide-react';
import { updateLink } from '../app/dashboard/actions';

interface EditLinkModalProps {
  link: {
    id: number;
    shortCode: string;
    originalUrl: string;
  };
}

export function EditLinkModal({ link }: EditLinkModalProps) {
  const [open, setOpen] = useState(false);
  const [originalUrl, setOriginalUrl] = useState(link.originalUrl);
  const [shortCode, setShortCode] = useState(link.shortCode);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!originalUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!shortCode.trim()) {
      setError('Please enter a short code');
      return;
    }

    startTransition(async () => {
      const result = await updateLink({
        linkId: link.id,
        originalUrl,
        shortCode,
      });

      if (result.success) {
        setError('');
        setOpen(false);
      } else {
        setError(result.error || 'Failed to update link');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription>
              Update the URL or short code for this link.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-url">
                Original URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-url"
                type="url"
                placeholder="https://example.com/very/long/url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                disabled={isPending}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-shortCode">
                Short Code <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">/</span>
                <Input
                  id="edit-shortCode"
                  type="text"
                  placeholder="my-link"
                  value={shortCode}
                  onChange={(e) => setShortCode(e.target.value)}
                  disabled={isPending}
                  pattern="[a-zA-Z0-9_-]+"
                  title="Only letters, numbers, hyphens, and underscores"
                  required
                />
              </div>
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
