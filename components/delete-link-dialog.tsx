'use client';

import { useState, useTransition } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteLink } from '../app/dashboard/actions';

interface DeleteLinkDialogProps {
  link: {
    id: number;
    shortCode: string;
  };
}

export function DeleteLinkDialog({ link }: DeleteLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    setError('');

    startTransition(async () => {
      const result = await deleteLink({ linkId: link.id });

      if (result.success) {
        setOpen(false);
      } else {
        setError(result.error || 'Failed to delete link');
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the link{' '}
            <span className="font-mono font-semibold">/{link.shortCode}</span>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <div className="text-sm text-destructive">{error}</div>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
