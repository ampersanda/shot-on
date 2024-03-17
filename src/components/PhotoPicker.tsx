import {ChangeEventHandler} from 'react';

type PhotoPickerProps = {
    onFileChanged: ChangeEventHandler<HTMLInputElement>
}

export default function PhotoPicker(props: PhotoPickerProps) {
    return (
        <>
            <label htmlFor="photoFile" className="dropzone">
                {/*<span>Choose an image file...</span>*/}
                <input type="file"
                       onChange={props.onFileChanged}
                       accept="image/*,.heic,.heif"
                       id="photoFile"
                       title="Pick an image file..."
                       placeholder="Pick an image file..."/>
            </label>
        </>
    )
}