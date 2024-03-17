import {ChangeEvent, useRef, useState} from 'react'
import * as ExifReader from 'exifreader'
import heic2any from 'heic2any'
import domtoimage from 'dom-to-image'

import 'normalize.css'

import PhotoPreview from './components/PhotoPreview.tsx'
import PhotoPicker from './components/PhotoPicker.tsx'

function App() {
    const [photoFile, setPhotoFile] = useState<null | File>(null)
    const [photoTags, setPhotoTags] = useState<null | ExifReader.Tags>(null)

    const showPreview = photoFile != null && photoTags != null

    const previewRef = useRef<HTMLDivElement>(null)

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
        if (previewRef.current != null) {
            domtoimage.toJpeg(previewRef.current, {cacheBust: false})
                .then((dataUrl) => {
                    const link = document.createElement("a")
                    link.download = `framed-${photoFile?.name}`
                    link.href = dataUrl
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                })
                .catch((err) => {
                    console.log(err)
                });
        }
    }

    return (
        <>
            <PhotoPicker onFileChanged={onFilePickerChanged}/>

            {showPreview ?
                <button onClick={onDownloadClicked} type="button" className="bg-slate-400">Download Image</button>

                : <></>}

            {showPreview ?
                <PhotoPreview file={photoFile} tags={photoTags} ref={previewRef}/>
                : <></>}
        </>
    )
}

export default App
