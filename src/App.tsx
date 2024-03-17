import {ChangeEvent, useRef, useState} from 'react'
import * as ExifReader from 'exifreader';
import {toPng} from 'html-to-image';

import 'normalize.css'

import PhotoPreview from './components/PhotoPreview.tsx';
import PhotoPicker from './components/PhotoPicker.tsx';

function App() {
    const [photoFile, setPhotoFile] = useState<null | File>(null)
    const [photoTags, setPhotoTags] = useState<null | ExifReader.Tags>(null)

    const showPreview = photoFile != null && photoTags != null;

    const previewRef = useRef<HTMLButtonElement>(null)

    const onFilePickerChanged = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target?.files?.length) {
            const file = e.target.files[0];
            const tags = await ExifReader.load(file);

            setPhotoFile(file)
            setPhotoTags(tags)
        }
    }

    const onDownloadClicked = () => {
        if (previewRef.current != null) {
            toPng(previewRef.current, {cacheBust: false})
                .then((dataUrl) => {
                    const link = document.createElement("a");
                    link.download = `framed-${photoFile?.name}`;
                    link.href = dataUrl;
                    link.click();
                })
                .catch((err) => {
                    console.log(err);
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
