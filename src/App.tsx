import {ChangeEvent, useEffect, useRef, useState} from 'react'
import type * as ExifReader from 'exifreader'

import 'normalize.css'

import PhotoPreview from './components/PhotoPreview.tsx'
import PhotoPicker from './components/PhotoPicker.tsx'

function App() {
    const [photoFile, setPhotoFile] = useState<null | File>(null)
    const [photoTags, setPhotoTags] = useState<null | ExifReader.Tags>(null)
    const [showCanvas, setShowCanvas] = useState<boolean>(false)

    const showPreview = photoFile != null && photoTags != null && !showCanvas

    const previewRef = useRef<HTMLDivElement>(null)
    const canvasWrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (previewRef.current != null) {
            import('html2canvas').then(({default: html2canvas}) =>
                html2canvas(previewRef.current!).then(canvas => {
                    setShowCanvas(true)

                    if (canvasWrapperRef.current == null) return

                    canvasWrapperRef.current.innerHTML = ''
                    canvasWrapperRef.current.appendChild(canvas)
                })
            );
        }
    }, [photoFile]);

    const onFilePickerChanged = async (e: ChangeEvent<HTMLInputElement>) => {
        setPhotoFile(null)
        setPhotoTags(null)
        setShowCanvas(false)

        if (e.target?.files?.length) {
            const file = e.target.files[0]
            let tags = {} as ExifReader.Tags

            const ExifReaderModule = await import('exifreader')
            try {
                tags = await ExifReaderModule.load(file)
            } catch {
                // EXIF extraction may fail for some formats (e.g. WebP)
            }

            if (file.name.toLowerCase().endsWith('.heic') ||
                file.name.toLowerCase().endsWith('.heif')) {
                const {default: heic2any} = await import('heic2any')
                const blob = new Blob([file])
                const jpegBlob: any = await heic2any({
                    blob,
                    toType: 'image/jpeg',
                })

                jpegBlob.lastModifiedDate = new Date()
                jpegBlob.name = `${file.name}.jpg`

                setPhotoFile(jpegBlob as File)
            } else {
                setPhotoFile(file)
            }

            setPhotoTags(tags)
        }
    }

    const onDownloadClicked = () => {
        if (canvasWrapperRef.current == null) return

        const canvas = canvasWrapperRef.current.querySelector('canvas')

        if (canvas != null) {
            const link = document.createElement('a')
            link.download = `framed-${photoFile?.name}`
            link.href = canvas.toDataURL()
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    const onReset = () => {
        setPhotoFile(null)
        setPhotoTags(null)
        setShowCanvas(false)
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="border-b border-te-border">
                <div className="max-w-[980px] mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="font-display text-sm font-medium tracking-tight text-te-text uppercase">
                        shot on
                    </h1>
                    {showCanvas && (
                        <button
                            onClick={onReset}
                            className="font-mono text-[10px] uppercase tracking-[0.15em] text-te-muted hover:text-te-text transition-colors"
                        >
                            new frame
                        </button>
                    )}
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-[980px]">
                    {!photoFile && !showCanvas && (
                        <PhotoPicker onFileChanged={onFilePickerChanged}/>
                    )}

                    {showPreview && (
                        <PhotoPreview file={photoFile} tags={photoTags} ref={previewRef}/>
                    )}

                    <div className={`flex flex-col items-center ${showCanvas ? '' : 'hidden'}`}>
                        <div ref={canvasWrapperRef} className="max-w-3xl w-full pb-20"></div>
                    </div>

                    {showCanvas && (
                        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-10">
                            <button
                                onClick={onDownloadClicked}
                                className="inline-flex items-center gap-2 bg-te-text text-te-bg px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] hover:opacity-80 transition-opacity shadow-lg"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="7 10 12 15 17 10"/>
                                    <line x1="12" y1="15" x2="12" y2="3"/>
                                </svg>
                                download
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-te-border">
                <div className="max-w-[980px] mx-auto px-6 py-4 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-te-muted">
                        frame your shots
                    </span>
                    <span className="font-mono text-[10px] text-te-muted">
                        v1.1
                    </span>
                </div>
            </footer>
        </div>
    )
}

export default App
