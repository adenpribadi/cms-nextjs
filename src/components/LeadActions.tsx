"use client";

import { markLeadAsRead, deleteLead } from "@/app/actions/leads";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MessageCircle, Check, Trash2 } from "lucide-react";

export function LeadActions({ leadId, status, leadName, leadPhone }: { 
  leadId: string, 
  status: string,
  leadName?: string,
  leadPhone?: string | null
}) {
  const router = useRouter();

  const handleMarkAsRead = async () => {
    const result = await markLeadAsRead(leadId);
    if (result.success) {
      toast.success("Pesan ditandai sebagai dibaca.");
      router.refresh();
    } else {
      toast.error("Gagal memperbarui status.");
    }
  };

  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus pesan ini?")) {
      const result = await deleteLead(leadId);
      if (result.success) {
        toast.success("Pesan berhasil dihapus.");
        router.refresh();
      } else {
        toast.error("Gagal menghapus pesan.");
      }
    }
  };

  const handleWhatsApp = () => {
    if (!leadPhone) {
      toast.error("Nomor WhatsApp tidak tersedia.");
      return;
    }
    const cleanPhone = leadPhone.replace(/\D/g, '');
    const message = `Halo ${leadName}, terima kasih telah menghubungi kami. Bagaimana ada yang bisa kami bantu?`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {leadPhone && (
        <button 
          onClick={handleWhatsApp}
          title="Balas via WhatsApp"
          style={{ 
            background: '#25D366', 
            border: 'none', 
            color: 'white', 
            cursor: 'pointer', 
            padding: '6px', 
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <MessageCircle size={16} />
        </button>
      )}
      {status === 'new' && (
        <button 
          onClick={handleMarkAsRead}
          title="Tandai Dibaca"
          style={{ 
            background: 'var(--accent-light)', 
            border: 'none', 
            color: 'var(--accent)', 
            cursor: 'pointer', 
            padding: '6px', 
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Check size={16} />
        </button>
      )}
      <button 
        onClick={handleDelete}
        title="Hapus"
        style={{ 
          background: '#fff1f1', 
          border: 'none', 
          color: '#ff4d4f', 
          cursor: 'pointer', 
          padding: '6px', 
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
