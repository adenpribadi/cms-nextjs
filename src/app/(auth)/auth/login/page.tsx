"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Email atau password salah.");
        setLoading(false);
      } else {
        toast.success("Login berhasil! Mengalihkan...");
        router.push("/admin/dashboard");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem.");
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <h2 className="font-heading" style={{ textAlign: 'center', marginBottom: '32px' }}>Login Admin</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ marginTop: '10px', padding: '14px' }}
          >
            {loading ? 'Silakan Tunggu...' : 'Masuk'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Hanya untuk pengelola website.
          </p>
        </div>
      </div>
    </div>
  );
}
