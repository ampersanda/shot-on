import {ChangeEvent, useEffect, useRef, useState} from 'react'
import * as ExifReader from 'exifreader'
import heic2any from 'heic2any'

import 'normalize.css'

import PhotoPreview from './components/PhotoPreview.tsx'
import PhotoPicker from './components/PhotoPicker.tsx'
import html2canvas from "html2canvas";

function App() {
    const [photoFile, setPhotoFile] = useState<null | File>(null)

    // TODO(lucky): cleanup photoTags
    const [photoTags, setPhotoTags] = useState<null | ExifReader.Tags>(null)

    const [showCanvas, setShowCanvas] = useState<boolean>(false)

    const showPreview = photoFile != null && photoTags != null

    const previewRef = useRef<HTMLDivElement>(null)
    const canvasWrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (previewRef.current != null) {
            html2canvas(previewRef.current).then(canvas => {
                if (canvasWrapperRef.current == null) return

                canvasWrapperRef.current.innerHTML = ''
                canvasWrapperRef.current.appendChild(canvas)

                setShowCanvas(true)
            });
        }
    }, [photoFile]);

    const onFilePickerChanged = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target?.files?.length) {
            const file = e.target.files[0]
            const tags = await ExifReader.load(file)

            if (file.name.toLowerCase().endsWith('.heic') ||
                file.name.toLowerCase().endsWith('.heif')) {
                const blob = new Blob([file])
                const jpegBlob: any = await heic2any({
                    blob,
                    toType: "image/jpeg",
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
            const link = document.createElement("a")
            link.download = `framed-${photoFile?.name}`
            link.href = canvas.toDataURL()
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    return (
        <>
            <PhotoPicker onFileChanged={onFilePickerChanged}/>
            {showPreview &&
                <button onClick={onDownloadClicked} type="button" className="bg-slate-400">Download Image</button>}
            {showPreview && !showCanvas && <PhotoPreview file={photoFile} tags={photoTags} ref={previewRef}/>}
            <div ref={canvasWrapperRef}></div>
        </>
    )
}

export default App
