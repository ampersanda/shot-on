import * as ExifReader from 'exifreader';
import React, {forwardRef} from 'react';

type PhotoPreviewProps = React.HTMLAttributes<HTMLDivElement> & {
    file: File,
    tags: ExifReader.Tags
}

export default forwardRef(function PhotoPreview(props: PhotoPreviewProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const host = props.tags.HostComputer?.description ??
        [props.tags.Make?.description, props.tags.Model?.description]
            .filter((host) => host != null)
            .join(' ') ?? ''
    const focalLength = props.tags.FocalLengthIn35mmFilm?.description.toString() ?? ''
    const fNumber = props.tags.FNumber?.description ?? ''
    const shutterSpeed = props.tags.ShutterSpeedValue?.description ?? ''
    const isoSpeed = props.tags.ISOSpeedRatings?.description ?? ''

    return (
        <div className='max-w-3xl border border-sky-500 p-8 bg-white' ref={ref}>
            <img className='w-full' src={URL.createObjectURL(props.file)} alt=""/>
            <div className='mt-6 text-center font-extralight text-lg leading-relaxed'>
                <h3>Shot on <strong className='font-bold'>{host}</strong></h3>
                <p>
                    <span className='mr-2'>{focalLength}mm</span>
                    {
                        fNumber ?
                            <span className='mr-2'>&#119891;/{fNumber.replace(/f\//g, '')}</span>
                            : <></>
                    }
                    <span className='mr-2'>{shutterSpeed}s</span>
                    <span className='mr-2'>ISO{isoSpeed}</span>
                </p>
            </div>
        </div>
    )
})