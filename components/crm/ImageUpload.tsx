'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Image, UploadSimple, X } from '@phosphor-icons/react'

interface Props {
  value: string | null
  onChange: (url: string | null) => void
  folder?: string
}

export function ImageUpload({ value, onChange, folder = 'uploads' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File) => {
    setUploading(true)
    setError(null)
    try {
      const supabase = createClient()
      const ext  = file.name.split('.').pop()
      const path = `${folder}/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('event-images')
        .upload(path, file, { upsert: true })
      if (uploadErr) throw uploadErr
      const { data } = supabase.storage.from('event-images').getPublicUrl(path)
      onChange(data.publicUrl)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) upload(file)
  }

  const remove = async () => {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-white/50 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Thumbnail preview"
            className="h-48 w-full object-cover"
          />
          <button
            type="button"
            onClick={remove}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
          >
            <X size={14} weight="bold" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#C9A84C]/40 bg-white/40 py-8 text-sm text-[#9A907F] backdrop-blur-sm transition-all hover:border-[#C9A84C]/70 hover:bg-white/60 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <UploadSimple size={24} weight="light" className="animate-pulse text-[#C9A84C]" />
              <span>Uploading…</span>
            </>
          ) : (
            <>
              <Image size={24} weight="light" className="text-[#C9A84C]" />
              <span>Click to upload thumbnail</span>
              <span className="text-xs">JPEG, PNG or WebP · max 5 MB</span>
            </>
          )}
        </button>
      )}

      {value && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs text-[#9A907F] underline hover:text-[#C9A84C]"
        >
          Replace image
        </button>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}
