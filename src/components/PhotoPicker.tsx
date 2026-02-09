import {ChangeEventHandler} from 'react';

type PhotoPickerProps = {
    onFileChanged: ChangeEventHandler<HTMLInputElement>
}

export default function PhotoPicker(props: PhotoPickerProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16">
            <label
                htmlFor="photoFile"
                className="group cursor-pointer flex flex-col items-center gap-6"
            >
                {/* Upload icon */}
                <div className="w-16 h-16 border border-te-border flex items-center justify-center group-hover:border-te-text transition-colors">
                    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-te-muted group-hover:text-te-text transition-colors">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                </div>

                <div className="text-center">
                    <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-te-text">
                        select image
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-te-muted mt-2">
                        jpg, png, heic
                    </p>
                </div>

                <input
                    type="file"
                    onChange={props.onFileChanged}
                    accept="image/*,.heic,.heif"
                    id="photoFile"
                />
            </label>

            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-te-muted mt-10">
                all processing happens locally - no images are uploaded
            </p>
        </div>
    )
}
