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
import { Plus, Link as LinkIcon } from 'lucide-react';
import { createLink } from '../app/dashboard/actions';

export function CreateLinkModal() {
  const [open, setOpen] = useState(false);
  const [originalUrl, setOriginalUrl] = useState('');
  const [customShortCode, setCustomShortCode] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!originalUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    startTransition(async () => {
      const result = await createLink(originalUrl, customShortCode);

      if (result.success) {
        // Reset form and close modal
        setOriginalUrl('');
        setCustomShortCode('');
        setError('');
        setOpen(false);
      } else {
        setError(result.error || 'Failed to create link');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Create New Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Short Link</DialogTitle>
            <DialogDescription>
              Enter a URL to shorten. You can optionally customize the short
              code.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">
                Original URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/very/long/url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                disabled={isPending}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shortCode">Custom Short Code (optional)</Label>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">/</span>
                <Input
                  id="shortCode"
                  type="text"
                  placeholder="my-link"
                  value={customShortCode}
                  onChange={(e) => setCustomShortCode(e.target.value)}
                  disabled={isPending}
                  pattern="[a-zA-Z0-9_-]+"
                  title="Only letters, numbers, hyphens, and underscores"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty to generate a random code
              </p>
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
              {isPending ? 'Creating...' : 'Create Link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
