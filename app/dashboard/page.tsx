import { getUserLinks } from '@/data/links';
import { CreateLinkModal } from '@/components/create-link-modal';
import { EditLinkModal } from '@/components/edit-link-modal';
import { DeleteLinkDialog } from '@/components/delete-link-dialog';

export default async function DashboardPage() {
  const links = await getUserLinks();

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Links</h1>
        <CreateLinkModal />
      </div>

      {links.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            You haven&apos;t created any links yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Click &quot;Create New Link&quot; to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {links.map((link) => (
            <div
              key={link.id}
              className="border rounded-lg p-4 hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono font-semibold text-lg">
                      /{link.shortCode}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {link.originalUrl}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created {link.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <EditLinkModal
                    link={{
                      id: link.id,
                      shortCode: link.shortCode,
                      originalUrl: link.originalUrl,
                    }}
                  />
                  <DeleteLinkDialog
                    link={{
                      id: link.id,
                      shortCode: link.shortCode,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
