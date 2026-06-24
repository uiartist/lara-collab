<?php

namespace App\Mail;

use App\Models\PurchaseRequest;
use App\Models\Task;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment as MailAttachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PurchaseRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public PurchaseRequest $purchaseRequest;

    public User $fromUser;

    public function __construct(PurchaseRequest $purchaseRequest, User $fromUser)
    {
        $this->purchaseRequest = $purchaseRequest;
        $this->fromUser = $fromUser;
        $this->purchaseRequest->loadMissing(['attachments', 'supplier', 'task']);
    }

    public function envelope(): Envelope
    {
        return new Envelope(null, [], [], [], [], $this->purchaseRequest->subject);
    }

    public function content(): Content
    {
        return new Content('emails.purchase-request', null, null, null, [
            'relatedTasks' => Task::whereIn('id', $this->purchaseRequest->related_task_ids ?? [])->get(),
        ]);
    }

    public function attachments(): array
    {
        return $this->purchaseRequest->attachments
            ->map(fn ($attachment) => MailAttachment::fromStorageDisk('local', $attachment->path)
                ->as($attachment->name)
                ->withMime($attachment->type ?? 'application/octet-stream'))
            ->all();
    }
}
