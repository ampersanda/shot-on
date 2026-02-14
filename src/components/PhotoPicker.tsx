import {DragEvent, useState} from 'react';

type PhotoPickerProps = {
    onFileSelected: (file: File) => void
}

export default function PhotoPicker(props: PhotoPickerProps) {
    const [isDragging, setIsDragging] = useState(false)

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault()

        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: DragEvent) => {
        e.preventDefault()

        setIsDragging(false)

        const file = e.dataTransfer.files[0]

        if (file) {
            props.onFileSelected(file)
        }
    }

    return (
        <div
            className="flex flex-col items-center justify-center py-16"
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <label
                htmlFor="photoFile"
                className="group cursor-pointer flex flex-col items-center gap-6"
            >
                {/* Upload icon */}
                <div className={`w-16 h-16 border flex items-center justify-center transition-colors ${isDragging ? 'border-te-text' : 'border-te-border group-hover:border-te-text'}`}>
                    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-colors ${isDragging ? 'text-te-text' : 'text-te-muted group-hover:text-te-text'}`}>
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                </div>

                <div className="text-center">
                    <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-te-text">
                        select or drop image
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-te-muted mt-2">
                        jpg, png, heic, webp
                    </p>
                </div>

                <input
                    type="file"
                    onChange={(e) => {
                        const file = e.target.files?.[0]

                        if (file) {
                            props.onFileSelected(file)
                        }
                    }}
                    onClick={(e) => { e.currentTarget.value = '' }}
                    accept="image/*,.heic,.heif,.webp"
                    id="photoFile"
                />
            </label>

            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-te-muted mt-10 text-center">
                all processing happens locally - no images are uploaded
            </p>
        </div>
    )
}
