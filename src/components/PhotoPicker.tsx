import {ChangeEventHandler} from 'react';

type PhotoPickerProps = {
    onFileChanged: ChangeEventHandler<HTMLInputElement>
}

export default function PhotoPicker(props: PhotoPickerProps) {
    return (
        <>
            <label htmlFor="photoFile"></label>
            <input type="file"
                   onChange={props.onFileChanged}
                   accept="image/*"
                   id="photoFile"/>
        </>
    )
}